# Page Matrix

This matrix documents public screens, routes, entry points, primary actions, host events, and acceptance notes for Glass IM Shell.

## Route Types

| Route type | Example | Owner | Notes |
| --- | --- | --- | --- |
| Tab view | `view:chats` | runtime navigation | Internal state, reached through bottom or rail navigation. |
| Chat detail | `chat:team` | chat | Opens a thread and composer. |
| Person detail | `person:chen` | contacts | Opens profile detail and relationship controls. |
| Deep page | `page:pay` | feature modules | Opens a module surface in the work pane. |

## Primary Shell Views

| Surface | Route / State | Entry Points | Purpose | Primary Actions | Host Events | Acceptance |
| --- | --- | --- | --- | --- | --- | --- |
| Messages | `view:chats`, `chat:{id}` | Bottom navigation, rail, chat list | Conversation list and active thread. | Open chat, send message, use composer tools, open chat detail. | `view:change`, `chat:open`, `message:send`, `composer:tool` | Chat list and thread render on desktop and mobile; composer controls have visible focus. |
| Contacts | `view:contacts`, `person:{id}` | Bottom navigation, rail, contact rows | Directory, requests, groups, labels, and profile details. | Open person, accept or ignore requests, update relationship settings. | `view:change`, `person:open`, `contact:update`, `contact:request:accept` | Directory sections render; person route supports mobile back. |
| Explore | `view:discover` | Bottom navigation, rail, explore entries | Activity, video, scanner, nearby, plugins, and games. | Open feature pages, like/comment, scan, open plugin/game entries. | `view:change`, `social:like`, `video:like`, `action` | Explore entries open deep pages with no horizontal overflow. |
| Profile | `view:me` | Bottom navigation, rail, profile entries | Profile, wallet, saved items, credentials, stickers, settings. | Open wallet, settings, saved items, and account pages. | `view:change`, `page:open`, `settings:toggle` | Profile entries open mobile deep layers and return correctly. |

## Contact Pages

| Page | Route | Entry Points | Required Data | Primary Actions | Host Events | Acceptance |
| --- | --- | --- | --- | --- | --- | --- |
| Connection Requests | `page:newFriends` | Contacts top entry | `contactRequests` | Accept, ignore, message. | `contact:request:accept`, `contact:request:ignore`, `contact:request:message` | Request rows show status and action controls. |
| Groups | `page:groups` | Contacts top entry | `chats` with group type | Open group summary. | `page:open`, `action` | Group rows show member count and status. |
| Labels | `page:tags` | Contacts top entry | `contactLabels` | Open label group. | `contact:label:open` | Label groups show counts and members. |
| Channels | `page:officialAccounts` | Contacts top entry | `channelSubscriptions` | Open subscription row. | `action` | Subscription list is readable and keyboard reachable. |
| Remark And Labels | `page:remarkTags` | Person detail | Active person data | Edit remark fields and labels. | `contact:update` | Form rows remain readable on mobile. |
| Friend Permissions | `page:friendPrivacy` | Person detail | Active person data | Toggle permissions. | `contact:update`, `settings:toggle` | Toggle controls have names and visible focus. |

## Explore Pages

| Page | Route | Entry Points | Required Data | Primary Actions | Host Events | Acceptance |
| --- | --- | --- | --- | --- | --- | --- |
| Activity | `page:moments` | Explore entry, person detail | `moments` | Like, comment, post menu. | `social:like`, `social:comment`, `social:menu` | Timeline rows, media placeholders, and action controls fit mobile. |
| Video Feed | `page:channels` | Explore entry | `videoFeed` | Like, comment, save, share. | `video:like`, `video:comment`, `video:save`, `video:share` | Smoke screenshot: `mobile-video-feed.png`. |
| Scanner | `page:scan` | Explore entry, sheet action | None required | Scan mock actions. | `action` | Scanner frame and result card render without external requests. |
| Nearby | `page:nearby` | Explore entry | `nearbyPlaces` | Open nearby row. | `action` | Nearby cards show distance and activity. |
| Plugins | `page:miniPrograms` | Explore entry | `pluginGroups` | Open plugin. | `action` | Recent and suggested plugin groups render. |
| Games | `page:games` | Explore entry | `gameCards` | Open game card. | `action` | Ranking and reward cards render in mobile. |

## Wallet Pages

| Page | Route | Entry Points | Required Data | Primary Actions | Host Events | Acceptance |
| --- | --- | --- | --- | --- | --- | --- |
| Wallet | `page:pay` | Profile wallet entry, runtime API | `walletSummary`, `cryptoAssets`, `walletDefiPositions`, `walletNftCollections`, `walletTransactions` | Open receive, pay, transfer, swap; switch portfolio tabs; open asset, position, collection, or transaction. | `wallet:switchWallet`, `wallet:tab`, `wallet:asset`, `wallet:defi`, `wallet:nft`, `wallet:tx`, `page:open` | Asset list shows coin mark, symbol, real asset name, supported chains, amount, and fiat value; portfolio tabs switch panels without leaving the route and support host-owned empty arrays. |
| Receive | `page:payCode` | Wallet action, sheet action | `cryptoAssets`, `walletContacts`, `walletFlowConfig.receive` | Copy address, select receive asset. | `wallet:copyAddress`, `wallet:receiveAsset` | Address, QR mock, asset selector, and incoming summary render from host-overridable values. |
| Pay | `page:sendCrypto` | Wallet action | `cryptoAssets`, `walletContacts`, `walletFlowConfig.pay` | Enter address, amount, max, confirm. | `wallet:max`, `wallet:confirmSend` | Wallet controls meet styled-control smoke checks and payment defaults can be host-provided. |
| Transfer | `page:transfer` | Wallet action, host route example | `walletContacts`, `cryptoAssets`, `walletFlowConfig.transfer` | Pick contact, set amount, confirm. | `wallet:contact`, `wallet:confirmTransfer` | Smoke screenshot: `mobile-wallet-transfer.png`; transfer amount, memo, and fee can be host-provided. |
| Swap | `page:swapCrypto` | Wallet action | `cryptoAssets`, `walletFlowConfig.swap` | Reverse route, confirm swap. | `wallet:swapDirection`, `wallet:confirmSwap` | Route, rate, slippage, bridge, fee, and estimate render as host-overridable mock data. |

Wallet pages must never imply real custody, signing, private-key storage, or live asset movement.

## Profile And Settings Pages

| Page | Route | Entry Points | Required Data | Primary Actions | Host Events | Acceptance |
| --- | --- | --- | --- | --- | --- | --- |
| Saved Items | `page:favorites` | Profile entry | `savedItems` | Open saved item. | `action` | Saved rows show type and metadata. |
| Personal Activity | `page:myMoments` | Profile entry | `moments` | Like/comment own activity. | `social:like`, `social:comment` | Uses activity layout with profile context. |
| Credentials | `page:cards` | Profile entry | `passItems` | Open pass. | `action` | Pass cards remain readable on mobile. |
| Stickers | `page:stickers` | Profile entry | `stickerPacks` | Open sticker pack. | `action` | Sticker grid has stable tile sizing. |
| Settings Home | `page:settings` | Profile entry | `accountDevices`, settings values | Open setting group. | `settings:toggle`, `page:open` | Escape closes mobile detail layer. |
| Account Security | `page:accountSecurity` | Settings metric | `accountDevices` | Run security check, open device. | `settings:securityCheck`, `settings:device` | Security score and devices render. |
| Notifications | `page:notificationSettings` | Settings metric | Settings state | Toggle notification preferences. | `settings:toggle` | Mobile route smoke covered. |
| Chat Settings | `page:chatSettings` | Settings metric | Settings state | Backup, toggle chat options. | `settings:backup`, `settings:toggle` | Mobile route smoke covered. |
| Privacy | `page:privacySettings` | Settings metric | Settings state | Toggle privacy options. | `settings:privacy`, `settings:toggle` | Mobile route smoke covered. |
| General | `page:generalSettings` | Settings metric | Runtime state | Change language, appearance, density. | `language:change`, `appearance:change`, `density:change` | Language and theme controls work through runtime API. |
| Storage | `page:storageSettings` | Settings metric | `storageBuckets` | Clean, inspect bucket. | `settings:clean` | Mobile route smoke covered. |
| About | `page:about` | Settings row, direct route | Version and license data | None critical. | `page:open` | Smoke screenshot: `fullscreen-about.png`. |
| Help | `page:help` | Settings row, sheet action | `helpTopics` | Open topic, run diagnostics. | `settings:diagnostics`, `action` | Help rows and diagnostics controls render. |

## Chat Detail Pages

| Page | Route | Entry Points | Required Data | Primary Actions | Host Events | Acceptance |
| --- | --- | --- | --- | --- | --- | --- |
| Chat Search | `page:chatSearch` | Chat detail side panel | Active chat | Filter content types. | `action` | Mobile route matrix covered. |
| Chat Files | `page:chatFiles` | Chat detail side panel | Active chat files | Open file rows. | `action` | File rows show type, name, and metadata. |
| Group Management | `page:groupManage` | Group chat detail | Active group chat | Manage group settings. | `settings:toggle`, `action` | Group summary and rows render. |

## Utility Pages

| Page | Route | Entry Points | Required Data | Primary Actions | Host Events | Acceptance |
| --- | --- | --- | --- | --- | --- | --- |
| Add Contact | `page:addFriend` | Sheet action | None required | Search and scan mock contact methods. | `action` | Mobile route matrix covered. |

## Smoke Coverage

Current browser smoke covers:

- Six primary mobile deep routes.
- Thirty-four mobile route matrix pages.
- One person route.
- Wallet hash route state, asset row structure, action event, and mobile back regression checks.
- Embedded wallet surface.
- Runtime API wallet route.
- Host API transfer route.
- Focus, Escape, basic accessibility, and wallet form styling.

## Remaining Page Matrix Work

To reach 100% documentation coverage:

- Use `docs/STATE_MATRIX.md` for empty, loading, error, disabled, and permission state review.
- Add screenshot reference for every public page.
- Add per-page host data override examples.
- Add keyboard path details for each interactive page.
