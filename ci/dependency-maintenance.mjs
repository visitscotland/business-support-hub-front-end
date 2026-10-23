import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import {
    readFileSync, writeFileSync, existsSync,
} from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';
import semver from 'semver';

export const marker = '<!-- bsh-dependency-maintenance:v1 -->';

export function assess(evidence, triage, afterLock) {
    assert.equal(evidence.status, 'complete', 'Collection must be complete');
    assert.equal(evidence.mode, 'live', 'Fixture evidence cannot publish a PR');
    assert.equal(triage.schemaVersion, 2);
    assert.equal(triage.collectionStatus, 'complete');
    assert.equal(triage.evidenceMode, 'live');
    assert.equal(triage.repository, evidence.repository);
    assert.equal(triage.baselineSha, evidence.baseline.data.sha);

    const ids = triage.packages.flatMap((p) => p.alerts.map((a) => a.number));
    const expected = evidence.alerts.data.map((a) => a.number);

    assert.equal(new Set(ids).size, ids.length, 'Duplicate alert in triage');
    assert.deepEqual([...ids].sort((a, b) => a - b), [...expected].sort((a, b) => a - b));

    const before = Object.values(YAML.parse(evidence.files['yarn.lock'].data.content));
    const after = Object.values(YAML.parse(afterLock));
    const ranks = {
        unknown: 0,
        low: 1,
        medium: 2,
        high: 3,
        critical: 4,
    };

    for (const p of triage.packages) {
        const alerts = evidence.alerts.data.filter((a) => a.dependency.package.name === p.name && a.dependency.package.ecosystem === p.ecosystem);

        assert.ok(alerts.length, `Unexpected package ${p.name}`);
        assert.deepEqual(p.alerts.map((a) => a.number).sort((a, b) => a - b), alerts.map((a) => a.number).sort((a, b) => a - b));

        const highest = alerts.reduce((s, a) => ranks[a.security_advisory.severity] > ranks[s] ? a.security_advisory.severity : s, 'unknown');

        assert.equal(p.highestSeverity, highest, `Incorrect severity for ${p.name}`);
    }

    return evidence.alerts.data.map((alert) => {
        const name = alert.dependency.package.name;
        const ranges = alert.security_advisory.vulnerabilities.filter((v) => v.package.name === name)
            .map((v) => v.vulnerable_version_range.replace(/,\s*/g, ' '));
        const valid = ranges.length > 0 && ranges.every((r) => semver.validRange(r));
        const affected = (entries) => entries.filter((v) => v?.resolution?.startsWith(`${name}@npm:`)
            && semver.valid(String(v.version)) && ranges.some((r) => semver.satisfies(String(v.version), r)))
            .map((v) => String(v.version));
        const oldVersions = valid ? affected(before) : [];
        const remainingVersions = valid ? affected(after) : [];
        const fixed = valid && oldVersions.length > 0 && remainingVersions.length === 0;
        const p = triage.packages.find((p) => p.name === name);

        return {
            number: alert.number,
            package: name,
            severity: alert.security_advisory.severity,
            url: alert.html_url,
            before: oldVersions,
            remaining: remainingVersions,
            outcome: fixed ? 'expected-fixed' : 'unresolved',
            reason: fixed ? 'No matching vulnerable instance remains in the proposed lockfile'
                : !valid ? 'Unparseable or missing advisory range — needs investigation'
                    : !oldVersions.length ? 'Alert and baseline lockfile differ — remediation cannot be attributed to this PR'
                        : p.recommendations.map((r) => r.action).join('; ') || 'Requires human investigation',
        };
    });
}

const cell = (value) => String(value).replaceAll('|', '\\|').replace(/[\r\n]+/g, ' ');

export function renderBody(evidence, triageReport, outcomes) {
    const pending = outcomes.filter((o) => o.outcome === 'unresolved');
    const fixed = outcomes.filter((o) => o.outcome === 'expected-fixed');
    const table = (rows) => rows.length
        ? ['| Package | Severity | Alert | Result / action |', '|---|---|---|---|',
            ...rows.map((o) => `| ${cell(o.package)} | ${cell(o.severity)} | [#${o.number}](${o.url}) | ${cell(o.reason)}${o.remaining.length ? `; remaining: ${o.remaining.join(', ')}` : ''} |`)].join('\n')
        : 'None.';

    return [marker, '# Dependency maintenance', '',
        `Repository: ${evidence.repository}. Baseline: ${evidence.baseline.data.sha}. Evidence: ${evidence.collectedAt}.`, '',
        `> [!WARNING]\n> **${pending.length} findings are NOT fixed by this PR and require human action.** Review this section separately from the proposed fixes.`, '',
        '## NOT FIXED — human action required', '', table(pending), '',
        `## Expected to be fixed by this PR (${fixed.length})`, '', table(fixed), '',
        'Expected fixes are based on the proposed lockfile. GitHub alerts reconcile after merge; this is not a claim of verified exploit reachability.', '',
        '## Validation', '',
        'Publication is gated on a complete live inventory, restricted manifest/lockfile diff, immutable install and the full lint/build/homepage smoke gate. Required PR CI and human approval still apply.', '',
        '<details><summary>Full two-list triage report</summary>', '', triageReport.trim(), '', '</details>', '',
    ].join('\n');
}

function validate() {
    const base = process.env.GITHUB_SHA;

    assert.match(base || '', /^[a-f0-9]{40}$/);

    const evidence = JSON.parse(readFileSync('triage-results/evidence.json', 'utf8'));
    const triage = JSON.parse(readFileSync('triage-results/triage.json', 'utf8'));

    assert.equal(evidence.baseline.data.sha, base, 'Default branch moved after the run began; recollect on a fresh run');

    const changed = execFileSync('git', ['diff', '--name-only', base], {
        encoding: 'utf8',
    }).trim().split('\n').filter(Boolean);

    assert.ok(changed.every((p) => ['package.json', 'yarn.lock'].includes(p)), 'Only package.json and yarn.lock may change');

    const before = evidence.files['package.json'].data.content;
    const after = JSON.parse(readFileSync('package.json', 'utf8'));

    for (const field of new Set([...Object.keys(before), ...Object.keys(after)])) {
        if (!['dependencies', 'devDependencies', 'overrides', 'resolutions'].includes(field)) {
            assert.deepEqual(after[field], before[field], `Cannot change manifest field ${field}`);
        }
    }

    const outcomes = assess(evidence, triage, readFileSync('yarn.lock', 'utf8'));
    const body = renderBody(evidence, readFileSync('triage-results/weekly-report.md', 'utf8'), outcomes);

    assert.equal(readFileSync('triage-results/pr-body.md', 'utf8'), body, 'PR body must be generated from the final candidate');
    assert.ok(Buffer.byteLength(body, 'utf8') < 60000, 'PR body exceeds the reviewable size budget');

    if (changed.length) {
        execFileSync(process.execPath, ['.yarn/releases/yarn-4.14.1.cjs', 'install', '--immutable', '--mode=skip-build'], {
            stdio: 'inherit',
        });
        execFileSync(process.execPath, ['ci/dependency-smoke.mjs'], {
            stdio: 'inherit',
        });
    }

    writeFileSync('triage-results/validation.json', `${JSON.stringify({
        passed: true,
        base,
        changed,
        outcomes,
        testsRun: changed.length > 0,
    }, null, 2)}\n`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    if (['render', 'validate'].includes(process.argv[2])) {
        const { validateTriage, renderTriage } = await import('./prepare-dependency-triage.mjs');
        const evidence = JSON.parse(readFileSync('triage-results/evidence.json', 'utf8'));
        const triage = JSON.parse(readFileSync('triage-results/triage.json', 'utf8'));

        validateTriage(evidence, triage);
        assert.equal(readFileSync('triage-results/weekly-report.md', 'utf8'), renderTriage(triage), 'Run the triage check before rendering or validating');
    }

    if (process.argv[2] === 'render') {
        const e = JSON.parse(readFileSync('triage-results/evidence.json', 'utf8'));
        const t = JSON.parse(readFileSync('triage-results/triage.json', 'utf8'));
        const outcomes = assess(e, t, readFileSync('yarn.lock', 'utf8'));

        writeFileSync('triage-results/pr-body.md', renderBody(e, readFileSync('triage-results/weekly-report.md', 'utf8'), outcomes));
    } else if (process.argv[2] === 'validate') {
        if (existsSync('triage-results/validation.json')) {
            writeFileSync('triage-results/validation.json', '{"passed":false}\n');
        }

        validate();
    } else {
        throw new Error('Use render or validate');
    }
}
