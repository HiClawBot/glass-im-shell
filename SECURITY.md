# Security Policy

## Supported Versions

This project is currently pre-Beta. Security review focuses on the latest `0.1.x` source in the repository.

## Reporting

Do not post secrets, private keys, access tokens, exploit details, or sensitive reproduction data in a public issue.

Use a private repository security advisory when available. If the repository owner lists a private contact channel on the project page, use that channel for reports that may expose users, integrators, or infrastructure.

Useful reports include:

- A short impact summary.
- A reproducible path or minimal test case.
- Browser, operating system, and package version.
- Whether the issue affects the static demo, an embedded host, or a downstream integration.

## Scope

In scope:

- Script injection paths in the static UI.
- Unsafe handling of host-provided mock data.
- Public API behavior that could expose host state unexpectedly.
- Dependency or packaging problems that affect integrators.
- CI or package publication configuration that could ship unintended files.

Out of scope:

- Fictional balances, fictional contacts, and mock transaction history.
- Missing live backend controls in the static prototype.
- Real asset custody, signing, or key management, which this project intentionally does not implement.

## Supply Chain

See `docs/SUPPLY_CHAIN.md` for dependency, script, CI, package, and wallet mock boundaries.
