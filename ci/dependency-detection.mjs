import assert from 'node:assert/strict';
import {
    existsSync, readFileSync, writeFileSync, mkdirSync,
} from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const detectionModel = 'gpt-4.1';
export function verifyModel(reflect, model = detectionModel) {
    const endpoint = reflect.endpoints?.find((e) => e.provider === 'copilot' && e.configured);
    assert.ok(endpoint?.models?.includes(model), `Detector model ${model} is absent from the workflow's live Copilot catalog`);
    return model;
}

export function detectionEvidence(directory) {
    const path = resolve(directory, 'detection_result.json');
    let status = 'failed';
    let diagnostic = 'Detection did not produce a structured verdict';
    if (existsSync(path)) {
        try {
            const result = JSON.parse(readFileSync(path, 'utf8'));
            if (result && typeof result === 'object' && Object.keys(result).length) {
                status = 'completed';
                diagnostic = 'Structured result recorded; publication still requires the compiler affirmative detection_success verdict';
            }
        } catch { diagnostic = 'Detector produced invalid JSON'; }
    }
    mkdirSync(directory, {
        recursive: true,
    });
    writeFileSync(resolve(directory, 'execution.json'), JSON.stringify({
        version: 1,
        component: 'detection',
        state: status,
        diagnostic,
    }));
    return status;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    try {
        if (process.argv[2] === 'model-check') verifyModel(JSON.parse(readFileSync('/tmp/gh-aw/sandbox/firewall/awf-reflect.json', 'utf8')));
        else if (process.argv[2] === 'record') {
            if (detectionEvidence('/tmp/gh-aw/threat-detection') !== 'completed') process.exitCode = 1;
        } else throw new Error('Use model-check or record');
    } catch (error) { console.error(error.message); process.exitCode = 1; }
}
