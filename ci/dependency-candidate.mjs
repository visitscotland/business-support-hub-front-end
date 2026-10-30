import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
    closeSync, existsSync, mkdirSync, openSync, readFileSync, writeFileSync,
} from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import semver from 'semver';
import { matchingPaths } from './dependency-graph.mjs';
import { applyProposal } from './dependency-maintenance.mjs';
import { fingerprint, pinTarget } from './prepare-dependency-maintenance.mjs';

const fields = ['dependencies', 'devDependencies', 'resolutions', 'overrides'];
const read = (path) => JSON.parse(readFileSync(path, 'utf8'));

export function candidateManifest(input, proposal, current) {
    const manifest = structuredClone(current);
    const seen = new Set();
    for (const edit of proposal.changes || []) {
        assert.ok(fields.includes(edit.field), 'Only dependency fields may change');
        assert.ok(typeof edit.name === 'string' && edit.name && !['__proto__', 'constructor', 'prototype'].includes(edit.name));
        const key = `${edit.field}:${edit.name}`;
        assert.ok(!seen.has(key), 'Duplicate manifest edit');
        seen.add(key);
        assert.ok(Object.hasOwn(edit, 'value'), 'Each edit needs value: an exact prepared version or null for removal');
        const target = ['dependencies', 'devDependencies'].includes(edit.field)
            ? edit.name : pinTarget(edit.name, Object.keys(input.releases));
        if (edit.value !== null) {
            assert.ok(semver.valid(edit.value), 'Use an exact version, never a range or latest');
            const candidate = input.releases[target]?.find((r) => r.version === edit.value);
            assert.ok(candidate, `No prepared candidate for ${key}`);
            assert.ok(candidate.applicableFromVersions?.length
                && candidate.applicableFromVersions.every((v) => semver.gte(edit.value, v)), 'No downgrade candidates');
            if (edit.field === 'resolutions') {
                const paths = matchingPaths(edit.name, input.paths || []);
                assert.ok(paths && paths.every((p) => p.effectiveVersions.every((v) =>
                    semver.valid(v) && semver.gte(edit.value, v))), 'Selector would downgrade an installed branch; narrow the selector');
            }
            manifest[edit.field] ||= {
            };
            manifest[edit.field][edit.name] = edit.value;
        } else {
            assert.equal(edit.field, 'resolutions', 'Only evidenced resolution removals are supported');
            delete manifest.resolutions?.[edit.name];
        }
    }
    applyProposal(input, proposal, manifest);
    return manifest;
}

// Persist before launching Yarn: crashes and timeouts consume an attempt too.
export function reserveAttempt(state, candidateHash) {
    assert.ok(state.attempts < 3, 'Candidate budget exhausted: one initial install plus two repairs. Render the retained result; do not retry.');
    assert.ok(!state.hashes.includes(candidateHash), 'Identical candidate already attempted; diagnose or render the retained result');
    return {
        ...state,
        attempts: state.attempts + 1,
        hashes: [...state.hashes, candidateHash],
    };
}

export function installCandidate(root, state, run = spawnSync) {
    const manifestPath = resolve(root, 'package.json');
    const lockPath = resolve(root, 'yarn.lock');
    const candidateHash = fingerprint(read(manifestPath));
    const reserved = reserveAttempt(state, candidateHash);
    const directory = resolve(root, 'triage-results/candidate');
    const statePath = resolve(directory, 'state.json');
    writeFileSync(statePath, JSON.stringify(reserved));
    const logPath = resolve(directory, `install-${reserved.attempts}.log`);
    const fd = openSync(logPath, 'w');
    let result;
    try {
        result = run(process.execPath, ['.yarn/releases/yarn-4.14.1.cjs', 'install', '--no-immutable', '--mode=skip-build'], {
            cwd: root,
            stdio: ['ignore', fd, fd],
            timeout: 180000,
        });
    } finally { closeSync(fd); }
    const passed = result.status === 0 && !result.error;
    if (passed) {
        reserved.manifest = readFileSync(manifestPath, 'utf8');
        reserved.lock = readFileSync(lockPath, 'utf8');
    } else {
        writeFileSync(manifestPath, state.manifest);
        writeFileSync(lockPath, state.lock);
    }
    writeFileSync(statePath, JSON.stringify(reserved));
    const summary = {
        passed,
        attempt: reserved.attempts,
        remainingRepairs: 3 - reserved.attempts,
        exitCode: result.status,
        signal: result.signal || null,
        error: result.error?.code || null,
        rolledBack: !passed,
        log: logPath,
        diagnostic: readFileSync(logPath, 'utf8').split(/\r?\n/).slice(-30).join('\n').slice(-4000),
    };
    writeFileSync(resolve(directory, 'result.json'), JSON.stringify(summary, null, 2));
    return summary;
}

export function main(command, root = process.cwd()) {
    const directory = resolve(root, 'triage-results/candidate');
    const statePath = resolve(directory, 'state.json');
    const input = read(resolve(root, 'triage-results/agent-input.json'));
    if (input.pathEvidence) {
        const proof = read(resolve(root, 'triage-results/dependency-paths.json'));
        assert.equal(proof.baselineSha, input.baselineSha);
        assert.equal(proof.fingerprint, input.fingerprint);
        assert.equal(fingerprint(proof.paths), input.pathEvidence.hash);
        input.paths = proof.paths;
    }
    mkdirSync(directory, {
        recursive: true,
    });
    const hasState = existsSync(statePath);
    if (!hasState) assert.deepEqual(read(resolve(root, 'package.json')), input.manifest, 'Use the helper before editing the manifest');
    const state = hasState ? read(statePath) : {
        baselineSha: input.baselineSha,
        fingerprint: input.fingerprint,
        attempts: 0,
        hashes: [],
        manifest: readFileSync(resolve(root, 'package.json'), 'utf8'),
        lock: readFileSync(resolve(root, 'yarn.lock'), 'utf8'),
    };
    assert.equal(state.baselineSha, input.baselineSha);
    assert.equal(state.fingerprint, input.fingerprint);
    if (command === 'restore') {
        writeFileSync(resolve(root, 'package.json'), state.manifest);
        writeFileSync(resolve(root, 'yarn.lock'), state.lock);
        console.log('Restored the last installed candidate (or baseline); attempt budget retained. Update proposal decisions before rendering.');
        return;
    }
    assert.equal(command, 'apply', 'Use apply or restore');
    const manifest = candidateManifest(input, read(resolve(root, 'triage-results/proposal.json')), read(resolve(root, 'package.json')));
    // Invalid plans and exhausted budgets never modify package.json.
    reserveAttempt(state, fingerprint(manifest));
    writeFileSync(statePath, JSON.stringify(state));
    writeFileSync(resolve(root, 'package.json'), `${JSON.stringify(manifest, null, 2)}\n`);
    const summary = installCandidate(root, state);
    console.log(JSON.stringify(summary));
    if (!summary.passed) process.exitCode = 1;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    try { main(process.argv[2]); } catch (error) {
        console.error(JSON.stringify({
            passed: false,
            diagnostic: error.message.slice(0, 4000),
        }));
        process.exitCode = 1;
    }
}
