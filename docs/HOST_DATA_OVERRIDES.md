# Host Data Overrides

This guide shows how a host app can replace the built-in fictional mock data without editing `script.js`.

Use this when embedding Glass IM Shell in another project, writing a host adapter, or preparing realistic demo data.

## Override Methods

| Method | When to use | Example |
| --- | --- | --- |
| `window.GLASS_IM_CONFIG.data` | Static or server-rendered page. | Provide data before loading `script.js`. |
| `window.GLASS_IM_CONFIG.dataProvider` | Async host-owned data loading. | Fetch data from a mock API or local fixture. |
| `GlassIMShell.setData(data)` | Runtime replacement after mount. | Swap persona, wallet, or feed data in a host control. |
| `GlassIMShell.configure(options)` | Replace data plus route, theme, language, density, or surface together. | Host route presets and product demos. |

Missing fields fall back to the package's fictional mock data.

## Replacement Semantics

`GlassIMShell.setData(data)`, `window.GLASS_IM_CONFIG.data`, and `dataProvider` use the same rules:

- Arrays replace the current collection. Passing `[]` intentionally shows empty states where the surface supports them.
- `people`, `modules`, and `i18n` merge by key so hosts can patch one record without resupplying the whole object.
- `walletSummary` merges field-by-field. When `nameEn`, `accountEn`, or `summaryEn` are omitted, the base host value is reused for English.
- `walletFlowConfig` merges by flow section. Hosts can patch only `pay.fee`, only `swap.route`, or any other small subset.
- Omitted top-level keys keep their current values.
- `configure({ data })` applies these data rules, then applies route, language, theme, density, appearance, and surface options.

Use explicit empty arrays when the host owns a collection and wants to suppress the built-in fixture.

## Minimal Static Embed

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
    route: "chat:ops",
    data: {
      people: {
        self: { id: "self", name: "Alex Vale", avatar: "A", color: "#14b8a6", title: "Host user", chatId: "alex" },
        ops: { id: "ops", name: "Orion Desk", avatar: "O", color: "#6366f1", title: "Operations", chatId: "ops" }
      },
      chats: [
        {
          id: "ops",
          title: "Host Operations",
          type: "group",
          avatar: "O",
          color: "#6366f1",
          subtitle: "Host-owned mock data",
          time: "09:42",
          preview: "Shell data is now supplied by the host.",
          members: ["self", "ops"],
          messages: [
            { type: "date", text: "Today" },
            { from: "ops", text: "This conversation came from host data." },
            { from: "self", text: "Events still flow through the shell API." }
          ]
        }
      ]
    },
    onEvent(event) {
      console.log(event.type, event.payload);
    }
  };
</script>
<script src="/glass-im-shell/script.js"></script>
```

## Async Data Provider

```js
window.GLASS_IM_CONFIG = {
  root: "#chat-shell",
  surface: "embedded",
  route: "page:pay",
  dataProvider: async () => {
    const response = await fetch("/api/glass-shell-fixture");
    if (!response.ok) throw new Error("Fixture failed");
    return response.json();
  },
  onEvent(event) {
    if (event.type === "data:error") {
      console.warn("Shell data failed", event.payload);
    }
  }
};
```

Runtime behavior:

- Pending provider state shows the global loading banner.
- Rejected provider state shows the global error banner and emits `data:error`.
- The shell remains navigable after data failure.

## Runtime Replacement

```js
GlassIMShell.setData({
  people: {
    self: { id: "self", name: "Mira Chen", avatar: "M", color: "#0ea5e9", chatId: "mira" },
    design: { id: "design", name: "Design Room", avatar: "D", color: "#a855f7", chatId: "design" }
  },
  chats: [
    {
      id: "design",
      title: "Design Room",
      type: "group",
      avatar: "D",
      color: "#a855f7",
      members: ["self", "design"],
      messages: [{ from: "design", text: "Runtime data replacement is active." }]
    }
  ]
});

GlassIMShell.navigate("chat:design");
```

## People And Directory

```js
GlassIMShell.setData({
  people: {
    self: { id: "self", name: "Mira Vale", avatar: "M", color: "#14b8a6", chatId: "mira" },
    alex: {
      id: "alex",
      name: "Alex North",
      avatar: "A",
      color: "#f59e0b",
      title: "Partner",
      region: "Berlin",
      status: "Available",
      chatId: "alex-north",
      sortKey: "alex north"
    }
  },
  contactSections: [
    {
      title: "Team",
      items: [{ id: "alex", icon: "contacts", person: "alex", color: "#f59e0b" }]
    }
  ],
  contactRequests: [
    {
      id: "req-1",
      name: "Rin Stone",
      avatar: "R",
      color: "#4f7cff",
      source: "Shared workspace",
      note: "Requesting access to the project room",
      status: "pending"
    }
  ],
  contactLabels: [
    { id: "partners", name: "Partners", color: "#14b8a6", members: ["alex"] }
  ],
  channelSubscriptions: [
    { id: "updates", name: "Release Updates", color: "#6366f1", unread: 2, update: "Weekly release notes" }
  ]
});
```

Notes:

- Use `sortKey` for predictable directory order across languages.
- Contact request states are local mock UI unless the host app persists them.
- Avoid real public-person names, likenesses, or endorsements in public demos.

## Chats And Messages

```js
GlassIMShell.setData({
  chats: [
    {
      id: "ops",
      title: "Operations",
      type: "group",
      avatar: "O",
      color: "#6366f1",
      subtitle: "Launch checklist",
      time: "10:15",
      unread: 3,
      pinned: true,
      muted: false,
      preview: "Smoke checks passed.",
      notice: "Keep launch notes short.",
      members: ["self", "ops", "alex"],
      files: [
        { name: "release-plan.pdf", meta: "2.8 MB", type: "PDF" }
      ],
      messages: [
        { type: "date", text: "Today" },
        { from: "ops", text: "All smoke checks passed." },
        { from: "self", text: "Ship notes are ready.", kind: "card", action: "Open draft" }
      ]
    }
  ]
});
```

Required chat fields:

- `id`
- `title`
- `type`
- `avatar`
- `color`
- `members`
- `messages`

## Activity And Video Feed

```js
GlassIMShell.setData({
  moments: [
    {
      id: "activity-1",
      author: "Alex North",
      avatar: "A",
      color: "#f59e0b",
      text: "Prototype review finished.",
      time: "12 min",
      likes: ["Mira Vale"],
      comments: ["Mira Vale: Logged for release review."],
      image: "Workspace review",
      location: "Remote",
      count: 2
    }
  ],
  videoFeed: [
    {
      id: "video-1",
      author: "Design Room",
      avatar: "D",
      color: "#a855f7",
      title: "Flow preview",
      caption: "Short product walkthrough with host-owned mock data.",
      likes: "1.2k",
      comments: "84",
      saves: "216",
      tag: "Prototype",
      tone: "studio"
    }
  ]
});
```

Notes:

- Default visuals are CSS-generated surfaces, not external media requests.
- Public demos should keep people and media fictional.

## Explore Modules

```js
GlassIMShell.setData({
  nearbyPlaces: [
    { id: "desk", title: "Team Desk", meta: "3 rooms active", tone: "studio", color: "#14b8a6" }
  ],
  pluginGroups: {
    recent: [
      { id: "notes", name: "Notes", desc: "Recent project notes", color: "#6366f1" }
    ],
    suggested: [
      { id: "review", name: "Review Board", desc: "Mock review queue", color: "#f59e0b" }
    ]
  },
  gameCards: [
    { id: "quiz", name: "Release Quiz", score: "980", reward: "Badge", color: "#a855f7" }
  ]
});
```

## Wallet Data

Wallet surfaces are display-only mock UI. Host apps own any real custody, signing, compliance, transaction building, quote calculation, or network submission outside this package.

```js
GlassIMShell.setData({
  walletSummary: {
    name: "Host Treasury",
    account: "Operations",
    total: "$27,342.58",
    summary: "Host-owned mock portfolio"
  },
  walletFlowConfig: {
    receive: {
      assetSymbol: "USDC",
      address: "host-mock-usdc-receive-address",
      addressShort: "host-usdc...receive",
      incoming: "1 pending"
    },
    pay: {
      assetSymbols: ["USDC", "ETH", "SOL"],
      address: "host-mock-pay-recipient",
      amount: "84.00",
      fee: "0.01 USDC",
      feeMeta: "Base · 2 sec",
      available: "$8,420.00"
    },
    transfer: {
      assetSymbols: ["USDC", "ETH", "SOL"],
      amount: "42.00",
      memo: "Host transfer memo",
      fee: "$0.01",
      feeMeta: "Base · 2 sec"
    },
    swap: {
      fromSymbol: "USDC",
      toSymbol: "ETH",
      fromAmount: "84.00",
      toAmount: "0.0260",
      rate: "1 ETH ≈ 3,230 USDC",
      route: ["Base", "Router", "Ethereum"],
      slippage: "0.3%",
      bridge: "Host route",
      fee: "$0.64",
      estimate: "45 sec"
    }
  },
  cryptoAssets: [
    {
      symbol: "USDT",
      name: "Tether USD",
      logo: "usdt",
      mark: "T",
      networks: ["Ethereum", "TRON", "Solana", "Avalanche", "Polygon", "TON"],
      amount: "12,480.00",
      fiat: "$12,480.00",
      change: "0.0%",
      color: "#26a17b"
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      logo: "eth",
      mark: "◆",
      networks: ["Ethereum", "Base", "Arbitrum", "OP Mainnet"],
      amount: "4.1820",
      fiat: "$18,402.10",
      change: "+1.4%",
      color: "#627eea"
    }
  ],
  walletTransactions: [
    { id: "tx-1", type: "receive", symbol: "USDT", amount: "+120.00", fiat: "$120.00", peer: "TQ9z...7k3", status: "Confirmed", time: "10:24" }
  ],
  walletDefiPositions: [
    { id: "defi-1", assetSymbol: "USDT", name: "Stable pool", value: "$12,480.00", meta: "Mock APY 4.2%" }
  ],
  walletNftCollections: [
    { id: "nft-1", name: "Access Keys", count: "3", floor: "0.04 ETH", color: "#14b8a6" }
  ],
  walletContacts: [
    { id: "ops", name: "Operations", avatar: "O", color: "#6366f1", address: "0x71a...2f9", network: "Ethereum" }
  ]
});
```

Wallet events to intercept:

If `nameEn`, `accountEn`, or `summaryEn` are omitted, the English startup language uses `name`, `account`, and `summary`.

```js
const off = GlassIMShell.on((event) => {
  if (event.type === "wallet:confirmSend") {
    // Host app may open its own secure transaction flow here.
  }
  if (event.type === "wallet:confirmTransfer") {
    // Host app may validate recipient and amount outside this package.
  }
  if (event.type === "wallet:confirmSwap") {
    // Host app may request a real quote outside this package.
  }
});
```

## Profile And Settings Data

```js
GlassIMShell.setData({
  accountDevices: [
    { id: "mac", name: "MacBook", meta: "Current device", color: "#14b8a6" }
  ],
  storageBuckets: [
    { id: "media", name: "Media", size: "1.4 GB", width: "58%", color: "#14b8a6" }
  ],
  savedItems: [
    { id: "note-1", title: "Launch note", meta: "Saved today", color: "#6366f1" }
  ],
  passItems: [
    { id: "pass-1", title: "Workspace pass", meta: "Demo only", color: "#f59e0b" }
  ],
  stickerPacks: [
    { id: "pack-1", name: "Glass marks", meta: "12 stickers", color: "#a855f7" }
  ],
  helpTopics: [
    { id: "embed", title: "Embedding", meta: "Host integration guide", color: "#14b8a6" }
  ]
});
```

## Empty And Disabled Fixtures

Use these fixtures to verify host-owned states:

```js
GlassIMShell.setData({
  chats: [],
  contactRequests: [],
  moments: [],
  videoFeed: [],
  cryptoAssets: [],
  walletDefiPositions: [],
  walletNftCollections: [],
  walletTransactions: [],
  walletFlowConfig: {
    receive: { incoming: "0" },
    pay: { available: "$0.00" }
  },
  helpTopics: []
});
```

Then review `docs/STATE_MATRIX.md` before making release claims.

## Theme And Surface Override

```js
GlassIMShell.configure({
  surface: "embedded",
  appearance: "dark",
  density: "compact",
  route: "page:pay",
  theme: {
    green: "#14b8a6",
    greenDeep: "#0f766e",
    glass: "rgba(255,255,255,.5)",
    glassStrong: "rgba(255,255,255,.74)"
  }
});
```

Host CSS sizing:

```css
#chat-shell {
  --glass-shell-height: 760px;
  --glass-shell-padding: 12px;
}
```

## Validation

After applying overrides:

```bash
npm run ci:verify
```

Review:

- `docs/PAGE_MATRIX.md`
- `docs/COMPONENT_MATRIX.md`
- `docs/STATE_MATRIX.md`
- `docs/WALLET_IMPLEMENTATION.md`
- `docs/SCREENSHOT_ACCEPTANCE_MAP.md`

Do not publish demo data that includes third-party product identity, official screenshots, copied icons, brand artwork, real public-person likenesses, private keys, access tokens, or real wallet addresses intended for live funds.
