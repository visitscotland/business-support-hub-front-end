---
name: Dependency maintenance agent
description: Triage captured Dependabot evidence and propose a validated minimal dependency patch for human review.
on:
  workflow_call:
    secrets:
      GH_AW_CI_TRIGGER_TOKEN:
        required: false
if: vars.DEPENDENCY_MAINTENANCE_ENABLED == 'true'
engine: copilot
permissions:
  contents: read
  pull-requests: read
  copilot-requests: write
timeout-minutes: 60
network:
  allowed:
    - defaults
    - node
    - registry.npmjs.org
    - registry.yarnpkg.com
tools:
  bash: ["*"]
jobs:
  safe_outputs:
    if: needs.agent.result == 'success'
safe-outputs:
  staged: true
  report-failure-as-issue: false
  create-pull-request:
    title-prefix: "[dependency-maintenance] "
    draft: false
    max: 1
    fallback-as-issue: false
    allowed-files: [package.json, yarn.lock]
    protected-files:
      policy: blocked
      exclude: [/package.json, /yarn.lock]
    github-token-for-extra-empty-commit: ${{ secrets.GH_AW_CI_TRIGGER_TOKEN }}
steps:
  - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683
    with:
      persist-credentials: false
      fetch-depth: 0
  - uses: actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020
    with:
      node-version-file: .nvmrc
  - uses: actions/download-artifact@d3f86a106a0bac45b974a628896c90dbdf5c8093
    with:
      name: dependency-evidence
      path: triage-results
  - name: Install locked tools without lifecycle scripts
    run: node .yarn/releases/yarn-4.14.1.cjs install --immutable --mode=skip-build
  - name: Install test browser and OS libraries
    run: node .yarn/releases/yarn-4.14.1.cjs playwright install --with-deps chromium
  - name: Test the deterministic reporting and replacement helpers
    run: node --test tests/dependency-maintenance.test.mjs
post-steps:
  - name: Reject edits to validation and workflow code
    run: git diff --exit-code "$GITHUB_SHA" -- ci .github tests
  - name: Restore the authoritative collector snapshot
    uses: actions/download-artifact@d3f86a106a0bac45b974a628896c90dbdf5c8093
    with:
      name: dependency-evidence
      path: triage-results
  - name: Verify inventory, proposed fixes and production smoke gate
    run: node ci/dependency-maintenance.mjs validate
  - name: Retain report and validation artifacts
    if: always()
    uses: actions/upload-artifact@ea165f8d65b6e75b540449e92b4886f43607fa02
    with:
      name: dependency-maintenance-report
      path: |
        triage-results/triage.json
        triage-results/weekly-report.md
        triage-results/pr-body.md
        triage-results/validation.json
        smoke-results/
      if-no-files-found: ignore
      retention-days: 7
---

Read `.github/skills/dependency-triage/SKILL.md` and its operation reference.
Run its triage procedure on `triage-results/evidence.json`, writing the concise
two-list Markdown report and schema-version-2 JSON. Use the recorded baseline,
not stale generated output. Stop if collection is incomplete or its SHA differs
from the starting checkout. Gather missing dependency paths and exact registry
release evidence through read-only tools. Normalize comma-separated advisory
comparators and validate ranges before reasoning about versions.

Then read and follow `.github/skills/dependency-remediation/SKILL.md` for the
separate remediation stage. This stage authorizes only the minimal manifest and
lockfile edits described there; triage itself remains report-only. If a group is
too complex, omit it and prominently explain it under NOT FIXED in the report.
Prefer a useful validated partial remediation to a risky attempt to remove every
alert. The publisher must never hide remaining findings in a summary count.

Use `node ci/dependency-maintenance.mjs render` after the final edits and submit
exactly its PR body. Commit only package.json and yarn.lock for the PR safe output.
Do not alter protected source files, read credentials, request additional write
tools, weaken tests, approve/merge PRs or close previous PRs. Previous maintenance
PRs are replaced by a separate deterministic job after this new PR is published.

There is no requirement to create a PR when no valid changes can be made. In that
case retain the report and emit noop. Only the configured safe output may publish
the patch. Publication is currently in preview mode pending Copilot activation.
