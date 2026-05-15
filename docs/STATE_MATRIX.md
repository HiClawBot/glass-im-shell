# State Matrix

This matrix defines empty, loading, error, disabled, and permission states for Glass IM Shell. It separates current built-in behavior from host-owned states so downstream projects can integrate the UI kit predictably.

## State Contract

| State area | Owner | Current behavior | Release expectation |
| --- | --- | --- | --- |
| Default | Package | Fictional mock data renders every primary route. | All public routes open with usable content. |
| Empty | Package and host | Search filters and empty message lists show localized empty copy. | Empty copy stays generic, localized, and not product-specific. |
| Loading | Package and host | `dataProvider` sets a global loading banner while async data loads. | Loading state must not shift layout or block navigation unnecessarily. |
| Error | Package and host | `dataProvider` failures show a global error banner and emit `data:error`. | Error text is recoverable, generic, and does not expose internal stack details. |
| Disabled | Package and host | Blocked or removed contacts disable message start actions. | Disabled controls remain visible, labeled, and distinguishable without color alone. |
| Permission | Package and host | Scanner and wallet stay mock-display only and do not request device or custody permissions by default. | Permission states must explain unavailable capabilities without implying live services. |

## Global Runtime States

| State | Trigger | Surface | UI pattern | Events | Acceptance |
| --- | --- | --- | --- | --- | --- |
| Loading data | `window.GLASS_IM_CONFIG.dataProvider` pending. | List pane banner. | `status-banner loading` with localized `common.loading`. | None required. | Banner is readable in light/dark mode and does not break list interaction. |
| Data error | `dataProvider` rejects. | List pane banner. | `status-banner error` retry-style button with localized `common.error`. | `data:error`. | Error banner is keyboard reachable and does not reveal stack traces. |
| Route unavailable | Unknown route or missing module id. | Work pane. | Falls back to settings or empty work panel. | None required. | Shell remains usable and navigation can recover. |
| Empty work pane | No active detail route on desktop. | Work pane. | `empty-work` card with short orientation copy. | None. | Desktop layout does not look broken when no detail is selected. |
| Live status | User action completed. | `aria-live` toast. | Short action feedback. | Feature event already emitted. | Screen readers can receive feedback without layout shift. |

## Navigation And List States

| Component | Empty state | Loading state | Error state | Disabled / permission state | Acceptance |
| --- | --- | --- | --- | --- | --- |
| Chat list | `common.noChat` after search returns no rows. | Global loading banner. | Global error banner. | N/A. | Empty result stays inside list pane and search remains usable. |
| Contact list | `common.noContact` after search or deleted contacts remove rows. | Global loading banner. | Global error banner. | Blocked/removed indicators on person rows. | Directory groups can disappear without breaking section spacing. |
| Explore list | `common.noContent` if host data provides no module rows. | Global loading banner. | Global error banner. | Feature rows can be omitted by host. | Empty list does not leave a blank pane. |
| Profile list | Host may omit optional rows. | Global loading banner. | Global error banner. | Wallet or settings entries may be hidden by host fork. | Remaining rows keep section rhythm and route safety. |
| Search input | Search returns localized empty copy. | Search remains visible. | Search remains visible. | N/A. | Clearing search restores rows without route reset. |

## Chat States

| Component | Empty state | Loading state | Error state | Disabled / permission state | Acceptance |
| --- | --- | --- | --- | --- | --- |
| Message stack | `chat-empty` with `common.noContent` when a thread has no messages. | Host can show loading through data provider before render. | Global error banner. | Removed or blocked contact can disable start-chat from profile. | Composer spacing remains stable with an empty stack. |
| Composer | Empty textarea disables meaningful send until content exists. | N/A. | N/A. | Host fork may disable send for policy or permissions. | Disabled send is visible and keyboard order remains intact. |
| Tool drawer | Hidden by default. | N/A. | N/A. | Host can remove unsupported tools. | Layout does not jump when tools are hidden. |
| Message action sheet | Closed by default. | N/A. | N/A. | Unsupported actions can be omitted. | Sheet focus remains trapped while open. |

## Contact And Privacy States

| Surface | Empty state | Loading state | Error state | Disabled / permission state | Acceptance |
| --- | --- | --- | --- | --- | --- |
| Requests | Request list may be empty after host override. | Global loading banner. | Global error banner. | Accepted and ignored requests show status instead of destructive mutation. | Request actions remain named and visible. |
| Person detail | Missing person id falls back to current account data. | Global loading banner. | Global error banner. | Blocked or removed contacts disable start-chat action. | Relationship state is visible without relying on color only. |
| Friend permissions | N/A. | Global loading banner. | Global error banner. | Toggle rows show on/off and restricted states. | Toggle controls have labels and focus style. |
| Remark form | Host may provide blank fields. | Global loading banner. | Global error banner. | Save action can be host-disabled. | Blank fields retain labels and input boundaries. |

## Explore States

| Surface | Empty state | Loading state | Error state | Disabled / permission state | Acceptance |
| --- | --- | --- | --- | --- | --- |
| Activity timeline | Host may provide zero posts. | Global loading banner. | Global error banner. | Like/comment can be omitted by host. | Empty timeline should use generic copy and no third-party wording. |
| Video feed | Host may provide zero videos. | Global loading banner. | Global error banner. | Save/share can be disabled by host. | Empty or disabled feed must not leave full-screen blank content. |
| Scanner | Mock result card works without camera APIs. | N/A. | N/A. | No camera permission is requested by default. | Permission copy must state mock-only behavior if host adds camera integration. |
| Nearby | Host may provide zero nearby places. | Global loading banner. | Global error banner. | Location permission is not requested by default. | Disabled location state should keep manual actions reachable. |
| Plugins and games | Host may provide empty groups. | Global loading banner. | Global error banner. | Host can hide unsupported modules. | Grids collapse without broken tiles. |

## Wallet States

Wallet states are display-only. They must never imply custody, signing, live balances, or live asset movement.

| Surface | Empty state | Loading state | Error state | Disabled / permission state | Acceptance |
| --- | --- | --- | --- | --- | --- |
| Wallet home | Host may provide `walletSummary`, zero `cryptoAssets`, zero `walletDefiPositions`, zero `walletNftCollections`, or zero `walletTransactions`. | Global loading banner before host data resolves. | Global error banner on data provider failure. | Wallet can be mock-only or host-disabled. | Empty assets, positions, collections, and records should keep wallet boundary copy visible. |
| Asset selector | Empty selector should show generic no-content copy in a host fork. | N/A. | N/A. | Unsupported assets can be omitted. | Selected asset field cannot show mismatched symbol/name/mark. |
| Receive | QR and address are mock placeholders from `walletFlowConfig.receive`. | Global loading banner. | Global error banner. | Host must own real address generation. | Mock QR must not encode a live request by default. |
| Pay | Address, amount, available balance, and fee inputs are mock controls from `walletFlowConfig.pay`. | Global loading banner. | Global error banner. | Confirm action emits event only. | Fee and risk copy remain visible before confirm. |
| Transfer | Contact list, asset selector, amount, memo, and fee use mock rows from `walletFlowConfig.transfer`. | Global loading banner. | Global error banner. | Confirm action emits event only. | Contact selection must not imply validation of a live address. |
| Swap | Quote and route are deterministic mock values from `walletFlowConfig.swap`. | Global loading banner. | Global error banner. | Confirm action emits event only. | Rate, slippage, bridge, fee, and estimate must read as display data. |

## Settings And Account States

| Surface | Empty state | Loading state | Error state | Disabled / permission state | Acceptance |
| --- | --- | --- | --- | --- | --- |
| Account security | Device list can be empty. | Global loading banner. | Global error banner. | Security checks are mock actions. | Empty device list keeps status summary visible. |
| Notifications | N/A. | Global loading banner. | Global error banner. | Toggles can be disabled by host policy. | Disabled toggles remain labeled. |
| Chat settings | N/A. | Global loading banner. | Global error banner. | Backup can be host-disabled. | Disabled backup does not remove explanatory metadata. |
| Privacy | N/A. | Global loading banner. | Global error banner. | Permission rows can be host-disabled. | On/off states are text-visible. |
| General | N/A. | Global loading banner. | Global error banner. | Host may lock language, appearance, or density. | Locked controls need disabled styling and explanation. |
| Storage | Host may provide zero storage buckets. | Global loading banner. | Global error banner. | Clean action can be host-disabled. | Empty storage view keeps total/status readable. |
| About and help | Help topics may be empty. | Global loading banner. | Global error banner. | Diagnostics can be host-disabled. | About page still shows version, disclaimer, and license. |

## Host Integration Rules

| Host responsibility | Requirement |
| --- | --- |
| Async data | Use `dataProvider` or `GlassIMShell.setData()` and let the shell preserve navigation while data changes. |
| Error handling | Listen for `data:error` and show host-level recovery if needed. |
| Empty data | Provide empty arrays intentionally and review the empty states. |
| Disabled features | Prefer disabled controls with explanatory metadata over removing critical navigation without replacement. |
| Permissions | Camera, location, wallet custody, signing, push, and storage permissions belong to the host app, not this package. |
| Accessibility | Disabled and permission states must be keyboard understandable and cannot rely on color only. |

## Current Implementation Notes

Implemented today:

- Search empty states for chats, contacts, and module rows.
- Empty message stack.
- Empty desktop work pane.
- Global async loading banner.
- Global async error banner with `data:error`.
- Disabled start-chat action for blocked or removed contacts.
- Mock-only scanner and wallet boundaries.
- Visible on/off text for settings and privacy rows.

Host-owned or future work:

- Per-page custom skeletons.
- Per-component retry actions beyond the global error banner.
- Dedicated empty screens for every host-provided collection.
- Policy-locked controls with explanations.
- Screenshot coverage for explicit empty/loading/error/disabled fixtures.

## Acceptance Checklist

- Empty states use localized generic copy.
- Loading and error banners do not create horizontal overflow.
- Error states avoid stack traces and named external services.
- Disabled controls remain visible and labeled.
- Permission states do not request browser or wallet permissions in default mock mode.
- Wallet unavailable states keep display-only boundaries visible.
- Host-owned states are documented before a release claim is made.
