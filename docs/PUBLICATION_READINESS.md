# Publication Readiness

Use this file for the final human acceptance and public repository metadata pass.

Glass IM Shell is ready for public publishing only after automated gates pass, screenshots are reviewed, and final repository URLs are real.

## Current Candidate

| Field | Value |
| --- | --- |
| Package | `glass-im-shell` |
| Version | `0.1.0` |
| Status | Pre-Beta release candidate |
| Manifest date | `2026-05-15` |
| License | MIT |
| Positioning | Original liquid-glass IM shell UI inspired by common messaging app patterns. |

## Required Metadata

Do not publish a package until these `package.json` fields point to the final public location:

- `repository`
- `homepage`
- `bugs`

Do not use placeholder URLs. Keep these fields absent until the public repository exists.

## Public Repository Checklist

Confirm before opening the repository:

- Repository name, description, and topics use generic IM UI kit positioning.
- Issues are enabled.
- Pull request template and issue templates render.
- CI workflow is present and named consistently in branch protection.
- README preview asset renders from `docs/assets/glass-im-shell-preview.svg`.
- Release screenshots are generated from `npm run smoke:playwright`.
- Generated archives, browser runner folders, local logs, dependency folders, and smoke output are not committed.

## Final Local Gate

Run:

```bash
npm run ci:verify
```

Accept only if:

- Release audit passes.
- Repository audit passes.
- Manifest audit passes.
- Static UI audit passes.
- Architecture audit passes.
- Supply chain audit passes.
- Package audit passes.
- Browser smoke passes.
- `npm pack --dry-run` lists only intended public files.
- Package preview lists 53 files for this release candidate.

## Human Acceptance Gate

Complete `docs/PRE_RELEASE_ACCEPTANCE.md`.

Use `docs/HUMAN_ACCEPTANCE_ROUTE.md` as the compact manual route before completing the full checklist.

Use `docs/FIRST_COMMIT_MANIFEST.md` before the first public commit.

Use `docs/REPOSITORY_LAUNCH_CHECKLIST.md` before opening the public repository.

The human reviewer must inspect:

- Fullscreen shell.
- Phone preview.
- Mobile deep routes.
- Embedded mode.
- Host API controls.
- npm minimal host example.
- Wallet mock flows.
- Activity and video feed surfaces.
- Light and dark appearance.
- Chinese and English language switching.
- Reduced-motion behavior.
- Package preview contents.
- Release boundary copy.

## Required Evidence

Record outside the package:

- Reviewer name.
- Review date.
- Commit identifier.
- `npm run ci:verify` result.
- Screenshot review result.
- Human acceptance route result.
- Package preview result.
- API contract review result.
- Public repository URL.
- Package URL, if published.
- Release URL, if created.

## No-Go Conditions

Do not publish if:

- Any automated gate fails.
- Final repository metadata is missing or uses placeholders.
- Screenshots show clipped controls, broken routes, unreadable text, or layout overlap.
- Package preview includes unintended local or generated files.
- Public copy implies affiliation with a third-party platform.
- Public demos include restricted identity, private information, real wallet addresses intended for live funds, private keys, or access tokens.
- Wallet UI implies real custody, signing, quote execution, or network submission inside this package.

## Publisher Sign-Off Template

```text
Project: Glass IM Shell
Version: 0.1.0
Commit:
Public repository:
Reviewer:
Date:

ci:verify:
Screenshot review:
Package preview:
Release boundary review:
Metadata review:

Decision:
Notes:
```
