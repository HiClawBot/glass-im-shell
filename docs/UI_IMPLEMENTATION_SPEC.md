# UI Implementation Spec

This document is the source of truth for implementing, reviewing, and extending Glass IM Shell as an original generic IM UI kit.

## Goal

The 100% UI implementation target is a documented, runnable, embeddable shell where a downstream project can:

- Understand every public screen and route.
- Recreate every stable component pattern.
- Replace fictional data through the documented schema.
- Verify desktop, mobile, embedded, language, theme, wallet, and deep-page behavior.
- Avoid third-party product identity, brand assets, official screenshots, copied text, and real public-person likenesses.

## Current Scope

Current status: pre-Beta UI implementation candidate.

Included surfaces:

- Fullscreen shell at `index.html`.
- Phone preview at `mobile.html`.
- Embedded host example at `examples/vanilla.html`.
- Host API example at `examples/host-api.html`.
- Messages, contacts, explore, profile, settings, social activity, video feed, scanner, nearby, plugins, saved items, credentials, stickers, help, and wallet surfaces.

Current constraints:

- Static HTML/CSS/JS runtime.
- Fictional mock data by default.
- Wallet screens are display-only mock UI.
- No backend services, production identity, custody, signing, push delivery, or production persistence.

## Canonical Local Review

Use only the canonical preview command for human review:

```bash
npm run serve:local
```

The command selects a port from `5500-5509`. See `docs/LOCAL_PREVIEW.md`.

Required review surfaces:

- `/`
- `/mobile.html`
- `/mobile.html#page:pay`
- `/examples/npm-minimal.html`
- `/examples/vanilla.html`
- `/examples/host-api.html`

## Public Runtime Contract

Stable public contract:

- `window.GLASS_IM_CONFIG`
- `window.GlassIMShell`
- `schema.d.ts`
- documented events in `INTEGRATION.md`
- `data-glass-*` root attributes
- package exports in `package.json`

`docs/API_CONTRACT.md` is the canonical host-facing contract for runtime methods, route strings, stable selectors, event payloads, and data replacement rules.

Not stable:

- Internal function names.
- Internal CSS class names.
- Exact mock data values.
- Generated smoke screenshots.

## Information Architecture

Primary tabs:

- Messages.
- Contacts.
- Explore.
- Profile.

Primary deep-page groups:

- Chat details.
- Contact details.
- Social activity.
- Video feed.
- Tools and plugins.
- Wallet.
- Saved items and credentials.
- Settings.
- Help and feedback.

Wallet primary actions:

- Receive.
- Pay.
- Transfer.
- Swap.

## Screen Documentation Model

Every public screen should eventually have:

- Route.
- Entry points.
- Purpose.
- Required data.
- Empty state.
- Loading state.
- Error or blocked state.
- Primary actions.
- Secondary actions.
- Host events.
- Accessibility notes.
- Smoke screenshot reference.

The page matrix lives in `docs/PAGE_MATRIX.md`.

## Component Documentation Model

Every stable component pattern should eventually have:

- Purpose.
- Anatomy.
- Required content.
- Optional content.
- Interaction states.
- Responsive behavior.
- Accessibility requirements.
- Host integration notes.
- Screenshot reference.

The component matrix lives in `docs/COMPONENT_MATRIX.md`.

## Design System Model

The design system should document:

- Color tokens.
- Glass material tokens.
- Typography scale.
- Spacing scale.
- Radius scale.
- Shadow and blur rules.
- Motion and reduced-motion behavior.
- Icon and CSS glyph rules.
- Mobile safe-area rules.
- Embedded host isolation rules.

The design token document lives in `docs/DESIGN_TOKENS.md`.

## Wallet Implementation Model

Wallet UI should remain generic and display-only.

Wallet documentation should cover:

- Asset list row anatomy.
- Coin mark handling.
- Supported chain labels.
- Receive flow.
- Pay flow.
- Transfer flow.
- Swap flow.
- Records.
- Risk and fee display.
- Host event handoff.
- No real custody, signing, private-key storage, or live asset movement.

The wallet implementation contract lives in `docs/WALLET_IMPLEMENTATION.md`.

## State Model

Every route should define:

- Default state.
- Empty state.
- Loading state.
- Error state.
- Disabled or permission state where relevant.
- Mobile back behavior.
- Escape behavior for sheets.
- Reduced-motion behavior.

The state matrix lives in `docs/STATE_MATRIX.md`.

## Accessibility Baseline

Current baseline:

- Visible focus.
- Basic labels.
- Escape handling for sheets and mobile detail layers.
- Reduced-motion media query.
- Mobile tap targets.

Future acceptance should add:

- Screen-reader route announcements.
- Full keyboard path documentation.
- Contrast review per theme.
- Manual assistive technology pass.

## Acceptance Gates

Automated:

```bash
npm run release:check
npm run smoke:playwright
npm run ci:verify
```

Human:

- `docs/PRE_RELEASE_ACCEPTANCE.md`
- `docs/BETA_READINESS_REPORT.md`
- `RELEASE_CHECKLIST.md`
- smoke screenshots in `output/smoke/`

## Release Boundary

The implementation must remain:

- Original.
- Generic.
- Fictional-data based.
- Free of third-party product identity.
- Free of official screenshots, official icons, copied product text, and real public-person likenesses.

## Remaining Spec Work

The full 100% documentation target still needs:

- Page matrix.
- Component matrix.
- Design token specification.
- Wallet implementation details.
- State and empty/loading/error matrix.
- Host data override examples.
- Accessibility acceptance checklist.
- Screenshot acceptance map.
