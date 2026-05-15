# First Commit Manifest

Use this manifest when preparing the first public commit for Glass IM Shell.

The goal is to commit the full source, examples, documentation, CI, audits, package lockfile, and original assets while excluding local preview output, browser runner output, dependencies, generated archives, and operating system metadata.

## Commit Root

The intended repository root is the `glass-im-shell` directory.

If this directory is copied into a new public repository, run the checks from that repository root before the first commit.

## Include In First Commit

Include these repository files:

- `.github/ISSUE_TEMPLATE/bug_report.md`
- `.github/ISSUE_TEMPLATE/config.yml`
- `.github/ISSUE_TEMPLATE/feature_request.md`
- `.github/pull_request_template.md`
- `.github/workflows/ci.yml`
- `.gitignore`
- `ARCHITECTURE.md`
- `CHANGELOG.md`
- `CONTRIBUTING.md`
- `HOST_READINESS.md`
- `INTEGRATION.md`
- `LICENSE`
- `README.md`
- `RELEASE_CHECKLIST.md`
- `SECURITY.md`
- `docs/API_CONTRACT.md`
- `docs/BETA_READINESS_REPORT.md`
- `docs/COMPONENT_MATRIX.md`
- `docs/DESIGN_TOKENS.md`
- `docs/FIRST_COMMIT_MANIFEST.md`
- `docs/GITHUB_RELEASE_GUIDE.md`
- `docs/HOST_DATA_OVERRIDES.md`
- `docs/HUMAN_ACCEPTANCE_ROUTE.md`
- `docs/LOCAL_PREVIEW.md`
- `docs/MAINTAINER_GUIDE.md`
- `docs/PACKAGE_METADATA.md`
- `docs/PAGE_MATRIX.md`
- `docs/PRE_RELEASE_ACCEPTANCE.md`
- `docs/PUBLICATION_READINESS.md`
- `docs/RELEASE_ASSETS.md`
- `docs/RELEASE_DRAFT.md`
- `docs/REPOSITORY_LAUNCH_CHECKLIST.md`
- `docs/SCREENSHOT_ACCEPTANCE_MAP.md`
- `docs/STATE_MATRIX.md`
- `docs/SUPPLY_CHAIN.md`
- `docs/UI_IMPLEMENTATION_SPEC.md`
- `docs/WALLET_IMPLEMENTATION.md`
- `docs/assets/glass-im-shell-preview.svg`
- `examples/host-api.html`
- `examples/npm-minimal.html`
- `examples/vanilla.html`
- `index.html`
- `mobile.html`
- `package-lock.json`
- `package.json`
- `release-manifest.json`
- `schema.d.ts`
- `script.js`
- `scripts/audit-architecture.js`
- `scripts/audit-integrity.js`
- `scripts/audit-manifest.js`
- `scripts/audit-package.js`
- `scripts/audit-release.js`
- `scripts/audit-repository.js`
- `scripts/audit-static-ui.js`
- `scripts/audit-supply-chain.js`
- `scripts/print-first-commit-files.js`
- `scripts/serve-local.js`
- `scripts/smoke-playwright.js`
- `src/module-map.json`
- `styles.css`

## Exclude From First Commit

Do not commit:

- `node_modules/`
- `.playwright-cli/`
- `.playwright-mcp/`
- `output/smoke/`
- `dist/`
- `.cache/`
- `*.log`
- `*.tgz`
- `.DS_Store`

## First Commit Commands

Run from the repository root:

```bash
npm run ci:verify
npm run commit:plan
git status --short
```

The status output should show only intended source, documentation, CI, package, lockfile, example, and audit files.

After the final human review passes, use a focused initial commit message such as:

```text
Initial public beta of Glass IM Shell
```

## No-Go Conditions

Do not create the first public commit if:

- `npm run ci:verify` fails.
- `npm run commit:plan` fails.
- `npm pack --dry-run` does not report `total files: 53`.
- `git status --short` shows dependency folders, browser runner output, smoke screenshots, generated archives, logs, or operating system metadata.
- `package.json` contains placeholder or local repository metadata.
- Public copy implies third-party product identity, affiliation, or official compatibility.
- Wallet surfaces imply custody, signing, quote execution, or network submission inside this UI package.
