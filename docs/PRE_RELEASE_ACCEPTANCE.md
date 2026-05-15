# Pre-Release Acceptance Checklist

Use this checklist after automated verification passes and before publishing a public pre-Beta release.

Release candidate: Glass IM Shell 0.1.0

Date: 2026-05-15

For a compact step-by-step route, use `docs/HUMAN_ACCEPTANCE_ROUTE.md` first, then complete this checklist.

## Automated Gate

Run:

```bash
npm run ci:verify
```

Accept only if:

- Release audit passes.
- Repository audit passes.
- Static UI audit passes.
- Architecture audit passes.
- Package audit passes.
- Browser smoke passes.
- Package preview lists only expected public files.
- Package preview lists 53 files for this release candidate.

## Local URLs

Start the canonical local preview:

```bash
npm run serve:local
```

Use only the printed port from `5500-5509`.

Review these surfaces:

- `http://127.0.0.1:5500/`
- `http://127.0.0.1:5500/mobile.html`
- `http://127.0.0.1:5500/mobile.html#page:pay`
- `http://127.0.0.1:5500/examples/npm-minimal.html`
- `http://127.0.0.1:5500/examples/vanilla.html`
- `http://127.0.0.1:5500/examples/host-api.html`

## Screenshot Review

After `npm run smoke:playwright`, review `output/smoke/`.

Use `docs/SCREENSHOT_ACCEPTANCE_MAP.md` as the detailed screenshot review map.

Accept only if:

- `fullscreen-about.png` shows a complete fullscreen shell without clipped navigation or broken sheets.
- `mobile-wallet-transfer.png` shows a readable wallet form with usable controls and no text overlap.
- `mobile-video-feed.png` shows immersive feed controls with clear CSS glyph actions.
- `embedded-wallet.png` shows embedded mode contained inside the host surface.
- `host-api.png` shows host controls, event log, and runtime state without layout breakage.
- `api-wallet-dark.png` shows dark compact mode with readable contrast.
- `readme-preview.png` matches the public preview positioning and uses only original visual assets.

## Mobile Flow Review

Review the phone preview and mobile route matrix.

Accept only if:

- Bottom navigation switches between messages, contacts, explore, and profile.
- Detail pages open from list entries and close back to the prior surface.
- Chat thread, person detail, wallet, settings, saved items, credentials, stickers, and help surfaces are reachable.
- Sheets close with Escape and mobile back controls.
- Touch targets are large enough for repeated use.
- Safe-area spacing prevents controls from colliding with the top or bottom edges.

## State Review

Use `docs/STATE_MATRIX.md`.

Accept only if:

- Empty states are localized and generic.
- Loading and error banners do not break layout.
- Disabled controls remain visible and labeled.
- Permission states do not request browser or wallet permissions in default mock mode.
- Host-owned states are not represented as built-in production services.

## Wallet Review

Accept only if:

- Wallet balance, receive, pay, transfer, and swap flows are reachable.
- Wallet screens clearly read as mock display surfaces.
- Fee, route, risk, network, address book, and record elements are visible where expected.
- No page implies real custody, signing, or live asset movement.
- Host events can intercept wallet actions.

## Language And Theme Review

Accept only if:

- Startup language follows browser locale when no host language is provided.
- In-app language switching works in both directions.
- System light/dark preference is respected.
- Host API can switch appearance and density.
- Reduced-motion preference removes nonessential animation.

## Embedded Host Review

Accept only if:

- Embedded mode does not change the host page background.
- Embedded mode does not lock host page scrolling.
- Host controls can change route, language, appearance, density, and theme.
- `data-glass-*` attributes are present for host tests.
- Event log records route, message, contact, wallet, and settings actions.

## Release Boundary Review

Accept only if:

- Public pages use the original project name and generic messaging product positioning.
- Screenshots and preview art show fictional data.
- No third-party marks, official screenshots, official icon files, copied product text, product artwork, or real public-person likenesses are present.
- README, release notes, and package metadata do not claim compatibility with a named third-party product.
- License language covers only repository-authored code, styling, layout, and mock data.

## Package Review

Accept only if package preview includes:

- Runtime HTML, CSS, and JS.
- `schema.d.ts`.
- Examples.
- Documentation.
- `docs/API_CONTRACT.md`.
- Audit scripts.
- Original preview asset.
- `package.json`, `LICENSE`, and changelog.

Reject if package preview includes:

- `node_modules/`.
- `output/`.
- Browser runner folders.
- Workflow-only files.
- Generated archives.
- Local logs.
- Local operating system metadata.

## Documentation Review

Accept only if these files match the shipped behavior:

- `README.md`
- `INTEGRATION.md`
- `ARCHITECTURE.md`
- `HOST_READINESS.md`
- `RELEASE_CHECKLIST.md`
- `docs/BETA_READINESS_REPORT.md`
- `docs/RELEASE_DRAFT.md`
- `docs/API_CONTRACT.md`
- `docs/FIRST_COMMIT_MANIFEST.md`
- `docs/HUMAN_ACCEPTANCE_ROUTE.md`
- `docs/PACKAGE_METADATA.md`
- `docs/REPOSITORY_LAUNCH_CHECKLIST.md`
- `docs/SCREENSHOT_ACCEPTANCE_MAP.md`
- `CHANGELOG.md`
- `SECURITY.md`

## No-Go Conditions

Do not publish if:

- Any automated gate fails.
- Mobile deep navigation is broken.
- Wallet mock screens imply real financial execution.
- Embedded mode leaks styles into the host page.
- Screenshots show clipped controls, unreadable text, or overlapping key content.
- Release copy introduces third-party product identity.
- Package preview includes generated output, dependencies, local logs, or local archives.

## Sign-Off

Use `docs/PUBLICATION_READINESS.md` for the publisher sign-off template. Record sign-off outside the package with:

- Reviewer name.
- Date.
- Commit or archive identifier.
- `npm run ci:verify` result.
- Screenshot review result.
- Package preview result.
- Release boundary review result.
