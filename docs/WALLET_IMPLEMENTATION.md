# Wallet Implementation

This document defines the wallet UI implementation model for Glass IM Shell. The wallet is a display-only mock interface for global crypto wallet flows.

## Boundary

| Boundary | Rule |
| --- | --- |
| Custody | The shell never stores private keys, seed phrases, signatures, or real wallet sessions. |
| Network | Default wallet screens make no chain RPC calls and do not submit live transactions. |
| Balances | Amounts, fiat values, fees, risk status, contacts, and records are fictional mock data unless a host app overrides them. |
| Handoff | Confirm actions emit host events only. A host app must own real transaction preparation, signing, compliance, and submission outside this package. |
| Assets | Asset names and symbols can represent real crypto assets, but visual marks are local CSS-authored marks, not bundled third-party logo files. |
| Publishing | Public copy must describe the wallet as generic, global, and mock-display oriented. |

## Routes

| Page | Route | Purpose | Required data | Stable events |
| --- | --- | --- | --- | --- |
| Wallet home | `page:pay` | Portfolio summary, primary actions, asset list, secondary wallet tabs, recent records. | `walletSummary`, `cryptoAssets`, `walletDefiPositions`, `walletNftCollections`, `walletTransactions` | `wallet:switchWallet`, `wallet:tab`, `wallet:asset`, `wallet:defi`, `wallet:nft`, `wallet:tx`, `page:open` |
| Receive | `page:payCode` | Asset address display, QR placeholder, copy action, asset selection. | `cryptoAssets`, `walletContacts`, `walletFlowConfig.receive` | `wallet:copyAddress`, `wallet:receiveAsset` |
| Pay | `page:sendCrypto` | Address payment mock form, amount, max, fee, risk notice. | `cryptoAssets`, `walletContacts`, `walletFlowConfig.pay` | `wallet:max`, `wallet:confirmSend` |
| Transfer | `page:transfer` | Contact transfer mock form, asset, amount, memo, fee. | `walletContacts`, `cryptoAssets`, `walletFlowConfig.transfer` | `wallet:contact`, `wallet:confirmTransfer` |
| Swap | `page:swapCrypto` | Mock asset conversion path, route, rate, fee, estimate. | `cryptoAssets`, `walletFlowConfig.swap` | `wallet:swapDirection`, `wallet:confirmSwap` |

## Data Model

Wallet host data is supplied through `GlassData`:

```ts
GlassIMShell.setData({
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
    }
  ],
  walletTransactions: [
    {
      id: "tx-1",
      type: "receive",
      symbol: "USDT",
      amount: "+120.00",
      fiat: "$120.00",
      peer: "TQ9z...7k3",
      status: "Confirmed",
      time: "10:24"
    }
  ],
  walletDefiPositions: [
    { id: "defi-1", assetSymbol: "USDT", name: "Stable pool", value: "$12,480.00", meta: "Mock APY 4.2%" }
  ],
  walletNftCollections: [
    { id: "nft-1", name: "Access Keys", count: "3", floor: "0.04 ETH", color: "#14b8a6" }
  ],
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
  walletContacts: [
    {
      id: "alex",
      name: "Alex",
      avatar: "A",
      color: "#4f7cff",
      address: "0x71a...2f9",
      network: "Ethereum"
    }
  ]
});
```

### `GlassCryptoAsset`

| Field | Required | Purpose | Acceptance |
| --- | --- | --- | --- |
| `symbol` | Yes | Ticker shown in the asset row and selectors. | Must match the asset identity. |
| `name` | Yes | Full asset name. | Must correspond to the symbol. |
| `network` | Optional | Single-chain fallback. | Used when `networks` is absent. |
| `networks` | Optional | Supported network labels. | Preferred for multi-chain assets. |
| `logo` | Optional | CSS coin mark suffix. | Maps to local CSS classes only. |
| `mark` | Optional | Short text inside the CSS coin mark. | Keep compact; avoid official artwork. |
| `amount` | Yes | Display quantity. | String owned by host formatting. |
| `fiat` | Yes | Display fiat value. | String owned by host formatting. |
| `change` | Optional | Short performance text. | Do not rely on color alone. |
| `color` | Yes | CSS mark accent. | Must remain readable in light and dark themes. |
| `allocation` | Optional | Future chart or allocation text. | Not required by current UI. |

## Default Asset Universe

The default mock asset list contains:

- BTC: Bitcoin on Bitcoin.
- ETH: Ethereum on Ethereum, Base, Arbitrum, and OP Mainnet.
- USDT: Tether USD on Ethereum, TRON, Solana, Avalanche, Polygon, and TON.
- USDC: USD Coin on Ethereum, Solana, Base, Arbitrum, OP Mainnet, Polygon PoS, Avalanche, and Sui.
- BNB: BNB on BNB Smart Chain.
- SOL: Solana on Solana.
- XRP: XRP on XRP Ledger.
- TRX: TRON on TRON.
- TON: Toncoin on TON.
- AVAX: Avalanche on Avalanche C-Chain.
- POL: Polygon Ecosystem Token on Polygon PoS.
- ARB: Arbitrum on Arbitrum One.
- OP: Optimism on OP Mainnet.

This list is for UI realism and layout coverage. It is not an endorsement, market ranking, investment recommendation, or live chain support statement.

## Asset Row Anatomy

| Slot | Content | Rule |
| --- | --- | --- |
| Coin mark | CSS mark using `logo`, `mark`, and `color`. | No external image files. |
| Main identity | `symbol` and `name`. | Symbol and name must correspond. |
| Chain labels | `networks.join(" · ")` or `network`. | Long multi-chain labels must wrap or truncate without horizontal scroll. |
| Balance | `amount`. | Right aligned in the row. |
| Fiat and change | `fiat` plus optional `change`. | Secondary line; visible in both themes. |

Acceptance:

- Asset rows must keep the standard wallet list structure: mark, symbol, real name, chains, amount, fiat value.
- USDT and USDC rows must demonstrate multi-chain label behavior.
- Coin marks must be CSS-authored and generic, even when the asset symbol is real.
- Do not add official token image files to the package.

## Wallet Home

Wallet home includes:

- Wallet selector in the hero topline.
- Host-overridable `walletSummary` name, account label, total, and summary text.
- Host-overridable `walletFlowConfig` for receive, pay, transfer, and swap deep-page display values.
- Four compact action buttons: receive, pay, transfer, swap.
- Switchable portfolio tabs: assets, DeFi, NFT, and records.
- Host-overridable asset list, DeFi positions, NFT collections, and recent transaction records.

Rules:

- The four primary action buttons stay compact and text-based on the wallet home.
- Portfolio tabs must switch visible panels, expose `role="tab"` / `role="tabpanel"` relationships, support keyboard arrow navigation, and emit `wallet:tab`.
- Summary text must include a mock-only cue near wallet context.
- Asset and record rows emit events but do not mutate real assets.

## Receive Flow

Receive page includes:

- Selected asset and first network label.
- Mock QR block.
- Mock address display.
- Copy address action.
- Asset selector.
- Incoming summary rows.

Events:

- `wallet:copyAddress`
- `wallet:receiveAsset`

Rules:

- QR is a placeholder and must not encode a real payment request by default.
- Address copy emits an event; host apps decide whether to copy to clipboard or show a toast.
- Asset selector currently renders the first four assets for compact mobile review.
- Receive, pay, transfer, and swap asset selectors use the same asset-row anatomy as wallet home: CSS coin mark, symbol, real name, chain labels, amount, and value or route metadata.

## Pay Flow

Pay page includes:

- Compact asset picker using wallet asset rows.
- Selected asset field using the same CSS coin mark and chain label.
- Address input.
- Amount input.
- Max button.
- Network fee card.
- Risk notice card.
- Confirm button.

Events:

- `wallet:max`
- `wallet:confirmSend`

Rules:

- Confirm emits a host event only.
- Risk card must remain visible and must state the mock-only boundary.
- Inputs need labels, focus style, and mobile-safe spacing.

## Transfer Flow

Transfer page includes:

- Frequent wallet contacts.
- Compact asset picker using wallet asset rows.
- Selected asset field using the same CSS coin mark and chain label.
- Amount field.
- Memo field.
- Network fee card.
- Confirm button.

Events:

- `wallet:contact`
- `wallet:confirmTransfer`

Rules:

- Contacts are address-book mock rows with avatar, name, network, and shortened address.
- Contact selection emits a host event and should not imply a real address validation.
- `output/smoke/mobile-wallet-transfer.png` is the current visual smoke reference.

## Swap Flow

Swap page includes:

- Source asset panel using wallet asset row anatomy.
- Direction reverse button.
- Destination asset panel using wallet asset row anatomy.
- Rate line.
- Route steps.
- Confirm button.
- Slippage, bridge, network fee, and estimate rows.

Events:

- `wallet:swapDirection`
- `wallet:confirmSwap`

Rules:

- Quote values are deterministic mock values unless a host app overrides the page in a fork.
- Direction reverse emits an event and does not calculate a live quote.
- Route labels must stay generic and readable on mobile.
- From/to panels must keep the same coin mark, symbol, name, chain label, and amount structure used by wallet home rows.

## Transaction Records

Transaction rows use:

- `type`: `receive`, `send`, `swap`, `transfer`, or host-defined string.
- `symbol`
- `amount`
- Optional `fiat`
- Optional `peer`
- Optional `status`
- Optional `time`

Acceptance:

- Incoming, outgoing, and swap rows should be visually distinct through text, sign, and glyph, not color alone.
- Values align right and stay readable in compact density.
- Records are history display rows only.

## Fee And Risk Display

| Area | Rule |
| --- | --- |
| Network fee | Show fee and network/speed where relevant. |
| Risk notice | Show mock risk status on payment surfaces. |
| Slippage | Show as a row in swap context. |
| Bridge | Show as a route label in swap context. |
| Estimate | Show as an approximate mock completion time. |

No fee, route, risk, slippage, or estimate text should be interpreted as live market or chain data by default.

## Host Events

Wallet actions use the runtime event bus:

| Event | Payload expectation |
| --- | --- |
| `wallet:switchWallet` | Wallet action id and source control. |
| `wallet:tab` | Selected wallet home tab id. |
| `wallet:asset` | Asset symbol from `data-asset`. |
| `wallet:tx` | Transaction id from `data-tx`. |
| `wallet:copyAddress` | Receive-page copy action. |
| `wallet:receiveAsset` | Selected receive asset symbol. |
| `wallet:max` | Pay-page max button. |
| `wallet:contact` | Contact id from `data-wallet-contact`. |
| `wallet:swapDirection` | Swap direction control. |
| `wallet:confirmSend` | Pay confirmation. |
| `wallet:confirmTransfer` | Transfer confirmation. |
| `wallet:confirmSwap` | Swap confirmation. |

Host apps should listen through:

```js
const off = GlassIMShell.on((event) => {
  if (event.type.startsWith("wallet:")) {
    console.log(event.type, event.payload);
  }
});
```

## Accessibility And Responsive Rules

- All wallet buttons and form controls need visible focus.
- Icon-only or glyph-only controls need accessible names.
- Wallet forms must fit mobile width without horizontal scrolling.
- Chain labels may wrap, truncate, or collapse, but must not overlap balances.
- Compact density must preserve tap targets and labels.
- Reduced-motion mode must not hide state changes.

## Acceptance Checklist

- `page:pay`, `page:payCode`, `page:sendCrypto`, `page:transfer`, and `page:swapCrypto` open on mobile.
- Asset rows show matching symbol, name, CSS mark, chains, amount, and fiat value.
- USDT and USDC show multiple supported chain labels.
- Receive, pay, transfer, and swap actions emit wallet events.
- Receive, pay, transfer, and swap asset selectors share the same asset-row structure and active state.
- Browser smoke checks wallet hash route state, asset row anatomy, core wallet action events, and wallet mobile back behavior.
- Payment and transfer forms show fee context.
- Pay and swap surfaces show risk, route, or estimate context where relevant.
- Wallet screens show mock/display-only boundaries.
- No third-party token image files, official wallet screenshots, or product artwork are packaged.
- `npm run ci:verify` passes.
