# Contributing

Thanks for helping improve Glass IM Shell. The goal is a reusable, original IM UI kit that host projects can embed, theme, test, and extend without bringing in third-party product identity.

## Local Setup

```bash
npm install
python3 -m http.server 5500
```

Open `http://127.0.0.1:5500/` for the full shell, `http://127.0.0.1:5500/mobile.html` for the phone preview, or `http://127.0.0.1:5500/examples/vanilla.html` for the embedded example.

## Checks

Run these before opening a pull request:

```bash
npm run release:check
npm run smoke:playwright
npm pack --dry-run
```

Or run the combined local CI sequence:

```bash
npm run ci:verify
```

If Playwright is not installed on the machine yet, install the browser once:

```bash
npx playwright install chromium
```

## Project Boundaries

- Keep names, avatars, messages, balances, groups, files, and media labels fictional.
- Do not add third-party logos, official screenshots, copied icons, product artwork, copied marketing text, or real public-person likenesses.
- Keep release imagery in `docs/assets/` original, and generate browser screenshots from this repository with `npm run smoke:playwright`.
- Keep the product language generic: messages, contacts, explore, profile, wallet, settings, activity, video, and channels.
- Treat the wallet as a UI-only mock surface. Do not add real transaction signing, seed phrase handling, private-key storage, or live asset movement.
- Preserve stable `data-glass-*` attributes used by host projects and smoke tests.
- Keep global CSS scoped to the shell surface so embedded hosts keep control of their document.

## Pull Requests

Pull requests should include:

- A focused summary of what changed and why.
- Screenshots for visible UI changes.
- The commands run for verification.
- Notes about any public API, schema, mock data, or integration behavior changes.

Large visual changes should update `ARCHITECTURE.md`, `src/module-map.json`, or `INTEGRATION.md` when they affect module ownership or host integration.

Maintainers should also use `docs/MAINTAINER_GUIDE.md` for issue triage, pull request review, release preparation, package boundaries, and documentation ownership.
