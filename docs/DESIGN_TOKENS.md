# Design Tokens

This document defines the visual token model for Glass IM Shell. It keeps the liquid-glass UI reusable, host-friendly, theme-aware, and original.

## Token Contract

| Area | Rule |
| --- | --- |
| Source | `styles.css` is the runtime source of truth for tokens. This document explains intent and acceptance rules. |
| Scope | Tokens are applied through `[data-glass-shell]`, `:root[data-theme]`, `:root[data-density]`, and `:root[data-glass-surface]`. |
| Public API | Host apps may set `appearance`, `density`, `surface`, and CSS custom properties documented here. Internal class names are not public API. |
| Isolation | Embedded mode must not override host typography, bare body scroll, bare link styles, or host page background. |
| Originality | Colors, glyphs, marks, glass treatments, and mock visuals must remain project-authored and generic. |

## Runtime Axes

| Axis | Values | Owner | Behavior |
| --- | --- | --- | --- |
| Appearance | `system`, `light`, `dark` | Runtime API and host config | `system` follows `prefers-color-scheme`; explicit values set `data-theme`. |
| Density | `comfortable`, `compact` | Runtime API and host config | Changes pane padding, row height, message spacing, and module density. |
| Surface | `fullscreen`, `embedded` | Runtime API and host config | Fullscreen owns the viewport; embedded respects host layout using `--glass-shell-height` and `--glass-shell-padding`. |
| Language | `system`, `zh`, `en` startup behavior | Runtime API and host config | Visual tokens must support Chinese and English without width-specific assumptions. |
| Motion | normal, reduced | Operating system | `prefers-reduced-motion` disables nonessential transitions and animation dependency. |

## Color Tokens

| Token | Light value | Dark value | Purpose | Usage rule |
| --- | --- | --- | --- | --- |
| `--ink` | `#101415` | `#f5f8f7` | Primary text and icons. | Must remain readable on `--glass` and `--bubble`. |
| `--muted` | `#617074` | `#b7c1c4` | Secondary text. | Use for metadata, timestamps, hints. |
| `--soft` | `#90a0a5` | `#879397` | Low-emphasis text. | Avoid for essential labels. |
| `--line` | translucent white | translucent white | Glass borders and separators. | Use where the border catches light. |
| `--line-dark` | translucent dark | translucent white | Inner separators. | Use on light/solid surfaces. |
| `--green` | `#12b7a6` | `#12b7a6` | Generic action accent. | Do not treat as a product identity color. |
| `--green-deep` | `#0b8d82` | `#0b8d82` | Strong accent text and active states. | Use sparingly for actions and active markers. |
| `--night` | `#121827` | `#121827` | Deep surface utility color. | Use for neutral dark affordances. |

Color acceptance:

- Do not introduce a dominant single-hue palette across the whole shell.
- Do not use official app brand colors, official marks, or product-specific color pairings.
- Every control state must work in both explicit dark/light modes and system mode.
- Color cannot be the only signal for toggles, selected items, warnings, or disabled states.

## Glass Material Tokens

| Token | Value | Purpose | Usage rule |
| --- | --- | --- | --- |
| `--glass` | translucent base | Main panel material. | Use for panes and major surfaces. |
| `--glass-strong` | stronger translucent base | Cards, selected regions, and elevated groups. | Use when text needs more support. |
| `--glass-dark` | dark translucent base | Rail, dark overlays, and high-contrast controls. | Use for dark material, not brand identity. |
| `--glass-edge` | bright edge highlight | Top and inset glass edges. | Pair with subtle border or inset shadow. |
| `--glass-depth` | inner light | Depth, reflection, and layered panels. | Keep subtle; do not create decorative blobs. |
| `--blur` | `blur(28px) saturate(1.45)` | Backdrop glass effect. | Always pair with translucent background and border. |
| `--shadow` | large soft elevation | App frame and major overlays. | Use on high-level surfaces, not every row. |

Glass acceptance:

- Glass surfaces need background, border, blur, and edge highlight together.
- Avoid stacking cards inside cards. Use full-width bands, lists, panes, or single-level repeated cards.
- Text must remain readable when backdrop blur is unavailable.
- Embedded mode must look correct if the host page has any background behind it.

## Typography Tokens

| Level | Current range | Purpose | Usage rule |
| --- | --- | --- | --- |
| App title | `20px-28px` | Primary pane and hero balances. | Reserve large sizes for actual top-level context. |
| Section heading | `15px-19px` | Pane headers and section names. | Keep compact in dashboards, settings, and wallet rows. |
| Body | `13px-15px` | Messages, rows, forms. | Use system font stack and normal weight by default. |
| Metadata | `11px-12px` | Times, chains, labels, hints. | Do not use for required action labels. |
| Badge | `10px-12px` | Counts, chips, status marks. | Keep stable width and avoid wrapping. |

Typography acceptance:

- No viewport-width font scaling.
- Letter spacing stays `0` unless a specific glyph mark needs optical correction.
- Default text weight should not be bold; use emphasis only for hierarchy.
- Chinese and English labels must fit without overlapping adjacent UI.

## Spacing Tokens

| Scale | Typical values | Purpose |
| --- | --- | --- |
| Tight | `4px`, `6px`, `8px` | Chips, metadata, compact controls. |
| Row | `10px`, `12px`, `14px` | List rows, wallet rows, form spacing. |
| Pane | `16px`, `18px`, `20px` | Pane padding and section gaps. |
| Shell | `24px`, `28px` | Desktop frame and page-level rhythm. |

Spacing acceptance:

- Use grid or flex gaps instead of margin piles where possible.
- Mobile rows must preserve tap target usability in compact density.
- Fixed-format components need stable dimensions or aspect ratios.
- No component should resize when hover, focus, badges, labels, or dynamic values appear.

## Radius Tokens

| Radius | Purpose | Usage rule |
| --- | --- | --- |
| `4px-8px` | Tiny chips, file marks, controls. | Prefer for compact operational UI. |
| `9px-14px` | Buttons, rows, inputs, message bubbles. | Default range for repeated components. |
| `15px-22px` | Panels, cards, modal sections. | Use for larger glass surfaces. |
| `24px+` | App frame and immersive media. | Use sparingly. |
| `999px` | Pills and round controls. | Only for deliberate pill/circle shapes. |

Radius acceptance:

- Repeated cards should stay at `8px` or less unless the local component pattern already requires a larger radius.
- Large rounded panels are allowed for the app frame and glass panes.
- Do not make text-only commands look like decorative rounded badges when an icon or native control pattern fits better.

## Shadow And Depth

| Depth | Rule |
| --- | --- |
| Frame depth | Use `--shadow` only on the shell frame, major overlays, and surfaces that must separate from the host. |
| Row depth | Prefer borders and subtle translucent fills over shadows. |
| Active depth | Use background, border, or marker changes before adding new shadows. |
| Dark mode | Shadows can be stronger, but must not flatten text contrast. |

## Motion Tokens

| Motion | Timing | Usage |
| --- | --- | --- |
| Micro interaction | `120ms-180ms` | Buttons, toggles, focus changes. |
| Sheet transition | `180ms-240ms` | Overlay and bottom sheet entrance. |
| Route change | Minimal | Prefer instant state changes with stable layout. |
| Reduced motion | None or near-none | Disable nonessential transforms and long transitions. |

Motion acceptance:

- UI must be usable with `prefers-reduced-motion: reduce`.
- Motion cannot be required to understand navigation state.
- Avoid continuous background animation in default shell surfaces.

## Icon And CSS Glyph Tokens

| Token group | Purpose | Rule |
| --- | --- | --- |
| Generic `.icon` glyphs | Navigation, module rows, action cards. | CSS-only; no external official icon files. |
| Wallet glyphs | Transaction direction and record type. | Allowed for records and secondary surfaces. |
| Coin marks | Asset recognition. | CSS-authored marks tied to real asset symbols and names; no third-party image files. |
| Avatar marks | Fictional people and groups. | Initials or generated marks only; no real likenesses. |

Glyph acceptance:

- Favor familiar global symbols over text-heavy labels where the meaning is obvious.
- Every icon-only button needs an accessible name.
- Do not copy official app icon silhouettes or official brand marks.

## Wallet Token Rules

| Area | Rule |
| --- | --- |
| Asset rows | Follow a standard wallet list structure: mark, symbol, real name, chains, amount, fiat value. |
| Deep-page selectors | Reuse asset row anatomy for receive, pay, transfer, and swap asset choices. |
| Primary actions | Receive, pay, transfer, and swap stay compact text buttons on the wallet home. |
| Logos | Use local CSS coin marks only; do not bundle logo image files. |
| Risk text | Always make display-only mock status visible. |
| Forms | Labels, network fee, route, and risk check must be readable on mobile. |

See `docs/WALLET_IMPLEMENTATION.md` for the wallet data model, routes, events, and display-only boundaries.

## Safe Area And Mobile Tokens

| Area | Rule |
| --- | --- |
| Mobile preview | Phone shell should use safe-area aware top and bottom spacing. |
| Bottom navigation | Must not collide with system gesture areas. |
| Deep pages | Must keep a visible back affordance and avoid horizontal scroll. |
| Future translucent devices | Prefer layered contrast, edge strokes, and fallback fills so the UI stays readable on transparent or high-glare displays. |
| Wearable or glasses-like use | Keep primary actions large enough, labels concise, and contrast independent of background imagery. |

## Embedded Host Tokens

| Token | Purpose | Default |
| --- | --- | --- |
| `--glass-shell-height` | Host-controlled shell height. | `min(760px, 100vh)` |
| `--glass-shell-padding` | Host-controlled outer padding. | `12px` |

Embedded acceptance:

- Host apps can place the shell inside cards, dashboards, modals, or full pages.
- The shell must not require host global CSS resets.
- Host pages can control height without patching internal markup.
- Host tests should use `data-glass-*` attributes, not internal class selectors.

## Change Rules

When changing visual tokens:

- Update `styles.css`.
- Update this file if intent, token names, or behavior changes.
- Update `docs/COMPONENT_MATRIX.md` if component anatomy or state styling changes.
- Update `docs/PAGE_MATRIX.md` if route-level acceptance changes.
- Run `npm run ci:verify`.

## Remaining Design Token Work

To reach full implementation documentation:

- Add visual swatches for color and material tokens.
- Add screenshot references for light, dark, compact, fullscreen, and embedded surfaces.
- Add contrast review evidence for key text and controls.
- Add a host override example for custom accent and shell height.
- Add per-component token references in `docs/COMPONENT_MATRIX.md`.
