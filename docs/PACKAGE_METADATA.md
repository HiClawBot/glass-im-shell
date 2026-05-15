# Package Metadata

This document describes the package metadata expected before publishing Glass IM Shell.

## Current Metadata

`package.json` includes:

- `name`: package name.
- `version`: release version.
- `description`: original generic IM UI kit positioning.
- `license`: MIT.
- `keywords`: IM, chat, UI kit, liquid-glass, and prototype discovery terms.
- `main`, `browser`, `style`, and `types`: public entry points.
- `exports`: runtime, stylesheet, schema, mobile preview, npm minimal example, vanilla example, and host API example.
- `files`: explicit public package allowlist.
- `sideEffects`: keeps the stylesheet from being removed by bundlers.
- `engines`: documents the Node version expected for verification scripts.
- `publishConfig`: marks the package as public when published.

## Repository URL Fields

Do not invent repository URLs before the final public location exists.

Before the first public package publish, add real values for:

- `repository`
- `homepage`
- `bugs`

These fields should point to the final public repository, project page, and issue tracker. They should not use placeholders.

Use `docs/PUBLICATION_READINESS.md` to record the final metadata review and publisher sign-off.

## Package Boundary

Package contents are controlled by `files` and verified by `scripts/audit-package.js`.

The package should include:

- Runtime HTML, CSS, and JS.
- Type declarations.
- Examples.
- Documentation, including `docs/API_CONTRACT.md` for host-facing stability, `docs/HUMAN_ACCEPTANCE_ROUTE.md` for final manual review, `docs/FIRST_COMMIT_MANIFEST.md` for initial commit boundaries, and `docs/REPOSITORY_LAUNCH_CHECKLIST.md` for public repository launch readiness.
- Audit and smoke scripts.
- Original preview asset.
- License and changelog.

The package should not include:

- Dependency folders.
- Browser smoke output.
- Browser runner folders.
- Workflow-only files.
- Local logs.
- Generated archives.
- Local operating system metadata.

## Verification

Run:

```bash
npm run release:check
npm pack --dry-run
```

Accept only if package audit passes and the package preview shows only intended public files.

For this release candidate, the expected preview count is 53 files.
