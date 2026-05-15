# Maintainer Guide

This guide keeps Glass IM Shell maintainable as an open-source UI kit. It covers triage, pull request review, release preparation, and package boundaries.

## Maintainer Goals

- Keep the project original, generic, and easy to embed.
- Preserve the public runtime API and `data-glass-*` selectors unless a change is deliberate and documented in `docs/API_CONTRACT.md`.
- Keep mock data fictional.
- Keep wallet surfaces UI-only unless a downstream host implements secure services outside this package.
- Keep release assets limited to repository-authored art and repository-generated screenshots.

## Issue Triage

Use these labels when available:

- `bug` for reproducible UI, runtime, accessibility, or packaging defects.
- `enhancement` for new surfaces, host API additions, theme tokens, examples, or docs.
- `documentation` for README, integration, release, or contributor guidance.
- `accessibility` for keyboard, focus, reduced-motion, contrast, labels, or screen-reader issues.
- `integration` for embedded mode, host API, schema, and selector issues.
- `release` for package, CI, release note, and acceptance checklist work.

Ask for reproduction details when an issue does not include:

- URL or route.
- Browser and operating system.
- Viewport or device.
- Package version or commit.
- Expected and actual result.
- Screenshot when the issue is visual.

## Pull Request Review

Before merging, confirm:

- The change has a focused scope.
- Public API or schema changes are documented in `INTEGRATION.md` and `schema.d.ts`.
- Visual changes include screenshots from `output/smoke/` or another repository-generated source.
- New controls have accessible names and visible focus.
- Embedded mode remains scoped and does not take over the host document.
- Mock data remains fictional.
- No third-party product identity or restricted assets were introduced.
- `npm run ci:verify` passes.

For release-facing pull requests, also confirm:

- `docs/PRE_RELEASE_ACCEPTANCE.md` has been completed.
- `docs/BETA_READINESS_REPORT.md` still matches the shipped behavior.
- `docs/RELEASE_DRAFT.md` is updated.
- `npm pack --dry-run` shows only intended package files.

## Release Process

1. Confirm `package.json` version.
2. Confirm `docs/PACKAGE_METADATA.md` and final repository URL fields.
3. Review `docs/SUPPLY_CHAIN.md`.
4. Review `docs/GITHUB_RELEASE_GUIDE.md`.
5. Review `docs/LOCAL_PREVIEW.md`.
6. Run `npm run ci:verify`.
7. Review `output/smoke/` screenshots.
8. Complete `docs/PRE_RELEASE_ACCEPTANCE.md`.
9. Complete `docs/PUBLICATION_READINESS.md`.
10. Review `docs/BETA_READINESS_REPORT.md`.
11. Review `docs/RELEASE_DRAFT.md`.
12. Review package preview output.
13. Create the release tag.
14. Publish release notes from `docs/RELEASE_DRAFT.md`.
15. Publish a package only after the preview is accepted and final repository metadata is real.

## Package Boundary

Package contents are controlled by `package.json`.

Include:

- Runtime HTML, CSS, and JS.
- Type schema.
- Examples.
- Documentation.
- Audit and smoke scripts.
- Original preview asset.
- License and changelog.

Metadata expectations are documented in `docs/PACKAGE_METADATA.md`.

Exclude:

- Dependency folders.
- Browser smoke output.
- Browser runner folders.
- Workflow-only files.
- Local logs.
- Generated archives.
- Local operating system metadata.

## Boundary Review

Block a change when it adds:

- Third-party product marks.
- Official screenshots.
- Official icon files.
- Product artwork from another source.
- Real public-person names, likenesses, endorsements, or brand relationships.
- Product-specific positioning for a named third-party app.
- Wallet behavior that implies real custody, signing, or live asset movement.

Accept common IM ideas only when the execution remains generic, original, and documented as repository-authored UI.

## CI Expectations

The CI workflow should keep these checks:

- `npm ci`
- Chromium installation for browser smoke.
- `npm run release:check`
- `npm run smoke:playwright`
- `npm pack --dry-run`
- Smoke screenshot artifact upload.

When adding new public flows, extend `scripts/smoke-playwright.js` and update release docs before considering the flow release-ready.

## Documentation Ownership

Update these files when behavior changes:

- `README.md` for first-run usage, public positioning, and top-level features.
- `docs/UI_IMPLEMENTATION_SPEC.md` for UI implementation scope, documentation model, public contract, and acceptance gate changes.
- `docs/PAGE_MATRIX.md` for route, page, entry point, host event, and page acceptance changes.
- `docs/API_CONTRACT.md` for runtime method, route string, selector, event payload, and data replacement contract changes.
- `docs/COMPONENT_MATRIX.md` for navigation, list, chat, wallet, settings, overlay, state, and CSS glyph component changes.
- `docs/DESIGN_TOKENS.md` for appearance, density, surface, color, glass material, typography, spacing, motion, glyph, and embedded host token changes.
- `docs/WALLET_IMPLEMENTATION.md` for wallet routes, data fields, asset rows, mock asset coverage, records, fee/risk display, and wallet event changes.
- `docs/LOCAL_PREVIEW.md` for local review ports, cache reset, and mobile deep-page URL changes.
- `docs/HOST_DATA_OVERRIDES.md` for static data, async provider, runtime replacement, wallet, theme, and empty-state override examples.
- `INTEGRATION.md` for host API, events, data, selectors, theme, and embedding.
- `ARCHITECTURE.md` and `src/module-map.json` for module boundaries and size budgets.
- `RELEASE_CHECKLIST.md` for gate changes.
- `docs/GITHUB_RELEASE_GUIDE.md` for repository release process changes.
- `docs/SUPPLY_CHAIN.md` for dependency, script, CI, package, or wallet boundary changes.
- `release-manifest.json` for package files, release docs, smoke screenshots, commands, entry points, and boundary changes.
- `docs/PRE_RELEASE_ACCEPTANCE.md` for human acceptance changes.
- `docs/PUBLICATION_READINESS.md` for final repository metadata, evidence, and publisher sign-off changes.
- `docs/SCREENSHOT_ACCEPTANCE_MAP.md` for screenshot route, smoke case, manual review, and no-go condition changes.
- `docs/STATE_MATRIX.md` for empty, loading, error, disabled, permission, and host-owned state changes.
- `docs/BETA_READINESS_REPORT.md` for status, risk, and evidence changes.
- `docs/PACKAGE_METADATA.md` for package entry point and repository URL changes.
- `docs/RELEASE_DRAFT.md` for release notes.
- `CHANGELOG.md` for user-visible changes.
