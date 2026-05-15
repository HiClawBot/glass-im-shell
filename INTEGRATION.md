# Integration

Glass IM Shell can run as a static prototype or as an embeddable UI shell controlled by host data.

For the simplest embedded example, open `examples/vanilla.html`. For a minimal package-style host page, open `examples/npm-minimal.html`. For a fuller host API example with event logs, runtime controls, and host-owned mock data, open `examples/host-api.html`.

For the stable host-facing method, route, selector, event payload, and data replacement contract, see `docs/API_CONTRACT.md`.

## Package Install Shape

```bash
npm install glass-im-shell
```

```js
import "glass-im-shell/styles.css";

window.GLASS_IM_CONFIG = {
  root: "#chat-shell",
  surface: "embedded",
  route: "page:pay"
};

await import("glass-im-shell");
```

Mount a container in your host page, assign `window.GLASS_IM_CONFIG`, and load the runtime entry before interacting with `window.GlassIMShell`. The package also exposes `glass-im-shell/schema` for TypeScript declarations and `glass-im-shell/npm-minimal` as the minimal HTML reference.

## CDN / Static Embed

```html
<link rel="stylesheet" href="/glass-im-shell/styles.css" />
<div id="chat-shell"></div>
<script>
  window.GLASS_IM_CONFIG = {
    root: "#chat-shell",
    surface: "embedded",
    lang: "en",
    appearance: "system",
    density: "comfortable",
    route: "page:pay",
    theme: {
      green: "#10b981",
      glass: "rgba(255,255,255,.48)"
    },
    data: {
      people: {
        self: { id: "self", name: "Alex", avatar: "A", color: "#4f7cff", chatId: "alex_01" }
      }
    },
    onEvent(event) {
      console.log("[GlassIM]", event.type, event.payload);
    }
  };
</script>
<script src="/glass-im-shell/script.js"></script>
```

## Runtime API

```js
GlassIMShell.navigate("page:pay");
GlassIMShell.setLang("zh");
GlassIMShell.setAppearance("dark");
GlassIMShell.setDensity("compact");
GlassIMShell.setSurface("embedded");
GlassIMShell.setTheme({ green: "#0ea5e9", glassStrong: "rgba(255,255,255,.72)" });
GlassIMShell.setData({ chats: nextChats });
GlassIMShell.configure({ lang: "en", appearance: "system", route: "page:settings" });
console.log(GlassIMShell.getVersion());

const off = GlassIMShell.on((event) => {
  if (event.type === "message:send") sendMessage(event.payload);
});
```

`setData()` applies host data as follows:

- Arrays replace the built-in arrays, including empty arrays.
- `people`, `modules`, and `i18n` merge by key.
- `walletSummary` merges with locale fallback for omitted English fields.
- `walletFlowConfig` merges by flow section: `receive`, `pay`, `transfer`, and `swap`.
- Omitted fields keep their current values.

## Host API Example

`examples/host-api.html` shows a more complete host integration pattern:

- Host-owned route buttons that call `GlassIMShell.navigate()`
- Runtime language, appearance, density, and theme changes
- A host event log wired through `onEvent`
- A readable runtime state panel fed by `GlassIMShell.getState()`
- Host-provided fictional contacts, messages, wallet assets, and wallet records

Use it as the starting point when embedding the shell in another product page.

## Events

- `app:ready`
- `app:mount`
- `view:change`
- `chat:open`
- `person:open`
- `page:open`
- `composer:tool`
- `message:menu`
- `message:send`
- `message:reply`
- `message:forward`
- `message:save`
- `message:copy`
- `message:delete`
- `contact:request:accept`
- `contact:request:ignore`
- `contact:request:message`
- `contact:label:open`
- `contact:update`
- `social:like`
- `social:comment`
- `social:post`
- `social:menu`
- `video:like`
- `video:comment`
- `video:save`
- `video:share`
- `wallet:switchWallet`
- `wallet:asset`
- `wallet:tx`
- `wallet:copyAddress`
- `wallet:receiveAsset`
- `wallet:max`
- `wallet:contact`
- `wallet:swapDirection`
- `wallet:confirmSend`
- `wallet:confirmTransfer`
- `wallet:confirmSwap`
- `settings:securityCheck`
- `settings:device`
- `settings:toggle`
- `settings:backup`
- `settings:privacy`
- `settings:clean`
- `settings:diagnostics`
- `language:change`
- `appearance:change`
- `density:change`
- `action`
- `data:update`
- `data:error`

## Data Provider

```js
window.GLASS_IM_CONFIG = {
  root: "#chat-shell",
  dataProvider: async () => {
    const response = await fetch("/api/mock-shell-data");
    return response.json();
  }
};
```

The provider may return any subset of the `GlassData` schema. Missing fields fall back to the built-in fictional mock data.

See `docs/HOST_DATA_OVERRIDES.md` for complete static, async, runtime, people, chat, activity, video, wallet, settings, theme, and empty-state replacement examples.

Contact-oriented host data can also override `contactRequests`, `contactLabels`, and `channelSubscriptions`. Add `sortKey` to people when names need locale-aware directory ordering across scripts.

Discovery-oriented host data can override `moments`, `videoFeed`, `nearbyPlaces`, `pluginGroups`, and `gameCards` for social, video, location, plugin, and game-style surfaces.

Wallet-oriented host data can override `walletSummary`, `cryptoAssets`, `walletNetworks`, `walletTransactions`, `walletDefiPositions`, `walletNftCollections`, `walletContacts`, and `walletFlowConfig`. `walletSummary` controls the wallet home name, selected account label, total, and summary text; when `nameEn`, `accountEn`, or `summaryEn` are omitted, the shell uses the host-provided base values in English too. `cryptoAssets` supports `symbol`, `name`, `network` or `networks`, `logo`, `mark`, `amount`, `fiat`, `change`, and `color`. `walletDefiPositions` and `walletNftCollections` control the secondary wallet home tabs and support empty arrays for host-owned empty states. `walletFlowConfig` controls receive address display, payment defaults, transfer defaults, and swap quote rows for UI-only deep pages. The built-in wallet screens are UI-only mock flows and never submit real transactions. See `docs/WALLET_IMPLEMENTATION.md` for the full wallet contract.

Profile and settings host data can override `accountDevices`, `storageBuckets`, `savedItems`, `passItems`, `stickerPacks`, and `helpTopics` for account, storage, saved content, pass, sticker, and help surfaces.

## Theme Tokens

Theme keys map to CSS variables. Both `green` and `--green` are accepted.

Common tokens:

- `ink`
- `muted`
- `soft`
- `glass`
- `glassStrong`
- `glassDark`
- `green`
- `greenDeep`
- `bubble`
- `bubbleOut`
- `shadow`
- `blur`

## Host Configuration

- `lang`: `"zh"`, `"en"`, or a custom locale key supplied through `data.i18n`
- `surface`: `"fullscreen"` or `"embedded"`; when `root` is supplied it defaults to `"embedded"`
- `appearance`: `"system"`, `"light"`, or `"dark"`; defaults to OS preference and can be changed at runtime
- `density`: `"comfortable"` or `"compact"` for consumer-style or denser work surfaces
- `route`: `"chat:team"`, `"person:self"`, `"page:pay"`, or `{ type, id }`
- `persistLanguage` / `persistAppearance`: set either to `false` when the host app owns persistence

## Test Selectors

The root shell exposes stable host-facing attributes after render:

- `data-glass-shell`
- `data-glass-version`
- `data-glass-view`
- `data-glass-route`
- `data-glass-page`
- `data-glass-lang`
- `data-glass-theme`
- `data-glass-density`
- `data-glass-surface`

Use these for smoke tests and screenshots instead of relying on internal class names.

## Embedded Surface

Use `surface: "embedded"` when the shell lives inside an existing product page. Embedded mode removes the prototype page background, avoids locking the host page scroll, and lets the host control sizing with CSS variables:

```css
#chat-shell {
  --glass-shell-height: 760px;
  --glass-shell-padding: 12px;
  --glass-shell-radius: 22px;
}
```

Use `surface: "fullscreen"` for standalone prototypes, kiosk-style demos, and mobile app previews.

The distributed stylesheet scopes element resets to the shell surface. Host pages should not rely on the shell CSS for global `body`, heading, link, or button styling.

## Legal Positioning

Use this shell as an original IM UI kit. Do not publish it as a copy of any named product, do not add third-party logos, official screenshots, official icons, brand colors, or copied product copy. Keep the public positioning focused on common messaging app patterns and original liquid-glass presentation.
