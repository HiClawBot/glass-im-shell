export type GlassLang = "zh" | "en" | string;
export type GlassSurface = "fullscreen" | "embedded";
export type GlassAppearance = "system" | "light" | "dark";
export type GlassDensity = "comfortable" | "compact";

export interface GlassPerson {
  id: string;
  name: string;
  avatar: string;
  color: string;
  title?: string;
  chatId?: string;
  region?: string;
  status?: string;
  sortKey?: string;
}

export interface GlassMessage {
  type?: "date";
  from?: string;
  text: string;
  kind?: "text" | "card" | "image" | "file" | "location";
  action?: string;
}

export interface GlassChat {
  id: string;
  title: string;
  type: "group" | "dm" | "official" | string;
  avatar: string;
  color: string;
  subtitle?: string;
  time?: string;
  unread?: number;
  pinned?: boolean;
  muted?: boolean;
  preview?: string;
  notice?: string;
  members: string[];
  files?: Array<{ name: string; meta: string; type: string }>;
  messages: GlassMessage[];
}

export interface GlassNavItem {
  id: string;
  icon: string;
  color?: string;
  page?: string;
  person?: string;
}

export interface GlassModule {
  title: string;
  hint?: string;
  kind: string;
}

export interface GlassContactRequest {
  id: string;
  name: string;
  nameEn?: string;
  avatar: string;
  color: string;
  source?: string;
  sourceEn?: string;
  note?: string;
  noteEn?: string;
  status?: "pending" | "added" | "ignored" | string;
}

export interface GlassContactLabel {
  id: string;
  name: string;
  nameEn?: string;
  color: string;
  members: string[];
}

export interface GlassChannelSubscription {
  id: string;
  name: string;
  nameEn?: string;
  unread?: number;
  pinned?: boolean;
  update?: string;
  updateEn?: string;
  color: string;
}

export interface GlassMoment {
  id?: string;
  author: string;
  avatar: string;
  color: string;
  text: string;
  time?: string;
  likes?: string[];
  comments?: string[];
  image?: string;
  location?: string;
  count?: number;
}

export interface GlassVideoItem {
  id?: string;
  author: string;
  avatar: string;
  color: string;
  title: string;
  caption?: string;
  likes?: string;
  comments?: string;
  saves?: string;
  tag?: string;
  tone?: string;
}

export interface GlassNearbyPlace {
  id: string;
  title: string;
  titleEn?: string;
  meta?: string;
  metaEn?: string;
  tone?: string;
  color: string;
}

export interface GlassPluginItem {
  id: string;
  name: string;
  nameEn?: string;
  desc?: string;
  descEn?: string;
  color: string;
}

export interface GlassGameCard {
  id: string;
  name: string;
  nameEn?: string;
  score?: string;
  reward?: string;
  color: string;
}

export interface GlassCryptoAsset {
  symbol: string;
  name: string;
  network?: string;
  networks?: string[];
  logo?: string;
  mark?: string;
  amount: string;
  fiat: string;
  change?: string;
  color: string;
  allocation?: string;
}

export interface GlassWalletNetwork {
  id: string;
  name: string;
  fee?: string;
  speed?: string;
  status?: string;
  color: string;
}

export interface GlassWalletTransaction {
  id: string;
  type: "receive" | "send" | "swap" | "transfer" | string;
  symbol: string;
  amount: string;
  fiat?: string;
  peer?: string;
  status?: string;
  time?: string;
}

export interface GlassWalletDefiPosition {
  id: string;
  assetSymbol: string;
  name?: string;
  nameEn?: string;
  value?: string;
  meta?: string;
  metaEn?: string;
  color?: string;
}

export interface GlassWalletNftCollection {
  id: string;
  name?: string;
  nameEn?: string;
  count?: string;
  floor?: string;
  color?: string;
}

export interface GlassWalletContact {
  id: string;
  name: string;
  nameEn?: string;
  avatar: string;
  color: string;
  address: string;
  network: string;
}

export interface GlassWalletSummary {
  name?: string;
  nameEn?: string;
  account?: string;
  accountEn?: string;
  total?: string;
  summary?: string;
  summaryEn?: string;
}

export interface GlassWalletFlowConfig {
  receive?: {
    assetSymbol?: string;
    address?: string;
    addressShort?: string;
    incoming?: string;
  };
  pay?: {
    assetSymbols?: string[];
    address?: string;
    amount?: string;
    fee?: string;
    feeMeta?: string;
    available?: string;
  };
  transfer?: {
    assetSymbols?: string[];
    amount?: string;
    memo?: string;
    fee?: string;
    feeMeta?: string;
  };
  swap?: {
    fromSymbol?: string;
    toSymbol?: string;
    fromAmount?: string;
    toAmount?: string;
    rate?: string;
    route?: string[];
    slippage?: string;
    bridge?: string;
    fee?: string;
    estimate?: string;
  };
}

export interface GlassNamedMetaItem {
  id: string;
  name?: string;
  nameEn?: string;
  title?: string;
  titleEn?: string;
  meta?: string;
  metaEn?: string;
  color?: string;
  [key: string]: unknown;
}

export interface GlassData {
  people?: Record<string, GlassPerson>;
  chats?: GlassChat[];
  contactSections?: Array<{ title?: string; titleKey?: string; items: GlassNavItem[] }>;
  contactRequests?: GlassContactRequest[];
  contactLabels?: GlassContactLabel[];
  channelSubscriptions?: GlassChannelSubscription[];
  discoverItems?: GlassNavItem[];
  meItems?: GlassNavItem[];
  moments?: GlassMoment[];
  cryptoAssets?: GlassCryptoAsset[];
  walletNetworks?: GlassWalletNetwork[];
  walletTransactions?: GlassWalletTransaction[];
  walletDefiPositions?: GlassWalletDefiPosition[];
  walletNftCollections?: GlassWalletNftCollection[];
  walletContacts?: GlassWalletContact[];
  walletSummary?: GlassWalletSummary;
  walletFlowConfig?: GlassWalletFlowConfig;
  videoFeed?: GlassVideoItem[];
  nearbyPlaces?: GlassNearbyPlace[];
  pluginGroups?: { recent?: GlassPluginItem[]; suggested?: GlassPluginItem[]; [key: string]: GlassPluginItem[] | undefined };
  gameCards?: GlassGameCard[];
  accountDevices?: GlassNamedMetaItem[];
  storageBuckets?: GlassNamedMetaItem[];
  savedItems?: GlassNamedMetaItem[];
  passItems?: GlassNamedMetaItem[];
  stickerPacks?: GlassNamedMetaItem[];
  helpTopics?: GlassNamedMetaItem[];
  modules?: Record<string, GlassModule>;
  i18n?: Record<string, Record<string, string>>;
}

export interface GlassEvent {
  type: string;
  payload: Record<string, unknown>;
  state: {
    view: string;
    route: string;
    activeChatId: string | null;
    activePersonId: string | null;
    activePage: string | null;
    walletTab?: string;
    lang: GlassLang;
    version: string;
    surface: GlassSurface;
    appearance: GlassAppearance;
    resolvedTheme: "light" | "dark";
    density: GlassDensity;
    blockedPeople?: string[];
    deletedPeople?: string[];
  };
}

export interface GlassMountOptions {
  root?: string | Element;
  data?: GlassData;
  dataProvider?: () => GlassData | Promise<GlassData>;
  theme?: Record<string, string>;
  lang?: GlassLang;
  surface?: GlassSurface;
  appearance?: GlassAppearance;
  density?: GlassDensity;
  route?: string | { type: "chat" | "person" | "page" | "view"; id: string };
  initialView?: string;
  persistLanguage?: boolean;
  persistAppearance?: boolean;
  onEvent?: (event: GlassEvent) => void;
}

export interface GlassIMShellApi {
  mount(options?: GlassMountOptions): GlassIMShellApi;
  render(): void;
  navigate(target: string | { type: "chat" | "person" | "page" | "view"; id: string }): void;
  setData(data: GlassData): void;
  setLang(lang: GlassLang): void;
  setTheme(theme: Record<string, string>): void;
  setAppearance(appearance: GlassAppearance): void;
  setDensity(density: GlassDensity): void;
  setSurface(surface: GlassSurface): void;
  configure(options?: GlassMountOptions): GlassIMShellApi;
  getVersion(): string;
  getState(): GlassEvent["state"];
  getData(): Required<Omit<GlassData, "i18n">>;
  on(listener: (event: GlassEvent) => void): () => void;
}

declare global {
  interface Window {
    GLASS_IM_CONFIG?: GlassMountOptions;
    GlassIMShell?: GlassIMShellApi;
  }
}
