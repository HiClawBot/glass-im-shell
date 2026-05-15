# API Contract

This document defines the pre-Beta public contract for host apps. Class names are implementation details unless they are listed here.

## Runtime Entry

| Surface | Contract |
| --- | --- |
| Global config | `window.GLASS_IM_CONFIG` before loading `script.js`. |
| Runtime API | `window.GlassIMShell` after loading `script.js`. |
| Stylesheet | `styles.css` or package export `glass-im-shell/styles.css`. |
| Type declarations | `schema.d.ts` or package export `glass-im-shell/schema`. |

## Runtime Methods

| Method | Input | Effect | Stable event |
| --- | --- | --- | --- |
| `mount(options)` | `GlassMountOptions` | Applies config and emits mount. | `app:mount` |
| `render()` | none | Re-renders current state. | none |
| `navigate(target)` | `"chat:{id}"`, `"person:{id}"`, `"page:{id}"`, or `{ type, id }` | Opens route. | `chat:open`, `person:open`, `page:open`, or `view:change` |
| `setData(data)` | `GlassData` subset | Applies host data rules and re-renders. | `data:update` |
| `setLang(lang)` | locale key | Changes language if available. | `language:change` |
| `setTheme(theme)` | CSS token map | Applies CSS variables. | none |
| `setAppearance(appearance)` | `system`, `light`, `dark` | Changes appearance mode. | `appearance:change` |
| `setDensity(density)` | `comfortable`, `compact` | Changes density mode. | `density:change` |
| `setSurface(surface)` | `fullscreen`, `embedded` | Changes surface mode. | `surface:change` |
| `configure(options)` | `GlassMountOptions` subset | Applies data, theme, runtime axes, route, and listener. | Depends on changed axes |
| `getVersion()` | none | Returns package version. | none |
| `getState()` | none | Returns runtime state snapshot. | none |
| `getData()` | none | Returns current shell data snapshot. | none |
| `on(listener)` | event callback | Subscribes to runtime events. | returns unsubscribe |

## Route Strings

| Route | Meaning |
| --- | --- |
| `chat:{chatId}` | Open a conversation. |
| `person:{personId}` | Open a contact or self profile. |
| `page:pay` | Wallet home. |
| `page:payCode` | Receive mock wallet flow. |
| `page:sendCrypto` | Pay mock wallet flow. |
| `page:transfer` | Transfer mock wallet flow. |
| `page:swapCrypto` | Swap mock wallet flow. |
| `page:settings` | Settings home. |
| `page:{id}` | Any page id listed in `docs/PAGE_MATRIX.md`. |
| `view:chats`, `view:contacts`, `view:discover`, `view:me` | Primary navigation views through object targets. |

Hash routes use the same string shape without a leading slash, for example `#page:pay`.

## Stable Selectors

| Selector | Purpose |
| --- | --- |
| `[data-glass-shell]` | Root shell for host tests. |
| `[data-glass-version]` | Runtime version. |
| `[data-glass-view]` | Active primary view. |
| `[data-glass-route]` | Active route category. |
| `[data-glass-page]` | Active page id. |
| `[data-glass-lang]` | Active language. |
| `[data-glass-theme]` | Resolved light/dark theme. |
| `[data-glass-density]` | Active density. |
| `[data-glass-surface]` | Active surface. |
| `[data-wallet-tab]` | Wallet home tab buttons. |
| `[data-wallet-panel]` | Wallet home tab panels. |
| `[data-wallet-action]` | Wallet action controls. |
| `[data-wallet-empty]` | Wallet empty states. |
| `[data-host-route]` | Host API example route controls. |

Use these for host E2E tests. Do not rely on internal visual class names as public selectors.

## Event Payloads

All events have the shape:

```ts
{
  type: string;
  payload: Record<string, unknown>;
  state: GlassEvent["state"];
}
```

Important stable payloads:

| Event | Payload |
| --- | --- |
| `app:ready` | `{}` |
| `app:mount` | `{ options: string[] }` |
| `view:change` | `{ view: string }` |
| `chat:open` | `{ chatId: string, chat: GlassChat }` |
| `person:open` | `{ personId: string, person: GlassPerson }` |
| `page:open` | `{ pageId: string, page: GlassModule }` |
| `message:send` | `{ chatId: string, text: string, kind?: string }` |
| `message:menu` | `{ messageId: string }` |
| `message:{action}` | `{ chatId: string, messageId: string, text: string }` |
| `contact:request:{action}` | `{ requestId: string, request: GlassContactRequest, status?: string }` |
| `contact:update` | `{ personId: string, action: string, relation: string }` |
| `contact:label:open` | `{ labelId: string, members: string[] }` |
| `social:{action}` | `{ momentId: string | null }` |
| `video:{action}` | `{ videoId: string | null }` |
| `wallet:tab` | `{ tab: "assets" | "defi" | "nft" | "records" | string }` |
| `wallet:{action}` | `{ id: string | null, action: string }` |
| `settings:{action}` | `{ action: string }` |
| `language:change` | `{ lang: string }` |
| `appearance:change` | `{ appearance: string, resolvedTheme: "light" | "dark" }` |
| `density:change` | `{ density: string }` |
| `surface:change` | `{ surface: string }` |
| `data:update` | `{ keys: string[] }` |
| `data:error` | `{ message: string }` |

## Data Replacement Rules

`setData(data)`, `GLASS_IM_CONFIG.data`, and `dataProvider` share these rules:

- Arrays replace the current collection, including intentional `[]`.
- `people`, `modules`, and `i18n` merge by key.
- `walletSummary` merges field-by-field and copies base host values into omitted English variants.
- `walletFlowConfig` merges by flow section: `receive`, `pay`, `transfer`, and `swap`.
- Omitted top-level keys keep their current values.

## Compatibility Notes

- Wallet routes are display-only mock UI and emit events for host-owned real flows.
- `data-glass-*` attributes, route string shapes, runtime method names, and event names require documentation and smoke updates before changing.
- Visual class names may change between pre-Beta builds.
