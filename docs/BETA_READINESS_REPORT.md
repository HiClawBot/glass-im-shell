# Beta Readiness Report

Date: 2026-05-13

Project: Glass IM Shell 0.1.0

Status: Pre-Beta release candidate, pending human visual review and publisher review.

## Scope

Glass IM Shell is an original, static liquid-glass IM UI kit for generic messaging-style products. It is designed for embeddable prototypes, host-app integration tests, product demos, and early package consumers.

The project provides:

- Fullscreen shell, phone preview, npm minimal host example, embedded example, and host API example.
- Messages, contacts, explore, profile, settings, activity timeline, immersive video feed, and global wallet surfaces.
- Wallet mock flows for receive, pay, transfer, and swap.
- Chinese/English startup language handling, in-app language switching, system light/dark adaptation, compact density, and theme tokens.
- Runtime configuration through `window.GLASS_IM_CONFIG` and `window.GlassIMShell`.
- Stable host-facing contract in `docs/API_CONTRACT.md`.
- TypeScript integration schema in `schema.d.ts`.
- Release audit scripts, package preview audit, browser smoke tests, and GitHub Actions verification.

## Capability Matrix

| Area | Readiness | Evidence |
| --- | --- | --- |
| Runtime API | Ready for pre-Beta | `docs/API_CONTRACT.md`, `INTEGRATION.md`, `schema.d.ts`, host API smoke |
| Fullscreen shell | Ready for pre-Beta | `index.html`, fullscreen smoke screenshot |
| Mobile shell | Ready for pre-Beta | `mobile.html`, mobile route matrix smoke |
| Embedded mode | Ready for pre-Beta | `examples/vanilla.html`, `examples/npm-minimal.html`, embedded smoke screenshot |
| Host controls | Ready for pre-Beta | `examples/host-api.html`, runtime state smoke |
| Wallet UI | Prototype-ready | Mock receive, pay, transfer, swap, records, and risk surfaces |
| Social surfaces | Prototype-ready | Activity timeline and immersive video feed with fictional data |
| i18n and theme | Ready for pre-Beta | Startup locale, toggle control, system appearance, density controls |
| Accessibility basics | Pre-Beta baseline | Focus visibility, Escape behavior, labels, reduced-motion support |
| Package release | Ready for dry run | `npm pack --dry-run` and package audit |
| Release boundary | Ready for publisher review | `RELEASE_CHECKLIST.md`, release audit, original preview asset |

## Verification Evidence

Run these before tagging a public release:

```bash
npm run release:check
npm run smoke:playwright
npm run ci:verify
```

The verification flow covers:

- JavaScript syntax.
- i18n and runtime API integrity.
- Static UI accessibility basics.
- Architecture size and ownership boundaries.
- Package content preview.
- Release boundary terms, required documents, and restricted design source formats.
- Browser smoke checks for fullscreen, mobile, embedded, host API, wallet hash routes, wallet asset rows, wallet action events, video feed, dark mode, compact density, focus, Escape behavior, and basic control accessibility.
- Wallet event smoke checks verify key payload fields and route state, not only event names.
- State coverage for empty, loading, error, disabled, permission, and host-owned behavior is documented in `docs/STATE_MATRIX.md`.
- Host-owned data replacement examples are documented in `docs/HOST_DATA_OVERRIDES.md`.
- Final repository metadata and publisher sign-off are documented in `docs/PUBLICATION_READINESS.md`.

## Smoke Coverage

The browser smoke runner starts on ports `5500-5509` and writes screenshots to `output/smoke/`.

Screenshot acceptance is mapped in `docs/SCREENSHOT_ACCEPTANCE_MAP.md`.

Current expected screenshots include:

- `fullscreen-about.png`
- `mobile-wallet-transfer.png`
- `mobile-video-feed.png`
- `embedded-wallet.png`
- `host-api.png`
- `api-wallet-dark.png`

Current expected smoke cases:

- `fullscreen-about`
- `mobile-deep-routes`
- `mobile-route-matrix`
- `mobile-hash-wallet-regression`
- `embedded-wallet`
- `npm-minimal`
- `runtime-api`
- `host-api`

Current expected route coverage includes:

- Six primary mobile deep-route screenshots.
- Full mobile route matrix coverage for public detail pages.
- Wallet hash route regression coverage for the five wallet pages, wallet events, asset row anatomy, and mobile back behavior.
- Person detail back-navigation coverage.
- Embedded host mode coverage.
- Runtime API and host API coverage.

## Package Boundary

The package preview is expected to list 53 files: runtime files, examples, schema, documentation, audit scripts, and original preview asset listed in `package.json`.

The package must not include:

- Browser smoke output.
- Browser runner logs.
- Dependency folders.
- Workflow-only files.
- Generated package archives.
- Local operating system metadata.

## Release Boundary

The public repository should keep the following boundary:

- Original project name and positioning.
- Original CSS glyphs, layout, preview art, and fictional data.
- No third-party product marks, official screenshots, official icon files, product artwork, app-store screenshots, copied product text, or real public-person likenesses.
- License scope limited to code, styling, layout, and mock data authored in this repository.

## Known Non-Goals

This release does not implement:

- Backend services.
- Production identity or authentication.
- Real wallet custody, signing, or live asset movement.
- Push delivery.
- Production persistence.
- Full WCAG audit.
- Full manual browser matrix beyond the automated Chromium smoke flow.

## Go / No-Go

Go for public pre-Beta only after:

- `npm run ci:verify` passes.
- Smoke screenshots are reviewed by a human.
- `docs/HUMAN_ACCEPTANCE_ROUTE.md` is completed for the compact manual route.
- `docs/FIRST_COMMIT_MANIFEST.md` is reviewed for the first public commit boundary.
- `docs/REPOSITORY_LAUNCH_CHECKLIST.md` is completed for the public repository launch gate.
- `docs/PRE_RELEASE_ACCEPTANCE.md` is completed.
- README, release draft, and package preview are reviewed.
- Publisher confirms the release boundary language and asset scope.

No-go if:

- A public page introduces third-party product identity.
- A public demo uses real public-person likenesses or brand assets.
- Package preview contains generated output, dependency folders, logs, archives, or local metadata.
- Browser smoke shows broken mobile detail navigation, wallet forms, embedded mode, or runtime controls.

## Final Release Steps

1. Run `npm run ci:verify`.
2. Review `output/smoke/` screenshots.
3. Complete `docs/HUMAN_ACCEPTANCE_ROUTE.md`.
4. Review `docs/FIRST_COMMIT_MANIFEST.md`.
5. Complete `docs/REPOSITORY_LAUNCH_CHECKLIST.md`.
6. Review `docs/RELEASE_DRAFT.md`.
7. Complete `docs/PRE_RELEASE_ACCEPTANCE.md`.
8. Review `README.md`, `HOST_READINESS.md`, `RELEASE_CHECKLIST.md`, and this report.
9. Create release tag `v0.1.0`.
10. Publish GitHub release notes from `docs/RELEASE_DRAFT.md`.
9. Publish package only after package preview is confirmed.
