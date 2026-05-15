## Summary

Describe what changed and why.

## Verification

- [ ] `npm run release:check`
- [ ] `npm run smoke:playwright`
- [ ] `npm pack --dry-run`
- [ ] `npm run ci:verify` for release-facing changes

## UI Evidence

Add screenshots for visible changes, including mobile and embedded surfaces when affected.

## Release Readiness

- [ ] Release notes, readiness report, acceptance checklist, and maintainer guide are updated when release behavior changes.
- [ ] Package preview contains only intended public files.

## Integration Impact

- [ ] Public API unchanged, or changes are documented.
- [ ] Stable `data-glass-*` selectors preserved, or changes are documented.
- [ ] No third-party brand assets, official screenshots, copied icon files, real public-person likenesses, or copied product text were added.
