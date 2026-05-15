# Supply Chain

This project is a static UI package. The release process should stay simple, deterministic, and easy to inspect.

## Dependency Boundary

- Runtime dependencies should stay empty.
- Development dependencies are used only for local and CI verification.
- `package-lock.json` is required for deterministic CI installs.
- Browser smoke verification uses Playwright as a development dependency.

## Script Boundary

The package should not define install or publish lifecycle scripts. Release behavior should be explicit through documented commands:

- `npm run release:check`
- `npm run smoke:playwright`
- `npm run ci:verify`
- `npm pack --dry-run`

## CI Boundary

The GitHub Actions workflow should:

- Use read-only repository contents permission.
- Avoid secret-dependent verification.
- Avoid elevated pull request workflows for untrusted changes.
- Run `npm ci`.
- Install Chromium for Playwright smoke checks.
- Run release audit, browser smoke, and package preview.
- Upload smoke screenshots for review.

## Package Boundary

The npm package preview is checked by `scripts/audit-package.js`. The package should include only source, schema, examples, docs, audit scripts, and original preview assets.

Generated screenshots, dependency folders, browser runner folders, local logs, generated archives, workflow-only files, and local operating system metadata should not ship in the package.

## Wallet Boundary

Wallet surfaces are display-only mock UI. This package should not include custody, signing, private-key storage, live asset movement, or backend transaction services.

## Verification

Run:

```bash
npm run audit:supply-chain
npm run release:check
npm run ci:verify
```

Accept only if all checks pass and package preview contains only intended public files.
