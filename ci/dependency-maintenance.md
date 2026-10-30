# Dependency maintenance execution

`dependency-maintenance.yml` remains manual and opt-in through
`DEPENDENCY_MAINTENANCE_ENABLED`. Validated changes now publish a live PR for human
review; merging remains manual. Both publication settings are false for staged mode.

The maintenance collector omits PR inventories, diffs, check runs and statuses.
The full collector remains available for interactive triage. Complete alert access
and an exact checkout/evidence baseline match are still mandatory.

`prepare-dependency-maintenance.mjs` combines the authoritative lockfile with one
offline `yarn info --all --recursive --virtuals --json` export. The graph supplies
effective versions even when resolution overrides rewrite descriptors; the lockfile
preserves each parent's declared constraint. Global, parent-scoped, descriptor and
scoped-package selectors are assessed separately, with unused selectors, lagging
pins, constraint overrides and unknown paths distinguished. Peer virtualisations
are deduplicated. None of this claims a verified unpinned installation.

The full relevant paths are retained in `dependency-paths.json` with an integrity
hash, separately from the compact `agent-input.json`. Copilot reads the standalone JSON files listed in `agent-context/index.md` once
in a single batch. Each file is under 10 KB and groups complete package records
with their candidates, parents and selectors; no JSON token is split between files. The validator consumes the authoritative paths. Registry reads are
sequential, deduplicated and limited to alert targets, evidenced lagging pins, and
parents for which a compatible security fix is unavailable. Unaffected pins do not
cause speculative registry searches.

Candidates use the smallest forward security fix for each affected release branch;
pre-1.0 minor branches are separate. Existing safe versions can be reused through
parent upgrades. Parent upgrade candidates retain a bounded earliest/latest choice
where useful. Downgrades, prereleases, deprecated releases, releases younger than
the seven-day Yarn age gate and Node-incompatible versions are excluded. Constraint
overrides and parent updates remain explicit review cases. Unselected new releases
do not invalidate an otherwise identical result's fingerprint.

Copilot reads the bounded package context and writes `proposal.json` decisions
and edits. Each edit supplies field, name, exact candidate value (or null for an
evidenced resolution removal), reason and compatibility.
`node ci/dependency-candidate.mjs apply` validates the whole proposal, applies
JSON edits and regenerates the lockfile in one call. It rejects unsupported values,
unknown selectors and downgrade pins before install. Full install logs stay local;
the same call returns the exit code and a diagnostic capped at 4,000 characters.
The persisted budget permits one initial install and two repairs; identical
manifest attempts are rejected. Failed installs and timeouts consume an attempt
and restore the last installed manifest/lockfile (initially the baseline).
The restore command never resets the budget. Final validation verifies these
retained files before running the authoritative immutable install and smoke gate.
Code generates the inventory JSON, two-table
report, upgrade disclosures and exact PR body. The post-agent steps restore the
authoritative evidence/input, check the diff and rendered reports, and retain the
existing immutable-install and full production smoke gate. Threat detection and
human review remain in place.

Node is pinned to 24.22.2 in `.nvmrc`. Preparation and the agent pre-steps reject
runtime drift or an incompatible installed Nuxt engine before model execution.
The smoke runner checks the final candidate runtime and regenerates `.clversion`
from the installed component-library manifest without running lifecycle scripts.
Changed resolutions require verified baseline paths, actual effect after install,
and no downgrade on unchanged parent paths.

The agent has 30 model turns, a 100-credit ceiling, three candidate groups and two
repair attempts across the run. Its harness allows one continuation retry after
30 seconds; Copilot's own transport owns inference retries and server backoff.
There is no outer workflow retry that would restart a rate-limited session. The
separate detection pass has ten turns, 50 credits and no whole-pass retries.
These initial caps should be calibrated against observed successful runs.

The read-only HTTP helper retries 429, rate-limited 403 and transient gateway
errors at most twice with exponential delay and jitter. It honours `Retry-After`
and exhausted GitHub reset headers. A server delay exceeding 60 seconds fails the
read rather than retrying early. Ordinary authentication/permission errors are
not retried. Error bodies and credentials are never logged.

Only successful, validated runs write a completion marker into Actions cache.
The fingerprint includes the baseline SHA, dependency files, advisory facts,
prepared candidates and policy/helper contents. Retrieval timestamps are excluded.
An identical result can be reused for six days, within the seven-day report
artifact retention. Incomplete registry evidence, a missing/expired marker, a
closed or changed published PR, a changed fingerprint, or the dispatch `force`
input always allows a new attempt. Cache errors cannot establish success.
The Actions summary identifies the previous report's run when Copilot is skipped.
Concurrency serializes this workflow in this repository; cross-repository
coordination would require an organization-level queue.

Validation:

```sh
node --test tests/dependency-maintenance.test.mjs tests/dependency-maintenance-graph.test.mjs .github/skills/dependency-triage/scripts/collect.test.mjs
gh aw compile dependency-maintenance-agent --no-check-update
```

When evaluating hosted runs, include both the main agent and detection artifacts:
model requests, input/output/cached tokens, credits, tool calls, repair attempts,
429s and successful inventory coverage. Local fixtures verify correctness and
input size; they cannot establish live Copilot savings or provider rate limits.

Every affected package requires an explicit, package-specific proposal decision.
Untouched proposals and default investigation text fail validation. Successful
validation records `analysisComplete`; the cache requires that marker and ignores
older entries without it, so the earlier empty noop cannot suppress a fresh run.
No-change decisions still avoid unnecessary install/build/browser runs.
