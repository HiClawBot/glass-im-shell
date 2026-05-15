# Human Acceptance Route

Use this one-page route after `npm run ci:verify` passes and before opening the repository or publishing a package.

## Gate

Run:

```bash
npm run ci:verify
```

Accept only if:

- All audits pass.
- Browser smoke passes.
- `npm pack --dry-run` reports `total files: 53`.
- Sensitive-term scan is clean.

## Local Review URLs

Start:

```bash
npm run serve:local
```

Use the printed port from `5500-5509`. If it starts on `5500`, review:

| URL | Pass Criteria | If It Fails |
| --- | --- | --- |
| `http://127.0.0.1:5500/` | Full app shell opens, no blank panes, no third-party identity. | Check `index.html`, `script.js`, and release boundary copy. |
| `http://127.0.0.1:5500/mobile.html` | Phone preview opens, bottom navigation works, no overflow. | Check mobile CSS, safe-area rules, and hash forwarding. |
| `http://127.0.0.1:5500/mobile.html#page:pay` | Wallet home opens with compact actions, asset rows, mock-only context. | Check wallet rendering, asset rows, and bottom navigation spacing. |
| `http://127.0.0.1:5500/mobile.html#page:payCode` | Receive flow shows mock address, QR placeholder, copy action. | Check `walletFlowConfig.receive` and receive page rendering. |
| `http://127.0.0.1:5500/mobile.html#page:sendCrypto` | Pay flow shows address, amount, fee, risk context, confirm action. | Check `walletFlowConfig.pay` and form control styles. |
| `http://127.0.0.1:5500/mobile.html#page:transfer` | Transfer flow shows contacts or empty state, asset selector, fee, memo. | Check `walletContacts`, transfer empty state, and form spacing. |
| `http://127.0.0.1:5500/mobile.html#page:swapCrypto` | Swap flow shows route, rate, slippage, bridge, fee, estimate. | Check `walletFlowConfig.swap` and route step layout. |
| `http://127.0.0.1:5500/examples/npm-minimal.html` | Minimal host page renders host-owned wallet data. | Check package-style config and `examples/npm-minimal.html`. |
| `http://127.0.0.1:5500/examples/vanilla.html` | Embedded surface stays inside host page and does not lock scroll. | Check embedded surface tokens and host scroll behavior. |
| `http://127.0.0.1:5500/examples/host-api.html` | Host controls change route, language, appearance, density, and theme. | Check host controls, event log, and runtime API calls. |

## Screenshot Review

Open `output/smoke/` after running smoke. Review with `docs/SCREENSHOT_ACCEPTANCE_MAP.md`.

| Screenshot | Pass Criteria | If It Fails |
| --- | --- | --- |
| `fullscreen-about.png` | About route, disclaimer, and shell frame are readable. | Check about page copy and mobile deep layer. |
| `mobile-wallet-transfer.png` | Wallet form is readable, aligned, and safely above bottom nav. | Check wallet form CSS and safe-area spacing. |
| `mobile-video-feed.png` | Video controls do not cover caption or creator text. | Check video feed action rail and responsive layout. |
| `embedded-wallet.png` | Embedded shell is contained in the host surface. | Check embedded mode and host body scroll rules. |
| `api-wallet-dark.png` | Dark compact wallet stays legible. | Check theme tokens and density styles. |
| `host-api.png` | Host controls, runtime state, and event log are visible. | Check host API example and event subscription. |

## Contract Review

Open `docs/API_CONTRACT.md`.

Accept only if:

- Runtime methods match `schema.d.ts`.
- Route strings match `docs/PAGE_MATRIX.md`.
- Stable selectors match `INTEGRATION.md`.
- Event payloads match smoke expectations.
- Data replacement rules match `docs/HOST_DATA_OVERRIDES.md`.

## Release Boundary

Accept only if:

- Public copy says original generic IM UI kit.
- No third-party marks, official screenshots, official icon files, copied product text, product artwork, or real public-person likenesses appear.
- Wallet copy remains display-only mock UI and does not imply custody, signing, live balances, quote execution, or network submission.
- License scope covers only repository-authored code, styling, layout, and fictional mock data.

## Sign-Off Decision

Use `docs/PUBLICATION_READINESS.md` for the final sign-off record.

Decision options:

- `GO`: CI passed, screenshots reviewed, local URLs pass, package preview is clean, release boundary is accepted.
- `FIX`: One or more review rows failed; fix, rerun `npm run ci:verify`, and repeat this route.
- `NO-GO`: Public identity, package boundary, wallet implication, or legal positioning is not acceptable for release.
