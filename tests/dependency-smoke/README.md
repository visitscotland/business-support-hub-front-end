# Production dependency smoke tests

Small standalone gate for dependency PRs: lint the site, build the production
output, start Nitro with a local Bloomreach API, and check `/` over HTTP and in
Chromium. Jenkins, GitHub Actions, approval and merge automation are not wired
up by this package.

## Install and run

Use Node 24 to match the deployment containers, with the repository's pinned
Yarn 4.14.1. From the repository root:

```sh
yarn install --immutable
yarn test:smoke:install
yarn test:smoke
```

On a Linux CI image, install browser OS dependencies once using
`yarn playwright install --with-deps chromium` during image preparation.

`test:smoke` stops at the first failing stage and exits nonzero. It runs the
existing `yarn lint` (warnings permitted), `yarn build`, then the production
HTTP and browser checks. Installation is an explicit prerequisite so an
eventual CI integration can control registry access separately.

Additional commands:

```sh
# Fast iteration against an existing production build; NOT the complete gate
yarn test:smoke:browser

# Prove that failures are detected (requires an existing production build)
yarn test:smoke:harness

# Fixture, port configuration and server-startup failure tests; no build/browser
yarn test:smoke:unit
```

Run serially. Ports 4317 (app) and 4318 (CMS) must be free; override them using
`SMOKE_APP_PORT` and `SMOKE_CMS_PORT`. Existing servers are never reused.

## What blocks merging

- Lint errors or a failed production build.
- Server startup failure, early exit or startup timeout.
- A homepage response other than HTTP 200, including redirects and error pages.
- Missing real homepage markup in the raw SSR response.
- Failure to observe `vs-app-hydrated`, hidden main content or a skeleton covering
  it, missing homepage heading, header or footer.
- An accordion that cannot open, display its content and close again. This is a
  real component-library control, proving that client event handlers work.
- Uncaught browser exceptions, unexpected console errors, broken essential
  requests, or incorrect script/stylesheet content types.
- An unhealthy server after browser startup.

Hydration **mismatch console messages** are attached and annotated as warnings;
they do not fail a page that renders and works. Other errors are not ignored
just because they mention hydration. A blank page, stuck skeleton or failed
interaction still fails even when a mismatch was logged.

The suite uses one Chromium worker, zero automatic retries, a desktop viewport,
bounded startup/assertion timeouts and a short post-render observation window.
It deliberately avoids `networkidle` and screenshot pixel comparisons.

## Deterministic CMS and telemetry

`fixtures/homepage.json` is synthetic, contains no production content or secrets,
and follows the Bloomreach page-model structure. It exercises the real SDK,
page mapping, Pinia store and component-library header, hero, accordion and
footer. Both SSR and browser requests use the local fixture server. Unexpected
fixture paths return 404. Keep its content assertions and fixture in step.

The smoke runner sets both build-time `BR_*` and runtime `NUXT_*` configuration.
It does not read or copy credentials. Nuxt may load an existing local `.env`,
but the CMS endpoints and RUM identifiers are explicitly overridden for tests.

RUM identifiers are left empty. Known optional Cludo and Tag Manager browser
requests, including the vendored `/scripts/cludo-search-results.js`, are fulfilled
locally without service initialisation. Unknown external application scripts/API requests
fail; external images/fonts are blocked and recorded. First-party application
code, CSS, payloads and APIs are not mocked in the normal smoke suite.

This tests one representative homepage, not every CMS module or a live CMS
deployment. It is an eligibility signal for the future PR evaluator, not proof
that every patch/minor upgrade is safe.

## Failure evidence

`smoke-results/` is ignored by Git and contains stage logs, `server.log`,
`result.json`, `playwright.json` and an HTML report. Browser diagnostics include
console output, hydration messages and failed requests. Failed browser tests
retain a screenshot and trace; the HTTP test attaches the SSR response.

```sh
yarn playwright show-report smoke-results/report
```

The full gate must be used for merge decisions. `result.json` explicitly records
`buildSkipped` and `harnessOnly` for the development commands. No branch rules
or existing pipeline statuses are changed by this initial package.

## Harness verification

The separate harness deliberately injects HTTP 500 and HTTP 200 error pages,
missing client JS, an overlaying skeleton, a runtime exception, missing CSS
and invalid JS MIME types. It asserts that each is rejected. A functioning
homepage with an injected hydration mismatch must pass. These injections only
exist inside the test browser and do not modify production routes or bundles.

## CI integration

Before making this a required merge gate, run the complete command on the
default branch in the intended CI image. Use the full command for eligibility;
the browser-only command deliberately skips lint and build validation.
