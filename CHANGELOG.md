# Changelog

All notable project changes are recorded here.

## 0.1.0 - 2026-05-13

- Added the first public pre-Beta UI kit surface for a generic glass-style IM shell.
- Added message, contact, explore, profile, wallet, settings, saved item, credential, sticker, help, and deep detail flows with fictional mock data.
- Added automatic Chinese/English startup language, in-app language switching, and light/dark adaptation.
- Added fullscreen and embedded surface modes with runtime configuration through `window.GLASS_IM_CONFIG` and `window.GlassIMShell`.
- Added TypeScript schema declarations, architecture boundaries, release audits, and browser smoke tests.
- Added GitHub Actions verification for release audit, browser smoke, and package preview checks.
- Added README preview art and release asset documentation for open-source publishing.
- Added package content audit, release draft notes, and ignore rules for local generated files.
- Added Beta readiness reporting with release evidence, non-goals, no-go conditions, and final release steps.
- Added human pre-release acceptance checklist for screenshots, mobile flows, wallet mock surfaces, embedded mode, package contents, and release boundary review.
- Added maintainer guide for issue triage, pull request review, release process, package boundary, CI expectations, and documentation ownership.
- Added package metadata documentation and audit coverage for entry points, package discovery fields, stylesheet side effects, Node engine, and public publish configuration.
- Added supply chain documentation and audit coverage for lockfile integrity, script boundaries, read-only CI permissions, package preview, and wallet mock boundaries.
- Added GitHub release guide for public repository setup, metadata updates, local verification, release notes, optional package publish, and post-release checks.
- Added release manifest and manifest audit for package files, release documents, smoke screenshots, public surfaces, entry points, commands, and boundary statements.
- Added canonical local preview command and documentation for `5500-5509` review ports, cache reset, and mobile deep-page URLs.
- Added UI implementation spec as the source of truth for the full UI documentation target, public contract, information architecture, screen and component documentation models, wallet model, state model, and acceptance gates.
- Added page matrix documenting public routes, entry points, required data, primary actions, host events, acceptance notes, and smoke coverage.
- Added component matrix documenting stable component anatomy, states, host events, selectors, accessibility expectations, responsive rules, and release review ownership.
- Added design token documentation for runtime axes, colors, glass material, typography, spacing, radius, depth, motion, glyphs, wallet visuals, safe areas, and embedded host isolation.
- Added wallet implementation documentation and schema alignment for asset rows, multi-chain labels, receive, pay, transfer, swap, records, fee/risk display, mock boundaries, and wallet host events.
- Unified wallet deep-page asset selection so receive, pay, transfer, and swap surfaces reuse the wallet asset row structure, active state, chain labels, CSS coin marks, and mobile-safe compact layout.
- Added mobile hash route regression smoke for wallet pages, asset row anatomy, wallet action events, and wallet mobile back behavior.
- Added screenshot acceptance map covering generated smoke screenshots, route mapping, automated checks, manual review focus, and no-go conditions.
- Added state matrix documenting empty, loading, error, disabled, permission, and host-owned state behavior across routes and components.
- Added host data override guide for static embed data, async providers, runtime replacement, people, chats, activity, video, wallet, settings, theme, and empty-state examples.
- Added publication readiness guide for final repository metadata, release evidence, no-go conditions, and publisher sign-off.
- Polished pre-release visual QA by compacting mobile wallet contact strips and simplifying the host API screenshot surface.
- Improved global-language polish for operation toasts and host page-open event payloads.
- Improved mobile profile deep-link behavior so self routes highlight the profile tab and sticky actions no longer cover profile fields.
- Tightened the mobile wallet home card, action buttons, and asset-list safe area so the asset list remains readable above the bottom navigation.
- Added functional wallet home portfolio tabs for assets, DeFi, NFT, and records with `wallet:tab` events and smoke coverage.
- Added ARIA tab-panel wiring and keyboard arrow navigation for wallet portfolio tabs while removing tab-switch toast noise.
- Added host-overridable `walletSummary` data for wallet home name, account label, total, and summary text.
- Normalized `walletSummary` locale fallback so host-provided summary fields render consistently in English when localized variants are omitted.
- Added host-overridable `walletDefiPositions` and `walletNftCollections` for wallet secondary tabs, including empty-state smoke coverage.
- Added host-overridable `walletFlowConfig` for receive, pay, transfer, and swap deep-page display values with smoke coverage in the host API example.
- Added a minimal package-style host example, documented `setData` replacement semantics, and added transfer contact empty-state fallback.
- Added `docs/API_CONTRACT.md` for runtime methods, route strings, stable selectors, event payloads, and data replacement rules, with stronger smoke checks for wallet event payloads.
- Aligned release readiness documents around the current API contract, smoke cases, and 49-file package preview expectation.
- Added `docs/HUMAN_ACCEPTANCE_ROUTE.md` as a one-page manual release acceptance route and aligned package preview expectations to 50 files.
- Added `docs/REPOSITORY_LAUNCH_CHECKLIST.md` for first public repository launch readiness and aligned package preview expectations to 51 files.
- Added `scripts/audit-repository.js` to automate public repository launch checks and aligned package preview expectations to 52 files.
- Added `docs/FIRST_COMMIT_MANIFEST.md` for first public commit boundaries and aligned package preview expectations to 53 files.
- Opted the GitHub Actions workflow into the Node 24 action runtime and added audit coverage for the setting.
