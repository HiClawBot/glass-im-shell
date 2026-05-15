# Architecture

Glass IM Shell currently ships as a no-build static UI kit: `script.js`, `styles.css`, `schema.d.ts`, and static examples. The runtime remains intentionally self-contained so it can run from a CDN, local file server, or embedded host page.

## Current Runtime

- `script.js`: boot config, fictional data, i18n, routing, render functions, interactions, runtime API.
- `styles.css`: design tokens, shell layout, feature surfaces, responsive behavior, embedded/fullscreen surface modes.
- `schema.d.ts`: host-facing data, event, and API types.
- `examples/vanilla.html`: static host integration example.
- `scripts/smoke-playwright.js`: optional browser smoke runner for local/CI checks with Playwright installed.

## Module Boundaries

The target pre-Beta split is tracked in `src/module-map.json`.

- `runtime`: boot config, state, public API, event emitter.
- `data`: fictional mock datasets, data merge helpers, i18n dictionaries.
- `navigation`: hash routes, view switching, mobile layer state.
- `chat`: chat list, message thread, composer, message actions.
- `contacts`: directory, requests, labels, groups, relationship actions.
- `explore`: activity timeline, video feed, scanner, nearby, plugins, games.
- `wallet`: mock crypto portfolio and payment-style UI flows.
- `profile-settings`: profile, settings, storage, saved items, passes, stickers, help.
- `styles`: tokens, shell, feature styles, responsive modes.
- `release`: release, integrity, static UI, and architecture audits.

## Public Contract

The public contract is the combination of:

- `window.GLASS_IM_CONFIG`
- `window.GlassIMShell`
- `schema.d.ts`
- stable `data-glass-*` attributes
- documented event names in `INTEGRATION.md`

Internal function names and CSS class names are not a stable public API.

## Beta Refactor Rules

- Keep `script.js` and `styles.css` as distributable outputs until a bundler is intentionally introduced.
- Move code into source modules only when the generated static output remains API-compatible.
- Do not change event names, data keys, or `data-glass-*` attributes without updating `schema.d.ts`, `INTEGRATION.md`, and release audits.
- Keep embedded mode isolated from host page global styles.
- Keep all mock names, assets, and product language fictional and generic.

## Size Budgets

These are release-check budgets, not performance targets:

- `script.js` should stay below 160 KB before source splitting.
- `styles.css` should stay below 110 KB before source splitting.
- Any new production file added to the package should be listed in `package.json#files`.

When a budget is reached, split the owning module from `src/module-map.json` before adding more behavior.

## Browser Smoke Scope

`npm run smoke:playwright` is intentionally optional because the package has no runtime dependencies. The script verifies:

- fullscreen mobile deep routes
- embedded host surface behavior
- runtime API state changes for language, appearance, density, and navigation
- console-error-free browser execution
- screenshot output in `output/smoke/`
