# Component Matrix

This matrix documents stable component patterns in Glass IM Shell. It is written for host teams that need to embed, restyle, test, or replace mock data while keeping the UI kit original and generic.

## Component Contract

| Contract area | Rule |
| --- | --- |
| Ownership | Components are static HTML/CSS/JS patterns owned by this package. Host apps provide data and event handlers. |
| Stability | Public runtime API, schema fields, routes, host events, and `data-glass-*` attributes are stable. Internal class names are implementation details. |
| Styling | Components inherit liquid-glass tokens from `styles.css` and must remain scoped to `[data-glass-shell]` surfaces. |
| Data | Default data is fictional. Host data must match `schema.d.ts` and should not require DOM rewrites. |
| Accessibility | Interactive components require visible focus, usable labels, keyboard operation, and reduced-motion compatibility. |
| Release review | Changes that alter anatomy, route ownership, events, or test selectors must update this file, `docs/PAGE_MATRIX.md`, and `INTEGRATION.md` when relevant. |

## Navigation Components

| Component | Surface | Purpose | Anatomy | States | Host / Events | Acceptance |
| --- | --- | --- | --- | --- | --- | --- |
| Shell Frame | Desktop, mobile, embedded | Owns app layout, panes, safe area, and route state. | Root surface, rail, list pane, work pane, side pane, sheet mount. | Fullscreen, embedded, mobile-open, detail-open, collapsed side pane. | `GlassIMShell.configure`, `setSurface`, root `data-glass-*` attributes. | No bare host body takeover in embedded mode; no horizontal overflow on mobile. |
| Rail Navigation | Desktop | Switches primary sections. | Brand mark, icon buttons, labels, active marker, bottom utility buttons. | Active, hover, focus, compact density. | `view:change` through `setView`. | Buttons have accessible labels and visible focus. |
| Bottom Navigation | Mobile | Switches primary sections in phone layout. | Four tab buttons, CSS glyphs, localized labels. | Active, hover, focus, safe-area inset. | `view:change`. | Fixed height, no label wrapping, route updates keep active tab correct. |
| List Pane Header | Desktop, mobile | Shows current section title and search. | Title, hint, search input, more action. | Empty search, focused input, compact density. | Search filters local mock data only. | Search does not break keyboard order or mobile width. |
| Mobile Back Bar | Mobile deep pages | Returns from detail/deep route to previous layer. | Back button, title, optional action. | Visible on deep page, hidden on base tab. | Hash route and internal navigation. | Escape and back affordance close the correct layer. |
| More Action Sheet Trigger | Global | Opens global action sheet. | Icon button with localized label. | Idle, focus, sheet open. | Opens sheet, emits selected sheet action. | Sheet receives focus after opening and restores focus after close. |

## List Components

| Component | Surface | Purpose | Anatomy | States | Host / Events | Acceptance |
| --- | --- | --- | --- | --- | --- | --- |
| Chat Row | Messages | Opens a conversation. | Avatar, title, preview, subtitle, time, unread badge, pin marker, typing dot. | Active, unread, pinned, typing, muted. | `chat:open`. | Row target is keyboard reachable; active row matches current thread. |
| Contact Row | Contacts | Opens person detail. | Avatar, name, title, region, relationship indicator. | Normal, blocked, removed, focused. | `person:open`. | Directory sorting works for Chinese and English mock names. |
| Module Row | Explore, profile, settings | Opens a feature page. | CSS glyph, title, subtitle, chevron. | Default, focus, disabled where relevant. | `page:open`, feature-specific events. | Glyphs remain project-authored CSS shapes and do not use external icon files. |
| Section Header | Contacts, settings, wallet | Groups related rows. | Eyebrow/title, optional count or hint. | Default, compact. | None. | Spacing remains consistent across mobile and desktop. |
| Request Row | Contacts | Handles connection requests. | Avatar, name, note, status, action buttons. | Pending, accepted, ignored. | `contact:request:accept`, `contact:request:ignore`, `contact:request:message`. | Buttons expose localized names and status stays readable. |
| File Row | Chat files, saved items | Shows attachments. | Type mark, file name, metadata, optional action. | Default, focus. | `action`. | Long file names truncate without changing row height. |

## Chat Components

| Component | Surface | Purpose | Anatomy | States | Host / Events | Acceptance |
| --- | --- | --- | --- | --- | --- | --- |
| Thread Header | Chat detail | Shows active chat context. | Back affordance, avatar/title, subtitle, action buttons. | Direct chat, group chat, mobile deep page. | Chat detail actions and page links. | Header remains one row on desktop and stable on mobile. |
| Message Stack | Chat detail | Hosts messages and day separators. | Scroll area, date chips, message groups. | Empty, populated, reduced motion. | Local render from `chats[].messages`. | Scroll area does not overlap composer. |
| Message Bubble | Chat detail | Renders text and rich mock messages. | Optional avatar/name, bubble, metadata/status. | Incoming, outgoing, reply target, focused action. | Message action sheet and `message:send`. | Bubble width adapts to mobile; text wraps cleanly. |
| Attachment Card | Chat detail | Shows image, file, location, pass, gift, or transfer mock content. | Preview block, title, metadata, status chip. | Default, compact, outgoing/incoming. | Attachment action events. | No external media requests are required for default data. |
| Reply Preview | Composer | Shows selected reply target. | Source label, snippet, cancel button. | Visible, hidden. | `message:reply`, cancel action. | Cancel button is keyboard reachable. |
| Composer | Chat detail | Sends mock messages and tools. | Tool buttons, text area, send button, reply preview. | Empty, typing, focused, compact. | `message:send`, `composer:tool`. | Send disabled state is visually distinct; textarea fits mobile. |
| Message Action Sheet | Chat detail | Shows contextual message actions. | Sheet header, action grid, close button. | Open, focused, Escape close. | `message:reply`, copy/save/delete/forward mock events. | Focus stays inside sheet while open. |

## Contact Components

| Component | Surface | Purpose | Anatomy | States | Host / Events | Acceptance |
| --- | --- | --- | --- | --- | --- | --- |
| Profile Summary | Person detail | Shows person identity and primary actions. | Avatar, name, title, status, relationship controls. | Normal, blocked, removed. | `contact:update`, `chat:open`. | Status changes do not remove the mobile back path. |
| Contact Stats | Person detail | Shows mutual groups and metadata. | Stat tiles, labels, counts. | Default, compact. | None. | Tiles do not become nested cards. |
| Remark Form | Person detail | Edits local display metadata. | Input rows, label chips, save button. | Focused, saved. | `contact:update`. | Form labels are programmatic and visible. |
| Permission Toggle Row | Person detail, settings | Shows privacy and notification controls. | Label, hint, switch. | On, off, focus. | `settings:toggle`, `contact:update`. | Switch state is readable without color alone. |

## Explore Components

| Component | Surface | Purpose | Anatomy | States | Host / Events | Acceptance |
| --- | --- | --- | --- | --- | --- | --- |
| Activity Item | Activity page | Shows social activity mock posts. | Author, text, media grid, metadata, action row. | Liked, commented, own profile context. | `social:like`, `social:comment`, `social:menu`. | Media grid keeps stable aspect ratios on mobile. |
| Video Feed Item | Video page | Shows immersive short-video mock content. | Full-height panel, creator, caption, CSS action rail. | Active, liked, saved. | `video:like`, `video:comment`, `video:save`, `video:share`. | Action rail never covers main caption text. |
| Scanner Frame | Scanner page | Shows local scan mock UI. | Viewfinder, status text, result card, action row. | Idle, result. | `action`. | Works without camera permission or device APIs. |
| Nearby Card | Nearby page | Shows local place mock data. | Title, distance, status, participants. | Default, focus. | `action`. | Distance and status remain readable in both themes. |
| Plugin Tile | Plugin page | Shows host-like extension entries. | CSS glyph, name, category, recent marker. | Recent, suggested. | `action`. | Tile grid does not require third-party artwork. |

## Wallet Components

Wallet components are display-only mock UI. They must not claim custody, signing, private-key storage, live balances, or live asset movement.

The detailed wallet contract lives in `docs/WALLET_IMPLEMENTATION.md`.

| Component | Surface | Purpose | Anatomy | States | Host / Events | Acceptance |
| --- | --- | --- | --- | --- | --- | --- |
| Wallet Hero | Wallet home | Shows mock portfolio summary. | Wallet selector, balance, 24h summary, mock-only notice. | Default, compact, dark/light. | `wallet:switchWallet`. | Summary reads as mock data and does not imply real custody. |
| Wallet Action Row | Wallet home | Opens primary wallet flows. | Four compact text buttons: receive, pay, transfer, swap. | Focus, hover, active route. | `page:open`. | No CSS pictograms in these buttons; height remains compact. |
| Wallet Portfolio Tabs | Wallet home | Switches wallet home panels. | Assets, DeFi, NFT, records tabs, ARIA controls, matching panel. | Active tab, focus, keyboard arrows, host event. | `wallet:tab`. | Switching tabs updates visible content without changing route, toast noise, or live network behavior. |
| Asset Row | Wallet home and wallet deep-page selectors | Shows coin and balance data. | Project-authored coin mark, symbol, real asset name, chain labels, amount, fiat value or route metadata. | Default, focused, selected, compact. | `wallet:asset`, `wallet:receiveAsset`. | Layout follows standard wallet list structure across receive, pay, transfer, and swap surfaces; symbol/logo/name correspond to the same asset. |
| Coin Mark | Wallet rows | Gives quick asset recognition without third-party files. | CSS-only circular mark, symbol letterform, optional shape accent. | Light/dark. | None. | No external logo files; mark is visually tied to the asset symbol. |
| Chain Label Group | Wallet rows and flows | Shows supported networks. | Inline chain labels, overflow-safe wrapping. | Many chains, compact. | Data from `cryptoAssets[].networks`. | USDT and USDC chain labels remain readable without horizontal scroll. |
| Transaction Row | Wallet records | Shows mock history. | Direction mark, title, chain, time, value. | Incoming, outgoing, swap. | `wallet:tx`. | Values align right and do not collide with labels. |
| Wallet Secondary Row | Wallet DeFi and NFT tabs | Shows host-owned secondary wallet inventory. | Asset mark or collection tile, title, metadata, value or floor. | Default, empty, focused. | `wallet:defi`, `wallet:nft`. | Rows render from host data, and empty arrays show mock-only empty states instead of stale defaults. |
| Wallet Form | Pay, transfer, swap | Captures mock address, contact, amount, route, and memo. | Labeled fields, shared asset selector, selected asset field, fee/risk card, confirm button. | Focus, max selected, confirm, host-provided defaults. | `wallet:max`, `wallet:contact`, `wallet:confirmSend`, `wallet:confirmTransfer`, `wallet:confirmSwap`. | Inputs have labels, focus style, mobile-safe spacing, and values from `walletFlowConfig`. |
| Receive Panel | Receive page | Shows mock address and QR block. | Asset selector, QR placeholder, address, copy action, incoming summary. | Asset selected, copy action. | `wallet:copyAddress`, `wallet:receiveAsset`. | QR is clearly a local placeholder, not a live payment request. |
| Swap Quote | Swap page | Shows mock conversion path. | From asset row, to asset row, rate, slippage, bridge, fee, estimate. | Reversed route, confirm. | `wallet:swapDirection`, `wallet:confirmSwap`. | Quote uses deterministic mock values and no network calls. |

## Settings Components

| Component | Surface | Purpose | Anatomy | States | Host / Events | Acceptance |
| --- | --- | --- | --- | --- | --- | --- |
| Settings Metric | Settings home | Opens settings groups. | Label, value, hint, chevron. | Default, focused. | `page:open`. | Values stay readable in compact density. |
| Toggle Row | Settings | Updates local preferences. | Label, hint, switch. | On, off, focus. | `settings:toggle`. | Switch is keyboard reachable and announced by label. |
| Segmented Control | General settings, host examples | Changes language, appearance, or density. | Button group, active segment. | Active, focus, disabled where needed. | `language:change`, `appearance:change`, `density:change`. | Active state is visible in light and dark themes. |
| Storage Bucket | Storage settings | Shows mock storage categories. | Label, amount, progress, clean action. | Default, cleaning mock action. | `settings:clean`. | Progress visuals are not color-only. |
| Device Row | Account security | Shows signed-in device mock data. | Device name, platform, last active, status. | Current, remote. | `settings:device`. | Current device is distinguishable without relying only on color. |

## Overlay Components

| Component | Surface | Purpose | Anatomy | States | Host / Events | Acceptance |
| --- | --- | --- | --- | --- | --- | --- |
| Action Sheet | Global, message actions | Presents modal actions. | Header, close button, action grid/list. | Open, focused, Escape close. | Feature-specific events. | `role="dialog"` and `aria-modal` are set while open. |
| Action Card | Sheets | Executes a compact command. | CSS glyph, label. | Hover, focus. | `action` or feature event. | Minimum tap target remains usable on mobile. |
| Toast / Live Status | Global | Announces route and action feedback. | `aria-live` region. | Updated, idle. | Runtime render state. | Screen readers can receive action feedback. |

## State Components

| Component | Surface | Purpose | Anatomy | States | Host / Events | Acceptance |
| --- | --- | --- | --- | --- | --- | --- |
| Empty State | Lists and routes | Shows no results or no data. | Short title, optional hint, optional action. | Search empty, data empty. | None or action. | Text is localized and not product-specific. |
| Loading State | Routes | Shows pending data where host apps load asynchronously. | Spinner or skeleton-compatible block. | Loading. | Host controlled in future data layer. | Reduced-motion mode has non-animated fallback. |
| Error State | Routes | Shows recoverable data failure. | Error title, hint, retry action. | Error, retrying. | Host controlled in future data layer. | Error copy avoids blaming external services by name. |
| Permission State | Scanner, wallet, contacts | Shows blocked or unavailable feature. | Notice, reason, action. | Disabled, mock-only. | `action`. | Does not request browser permissions in default mock mode. |

## CSS Glyph Components

| Component | Surface | Purpose | Anatomy | States | Host / Events | Acceptance |
| --- | --- | --- | --- | --- | --- | --- |
| Generic Glyph | Navigation and rows | Provides globally recognizable symbols. | `.icon` base with pseudo-elements. | Light/dark, active. | None. | CSS only; no copied official icons or external icon files. |
| Wallet Glyph | Transaction rows | Shows direction or action type. | Directional CSS lines and dots. | Incoming, outgoing, swap. | None. | Used for records only, not the compact wallet action buttons. |
| Avatar Mark | Chats and contacts | Represents fictional people or groups. | Initials, gradient/color token, optional status. | Online, muted, blocked. | None. | No real likenesses or third-party portraits. |

## Responsive Rules

| Rule | Requirement |
| --- | --- |
| Desktop | Rail, list pane, work pane, and side pane can coexist without clipping primary actions. |
| Mobile | List to detail uses layered navigation; deep pages keep a visible return path. |
| Embedded | Host scroll, body background, and page typography are not overwritten by the shell. |
| Density | Comfortable and compact density preserve tap targets and text readability. |
| Theme | `system`, `light`, and `dark` appearance modes use tokenized colors and maintain contrast. |
| Motion | Reduced-motion mode disables nonessential transitions and avoids route motion dependence. |

## Test Selectors

Stable selectors for host smoke tests:

- `[data-glass-shell]`
- `[data-glass-version]`
- `[data-glass-surface]`
- `[data-host-action]` in host examples
- `[data-host-route]` in host API example
- `[data-runtime-state]` in host API example

Avoid asserting internal class names in downstream tests unless the host owns a fork.

## Remaining Component Matrix Work

To reach full implementation documentation:

- Add screenshot references for every component group.
- Use `docs/STATE_MATRIX.md` for empty, loading, error, disabled, and permission state examples.
- Add host override snippets for each component family.
- Add per-component token references from `docs/DESIGN_TOKENS.md`.
- Add per-component keyboard paths for the final acceptance checklist.
