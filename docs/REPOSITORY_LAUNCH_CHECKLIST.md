# Repository Launch Checklist

Use this checklist before opening the public repository for Glass IM Shell.

This project must publish as an original generic IM UI kit. The repository should describe the package as a liquid-glass messaging shell, not as a recreation of any third-party product.

## Repository Identity

Confirm:

- Repository name is `glass-im-shell` or another original neutral name.
- Display name is `Glass IM Shell`.
- Description uses generic IM UI kit positioning.
- Topics are limited to neutral terms such as `im`, `chat`, `ui-kit`, `liquid-glass`, and `prototype`.
- Repository avatar, social preview, README art, and screenshots are original project assets.
- Public copy does not imply sponsorship, affiliation, compatibility certification, or product partnership.

## Required Files

Confirm these files are present before the first public push:

- `README.md`
- `LICENSE`
- `SECURITY.md`
- `CONTRIBUTING.md`
- `CHANGELOG.md`
- `ARCHITECTURE.md`
- `INTEGRATION.md`
- `HOST_READINESS.md`
- `RELEASE_CHECKLIST.md`
- `.github/pull_request_template.md`
- `.github/ISSUE_TEMPLATE/bug_report.md`
- `.github/ISSUE_TEMPLATE/feature_request.md`
- `.github/workflows/ci.yml`

## Git Ignore Boundary

Confirm these local or generated paths are not committed:

- `node_modules/`
- `.playwright-cli/`
- `.playwright-mcp/`
- `output/smoke/`
- `dist/`
- `.cache/`
- `*.log`
- `*.tgz`
- `.DS_Store`

## Metadata Gate

Before publishing a package, update `package.json` only when the final public URLs exist:

- `repository`
- `homepage`
- `bugs`

Keep these fields absent until real public URLs are available. Do not use placeholder URLs.

## Verification Gate

Run:

```bash
npm run ci:verify
```

Accept only if:

- Release audit passes.
- Repository audit passes.
- Manifest audit passes.
- Static UI audit passes.
- Architecture audit passes.
- Supply chain audit passes.
- Package audit passes.
- Browser smoke passes.
- `npm pack --dry-run` reports `total files: 53`.

## Manual Gate

Complete:

- `docs/HUMAN_ACCEPTANCE_ROUTE.md`
- `docs/FIRST_COMMIT_MANIFEST.md`
- `docs/PRE_RELEASE_ACCEPTANCE.md`
- `docs/PUBLICATION_READINESS.md`
- `RELEASE_CHECKLIST.md`

Record the reviewer, date, commit identifier, CI result, package preview result, screenshot review result, and final decision outside the package.

## Public Launch Gate

Do not publish if:

- Any automated check fails.
- Public metadata points to placeholders or private URLs.
- Screenshots show clipped controls, unreadable labels, broken routes, or layout overlap.
- Package preview includes unintended local output, dependency folders, logs, or generated archives.
- Public copy suggests a third-party product identity or affiliation.
- Wallet surfaces imply custody, signing, quote execution, or network submission inside this UI package.

## Final Decision

Use one of these outcomes:

- `GO`: publish the public repository and create the first release.
- `FIX`: keep the repository private, resolve listed issues, and repeat verification.
- `NO-GO`: stop publication until scope, identity, legal, or security concerns are resolved.
