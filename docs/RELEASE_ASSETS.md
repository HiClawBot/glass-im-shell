# Release Assets

This project keeps release assets original and reproducible.

## README Preview

- File: `docs/assets/glass-im-shell-preview.svg`
- Purpose: lightweight GitHub README visual for the original liquid-glass UI kit.
- Source: hand-authored vector preview based on this project's own UI language.
- Boundary: do not add third-party logos, official screenshots, copied icon files, copied product text, or real public-person likenesses.

## Smoke Screenshots

Run:

```bash
npm run smoke:playwright
```

Generated files:

- `output/smoke/fullscreen-about.png`
- `output/smoke/mobile-wallet-transfer.png`
- `output/smoke/mobile-video-feed.png`
- `output/smoke/embedded-wallet.png`
- `output/smoke/api-wallet-dark.png`
- `output/smoke/host-api.png`

See `docs/SCREENSHOT_ACCEPTANCE_MAP.md` for the route, smoke case, automated checks, manual review focus, and no-go conditions for each screenshot.

`output/smoke/` is ignored by git. Regenerate those files locally for visual release review; CI runs the same smoke checks but does not upload screenshots while the upload action emits Node runtime warnings.

## Publishing Notes

- Use screenshots generated from this repository only.
- Keep all visible names, balances, messages, groups, and media labels fictional.
- Use `npm run ci:verify` before publishing release notes or package files.
- Do not use third-party app screenshots, official icons, brand colors, product names, or marketing text in release imagery.
