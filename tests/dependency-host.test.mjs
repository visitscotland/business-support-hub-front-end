import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
    mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runInNewContext } from 'node:vm';
import YAML from 'yaml';
import { planGroups, proposalFor } from '../ci/dependency-plan.mjs';
import { prepareHost, reviewCheck } from '../ci/dependency-host.mjs';
import { verifyModel, detectionEvidence } from '../ci/dependency-detection.mjs';
import { candidateManifest, main as candidateMain } from '../ci/dependency-candidate.mjs';

function inputFixture() {
    const path = {
        name: 'parent',
        version: '1.0.0',
        requestedName: 'thing',
        targetName: 'thing',
        constraint: '^1.0.0',
        declaredRange: 'npm:^1.0.0',
        effectiveVersions: ['1.0.0'],
        pathVerified: true,
    };
    return {
        repository: 'example/demo',
        registryComplete: true,
        fingerprint: 'prepared',
        preparedAt: '2026-11-02T10:00:00Z',
        manifest: {
            name: 'fixture',
            resolutions: {
            },
        },
        pins: [],
        paths: [path],
        releases: {
            thing: [{
                version: '1.0.2',
                applicableFromVersions: ['1.0.0'],
                dependencies: {
                },
                source: 'https://registry.npmjs.org/thing/1.0.2',
            }],
        },
        triage: {
            schemaVersion: 2,
            collectionStatus: 'complete',
            evidenceMode: 'live',
            repository: 'example/demo',
            gaps: [],
            laggingPins: [],
            packages: [{
                name: 'thing',
                ecosystem: 'npm',
                affectedVersions: ['1.0.0'],
                highestSeverity: 'high',
                relationship: 'transitive',
                parents: [path],
                alerts: [{
                    number: 1,
                }],
                sources: [],
                uncertainties: [],
                recommendations: [],
            }],
        },
    };
}

test('planner targets vulnerable descriptors and chooses a prepared parent upgrade instead of safe copies', () => {
    const input = inputFixture();
    input.paths.push({
        ...input.paths[0],
        name: 'safe-parent',
        constraint: '^2.0.0',
        declaredRange: 'npm:^2.0.0',
        effectiveVersions: ['2.0.1'],
    });
    let plan = planGroups(input);
    assert.equal(plan.groups[0].edits[0].name, 'thing@npm:^1.0.0');
    assert.equal(plan.groups[0].edits.length, 1);
    candidateManifest(input, proposalFor(plan, plan.groups), input.manifest);
    input.paths[0].constraint = '^0.9.0';
    input.paths[0].declaredRange = 'npm:^0.9.0';
    input.releases.parent = [{
        version: '1.0.1',
        dependencies: {
            thing: '^1.0.2',
        },
    }];
    plan = planGroups(input);
    assert.equal(plan.groups[0].edits[0].name, 'parent');
    assert.equal(plan.groups[0].edits[0].value, '1.0.1');
    input.releases.parent = [];
    assert.equal(planGroups(input).groups[0].edits[0].name, 'parent/thing');
    input.paths = [];
    assert.equal(planGroups(input).packages[0].disposition, 'unknown-path');
});

function fixture() {
    const root = mkdtempSync(join(tmpdir(), 'maintenance-host-'));
    const git = (args) => {
        const result = spawnSync('git', args, {
            cwd: root,
            encoding: 'utf8',
        });
        assert.equal(result.status, 0, result.stderr);
        return result.stdout.trim();
    };
    const input = inputFixture();
    const lock = YAML.stringify({
        'thing@npm:^1.0.0': {
            version: '1.0.0',
            resolution: 'thing@npm:1.0.0',
        },
    });
    writeFileSync(join(root, '.gitignore'), 'triage-results/\n.yarn/\n');
    writeFileSync(join(root, 'package.json'), JSON.stringify(input.manifest));
    writeFileSync(join(root, 'yarn.lock'), lock);
    writeFileSync(join(root, 'app.vue'), 'protected source');
    git(['init', '--quiet']);
    git(['add', '.']);
    git(['-c', 'user.name=Test', '-c', 'user.email=test@example.invalid', '-c', 'commit.gpgsign=false', 'commit', '--quiet', '-m', 'Baseline']);
    input.baselineSha = git(['rev-parse', 'HEAD']);
    input.triage.baselineSha = input.baselineSha;
    const evidence = {
        status: 'complete',
        mode: 'live',
        repository: input.repository,
        baseline: {
            data: {
                sha: input.baselineSha,
            },
        },
        files: {
            'package.json': {
                data: {
                    content: input.manifest,
                },
            },
            'yarn.lock': {
                data: {
                    content: lock,
                },
            },
        },
        alerts: {
            data: [{
                number: 1,
                html_url: 'https://example.invalid/1',
                dependency: {
                    package: {
                        name: 'thing',
                        ecosystem: 'npm',
                    },
                },
                security_advisory: {
                    severity: 'high',
                },
                security_vulnerability: {
                    vulnerable_version_range: '<1.0.2',
                },
            }],
        },
    };
    mkdirSync(join(root, 'triage-results'));
    writeFileSync(join(root, 'triage-results/agent-input.json'), JSON.stringify(input));
    writeFileSync(join(root, 'triage-results/evidence.json'), JSON.stringify(evidence));
    mkdirSync(join(root, '.yarn/releases'), {
        recursive: true,
    });
    // Exercise the actual candidate command and renderer; application smoke is
    // replaced at the validation seam, whose real implementation has separate tests.
    writeFileSync(join(root, '.yarn/releases/yarn-4.14.1.cjs'), 'const fs=require(\'node:fs\');fs.writeFileSync(\'yarn.lock\',fs.readFileSync(\'yarn.lock\',\'utf8\').replaceAll(\'1.0.0\',\'1.0.2\'));');
    const calls = [];
    const run = (executable, args, options) => {
        calls.push([executable, ...args]);
        if (args[0]?.endsWith('dependency-maintenance.mjs') && args[1] === 'validate') {
            writeFileSync(join(root, 'triage-results/validation.json'), JSON.stringify({
                passed: true,
                base: input.baselineSha,
                changed: ['package.json', 'yarn.lock'],
                analysisComplete: true,
                remediationStatus: 'succeeded',
                fingerprint: input.fingerprint,
                outcomes: [{
                    before: ['1.0.0'],
                    remaining: [],
                    outcome: 'expected-fixed',
                }],
                testsRun: true,
            }));
            return {
                status: 0,
            };
        }
        return spawnSync(executable, args, options);
    };
    return {
        root,
        input,
        run,
        calls,
    };
}

test('host applies, renders, validates and commits before review; wrong output or tampering cannot complete', () => {
    const { root, run, calls } = fixture();
    try {
        const hash = prepareHost(root, run);
        assert.match(hash, /^[a-f0-9]{64}$/);
        assert.ok(calls.find((args) => args[0] === 'git' && args.includes('commit')));
        assert.ok(readFileSync(join(root, 'triage-results/weekly-report.md'), 'utf8').includes('thing'));
        assert.throws(() => reviewCheck(root, hash, 'noop'), /exactly create_pull_request/);
        assert.throws(() => reviewCheck(root, hash, 'create_pull_request', 'false'), /transport is missing/);
        assert.equal(reviewCheck(root, hash, 'create_pull_request', 'true'), 'create_pull_request');
        assert.equal(JSON.parse(readFileSync(join(root, 'triage-results/validation.json'))).reviewAccepted, true);
        assert.throws(() => reviewCheck(root, hash, 'create_pull_request'), /changed the host-prepared/);
    } finally { rmSync(root, {
        recursive: true,
        force: true,
    }); }
});

test('failed host execution always records failure and produces a diagnostic report without invoking a model', () => {
    const { root } = fixture();
    try {
        assert.throws(() => prepareHost(root, () => ({
            status: 1,
            stderr: 'controlled dependency failure',
        })), /controlled dependency failure/);
        assert.equal(JSON.parse(readFileSync(join(root, 'triage-results/validation.json'))).passed, false);
        assert.match(readFileSync(join(root, 'triage-results/weekly-report.md'), 'utf8'), /failed/);
    } finally { rmSync(root, {
        recursive: true,
        force: true,
    }); }
});

test('rejected selectors and unsupported render commands remain in persisted failure history', () => {
    const { root } = fixture();
    try {
        writeFileSync(join(root, 'triage-results/proposal.json'), '{"schemaVersion":1,"packages":[],"changes":[]}');
        assert.throws(() => candidateMain('apply', root), /missing explicit decisions/);
        assert.throws(() => candidateMain('render', root), /Use apply or restore/);
        assert.throws(() => candidateMain('render', root), /Use apply or restore/);
        assert.throws(() => candidateMain('apply', root), /budget exhausted/);
        const history = JSON.parse(readFileSync(join(root, 'triage-results/candidate/history.json')));
        assert.ok(history.every((entry) => entry.outcome === 'failed'));
        assert.equal(JSON.parse(readFileSync(join(root, 'triage-results/candidate/result.json'))).passed, false);
    } finally { rmSync(root, {
        recursive: true,
        force: true,
    }); }
});

test('explicit detector model and terminal evidence reject the unsupported-alias/missing-verdict sequence', () => {
    assert.equal(verifyModel({
        endpoints: [{
            provider: 'copilot',
            configured: true,
            models: ['gpt-4.1'],
        }],
    }), 'gpt-4.1');
    assert.throws(() => verifyModel({
        endpoints: [{
            provider: 'copilot',
            configured: true,
            models: ['detection'],
        }],
    }), /absent/);
    const root = mkdtempSync(join(tmpdir(), 'detector-'));
    try {
        assert.equal(detectionEvidence(root), 'failed');
        assert.equal(JSON.parse(readFileSync(join(root, 'execution.json'))).state, 'failed');
        writeFileSync(join(root, 'detection_result.json'), 'invalid');
        assert.equal(detectionEvidence(root), 'failed');
        writeFileSync(join(root, 'detection_result.json'), '{"verdict":"safe"}');
        assert.equal(detectionEvidence(root), 'completed');
    } finally { rmSync(root, {
        recursive: true,
        force: true,
    }); }
});

test('compiled publication requires an affirmative detector and host body; no-op claims must match host evidence', () => {
    const source = YAML.parse(readFileSync(new URL('../.github/workflows/dependency-maintenance-agent.md', import.meta.url), 'utf8').split('---')[1]);
    const compiled = YAML.parse(readFileSync(new URL('../.github/workflows/dependency-maintenance-agent.lock.yml', import.meta.url), 'utf8'));
    assert.equal(source.tools.bash, false);
    assert.equal(source.tools.edit, false);
    assert.equal(source['safe-outputs']['threat-detection']['continue-on-error'], false);
    assert.equal(source['safe-outputs']['threat-detection'].engine.model, 'gpt-4.1');
    assert.match(compiled.jobs.safe_outputs.if, /detection_success == 'true'/);
    assert.match(compiled.jobs.detection.if, /has_patch == 'true'/);
    assert.match(compiled.jobs.detection.if, /needs.agent.result == 'success'/);
    const script = source.jobs.safe_outputs['pre-steps'].at(-1).with.script;
    const execute = (body, passed = true, overrides = {
    }) => runInNewContext(script, {
        process: {
            env: {
                RUNNER_TEMP: '/runtime',
            },
        },
        require: (name) => {
            if (name === 'node:fs') return {
                readFileSync: (path) => path.endsWith('validation.json') ? JSON.stringify({
                    passed,
                    reviewAccepted: true,
                    changed: ['package.json'],
                    branch: 'host-branch',
                })
                    : path.endsWith('agent_output.json') ? JSON.stringify({
                        items: [{
                            type: 'create_pull_request',
                            title: 'Dependency security and pin refresh',
                            branch: 'host-branch',
                            ...overrides,
                            body,
                        }],
                    }) : 'host body',
            };
            if (name.endsWith('sanitize_content.cjs')) return {
                sanitizeContent: (value) => value,
            };
            if (name === 'node:assert/strict') return assert;
            if (name === 'node:path') return {
                join: (...parts) => parts.join('/'),
            };
            throw new Error(name);
        },
    });
    execute('host body');
    assert.throws(() => execute('invented body'), /differs/);
    assert.throws(() => execute('host body', false));
    assert.throws(() => execute('host body', true, {
        branch: 'invented-branch',
    }));
    assert.throws(() => execute('host body', true, {
        title: 'All findings fixed',
    }));
});


test('no-op publication cannot contradict the host unresolved-finding summary', () => {
    const source = YAML.parse(readFileSync(new URL('../.github/workflows/dependency-maintenance-agent.md', import.meta.url), 'utf8').split('---')[1]);
    const script = source.jobs.conclusion['pre-steps'].at(-1).with.script;
    const execute = (message) => runInNewContext(script, {
        require: (name) => {
            if (name === 'node:assert/strict') return assert;
            if (name === 'node:fs') return {
                readFileSync: (path) => path.endsWith('validation.json')
                    ? JSON.stringify({
                        passed: true,
                        reviewAccepted: true,
                        changed: [],
                        noopMessage: 'Host: unresolved findings remain',
                    })
                    : JSON.stringify({
                        items: [{
                            type: 'noop',
                            message,
                        }],
                    }),
            };
            throw new Error(name);
        },
    });
    execute('Host: unresolved findings remain');
    assert.throws(() => execute('All dependencies are safe'));
});
