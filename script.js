const GLASS_IM_VERSION = "0.1.0";
const bootConfig = window.GLASS_IM_CONFIG || {};
const validSurfaces = new Set(["fullscreen", "embedded"]);
const initialSurface = validSurfaces.has(bootConfig.surface) ? bootConfig.surface : bootConfig.root ? "embedded" : "fullscreen";

document.documentElement.dataset.glassSurface = initialSurface;

function ensureAppShell() {
  if (document.querySelector("#appShell")) return;
  const target = typeof bootConfig.root === "string" ? document.querySelector(bootConfig.root) : bootConfig.root;
  const host = target || document.body;
  host.insertAdjacentHTML("beforeend", `
    <main class="stage" aria-label="Glass IM Shell">
      <section class="app-shell glass-window" id="appShell" data-glass-shell>
        <aside class="rail glass-dark" aria-label="Primary navigation">
          <button class="avatar self" type="button" data-open-page="profile:self" aria-label="Profile">林</button>
          <nav class="rail-nav" id="railNav" aria-label="Main sections"></nav>
          <button class="rail-icon" type="button" data-open-page="settings" aria-label="Settings"><span class="icon gear"></span></button>
        </aside>
        <section class="list-pane glass-pane" aria-label="List pane">
          <header class="pane-head">
            <div><h1 id="paneTitle">消息</h1><p id="paneHint">12 条模拟会话</p></div>
            <div class="pane-actions">
              <button class="lang-button" id="languageButton" type="button" aria-label="Switch language">EN</button>
              <button class="round-button" id="plusButton" type="button" aria-label="More actions">+</button>
            </div>
          </header>
          <div class="search-row"><span class="icon search" aria-hidden="true"></span><input id="searchInput" type="search" placeholder="搜索" autocomplete="off" /></div>
          <div class="list-scroll" id="listContent"></div>
        </section>
        <section class="work-pane glass-pane" id="workPane" aria-label="Work pane"></section>
        <aside class="side-pane glass-pane" id="sidePane" aria-label="Detail pane"></aside>
      </section>
    </main>
    <div class="toast" id="toast" role="status" aria-live="polite"></div>
    <div class="overlay" id="overlay" hidden></div>
    <section class="sheet glass-pane" id="sheet" hidden aria-label="Sheet"></section>`);
}

ensureAppShell();

const navItems = [
  { id: "chats", icon: "chat" },
  { id: "contacts", icon: "contacts" },
  { id: "discover", icon: "discover" },
  { id: "me", icon: "me" },
];

const systemLang = () => (navigator.language || "zh").toLowerCase().startsWith("zh") ? "zh" : "en";
const savedLang = bootConfig.persistLanguage === false ? null : localStorage.getItem("glass-im-lang");
const systemAppearance = () => (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
const savedAppearance = bootConfig.persistAppearance === false ? null : localStorage.getItem("glass-im-appearance");
const validAppearances = new Set(["system", "light", "dark"]);
const validDensities = new Set(["comfortable", "compact"]);

const i18n = {
  zh: {
    "nav.chats": "消息", "nav.contacts": "联系人", "nav.discover": "探索", "nav.me": "我",
    "common.search": "搜索", "common.more": "更多操作", "common.noChat": "没有匹配的会话", "common.noContact": "没有匹配的联系人", "common.noContent": "没有匹配内容", "common.mockDone": "模拟完成",
    "common.loading": "正在加载数据", "common.error": "数据加载失败", "chat.online": "已连接", "chat.replying": "回复", "chat.cancel": "取消", "chat.send": "发送",
    "msg.actions": "消息操作", "msg.reply": "回复", "msg.forward": "转发", "msg.save": "收藏", "msg.copy": "复制", "msg.delete": "删除", "msg.delivered": "已送达", "msg.read": "已读",
    "hint.chats": "{count} 条模拟会话", "hint.contacts": "联系人、群组、分组标签、频道", "hint.discover": "内容、工具、插件",
    "section.common": "常用", "section.mockCelebrities": "模拟名人",
    "item.new-friends.label": "连接请求", "item.new-friends.desc": "3 条申请", "item.group-chats.label": "群组", "item.group-chats.desc": "12 个群", "item.tags.label": "分组标签", "item.tags.desc": "客户、团队、家人", "item.official.label": "频道", "item.official.desc": "6 个订阅",
    "item.moments.label": "动态", "item.moments.desc": "好友动态与互动", "item.channels.label": "视频流", "item.channels.desc": "短视频、直播、关注", "item.scan.label": "扫描", "item.scan.desc": "二维码、条码、翻译", "item.nearby.label": "附近", "item.nearby.desc": "附近直播和动态", "item.mini.label": "插件", "item.mini.desc": "最近使用与推荐", "item.games.label": "游戏", "item.games.desc": "好友排行和礼包",
    "item.pay.label": "钱包", "item.pay.desc": "多链资产、收款、付款、兑换", "item.favorites.label": "收藏", "item.favorites.desc": "图片、笔记、链接、文件", "item.posts.label": "动态", "item.posts.desc": "个人相册与状态", "item.cards.label": "凭证", "item.cards.desc": "会员卡、票券、证件", "item.stickers.label": "贴纸", "item.stickers.desc": "贴纸商店和最近使用", "item.settings.label": "设置", "item.settings.desc": "账号、安全、隐私、通用",
    "page.pay.title": "钱包", "page.pay.hint": "多链资产与加密支付", "page.payCode.title": "收款", "page.payCode.hint": "多链地址、二维码、收款记录", "page.sendCrypto.title": "付款", "page.sendCrypto.hint": "地址、扫码、网络费确认", "page.transfer.title": "转账", "page.transfer.hint": "联系人转账与链上转账确认", "page.swapCrypto.title": "兑换", "page.swapCrypto.hint": "跨链兑换、滑点、报价路由",
    "page.newFriends.title": "连接请求", "page.newFriends.hint": "申请、来源、验证状态", "page.groups.title": "群组", "page.groups.hint": "群聊目录、置顶、免打扰", "page.tags.title": "分组标签", "page.tags.hint": "按关系、场景和频率管理联系人", "page.officialAccounts.title": "频道", "page.officialAccounts.hint": "订阅频道与服务频道", "page.remarkTags.title": "备注和分组标签", "page.remarkTags.hint": "联系人备注、描述、电话、标签", "page.friendPrivacy.title": "朋友权限", "page.friendPrivacy.hint": "聊天、动态、视频流、关系状态",
    "page.moments.title": "动态", "page.moments.hint": "好友动态", "page.myMoments.title": "动态", "page.myMoments.hint": "个人相册", "page.channels.title": "视频流", "page.channels.hint": "关注、推荐、直播", "page.settings.title": "设置", "page.settings.hint": "账号、安全、隐私、通用",
    "page.favorites.title": "收藏", "page.favorites.hint": "图片、笔记、链接、文件", "page.cards.title": "凭证", "page.cards.hint": "票券、会员卡、证件", "page.stickers.title": "贴纸", "page.stickers.hint": "最近使用与商店",
    "page.accountSecurity.title": "账号与安全", "page.accountSecurity.hint": "账号信息、登录设备、安全中心", "page.notificationSettings.title": "新消息通知", "page.notificationSettings.hint": "消息提醒、声音、横幅、详情显示", "page.chatSettings.title": "聊天", "page.chatSettings.hint": "聊天记录、迁移、快捷输入、背景", "page.privacySettings.title": "隐私", "page.privacySettings.hint": "添加方式、动态、黑名单、授权", "page.generalSettings.title": "通用", "page.generalSettings.hint": "多语言、字体、照片视频、辅助功能", "page.storageSettings.title": "存储空间", "page.storageSettings.hint": "缓存、聊天记录、清理建议", "page.about.title": "关于", "page.about.hint": "版本、功能介绍、开源声明", "page.help.title": "帮助与反馈", "page.help.hint": "常见问题、反馈记录、诊断工具",
    "contact.directory": "联系人目录", "contact.mutual": "共同群组", "contact.source": "来源", "contact.relation": "关系状态", "contact.normal": "正常", "contact.blocked": "已加入黑名单", "contact.deleted": "已移出联系人", "contact.accept": "接受", "contact.ignore": "忽略", "contact.message": "发消息", "contact.pending": "等待验证", "contact.added": "已添加", "contact.block": "加入黑名单", "contact.unblock": "移出黑名单", "contact.delete": "删除联系人", "contact.restore": "恢复联系人", "contact.save": "保存备注", "contact.members": "{count} 人", "contact.pinned": "置顶", "contact.muted": "免打扰", "contact.files": "文件", "contact.labelNew": "新建分组标签", "contact.notGrouped": "未分组", "contact.currentAccount": "当前账号", "contact.sourceMock": "通过模拟联系人添加",
    "privacy.chat": "聊天", "privacy.activity": "动态和状态", "privacy.video": "视频动态", "privacy.hideFrom": "不让他看", "privacy.hideTo": "不看他", "privacy.allowed": "允许", "privacy.restricted": "受限", "privacy.visible": "可见", "privacy.hidden": "不可见", "privacy.on": "已开启", "privacy.off": "未开启",
    "social.friendActivity": "好友动态", "social.myActivity": "我的动态", "social.today": "今天", "social.camera": "发布", "social.like": "喜欢", "social.comment": "评论", "social.reply": "回复", "social.share": "分享", "social.save": "保存", "social.none": "暂无", "social.recommended": "推荐", "social.following": "关注", "social.live": "直播", "social.nearby": "附近",
    "scan.aim": "对准二维码 / 条形码", "scan.desc": "支持扫码、翻译、识物和封面识别。", "scan.qr": "扫码", "scan.translate": "翻译", "scan.object": "识物", "scan.cover": "封面", "scan.history": "最近扫描", "scan.result": "识别结果", "scan.mock": "模拟识别 · 无外部请求",
    "nearby.map": "附近热区", "nearby.people": "在线", "nearby.distance": "{distance} 公里", "plugin.recent": "最近使用", "plugin.suggested": "推荐", "plugin.open": "打开", "game.rank": "好友排行", "game.reward": "奖励",
    "wallet.main": "主钱包", "wallet.assets": "资产", "wallet.records": "记录", "wallet.all": "全部", "wallet.receive": "收款", "wallet.pay": "付款", "wallet.transfer": "转账", "wallet.swap": "兑换", "wallet.mock": "24h +$1,248.62 · 多链模拟资产",
    "wallet.portfolio": "组合概览", "wallet.available": "可用", "wallet.networks": "网络", "wallet.watch": "观察", "wallet.defi": "DeFi", "wallet.nft": "NFT", "wallet.recent": "最近记录", "wallet.addressBook": "地址簿", "wallet.networkFee": "网络费", "wallet.risk": "风险检测", "wallet.riskClear": "地址未命中风险规则", "wallet.confirm": "确认", "wallet.copy": "复制地址", "wallet.address": "地址", "wallet.amount": "金额", "wallet.memo": "备注", "wallet.route": "报价路由", "wallet.slippage": "滑点", "wallet.bridge": "跨链桥", "wallet.estimate": "预计完成", "wallet.incoming": "最近收款", "wallet.contacts": "常用联系人", "wallet.max": "最大", "wallet.mockOnly": "模拟钱包数据，不连接真实链上资产", "wallet.position": "仓位", "wallet.apy": "年化", "wallet.collection": "收藏集", "wallet.floor": "地板价", "wallet.emptyAssets": "暂无资产", "wallet.emptyDefi": "暂无仓位", "wallet.emptyNft": "暂无收藏", "wallet.emptyRecords": "暂无记录",
    "settings.security": "安全评分", "settings.devices": "登录设备", "settings.bound": "已绑定", "settings.unbound": "未绑定", "settings.enabled": "已开启", "settings.disabled": "未开启", "settings.manage": "管理", "settings.clean": "清理", "settings.backup": "备份", "settings.lastBackup": "最近备份：昨天", "settings.media": "照片、视频、文件和通话", "settings.accessibility": "辅助功能", "settings.font": "字体大小", "settings.standard": "标准", "settings.diagnostics": "诊断工具", "settings.run": "运行一次", "settings.version": "版本", "settings.license": "开源许可", "settings.localOnly": "仅本地模拟数据", "settings.disclaimer": "非官方、非关联、仅作 UI/UX 原型", "settings.freeze": "冻结账号", "settings.close": "注销账号", "settings.push": "接收新消息通知", "settings.preview": "通知显示消息详情", "settings.callAlerts": "语音和视频通话提醒", "settings.sound": "声音", "settings.vibration": "震动", "settings.quiet": "免打扰时段", "settings.chatBackground": "聊天背景", "settings.stickerManager": "贴纸管理", "settings.quickInput": "快捷输入", "settings.discovery": "添加我的方式", "settings.activityVisibility": "动态权限", "settings.videoVisibility": "视频动态权限", "settings.permissions": "个人信息与权限", "settings.blocked": "联系人黑名单", "settings.recommendations": "个性化推荐", "settings.phoneSearch": "手机号搜索",
    "saved.all": "全部收藏", "saved.images": "图片与视频", "saved.links": "链接", "saved.files": "文件", "saved.notes": "笔记", "passes.available": "可用", "stickers.recent": "最近使用", "stickers.store": "贴纸商店",
    "sheet.title": "更多操作", "sheet.group": "发起群组", "sheet.add": "添加联系人", "sheet.scan": "扫描", "sheet.receive": "收款", "sheet.help": "帮助与反馈", "sheet.desktop": "桌面登录",
    "settings.language": "语言", "settings.system": "跟随系统", "settings.dark": "深色模式", "settings.general": "通用",
  },
  en: {
    "nav.chats": "Chats", "nav.contacts": "Contacts", "nav.discover": "Explore", "nav.me": "Me",
    "common.search": "Search", "common.more": "More actions", "common.noChat": "No matching chats", "common.noContact": "No matching contacts", "common.noContent": "No results", "common.mockDone": "Mock complete",
    "common.loading": "Loading data", "common.error": "Data failed to load", "chat.online": "Connected", "chat.replying": "Replying to", "chat.cancel": "Cancel", "chat.send": "Send",
    "msg.actions": "Message actions", "msg.reply": "Reply", "msg.forward": "Forward", "msg.save": "Save", "msg.copy": "Copy", "msg.delete": "Delete", "msg.delivered": "Delivered", "msg.read": "Read",
    "hint.chats": "{count} mock chats", "hint.contacts": "Contacts, groups, labels, channels", "hint.discover": "Content, tools, plugins",
    "section.common": "Pinned", "section.mockCelebrities": "Mock Personas",
    "item.new-friends.label": "Requests", "item.new-friends.desc": "3 pending", "item.group-chats.label": "Groups", "item.group-chats.desc": "12 groups", "item.tags.label": "Labels", "item.tags.desc": "Clients, team, family", "item.official.label": "Channels", "item.official.desc": "6 subscriptions",
    "item.moments.label": "Activity", "item.moments.desc": "Friends and replies", "item.channels.label": "Video", "item.channels.desc": "Short video, live, following", "item.scan.label": "Scan", "item.scan.desc": "QR, barcode, translate", "item.nearby.label": "Nearby", "item.nearby.desc": "Local live and activity", "item.mini.label": "Plugins", "item.mini.desc": "Recent and suggested", "item.games.label": "Games", "item.games.desc": "Rankings and rewards",
    "item.pay.label": "Wallet", "item.pay.desc": "Assets, receive, pay, transfer, swap", "item.favorites.label": "Saved", "item.favorites.desc": "Images, notes, links, files", "item.posts.label": "Activity", "item.posts.desc": "Personal album and status", "item.cards.label": "Passes", "item.cards.desc": "Memberships, tickets, IDs", "item.stickers.label": "Stickers", "item.stickers.desc": "Sticker store and recent", "item.settings.label": "Settings", "item.settings.desc": "Account, security, privacy, general",
    "page.pay.title": "Wallet", "page.pay.hint": "Multi-chain assets and crypto payments", "page.payCode.title": "Receive", "page.payCode.hint": "Addresses, QR, incoming records", "page.sendCrypto.title": "Pay", "page.sendCrypto.hint": "Address, scan, network fee", "page.transfer.title": "Transfer", "page.transfer.hint": "Contacts and on-chain transfer", "page.swapCrypto.title": "Swap", "page.swapCrypto.hint": "Cross-chain route and slippage",
    "page.newFriends.title": "Requests", "page.newFriends.hint": "Requests, sources, verification status", "page.groups.title": "Groups", "page.groups.hint": "Group directory, pinned, muted", "page.tags.title": "Labels", "page.tags.hint": "Manage contacts by relationship and context", "page.officialAccounts.title": "Channels", "page.officialAccounts.hint": "Subscribed channels and service channels", "page.remarkTags.title": "Remark and Labels", "page.remarkTags.hint": "Remark, description, phone, labels", "page.friendPrivacy.title": "Friend Permissions", "page.friendPrivacy.hint": "Chat, activity, video, relationship state",
    "page.moments.title": "Activity", "page.moments.hint": "Friend activity", "page.myMoments.title": "Activity", "page.myMoments.hint": "Personal album", "page.channels.title": "Video", "page.channels.hint": "Following, recommended, live", "page.settings.title": "Settings", "page.settings.hint": "Account, security, privacy, general",
    "page.favorites.title": "Saved", "page.favorites.hint": "Images, notes, links, files", "page.cards.title": "Passes", "page.cards.hint": "Tickets, memberships, IDs", "page.stickers.title": "Stickers", "page.stickers.hint": "Recent and store",
    "page.accountSecurity.title": "Account & Security", "page.accountSecurity.hint": "Account, devices, security center", "page.notificationSettings.title": "Notifications", "page.notificationSettings.hint": "Alerts, sound, banners, detail preview", "page.chatSettings.title": "Chats", "page.chatSettings.hint": "History, migration, quick input, background", "page.privacySettings.title": "Privacy", "page.privacySettings.hint": "Discovery, activity, block list, permissions", "page.generalSettings.title": "General", "page.generalSettings.hint": "Language, font, media, accessibility", "page.storageSettings.title": "Storage", "page.storageSettings.hint": "Cache, chat history, cleanup suggestions", "page.about.title": "About", "page.about.hint": "Version, overview, open-source notice", "page.help.title": "Help", "page.help.hint": "FAQ, feedback, diagnostics",
    "contact.directory": "Directory", "contact.mutual": "Mutual groups", "contact.source": "Source", "contact.relation": "Relationship", "contact.normal": "Normal", "contact.blocked": "Blocked", "contact.deleted": "Removed", "contact.accept": "Accept", "contact.ignore": "Ignore", "contact.message": "Message", "contact.pending": "Pending", "contact.added": "Added", "contact.block": "Block", "contact.unblock": "Unblock", "contact.delete": "Remove contact", "contact.restore": "Restore contact", "contact.save": "Save remark", "contact.members": "{count} members", "contact.pinned": "Pinned", "contact.muted": "Muted", "contact.files": "Files", "contact.labelNew": "New label", "contact.notGrouped": "Not grouped", "contact.currentAccount": "Current account", "contact.sourceMock": "Added through mock contacts",
    "privacy.chat": "Chat", "privacy.activity": "Activity", "privacy.video": "Video activity", "privacy.hideFrom": "Hide my activity", "privacy.hideTo": "Mute their activity", "privacy.allowed": "Allowed", "privacy.restricted": "Restricted", "privacy.visible": "Visible", "privacy.hidden": "Hidden", "privacy.on": "On", "privacy.off": "Off",
    "social.friendActivity": "Friend Activity", "social.myActivity": "My Activity", "social.today": "Today", "social.camera": "Post", "social.like": "Like", "social.comment": "Comment", "social.reply": "Reply", "social.share": "Share", "social.save": "Save", "social.none": "None", "social.recommended": "Recommended", "social.following": "Following", "social.live": "Live", "social.nearby": "Nearby",
    "scan.aim": "Aim at a code", "scan.desc": "QR, barcode, translation, object, and cover recognition.", "scan.qr": "Scan", "scan.translate": "Translate", "scan.object": "Object", "scan.cover": "Cover", "scan.history": "Recent scans", "scan.result": "Result", "scan.mock": "Mock recognition · no external request",
    "nearby.map": "Nearby zones", "nearby.people": "online", "nearby.distance": "{distance} km", "plugin.recent": "Recent", "plugin.suggested": "Suggested", "plugin.open": "Open", "game.rank": "Friend ranking", "game.reward": "Reward",
    "wallet.main": "Main wallet", "wallet.assets": "Assets", "wallet.records": "Records", "wallet.all": "All", "wallet.receive": "Receive", "wallet.pay": "Pay", "wallet.transfer": "Transfer", "wallet.swap": "Swap", "wallet.mock": "24h +$1,248.62 · Multi-chain mock assets",
    "wallet.portfolio": "Portfolio", "wallet.available": "Available", "wallet.networks": "Networks", "wallet.watch": "Watch", "wallet.defi": "DeFi", "wallet.nft": "NFT", "wallet.recent": "Recent", "wallet.addressBook": "Address book", "wallet.networkFee": "Network fee", "wallet.risk": "Risk check", "wallet.riskClear": "Address passed mock risk rules", "wallet.confirm": "Confirm", "wallet.copy": "Copy address", "wallet.address": "Address", "wallet.amount": "Amount", "wallet.memo": "Memo", "wallet.route": "Quote route", "wallet.slippage": "Slippage", "wallet.bridge": "Bridge", "wallet.estimate": "ETA", "wallet.incoming": "Recent incoming", "wallet.contacts": "Frequent contacts", "wallet.max": "Max", "wallet.mockOnly": "Mock wallet data, no real on-chain assets", "wallet.position": "Position", "wallet.apy": "APY", "wallet.collection": "Collection", "wallet.floor": "Floor", "wallet.emptyAssets": "No assets", "wallet.emptyDefi": "No positions", "wallet.emptyNft": "No collections", "wallet.emptyRecords": "No records",
    "settings.security": "Security score", "settings.devices": "Signed-in devices", "settings.bound": "Bound", "settings.unbound": "Not bound", "settings.enabled": "On", "settings.disabled": "Off", "settings.manage": "Manage", "settings.clean": "Clean", "settings.backup": "Backup", "settings.lastBackup": "Last backup: yesterday", "settings.media": "Photos, videos, files, calls", "settings.accessibility": "Accessibility", "settings.font": "Font size", "settings.standard": "Standard", "settings.diagnostics": "Diagnostics", "settings.run": "Run once", "settings.version": "Version", "settings.license": "License", "settings.localOnly": "Local mock data only", "settings.disclaimer": "Unofficial, unaffiliated UI/UX prototype", "settings.freeze": "Freeze account", "settings.close": "Close account", "settings.push": "Push notifications", "settings.preview": "Show message preview", "settings.callAlerts": "Voice and video call alerts", "settings.sound": "Sound", "settings.vibration": "Vibration", "settings.quiet": "Quiet hours", "settings.chatBackground": "Chat background", "settings.stickerManager": "Sticker manager", "settings.quickInput": "Quick input", "settings.discovery": "Discovery methods", "settings.activityVisibility": "Activity visibility", "settings.videoVisibility": "Video visibility", "settings.permissions": "Data permissions", "settings.blocked": "Blocked contacts", "settings.recommendations": "Personalized recommendations", "settings.phoneSearch": "Search by phone",
    "saved.all": "All saved", "saved.images": "Images & video", "saved.links": "Links", "saved.files": "Files", "saved.notes": "Notes", "passes.available": "Available", "stickers.recent": "Recent", "stickers.store": "Sticker store",
    "sheet.title": "More actions", "sheet.group": "New group", "sheet.add": "Add contact", "sheet.scan": "Scan", "sheet.receive": "Receive", "sheet.help": "Help", "sheet.desktop": "Desktop login",
    "settings.language": "Language", "settings.system": "System", "settings.dark": "Dark mode", "settings.general": "General",
  },
};

let people = {
  self: { id: "self", name: "林亦", avatar: "林", color: "#4f7cff", title: "产品工程师", chatId: "lin_glass_01", region: "上海", status: "把复杂流程做薄" },
  chen: { id: "chen", name: "陈未", avatar: "陈", color: "#ff8a3d", title: "产品设计", chatId: "chen_design", region: "杭州", status: "今天不改信息架构", sortKey: "chen wei" },
  a: { id: "a", name: "阿澈", avatar: "阿", color: "#19a35b", title: "前端工程", chatId: "ache_web", region: "深圳", status: "CSS 先跑起来", sortKey: "a che" },
  zhou: { id: "zhou", name: "周策", avatar: "周", color: "#8757f2", title: "项目管理", chatId: "zhou_pm", region: "北京", status: "排期同步中", sortKey: "zhou ce" },
  xu: { id: "xu", name: "许然", avatar: "许", color: "#ef4c68", title: "视觉设计", chatId: "xu_visual", region: "成都", status: "玻璃不是模糊一切", sortKey: "xu ran" },
  mom: { id: "mom", name: "妈妈", avatar: "妈", color: "#ff5a5f", title: "家人", chatId: "family_mom", region: "苏州", status: "晚上记得吃饭" },
  system: { id: "system", name: "系统通知", avatar: "服", color: "#12b7a6", title: "系统", chatId: "service_notice", region: "系统", status: "系统更新" },
  song: { id: "song", name: "宋星河", avatar: "宋", color: "#5b7cfa", title: "模拟歌手", chatId: "song_star_mock", region: "台北", status: "巡演排练中", sortKey: "song xinghe" },
  yue: { id: "yue", name: "岳知秋", avatar: "岳", color: "#c05cff", title: "模拟演员", chatId: "yue_actor_mock", region: "北京", status: "片场休息十分钟", sortKey: "yue zhiqiu" },
  qiao: { id: "qiao", name: "乔以南", avatar: "乔", color: "#e06b32", title: "模拟导演", chatId: "qiao_director_mock", region: "上海", status: "分镜比对白重要", sortKey: "qiao yinan" },
  ji: { id: "ji", name: "季云舒", avatar: "季", color: "#2aa6a1", title: "模拟主持人", chatId: "ji_host_mock", region: "广州", status: "今晚录制", sortKey: "ji yunshu" },
};

let chats = [
  {
    id: "team",
    title: "项目组",
    type: "group",
    avatar: "项",
    color: "#0c9f68",
    subtitle: "4 位成员，当前在线 3 人",
    time: "09:42",
    unread: 3,
    pinned: true,
    muted: false,
    preview: "阿澈：我把交互走查结果放到群文件了",
    notice: "今天 18:00 前确认液体玻璃版 IM 原型，信息架构先冻结。",
    members: ["self", "chen", "a", "zhou"],
    files: [
      { name: "liquid-chat-flow.pdf", meta: "3.4 MB · 昨天", type: "PDF" },
      { name: "glass-ui-shot.png", meta: "1.1 MB · 周一", type: "IMG" },
    ],
    messages: [
      { type: "date", text: "上午 9:18" },
      { from: "chen", text: "这次要覆盖一级入口、二级页、详情页、输入流和常见空状态。", kind: "text" },
      { from: "a", text: "我把交互走查结果放到群文件了，搜索和发送都可以先做成前端状态。", kind: "text" },
      { from: "self", text: "收到。我会先锁会话结构，再补联系人、探索、钱包和设置。", kind: "text" },
      { from: "zhou", text: "移动端要像真实聊天一样从列表推进到会话。", kind: "text" },
    ],
  },
  {
    id: "design",
    title: "设计评审",
    type: "group",
    avatar: "设",
    color: "#4f7cff",
    subtitle: "外观、动效、适配",
    time: "昨天",
    unread: 0,
    pinned: false,
    muted: true,
    preview: "许然：玻璃质感要有层次，不要只是透明",
    notice: "评审重点：层级、可读性、移动端抽屉、状态反馈。",
    members: ["self", "xu", "chen"],
    files: [{ name: "visual-audit.md", meta: "24 KB · 昨天", type: "DOC" }],
    messages: [
      { type: "date", text: "昨天 16:05" },
      { from: "xu", text: "液体玻璃需要折射边、内高光和明确的文字对比。", kind: "text" },
      { from: "self", text: "会控制透明度，操作区保留实底，避免输入区读不清。", kind: "text" },
    ],
  },
  {
    id: "service",
    title: "系统通知",
    type: "official",
    avatar: "服",
    color: "#12b7a6",
    subtitle: "支付、插件、账号消息",
    time: "周一",
    unread: 2,
    pinned: false,
    muted: false,
    preview: "你有 2 条待确认的项目更新",
    notice: "系统通知仅展示摘要和跳转卡片。",
    members: ["self", "system"],
    files: [],
    messages: [
      { type: "date", text: "周一 10:12" },
      { from: "system", text: "你有 2 条待确认的项目更新。", kind: "card", action: "查看详情" },
      { from: "self", text: "稍后处理。", kind: "text" },
    ],
  },
  {
    id: "family",
    title: "家人群",
    type: "group",
    avatar: "家",
    color: "#ff725c",
    subtitle: "5 位成员",
    time: "周日",
    unread: 0,
    pinned: false,
    muted: false,
    preview: "妈妈：晚上回家吃饭吗？",
    notice: "周末聚餐时间暂定 19:00。",
    members: ["self", "mom"],
    files: [],
    messages: [
      { type: "date", text: "周日 18:26" },
      { from: "mom", text: "晚上回家吃饭吗？", kind: "text" },
      { from: "self", text: "回，差不多七点到。", kind: "text" },
    ],
  },
  {
    id: "stars",
    title: "星光通告群",
    type: "group",
    avatar: "星",
    color: "#c05cff",
    subtitle: "艺人通告与直播脚本",
    time: "08:15",
    unread: 5,
    pinned: false,
    muted: false,
    preview: "宋星河：晚上的直播串词我看过了",
    notice: "此群为虚构艺人模拟数据，不对应任何真实人物或商业代言。",
    members: ["self", "song", "yue", "qiao", "ji"],
    files: [{ name: "show-rundown.xlsx", meta: "540 KB · 今天", type: "XLS" }],
    messages: [
      { type: "date", text: "上午 8:15" },
      { from: "song", text: "晚上的直播串词我看过了，第二段需要少一点品牌口播。", kind: "text" },
      { from: "yue", text: "我 19:20 到现场，先走妆发再彩排。", kind: "text" },
      { from: "self", text: "收到，我把流程卡片同步到群文件。", kind: "text" },
    ],
  },
];

let contactSections = [
  {
    titleKey: "section.common",
    items: [
      { id: "new-friends", icon: "request", color: "#12b7a6", page: "newFriends" },
      { id: "group-chats", icon: "group", color: "#13a06f", page: "groups" },
      { id: "tags", icon: "tag", color: "#4f7cff", page: "tags" },
      { id: "official", icon: "broadcast", color: "#f3a23a", page: "officialAccounts" },
    ],
  },
  {
    title: "A",
    items: [{ id: "a", person: "a" }],
  },
  {
    title: "C",
    items: [{ id: "chen", person: "chen" }],
  },
  {
    title: "X",
    items: [{ id: "xu", person: "xu" }],
  },
  {
    title: "Z",
    items: [{ id: "zhou", person: "zhou" }],
  },
  {
    titleKey: "section.mockCelebrities",
    items: [{ id: "song", person: "song" }, { id: "yue", person: "yue" }, { id: "qiao", person: "qiao" }, { id: "ji", person: "ji" }],
  },
];

let contactRequests = [
  { id: "r-jp", name: "江南产品会", nameEn: "Jiangnan Product Lab", avatar: "江", color: "#12b7a6", source: "通过群组“星光通告群”添加你", sourceEn: "From a shared production group", note: "你好，我想同步一下项目资料。", noteEn: "Hi, I would like to sync project materials.", status: "pending" },
  { id: "r-mia", name: "Mia", avatar: "M", color: "#4f7cff", source: "来自手机号搜索", sourceEn: "From phone search", note: "我们刚刚在活动现场见过。", noteEn: "We met at the event earlier.", status: "pending" },
  { id: "r-bei", name: "北辰", nameEn: "Beichen", avatar: "北", color: "#8757f2", source: "2 个共同群组", sourceEn: "2 mutual groups", note: "已通过验证，保留添加记录。", noteEn: "Verified and kept in the request log.", status: "added" },
];

let contactLabels = [
  { id: "team", name: "团队", nameEn: "Team", color: "#12b7a6", members: ["chen", "a", "zhou", "xu"] },
  { id: "family", name: "家人", nameEn: "Family", color: "#ff725c", members: ["mom"] },
  { id: "creator", name: "创作", nameEn: "Creators", color: "#7c5cff", members: ["song", "yue", "qiao", "ji"] },
  { id: "priority", name: "高频联系", nameEn: "Frequent", color: "#f3a23a", members: ["chen", "a", "song", "zhou"] },
  { id: "followup", name: "待跟进", nameEn: "Follow up", color: "#4f7cff", members: ["xu", "qiao"] },
];

let channelSubscriptions = [
  { id: "product-weekly", name: "产品周刊", nameEn: "Product Weekly", unread: 3, pinned: true, update: "今天 08:30 更新", updateEn: "Updated today 08:30", color: "#f3a23a" },
  { id: "design-watch", name: "设计观察", nameEn: "Design Watch", unread: 0, pinned: false, update: "今天 08:30 更新", updateEn: "Updated today 08:30", color: "#4f7cff" },
  { id: "frontend-daily", name: "前端早读课", nameEn: "Frontend Brief", unread: 0, pinned: false, update: "昨天 20:45 更新", updateEn: "Updated yesterday 20:45", color: "#12b7a6" },
  { id: "city-tools", name: "城市工具", nameEn: "City Tools", unread: 1, pinned: false, update: "服务提醒 1 条", updateEn: "1 service alert", color: "#8757f2" },
  { id: "service-digest", name: "订阅号消息", nameEn: "Channel Digest", unread: 0, pinned: false, update: "汇总 6 个频道", updateEn: "6 channels summarized", color: "#67707a" },
];

let discoverItems = [
  { id: "moments", icon: "activity", color: "#12b7a6", page: "moments" },
  { id: "channels", icon: "video", color: "#f05260", page: "channels" },
  { id: "scan", icon: "scan", color: "#4f7cff", page: "scan" },
  { id: "nearby", icon: "nearby", color: "#12a0aa", page: "nearby" },
  { id: "mini", icon: "plugin", color: "#7c5cff", page: "miniPrograms" },
  { id: "games", icon: "game", color: "#ff8a3d", page: "games" },
];

let meItems = [
  { id: "pay", icon: "wallet", color: "#121827", page: "pay" },
  { id: "favorites", icon: "bookmark", color: "#f3a23a", page: "favorites" },
  { id: "posts", icon: "activity", color: "#4f7cff", page: "myMoments" },
  { id: "cards", icon: "pass", color: "#ff725c", page: "cards" },
  { id: "stickers", icon: "smile", color: "#7c5cff", page: "stickers" },
  { id: "settings", icon: "settings", color: "#67707a", page: "settings" },
];

let moments = [
  { id: "m-chen", author: "陈未", avatar: "陈", color: "#ff8a3d", text: "把一个复杂产品做清楚，最难的是删掉看似有用的入口。", time: "8 分钟前", likes: ["林亦", "许然"], comments: ["阿澈：这句可以放评审结论。"], image: "晨光会议桌", location: "杭州 · 西溪", count: 4 },
  { id: "m-xu", author: "许然", avatar: "许", color: "#ef4c68", text: "液体玻璃不是装饰，是状态层级。", time: "1 小时前", likes: ["陈未"], comments: ["林亦：输入区要保留实底。"], image: "玻璃建筑细节", location: "成都 · 天府软件园", count: 2 },
  { id: "m-song", author: "宋星河", avatar: "宋", color: "#5b7cfa", text: "彩排结束，今晚会把新歌桥段压到三分钟以内。", time: "2 小时前", likes: ["林亦", "岳知秋"], comments: ["乔以南：镜头一可以再靠近一点。", "季云舒：开场我来接。"], image: "舞台灯光", location: "台北 · 场馆后台", count: 6 },
  { id: "m-zhou", author: "周策", avatar: "周", color: "#8757f2", text: "新版原型今天走完主链路，明天补异常状态。", time: "昨天", likes: ["林亦", "阿澈"], comments: [], image: "项目白板", location: "北京 · 望京", count: 3 },
];

let cryptoAssets = [
  { symbol: "BTC", name: "Bitcoin", logo: "btc", mark: "₿", networks: ["Bitcoin"], amount: "0.28452", fiat: "$29,846.23", change: "+2.8%", color: "#f7931a" },
  { symbol: "ETH", name: "Ethereum", logo: "eth", mark: "◆", networks: ["Ethereum", "Base", "Arbitrum", "OP Mainnet"], amount: "4.1820", fiat: "$18,402.10", change: "+1.4%", color: "#627eea" },
  { symbol: "USDT", name: "Tether USD", logo: "usdt", mark: "₮", networks: ["Ethereum", "TRON", "Solana", "Avalanche", "Polygon", "TON"], amount: "12,480.00", fiat: "$12,480.00", change: "0.0%", color: "#26a17b" },
  { symbol: "USDC", name: "USD Coin", logo: "usdc", mark: "$", networks: ["Ethereum", "Solana", "Base", "Arbitrum", "OP Mainnet", "Polygon PoS", "Avalanche", "Sui"], amount: "8,250.00", fiat: "$8,250.00", change: "0.0%", color: "#2775ca" },
  { symbol: "BNB", name: "BNB", logo: "bnb", mark: "◆", networks: ["BNB Smart Chain"], amount: "18.36", fiat: "$12,644.22", change: "+1.1%", color: "#f3ba2f" },
  { symbol: "SOL", name: "Solana", logo: "sol", mark: "≋", networks: ["Solana"], amount: "96.40", fiat: "$15,128.92", change: "-0.6%", color: "#14f195" },
  { symbol: "XRP", name: "XRP", logo: "xrp", mark: "X", networks: ["XRP Ledger"], amount: "2,400.00", fiat: "$5,016.00", change: "+0.7%", color: "#23292f" },
  { symbol: "TRX", name: "TRON", logo: "trx", mark: "△", networks: ["TRON"], amount: "18,420.00", fiat: "$2,873.52", change: "+0.4%", color: "#ff0013" },
  { symbol: "TON", name: "Toncoin", logo: "ton", mark: "◆", networks: ["TON"], amount: "420.00", fiat: "$1,911.00", change: "+2.1%", color: "#0098ea" },
  { symbol: "AVAX", name: "Avalanche", logo: "avax", mark: "A", networks: ["Avalanche C-Chain"], amount: "88.20", fiat: "$2,822.40", change: "-0.8%", color: "#e84142" },
  { symbol: "POL", name: "Polygon Ecosystem Token", logo: "pol", mark: "∞", networks: ["Polygon PoS"], amount: "3,600.00", fiat: "$2,016.00", change: "+0.5%", color: "#8247e5" },
  { symbol: "ARB", name: "Arbitrum", logo: "arb", mark: "A", networks: ["Arbitrum One"], amount: "1,840.00", fiat: "$1,674.40", change: "+1.6%", color: "#28a0f0" },
  { symbol: "OP", name: "Optimism", logo: "op", mark: "OP", networks: ["OP Mainnet"], amount: "960.00", fiat: "$1,344.00", change: "+0.9%", color: "#ff0420" },
];

let walletNetworks = [
  { id: "bitcoin", name: "Bitcoin", fee: "$2.14", speed: "20 min", status: "Stable", color: "#f7931a" },
  { id: "ethereum", name: "Ethereum", fee: "$3.28", speed: "45 sec", status: "Busy", color: "#627eea" },
  { id: "solana", name: "Solana", fee: "$0.01", speed: "4 sec", status: "Fast", color: "#8a5cff" },
  { id: "tron", name: "TRON", fee: "$1.00", speed: "20 sec", status: "Stable", color: "#26a17b" },
];

let walletTransactions = [
  { id: "tx-1", type: "receive", symbol: "BTC", amount: "+0.0182", fiat: "$1,912.40", peer: "bc1q...92p", status: "Confirmed", time: "10:24" },
  { id: "tx-2", type: "swap", symbol: "ETH", amount: "+0.0384", fiat: "$120.00", peer: "USDT → ETH", status: "Completed", time: "昨天" },
  { id: "tx-3", type: "send", symbol: "USDT", amount: "-200.00", fiat: "$200.00", peer: "TQ9z...7k3", status: "Pending", time: "周一" },
];

let walletDefiPositions = [
  { id: "defi-eth", assetSymbol: "ETH", name: "质押仓位", nameEn: "Liquid staking", value: "$9,180.00", meta: "年化 3.8%", metaEn: "APY 3.8%" },
  { id: "defi-usdt", assetSymbol: "USDT", name: "稳定池", nameEn: "Stable pool", value: "$12,480.00", meta: "年化 4.2%", metaEn: "APY 4.2%" },
  { id: "defi-btc", assetSymbol: "BTC", name: "保管仓", nameEn: "Vault", value: "$29,846.23", meta: "仓位 0.28452 BTC", metaEn: "Position 0.28452 BTC" },
];

let walletNftCollections = [
  { id: "nft-pass", name: "Glass Pass", nameEn: "Glass Pass", count: "12", floor: "0.42 ETH", color: "#4f7cff" },
  { id: "nft-signal", name: "Signal Cards", nameEn: "Signal Cards", count: "8", floor: "0.18 ETH", color: "#12b7a6" },
  { id: "nft-access", name: "Access Badges", nameEn: "Access Badges", count: "5", floor: "0.09 ETH", color: "#f3a23a" },
];

let walletContacts = [
  { id: "song", name: "宋星河", nameEn: "Song Xinghe", avatar: "宋", color: "#5b7cfa", address: "TQ9z...GLASS...7k3", network: "TRON" },
  { id: "yue", name: "岳知秋", nameEn: "Yue Zhiqiu", avatar: "岳", color: "#c05cff", address: "0x71a...glass...2f9", network: "Ethereum" },
  { id: "chen", name: "陈未", nameEn: "Chen Wei", avatar: "陈", color: "#ff8a3d", address: "SoL4...glass...83p", network: "Solana" },
];

let walletSummary = {
  name: "全球钱包",
  nameEn: "Global Wallet",
  account: "主钱包",
  accountEn: "Main wallet",
  total: "$81,773.25",
  summary: "24h +$1,248.62 · 多链模拟资产",
  summaryEn: "24h +$1,248.62 · Multi-chain mock assets",
};

let walletFlowConfig = {
  receive: {
    assetSymbol: "BTC",
    address: "mock-btc-receive-address-not-for-funds",
    addressShort: "mock-btc...not-for-funds",
    incoming: "2 pending",
  },
  pay: {
    assetSymbols: ["USDT", "ETH", "BTC"],
    address: "mock-tron-pay-address-not-for-funds",
    amount: "120.00",
    fee: "1.00 USDT",
    feeMeta: "TRON · 20 sec",
    available: "$19,880",
  },
  transfer: {
    assetSymbols: ["USDT", "ETH", "SOL"],
    amount: "200.00",
    memo: "Mock transfer note",
    fee: "$1.00",
    feeMeta: "TRON · 20 sec",
  },
  swap: {
    fromSymbol: "USDT",
    toSymbol: "ETH",
    fromAmount: "120.00",
    toAmount: "0.0384",
    rate: "1 ETH ≈ 3,125 USDT",
    route: ["TRON", "Bridge", "Ethereum"],
    slippage: "0.5%",
    bridge: "Auto route",
    fee: "$2.42",
    estimate: "2 min",
  },
};

let videoFeed = [
  { id: "v-song", author: "宋星河", avatar: "宋", color: "#5b7cfa", title: "彩排片段", caption: "三分钟桥段压缩版，鼓点进来以后镜头贴近。", likes: "12.8w", comments: "2,431", saves: "8,102", tag: "音乐现场", tone: "stage" },
  { id: "v-yue", author: "岳知秋", avatar: "岳", color: "#c05cff", title: "幕后日记", caption: "收工前最后一条，玻璃反光刚好落在侧脸。", likes: "8.6w", comments: "1,204", saves: "3,087", tag: "片场", tone: "film" },
  { id: "v-qiao", author: "乔以南", avatar: "乔", color: "#e06b32", title: "分镜课", caption: "竖屏内容也要有前景、中景、背景，不要只有大头。", likes: "5.2w", comments: "903", saves: "2,212", tag: "创作", tone: "studio" },
];

let nearbyPlaces = [
  { id: "near-live", title: "城市直播间", titleEn: "City Live Room", meta: "1.2 km · 38 人在线", metaEn: "1.2 km · 38 online", tone: "live", color: "#ef4c68" },
  { id: "near-cafe", title: "玻璃咖啡", titleEn: "Glass Cafe", meta: "0.8 km · 朋友去过", metaEn: "0.8 km · friends visited", tone: "cafe", color: "#12b7a6" },
  { id: "near-studio", title: "共创工作室", titleEn: "Creator Studio", meta: "2.4 km · 本周活动", metaEn: "2.4 km · events this week", tone: "studio", color: "#4f7cff" },
];

let pluginGroups = {
  recent: [
    { id: "tickets", name: "票务助手", nameEn: "Ticket Helper", desc: "演出、电影、行程", descEn: "Shows, movies, trips", color: "#7c5cff" },
    { id: "minutes", name: "会议纪要", nameEn: "Meeting Notes", desc: "语音转文字与摘要", descEn: "Voice notes and summaries", color: "#12b7a6" },
    { id: "scanner", name: "文档扫描", nameEn: "Doc Scanner", desc: "拍照、裁切、归档", descEn: "Capture, crop, archive", color: "#4f7cff" },
    { id: "coffee", name: "咖啡点单", nameEn: "Coffee Order", desc: "到店自取", descEn: "Pickup order", color: "#f3a23a" },
  ],
  suggested: [
    { id: "bike", name: "共享单车", nameEn: "Bike Share", desc: "附近车辆", descEn: "Nearby bikes", color: "#12a0aa" },
    { id: "parcel", name: "快递钱包", nameEn: "Parcel Wallet", desc: "物流与保价", descEn: "Delivery and cover", color: "#8757f2" },
    { id: "weather", name: "天气卡片", nameEn: "Weather Card", desc: "未来 24 小时", descEn: "Next 24 hours", color: "#5b7cfa" },
    { id: "ledger", name: "记账本", nameEn: "Ledger", desc: "多人分账", descEn: "Shared expenses", color: "#ff725c" },
  ],
};

let gameCards = [
  { id: "runner", name: "光轨冲刺", nameEn: "Light Runner", score: "8,420", reward: "120 pts", color: "#4f7cff" },
  { id: "puzzle", name: "玻璃拼图", nameEn: "Glass Puzzle", score: "6,980", reward: "80 pts", color: "#12b7a6" },
  { id: "duel", name: "好友对战", nameEn: "Friend Duel", score: "5,210", reward: "50 pts", color: "#ef4c68" },
];

let accountDevices = [
  { id: "mac", name: "MacBook Pro", nameEn: "MacBook Pro", meta: "当前设备 · 柏林", metaEn: "Current device · Berlin", status: "online", color: "#4f7cff" },
  { id: "phone", name: "iPhone", nameEn: "iPhone", meta: "昨天 22:18 · 上海", metaEn: "Yesterday 22:18 · Shanghai", status: "trusted", color: "#12b7a6" },
  { id: "web", name: "Web Session", nameEn: "Web Session", meta: "3 天前 · 新加坡", metaEn: "3 days ago · Singapore", status: "review", color: "#f3a23a" },
];

let storageBuckets = [
  { id: "history", name: "聊天记录", nameEn: "Chat history", size: "1.8 GB", width: "72%", color: "#12b7a6" },
  { id: "cache", name: "缓存", nameEn: "Cache", size: "318 MB", width: "18%", color: "#4f7cff" },
  { id: "media", name: "图片与视频", nameEn: "Images & video", size: "240 MB", width: "10%", color: "#f3a23a" },
];

let savedItems = [
  { id: "saved-1", type: "IMG", title: "视觉走查截图", titleEn: "Visual QA screenshot", meta: "PNG · 1.1 MB", color: "#4f7cff" },
  { id: "saved-2", type: "LINK", title: "产品资料链接", titleEn: "Product reference link", meta: "example.local", color: "#12b7a6" },
  { id: "saved-3", type: "DOC", title: "会议纪要", titleEn: "Meeting notes", meta: "TXT · 12 KB", color: "#f3a23a" },
];

let passItems = [
  { id: "coffee", title: "星选咖啡会员卡", titleEn: "Star Select Coffee", meta: "可用券 2", metaEn: "2 coupons", color: "#7c5cff" },
  { id: "movie", title: "电影票券", titleEn: "Movie ticket", meta: "本周五 19:40", metaEn: "Fri 19:40", color: "#ef4c68" },
  { id: "boarding", title: "登机牌", titleEn: "Boarding pass", meta: "SHA → SZX", metaEn: "SHA → SZX", color: "#12b7a6" },
];

let stickerPacks = [
  { id: "work", title: "职场贴纸", titleEn: "Work stickers", count: "24", color: "#4f7cff" },
  { id: "festival", title: "节日贴纸", titleEn: "Festival stickers", count: "18", color: "#f3a23a" },
  { id: "motion", title: "动态贴纸", titleEn: "Motion stickers", count: "32", color: "#12b7a6" },
];

let helpTopics = [
  { id: "faq", title: "常见问题", titleEn: "FAQ", meta: "18 条", metaEn: "18 articles" },
  { id: "feedback", title: "意见反馈", titleEn: "Feedback", meta: "3 条记录", metaEn: "3 records" },
  { id: "repair", title: "故障修复", titleEn: "Repair tools", meta: "网络 / 通知 / 存储", metaEn: "Network / notices / storage" },
];

let modules = {
  newFriends: { title: "连接请求", hint: "好友申请、添加记录", kind: "requests" },
  groups: { title: "群组", hint: "你加入的群组", kind: "groups" },
  tags: { title: "分组标签", hint: "按关系管理联系人", kind: "tags" },
  officialAccounts: { title: "频道", hint: "订阅频道与服务频道", kind: "official" },
  moments: { title: "动态", hint: "好友动态", kind: "moments" },
  channels: { title: "视频流", hint: "关注、推荐、直播", kind: "channels" },
  scan: { title: "扫描", hint: "二维码 / 条码 / 翻译", kind: "scan" },
  nearby: { title: "附近", hint: "附近的人与直播", kind: "nearby" },
  miniPrograms: { title: "插件", hint: "最近使用与推荐", kind: "mini" },
  games: { title: "游戏", hint: "好友排行与礼包", kind: "games" },
  pay: { title: "钱包", hint: "多链资产与加密支付", kind: "pay" },
  favorites: { title: "收藏", hint: "按类型归档", kind: "favorites" },
  myMoments: { title: "动态", hint: "个人相册", kind: "myMoments" },
  cards: { title: "凭证", hint: "票券、会员卡、证件", kind: "cards" },
  stickers: { title: "贴纸", hint: "最近使用与商店", kind: "stickers" },
  settings: { title: "设置", hint: "账号、安全、隐私、通用", kind: "settings" },
  chatSearch: { title: "查找聊天内容", hint: "按类型筛选当前会话", kind: "chatSearch" },
  chatFiles: { title: "聊天文件", hint: "文件、图片、链接、音乐", kind: "chatFiles" },
  groupManage: { title: "群管理", hint: "成员、公告、群二维码、邀请确认", kind: "groupManage" },
  remarkTags: { title: "备注和分组标签", hint: "联系人备注、描述、电话、分组标签", kind: "remarkTags" },
  friendPrivacy: { title: "朋友权限", hint: "聊天、动态、视频动态权限", kind: "friendPrivacy" },
  accountSecurity: { title: "账号与安全", hint: "账号信息、登录设备、安全中心", kind: "accountSecurity" },
  notificationSettings: { title: "新消息通知", hint: "消息提醒、声音、横幅、详情显示", kind: "notificationSettings" },
  chatSettings: { title: "聊天", hint: "聊天记录、迁移、快捷输入、背景", kind: "chatSettings" },
  privacySettings: { title: "隐私", hint: "添加方式、动态、黑名单、授权", kind: "privacySettings" },
  generalSettings: { title: "通用", hint: "多语言、字体、照片视频、辅助功能", kind: "generalSettings" },
  storageSettings: { title: "存储空间", hint: "缓存、聊天记录、清理建议", kind: "storageSettings" },
  about: { title: "关于", hint: "版本、功能介绍、开源声明", kind: "about" },
  addFriend: { title: "添加联系人", hint: "Chat ID、手机号、群组、二维码", kind: "addFriend" },
  payCode: { title: "收款", hint: "多链地址、二维码、收款记录", kind: "payCode" },
  sendCrypto: { title: "付款", hint: "地址、扫码、网络费确认", kind: "sendCrypto" },
  transfer: { title: "转账", hint: "联系人转账与链上转账确认", kind: "transfer" },
  swapCrypto: { title: "兑换", hint: "跨链兑换、滑点、报价路由", kind: "swapCrypto" },
  help: { title: "帮助与反馈", hint: "常见问题、反馈记录、诊断工具", kind: "help" },
};

const isMobileViewport = () => window.matchMedia("(max-width: 760px)").matches;

function applyTheme(theme = {}) {
  Object.entries(theme).forEach(([key, value]) => {
    if (value == null) return;
    const cssVar = key.startsWith("--") ? key : `--${key.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)}`;
    document.documentElement.style.setProperty(cssVar, value);
  });
}

function applyData(data = {}) {
  if (data.people) people = { ...people, ...data.people };
  if (data.chats) chats = data.chats;
  if (data.contactSections) contactSections = data.contactSections;
  if (data.contactRequests) contactRequests = data.contactRequests;
  if (data.contactLabels) contactLabels = data.contactLabels;
  if (data.channelSubscriptions) channelSubscriptions = data.channelSubscriptions;
  if (data.discoverItems) discoverItems = data.discoverItems;
  if (data.meItems) meItems = data.meItems;
  if (data.moments) moments = data.moments;
  if (data.cryptoAssets) cryptoAssets = data.cryptoAssets;
  if (data.walletNetworks) walletNetworks = data.walletNetworks;
  if (data.walletTransactions) walletTransactions = data.walletTransactions;
  if (data.walletDefiPositions) walletDefiPositions = data.walletDefiPositions;
  if (data.walletNftCollections) walletNftCollections = data.walletNftCollections;
  if (data.walletContacts) walletContacts = data.walletContacts;
  if (data.walletSummary) {
    const nextSummary = { ...data.walletSummary };
    if (nextSummary.name && !nextSummary.nameEn) nextSummary.nameEn = nextSummary.name;
    if (nextSummary.account && !nextSummary.accountEn) nextSummary.accountEn = nextSummary.account;
    if (nextSummary.summary && !nextSummary.summaryEn) nextSummary.summaryEn = nextSummary.summary;
    walletSummary = { ...walletSummary, ...nextSummary };
  }
  if (data.walletFlowConfig) {
    walletFlowConfig = {
      ...walletFlowConfig,
      ...data.walletFlowConfig,
      receive: { ...walletFlowConfig.receive, ...(data.walletFlowConfig.receive || {}) },
      pay: { ...walletFlowConfig.pay, ...(data.walletFlowConfig.pay || {}) },
      transfer: { ...walletFlowConfig.transfer, ...(data.walletFlowConfig.transfer || {}) },
      swap: { ...walletFlowConfig.swap, ...(data.walletFlowConfig.swap || {}) },
    };
  }
  if (data.videoFeed) videoFeed = data.videoFeed;
  if (data.nearbyPlaces) nearbyPlaces = data.nearbyPlaces;
  if (data.pluginGroups) pluginGroups = data.pluginGroups;
  if (data.gameCards) gameCards = data.gameCards;
  if (data.accountDevices) accountDevices = data.accountDevices;
  if (data.storageBuckets) storageBuckets = data.storageBuckets;
  if (data.savedItems) savedItems = data.savedItems;
  if (data.passItems) passItems = data.passItems;
  if (data.stickerPacks) stickerPacks = data.stickerPacks;
  if (data.helpTopics) helpTopics = data.helpTopics;
  if (data.modules) modules = { ...modules, ...data.modules };
  if (data.i18n) {
    Object.entries(data.i18n).forEach(([lang, dictionary]) => {
      i18n[lang] = { ...(i18n[lang] || {}), ...dictionary };
    });
  }
}

applyData(bootConfig.data);
applyTheme(bootConfig.theme);

const state = {
  view: "chats",
  route: "chat",
  activeChatId: "team",
  activePersonId: null,
  activePage: null,
  detailOpen: !isMobileViewport(),
  toolDrawer: false,
  mobileChatOpen: false,
  lang: bootConfig.lang || savedLang || systemLang(),
  replyTo: null,
  selectedMessageId: null,
  requestStatuses: {},
  blockedPeople: [],
  deletedPeople: [],
  hiddenPeople: [],
  likedMoments: [],
  savedVideos: [],
  walletTab: "assets",
  loading: false,
  error: null,
  surface: initialSurface,
  appearance: validAppearances.has(bootConfig.appearance || savedAppearance) ? bootConfig.appearance || savedAppearance : "system",
  density: validDensities.has(bootConfig.density) ? bootConfig.density : "comfortable",
};

let lastFocusedBeforeSheet = null;

if (bootConfig.initialView) state.view = bootConfig.initialView;

const els = {
  shell: document.querySelector("#appShell"),
  rail: document.querySelector("#railNav"),
  title: document.querySelector("#paneTitle"),
  hint: document.querySelector("#paneHint"),
  search: document.querySelector("#searchInput"),
  list: document.querySelector("#listContent"),
  work: document.querySelector("#workPane"),
  side: document.querySelector("#sidePane"),
  toast: document.querySelector("#toast"),
  overlay: document.querySelector("#overlay"),
  sheet: document.querySelector("#sheet"),
  plus: document.querySelector("#plusButton"),
  lang: document.querySelector("#languageButton"),
};

const activeChat = () => chats.find((chat) => chat.id === state.activeChatId) || chats[0];
const person = (id) => people[id] || people.self;
const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);
const messageId = (message, index) => message.id || `${message.from || "system"}-${index}-${String(message.text || message.type || "msg").slice(0, 8)}`;
const t = (key, vars = {}) => {
  const fallback = typeof vars === "string" ? vars : key;
  const replacements = typeof vars === "object" && vars !== null ? vars : {};
  const template = i18n[state.lang]?.[key] || i18n.zh[key] || fallback;
  return Object.entries(replacements).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, value), template);
};

function focusableWithin(root) {
  return [...root.querySelectorAll("a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])")]
    .filter((element) => element.offsetParent !== null || element === document.activeElement);
}

function normalizeInteractiveElements(root = document) {
  root.querySelectorAll("button:not([type])").forEach((button) => {
    button.type = "button";
  });
  root.querySelectorAll("[data-mobile-back]").forEach((button) => {
    button.setAttribute("aria-label", state.lang === "zh" ? "返回" : "Back");
  });
  root.querySelectorAll("[data-close-sheet]").forEach((button) => {
    button.setAttribute("aria-label", state.lang === "zh" ? "关闭" : "Close");
  });
  root.querySelectorAll("input[type='checkbox']").forEach((input) => {
    if (!input.getAttribute("aria-label")) {
      const label = input.closest("label")?.textContent.trim() || input.closest("button")?.textContent.trim() || "Toggle";
      input.setAttribute("aria-label", label);
    }
  });
  root.querySelectorAll("input, select, textarea").forEach((control) => {
    if (control.closest("label") || control.getAttribute("aria-label")) return;
    const label = control.getAttribute("placeholder") || control.closest(".search-large")?.textContent.trim() || control.name || control.type || "Input";
    control.setAttribute("aria-label", label);
  });
}
const itemLabel = (item) => t(`item.${item.id}.label`, item.label || item.id);
const itemDesc = (item) => t(`item.${item.id}.desc`, item.desc || "");
const pageTitle = (id, page) => t(`page.${id}.title`, page.title);
const pageHint = (id, page) => t(`page.${id}.hint`, page.hint);
const pageEventPayload = (id) => {
  const page = modules[id] || modules.settings;
  return { kind: page.kind, title: pageTitle(id, page), hint: pageHint(id, page) };
};
const localText = (item, key) => state.lang === "en" && item[`${key}En`] ? item[`${key}En`] : item[key];
const eventSubscribers = new Set();

function toggleId(list, id, force) {
  const exists = list.includes(id);
  if (force === true || (!exists && force !== false)) list.push(id);
  if (force === false || (exists && force !== true)) list.splice(list.indexOf(id), 1);
}

function contactIds() {
  return [...new Set(contactSections.flatMap((section) => section.items.map((item) => item.person).filter(Boolean)))].filter((id) => !state.deletedPeople.includes(id));
}

function contactSortKey(p) {
  return p.sortKey || p.name || p.chatId || p.id;
}

function contactIndexLabel(p) {
  const first = contactSortKey(p).trim().charAt(0).toUpperCase();
  return /^[A-Z0-9]$/.test(first) ? first : "#";
}

function contactGroups() {
  const collator = new Intl.Collator(state.lang === "zh" ? "zh-Hans-CN" : "en", { sensitivity: "base", numeric: true });
  return contactIds()
    .map(person)
    .sort((a, b) => collator.compare(contactSortKey(a), contactSortKey(b)))
    .reduce((groups, p) => {
      const letter = contactIndexLabel(p);
      groups[letter] = groups[letter] || [];
      groups[letter].push(p);
      return groups;
    }, {});
}

function requestStatus(request) {
  return state.requestStatuses[request.id] || request.status || "pending";
}

function relationStatus(id) {
  if (state.deletedPeople.includes(id)) return t("contact.deleted");
  if (state.blockedPeople.includes(id)) return t("contact.blocked");
  return t("contact.normal");
}

function snapshotState() {
  const resolvedTheme = state.appearance === "system" ? systemAppearance() : state.appearance;
  return {
    view: state.view,
    route: state.route,
    activeChatId: state.activeChatId,
    activePersonId: state.activePersonId,
    activePage: state.activePage,
    walletTab: state.walletTab,
    lang: state.lang,
    version: GLASS_IM_VERSION,
    surface: state.surface,
    appearance: state.appearance,
    resolvedTheme,
    density: state.density,
    blockedPeople: [...state.blockedPeople],
    deletedPeople: [...state.deletedPeople],
  };
}

function emit(type, payload = {}) {
  const event = { type, payload, state: snapshotState() };
  eventSubscribers.forEach((listener) => listener(event));
  if (typeof bootConfig.onEvent === "function") bootConfig.onEvent(event);
}

function statusBanner() {
  if (state.loading) return `<div class="status-banner loading">${t("common.loading")}</div>`;
  if (state.error) return `<button class="status-banner error" type="button" data-action="retryData">${t("common.error")}</button>`;
  return "";
}

function currentReplyMessage() {
  const chat = activeChat();
  return (chat.messages || []).find((message, index) => messageId(message, index) === state.replyTo) || null;
}

function navigate(target) {
  if (!target) return;
  if (typeof target === "string") {
    const [kind, id] = target.replace(/^#/, "").split(":");
    if (kind === "chat") openChat(id);
    if (kind === "person") openPerson(id);
    if (kind === "page") openPage(id);
    return;
  }
  if (target.type === "chat") openChat(target.id);
  if (target.type === "person") openPerson(target.id);
  if (target.type === "page") openPage(target.id);
  if (target.type === "view") setView(target.id);
}

function avatarMarkup(entity, className = "avatar") {
  return `<span class="${className}" style="--avatar-color:${entity.color}">${esc(entity.avatar)}</span>`;
}

function iconMarkup(icon, color) {
  return `<span class="tile-icon glyph-${esc(icon)}" style="--avatar-color:${color}" aria-hidden="true"></span>`;
}

function toast(text) {
  els.toast.textContent = text;
  els.toast.classList.add("show");
  window.clearTimeout(toast.timer);
  toast.timer = window.setTimeout(() => els.toast.classList.remove("show"), 1800);
}

function setView(view) {
  state.view = view;
  state.mobileChatOpen = false;
  state.toolDrawer = false;
  if (view === "chats") {
    state.route = "chat";
  } else {
    state.route = "empty";
    state.activePage = null;
    state.activePersonId = null;
  }
  els.search.value = "";
  render();
  emit("view:change", { view });
}

function openChat(id) {
  state.view = "chats";
  state.route = "chat";
  state.activeChatId = id;
  state.mobileChatOpen = true;
  if (isMobileViewport()) state.detailOpen = false;
  const chat = activeChat();
  chat.unread = 0;
  render();
  emit("chat:open", { chatId: id, chat });
}

function openPerson(id) {
  state.view = id === "self" ? "me" : "contacts";
  state.route = "person";
  state.activePersonId = id;
  state.mobileChatOpen = true;
  if (isMobileViewport()) state.detailOpen = false;
  render();
  emit("person:open", { personId: id, person: person(id) });
}

function viewForPage(id) {
  const meDeepPages = [
    "payCode",
    "sendCrypto",
    "transfer",
    "swapCrypto",
    "accountSecurity",
    "notificationSettings",
    "chatSettings",
    "privacySettings",
    "generalSettings",
    "storageSettings",
    "about",
    "help",
    "favorites",
    "cards",
    "stickers",
    "myMoments",
  ];
  if (meItems.some((item) => item.page === id) || meDeepPages.includes(id)) return "me";
  if (discoverItems.some((item) => item.page === id)) return "discover";
  if (["newFriends", "groups", "tags", "officialAccounts", "remarkTags", "friendPrivacy"].includes(id)) return "contacts";
  if (contactSections.some((section) => section.items.some((item) => item.page === id))) return "contacts";
  return state.view;
}

function openPage(id) {
  state.view = viewForPage(id);
  state.route = "page";
  state.activePage = id;
  state.mobileChatOpen = true;
  if (isMobileViewport()) state.detailOpen = false;
  render();
  emit("page:open", { pageId: id, page: pageEventPayload(id) });
}

function openSheet(kind) {
  lastFocusedBeforeSheet = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  els.overlay.hidden = false;
  els.sheet.hidden = false;
  els.overlay.setAttribute("aria-hidden", "false");
  els.sheet.setAttribute("role", "dialog");
  els.sheet.setAttribute("aria-modal", "true");
  els.sheet.setAttribute("tabindex", "-1");
  if (kind === "plus") {
    els.sheet.innerHTML = `
      <header class="sheet-head"><h3>${t("sheet.title")}</h3><button type="button" data-close-sheet>×</button></header>
      <div class="action-grid">
        ${[
          [t("sheet.group"), "group", "startGroup"],
          [t("sheet.add"), "add", "page:addFriend"],
          [t("sheet.scan"), "scan", "page:scan"],
          [t("sheet.receive"), "receive", "page:payCode"],
          [t("sheet.help"), "help", "page:help"],
          [t("sheet.desktop"), "desktop", "desktop"],
        ]
          .map(([label, icon, action]) => {
            const href = action.startsWith("page:") ? ` href="#page:${action.split(":")[1]}"` : ` href="#action:${encodeURIComponent(action)}"`;
            return `<a class="action-card" ${href} data-action="${action}">${iconMarkup(icon, "#12b7a6")}<span>${label}</span></a>`;
          })
          .join("")}
      </div>`;
  }
  if (kind === "message") {
    els.sheet.innerHTML = `
      <header class="sheet-head"><h3>${t("msg.actions")}</h3><button type="button" data-close-sheet>×</button></header>
      <div class="action-grid message-action-grid">
        ${[
          [t("msg.reply"), "reply"],
          [t("msg.forward"), "forward"],
          [t("msg.save"), "save"],
          [t("msg.copy"), "copy"],
          [t("msg.delete"), "delete"],
        ].map(([label, action]) => `<button class="action-card" type="button" data-message-action="${action}">${iconMarkup(action === "reply" ? "broadcast" : action === "save" ? "bookmark" : action === "delete" ? "settings" : "plugin", "#12b7a6")}<span>${label}</span></button>`).join("")}
      </div>`;
  }
  normalizeInteractiveElements(els.sheet);
  (focusableWithin(els.sheet)[0] || els.sheet).focus({ preventScroll: true });
}

function closeSheet() {
  const shouldRestoreFocus = !els.sheet.hidden;
  els.overlay.hidden = true;
  els.sheet.hidden = true;
  els.overlay.setAttribute("aria-hidden", "true");
  els.sheet.removeAttribute("role");
  els.sheet.removeAttribute("aria-modal");
  els.sheet.removeAttribute("tabindex");
  els.sheet.innerHTML = "";
  if (shouldRestoreFocus && lastFocusedBeforeSheet?.isConnected) {
    lastFocusedBeforeSheet.focus({ preventScroll: true });
  }
  lastFocusedBeforeSheet = null;
}

function closeMobileLayer() {
  if (!isMobileViewport() || !state.mobileChatOpen) return false;
  state.mobileChatOpen = false;
  state.detailOpen = false;
  renderShellState();
  return true;
}

function renderRail() {
  els.rail.innerHTML = navItems
    .map((item) => `
      <button class="rail-icon ${state.view === item.id ? "active" : ""}" type="button" data-view="${item.id}" aria-label="${t(`nav.${item.id}`)}">
        <span class="icon ${item.icon}"></span>
        <em>${t(`nav.${item.id}`)}</em>
      </button>`)
    .join("");
}

function listMatch(text) {
  const query = els.search.value.trim().toLowerCase();
  return !query || text.toLowerCase().includes(query);
}

function renderChatList() {
  els.title.textContent = t("nav.chats");
  els.hint.textContent = t("hint.chats", { count: chats.length });
  const filtered = chats.filter((chat) => listMatch(`${chat.title} ${chat.preview} ${chat.subtitle}`));
  const body = filtered.length
    ? filtered.map((chat) => `
      <a class="list-item chat-row ${chat.id === state.activeChatId ? "active" : ""}" href="#chat:${chat.id}" data-chat="${chat.id}">
        ${avatarMarkup(chat)}
        <span class="item-copy">
          <span class="item-title">${chat.pinned ? '<i class="pin">顶</i>' : ""}${esc(chat.title)}${chat.unread ? `<b class="badge">${chat.unread}</b>` : ""}</span>
          <span class="item-sub">${chat.typing ? `<i class="typing-dot"></i>` : ""}${esc(chat.typing || chat.preview)}</span>
        </span>
        <time>${esc(chat.time)}</time>
      </a>`).join("")
    : `<p class="empty">${t("common.noChat")}</p>`;
  els.list.innerHTML = statusBanner() + body;
}

function renderContactsList() {
  els.title.textContent = t("nav.contacts");
  els.hint.textContent = t("hint.contacts");
  const commonSections = contactSections.filter((section) => section.items.some((item) => !item.person));
  const commonHtml = commonSections.map((section) => {
    const rows = section.items
      .filter((item) => !item.person)
      .filter((item) => {
        return listMatch(`${itemLabel(item)} ${itemDesc(item)}`);
      })
      .map((item) => {
        return `<a class="list-item nav-row" href="#page:${item.page}" data-page="${item.page}">${iconMarkup(item.icon, item.color)}<span class="item-copy"><span class="item-title">${esc(itemLabel(item))}</span><span class="item-sub">${esc(itemDesc(item))}</span></span></a>`;
      })
      .join("");
    return rows ? `<div class="section-label">${esc(section.titleKey ? t(section.titleKey) : section.title)}</div><div class="row-group">${rows}</div>` : "";
  }).join("");
  const groups = contactGroups();
  const directoryHtml = Object.entries(groups).map(([letter, persons]) => {
    const rows = persons
      .filter((p) => listMatch(`${p.name} ${p.title} ${p.chatId}`))
      .map((p) => `<a class="list-item nav-row" href="#person:${p.id}" data-person="${p.id}">${avatarMarkup(p)}<span class="item-copy"><span class="item-title">${esc(p.name)}${state.blockedPeople.includes(p.id) ? `<i class="status-dot"></i>` : ""}</span><span class="item-sub">${esc(p.title)} · ${esc(p.region)}</span></span></a>`)
      .join("");
    return rows ? `<div class="section-label">${esc(letter)}</div><div class="row-group contact-directory">${rows}</div>` : "";
  }).join("");
  const summary = `<div class="contact-summary"><span>${t("contact.directory")}</span><em>${t("contact.members", { count: contactIds().length })}</em></div>`;
  els.list.innerHTML = statusBanner() + commonHtml + summary + (directoryHtml || `<p class="empty">${t("common.noContact")}</p>`);
}

function renderModuleList(items, title, hint) {
  els.title.textContent = title;
  els.hint.textContent = hint;
  const filtered = items.filter((item) => listMatch(`${itemLabel(item)} ${itemDesc(item)}`));
  const body = filtered.length
    ? `<div class="row-group row-spaced">${filtered.map((item) => `
      <a class="list-item nav-row" href="#page:${item.page}" data-page="${item.page}">
        ${iconMarkup(item.icon, item.color)}
        <span class="item-copy"><span class="item-title">${esc(itemLabel(item))}</span><span class="item-sub">${esc(itemDesc(item))}</span></span>
        <span class="chevron">›</span>
      </a>`).join("")}</div>`
    : `<p class="empty">${t("common.noContent")}</p>`;
  els.list.innerHTML = statusBanner() + body;
}

function renderMeList() {
  els.title.textContent = t("nav.me");
  els.hint.textContent = people.self.status;
  const self = people.self;
  const profile = `
    <a class="me-profile" href="#person:self" data-person="self">
      ${avatarMarkup(self, "avatar large")}
      <span><strong>${esc(self.name)}</strong><small>Chat ID：${esc(self.chatId)}</small></span>
      <span class="qr-dot"></span>
    </a>`;
  const rows = meItems
    .filter((item) => listMatch(`${itemLabel(item)} ${itemDesc(item)}`))
    .map((item) => `<a class="list-item nav-row" href="#page:${item.page}" data-page="${item.page}">${iconMarkup(item.icon, item.color)}<span class="item-copy"><span class="item-title">${esc(itemLabel(item))}</span><span class="item-sub">${esc(itemDesc(item))}</span></span><span class="chevron">›</span></a>`)
    .join("");
  els.list.innerHTML = statusBanner() + profile + `<div class="row-group row-spaced">${rows}</div>`;
}

function renderList() {
  if (state.view === "chats") renderChatList();
  if (state.view === "contacts") renderContactsList();
  if (state.view === "discover") renderModuleList(discoverItems, t("nav.discover"), t("hint.discover"));
  if (state.view === "me") renderMeList();
  bindListActions();
}

function bindListActions() {
  els.list.querySelectorAll("[data-chat]").forEach((button) => {
    button.addEventListener("click", () => openChat(button.dataset.chat));
  });
  els.list.querySelectorAll("[data-person]").forEach((button) => {
    button.addEventListener("click", () => openPerson(button.dataset.person));
  });
  els.list.querySelectorAll("[data-page]").forEach((button) => {
    button.addEventListener("click", () => openPage(button.dataset.page));
  });
}

function renderMessage(message, index) {
  if (message.type === "date") return `<div class="date-chip">${esc(message.text)}</div>`;
  const p = person(message.from);
  const outgoing = message.from === "self";
  const id = messageId(message, index);
  const status = outgoing ? `<span class="message-status">${esc(message.status === "read" ? t("msg.read") : t("msg.delivered"))}</span>` : "";
  const reply = message.replyTo ? `<div class="reply-quote">${esc(message.replyTo)}</div>` : "";
  const attachment = renderMessageAttachment(message);
  const reactions = message.reactions?.length ? `<div class="reaction-row">${message.reactions.map((item) => `<span>${esc(item)}</span>`).join("")}</div>` : "";
  return `
    <article class="message ${outgoing ? "out" : "in"}" data-message-id="${esc(id)}">
      ${avatarMarkup(p, "avatar message-avatar")}
      <div class="message-body">
        <span class="message-name">${esc(p.name)}</span>
        <button class="bubble ${message.kind === "card" ? "card-bubble" : ""}" type="button" data-message-menu="${esc(id)}">
          ${reply}
          <p>${esc(message.text)}</p>
          ${attachment}
          ${message.kind === "card" ? `<button type="button" data-action="card">${esc(message.action)}</button>` : ""}
        </button>
        ${reactions}
        ${status}
      </div>
    </article>`;
}

function renderMessageAttachment(message) {
  if (message.kind === "image") return `<div class="message-attachment image-attachment"><span>${esc(message.attachmentLabel || "IMG")}</span></div>`;
  if (message.kind === "file") return `<div class="message-attachment file-attachment"><strong>${esc(message.fileName || "file.dat")}</strong><small>${esc(message.fileMeta || "128 KB")}</small></div>`;
  if (message.kind === "location") return `<div class="message-attachment location-attachment"><span></span><strong>${esc(message.location || "Pinned location")}</strong></div>`;
  return "";
}

function renderChat() {
  const chat = activeChat();
  const chatMessages = chat.messages || [];
  const replyMessage = currentReplyMessage();
  els.work.innerHTML = `
    <header class="work-head">
      <button class="mobile-back" type="button" data-mobile-back>‹</button>
      <div><h2>${esc(chat.title)}</h2><p>${esc(chat.subtitle)}</p></div>
      <div class="head-actions">
        <button class="mini-button" type="button" data-action="call">通话</button>
        <button class="dots-button ${state.detailOpen ? "active" : ""}" type="button" data-toggle-detail aria-label="聊天详情"><span></span><span></span><span></span></button>
      </div>
    </header>
    <div class="messages" id="messageList">${chatMessages.length ? chatMessages.map(renderMessage).join("") : `<div class="chat-empty">${t("common.noContent")}</div>`}</div>
    <form class="composer" id="composer">
      <div class="compose-toolbar">
        ${[
          ["语音", "voice"],
          ["贴纸", "emoji"],
          ["图片", "image"],
          ["文件", "file"],
          ["更多", "more"],
        ].map(([label, tool]) => `<button type="button" data-tool="${tool}">${label}</button>`).join("")}
      </div>
      ${state.toolDrawer ? renderToolDrawer() : ""}
      ${replyMessage ? `<div class="reply-preview"><span>${t("chat.replying")} ${esc(person(replyMessage.from).name)}：${esc(replyMessage.text.slice(0, 42))}</span><button type="button" data-cancel-reply>${t("chat.cancel")}</button></div>` : ""}
      <textarea id="messageInput" placeholder="输入消息，Enter 发送，Shift + Enter 换行"></textarea>
      <div class="compose-foot"><span>${t("chat.online")}</span><button type="submit">${t("chat.send")}</button></div>
    </form>`;
  renderSideChat(chat);
  const messageList = document.querySelector("#messageList");
  if (messageList) messageList.scrollTop = messageList.scrollHeight;
}

function renderToolDrawer() {
  return `<div class="tool-drawer">
    ${[
      ["相册", "image"],
      ["拍摄", "camera"],
      ["视频通话", "video"],
      ["位置", "nearby"],
      ["红包", "gift"],
      ["转账", "transfer"],
      ["收藏", "bookmark"],
      ["名片", "pass"],
    ].map(([label, icon]) => `<button type="button" data-quick="[${label}]"><span class="tool-glyph glyph-${icon}" aria-hidden="true"></span><em>${label}</em></button>`).join("")}
  </div>`;
}

function appendSimulatedMessage(kind, label) {
  const chat = activeChat();
  if (!chat.messages) chat.messages = [];
  const base = { id: `m-${Date.now()}`, from: "self", text: label, status: "delivered" };
  if (kind === "image") chat.messages.push({ ...base, kind: "image", attachmentLabel: label });
  else if (kind === "file") chat.messages.push({ ...base, kind: "file", fileName: `${label}.pdf`, fileMeta: "248 KB" });
  else if (kind === "nearby") chat.messages.push({ ...base, kind: "location", location: "Shared location" });
  else chat.messages.push({ ...base, kind: "text" });
  chat.preview = `我：${label}`;
  chat.time = "刚刚";
  render();
  emit("message:send", { chatId: chat.id, text: label, kind });
}

function handleMessageAction(action) {
  const chat = activeChat();
  const chatMessages = chat.messages || [];
  const index = chatMessages.findIndex((message, i) => messageId(message, i) === state.selectedMessageId);
  const message = chatMessages[index];
  if (!message) return closeSheet();
  if (action === "reply") {
    state.replyTo = state.selectedMessageId;
    closeSheet();
    renderChat();
    document.querySelector("#messageInput")?.focus();
  } else if (action === "delete") {
    chatMessages.splice(index, 1);
    closeSheet();
    render();
  } else {
    closeSheet();
    toast(`${message.text} · ${action}`);
  }
  emit(`message:${action}`, { chatId: chat.id, messageId: state.selectedMessageId, text: message.text });
}

function handleRequestAction(button) {
  const id = button.dataset.requestId;
  const action = button.dataset.requestAction;
  const request = contactRequests.find((item) => item.id === id);
  if (!request) return;
  if (action === "message") {
    toast(`${localText(request, "name")} · ${t("contact.message")}`);
  } else {
    state.requestStatuses[id] = action === "ignore" ? "ignored" : "added";
    toast(`${localText(request, "name")} · ${action === "ignore" ? t("contact.ignore") : t("contact.added")}`);
    renderPage();
  }
  emit(`contact:request:${action}`, { requestId: id, request, status: state.requestStatuses[id] || request.status });
}

function handleContactAction(button) {
  const id = button.dataset.personId || state.activePersonId;
  const action = button.dataset.contactAction;
  if (!id) return;
  if (action === "toggleBlock") {
    toggleId(state.blockedPeople, id);
  } else if (action === "toggleHidden") {
    toggleId(state.hiddenPeople, id);
  } else if (action === "toggleDelete") {
    toggleId(state.deletedPeople, id);
    if (state.deletedPeople.includes(id)) toggleId(state.blockedPeople, id, false);
  }
  render();
  toast(`${person(id).name} · ${relationStatus(id)}`);
  emit("contact:update", { personId: id, action, relation: relationStatus(id) });
}

function handleLabelAction(button) {
  const label = contactLabels.find((item) => item.id === button.dataset.labelId);
  if (!label) return;
  toast(`${localText(label, "name")} · ${t("contact.members", { count: label.members.length })}`);
  emit("contact:label:open", { labelId: label.id, members: label.members });
}

function handleSocialAction(button) {
  const action = button.dataset.socialAction;
  const id = button.dataset.momentId;
  if (action === "like" && id) {
    toggleId(state.likedMoments, id);
    renderPage();
  }
  const label = action === "like" ? t("social.like") : action === "comment" ? t("social.comment") : action === "post" ? t("social.camera") : t("common.more");
  toast(`${label} · ${t("common.mockDone")}`);
  emit(`social:${action}`, { momentId: id || null });
}

function handleVideoAction(button) {
  const action = button.dataset.videoAction;
  const id = button.dataset.videoId;
  if (action === "save" && id) {
    toggleId(state.savedVideos, id);
    renderPage();
  }
  const label = action === "like" ? t("social.like") : action === "comment" ? t("social.comment") : action === "save" ? t("social.save") : t("social.share");
  toast(`${label} · ${t("common.mockDone")}`);
  emit(`video:${action}`, { videoId: id || null });
}

function handleWalletAction(button) {
  const action = button.dataset.walletAction;
  const id = button.dataset.asset || button.dataset.tx || button.dataset.walletContact || button.dataset.position || button.dataset.collection || null;
  const label = button.textContent.trim() || action;
  toast(`${label} · ${t("common.mockDone")}`);
  emit(`wallet:${action}`, { id, action });
}

function handleWalletTab(button) {
  state.walletTab = button.dataset.walletTab || "assets";
  renderPage();
  emit("wallet:tab", { tab: state.walletTab });
}

function switchWalletTabByKey(current, key) {
  const tabs = [...document.querySelectorAll("[data-wallet-tab]")];
  const index = tabs.indexOf(current);
  if (index < 0) return false;
  let nextIndex = index;
  if (key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
  else if (key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
  else if (key === "Home") nextIndex = 0;
  else if (key === "End") nextIndex = tabs.length - 1;
  else return false;
  handleWalletTab(tabs[nextIndex]);
  window.requestAnimationFrame(() => document.querySelector(`[data-wallet-tab="${tabs[nextIndex].dataset.walletTab}"]`)?.focus());
  return true;
}

function handleSettingsAction(button) {
  const action = button.dataset.settingsAction;
  const label = button.textContent.trim() || action;
  toast(`${label} · ${t("common.mockDone")}`);
  emit(`settings:${action}`, { action });
}

function renderSideChat(chat) {
  if (!state.detailOpen) {
    els.side.innerHTML = "";
    els.shell.classList.add("side-collapsed");
    return;
  }
  const chatFiles = chat.files || [];
  const chatMembers = chat.members || [];
  els.shell.classList.remove("side-collapsed");
  els.side.innerHTML = `
    <header class="side-head"><h3>聊天信息</h3><button type="button" data-toggle-detail>×</button></header>
    <section class="member-grid">
      ${chatMembers.map((id) => {
        const p = person(id);
        return `<button type="button" data-person="${p.id}">${avatarMarkup(p, "avatar member-avatar")}<span>${esc(p.name)}</span></button>`;
      }).join("")}
      <button class="add-member" type="button" data-action="addMember">+</button>
    </section>
    <section class="side-section"><h4>群公告</h4><p>${esc(chat.notice)}</p></section>
    <section class="side-section"><h4>查找聊天内容</h4><a class="side-search" href="#page:chatSearch">日期 / 图片 / 文件 / 链接 / 音乐 / 交易</a></section>
    <section class="side-section"><h4>聊天文件</h4>${chatFiles.length ? chatFiles.map((file) => `<a class="file-row" href="#page:chatFiles"><span>${esc(file.type)}</span><div><strong>${esc(file.name)}</strong><small>${esc(file.meta)}</small></div></a>`).join("") : `<p class="muted">暂无共享文件</p>`}</section>
    <section class="side-section side-links">
      <a href="#page:groupManage"><span>群管理</span><em>群二维码 / 群公告 / 邀请确认</em></a>
      <a href="#page:chatFiles"><span>聊天记录管理</span><em>导出 / 清理 / 多选</em></a>
    </section>
    <section class="side-section switches">
      <label><span>消息免打扰</span><input type="checkbox" ${chat.muted ? "checked" : ""} data-toggle-muted /></label>
      <label><span>置顶聊天</span><input type="checkbox" ${chat.pinned ? "checked" : ""} data-toggle-pinned /></label>
      <label><span>保存到联系人</span><input type="checkbox" checked /></label>
    </section>`;
}

function renderPersonPage() {
  const p = person(state.activePersonId || "self");
  const blocked = state.blockedPeople.includes(p.id);
  const removed = state.deletedPeople.includes(p.id);
  els.work.innerHTML = `
    <header class="work-head"><button class="mobile-back" type="button" data-mobile-back>‹</button><div><h2>${esc(p.name)}</h2><p>${esc(p.title)}</p></div></header>
    <div class="profile-page detail-page">
      <section class="profile-hero">
        ${avatarMarkup(p, "avatar profile-avatar")}
        <div><h2>${esc(p.name)}</h2><p>Chat ID：${esc(p.chatId)} · ${esc(p.region)}</p><strong>${esc(p.status)}</strong></div>
        <span class="qr-card">QR</span>
      </section>
      <section class="relationship-card glass-card">
        <span>${t("contact.relation")}</span>
        <strong class="${blocked || removed ? "warn" : ""}">${esc(relationStatus(p.id))}</strong>
        <small>${p.id === "self" ? t("contact.currentAccount") : `${t("contact.mutual")} · ${mutualGroups(p.id).join(" / ") || "-"}`}</small>
      </section>
      <section class="profile-fields glass-card settings-group">
        <a href="#page:moments" data-page="moments">动态 <span>3 张近照</span></a>
        <a href="#page:remarkTags" data-page="remarkTags">备注和分组标签 <span>团队 / 高频协作</span></a>
        <a href="#page:friendPrivacy" data-page="friendPrivacy">朋友权限 <span>聊天、动态、视频流</span></a>
        <button data-action="phone">电话号码 <span>${p.id === "self" ? "未展示" : "已备注"}</span></button>
      </section>
      <section class="profile-actions">
        <button class="primary" data-start-chat="${p.id}" ${blocked || removed ? "disabled" : ""}>发消息</button>
        <button data-action="voiceCall">音视频通话</button>
        <button data-action="moreProfile">更多</button>
      </section>
    </div>`;
  els.side.innerHTML = renderMiniTimeline(p);
}

function mutualGroups(id) {
  return chats.filter((chat) => chat.type === "group" && (chat.members || []).includes(id)).map((chat) => chat.title);
}

function renderMiniTimeline(p) {
  return `<header class="side-head"><h3>资料摘要</h3></header>
    <section class="side-section"><h4>共同群组</h4><p>${p.id === "self" ? "当前账号" : "项目组、设计评审"}</p></section>
    <section class="side-section"><h4>最近动态</h4><div class="photo-row"><span></span><span></span><span></span></div></section>
    <section class="side-section"><h4>来源</h4><p>通过模拟联系人添加</p></section>`;
}

function renderPage() {
  const page = modules[state.activePage] || modules.settings;
  els.work.innerHTML = `
    <header class="work-head"><button class="mobile-back" type="button" data-mobile-back>‹</button><div><h2>${esc(pageTitle(state.activePage, page))}</h2><p>${esc(pageHint(state.activePage, page))}</p></div></header>
    <div class="module-page detail-page">${renderModuleBody(page.kind)}</div>`;
  els.side.innerHTML = renderModuleSide(page);
}

function renderModuleBody(kind) {
  if (kind === "moments" || kind === "myMoments") {
    return renderMomentsPage(kind);
  }
  if (kind === "channels") {
    return renderVideoFeed();
  }
  if (kind === "scan") {
    return renderScanPage();
  }
  if (kind === "pay") {
    return renderWalletPage();
  }
  if (kind === "settings") {
    return settingsHomePage();
  }
  if (kind === "chatSearch") return chatSearchPage();
  if (kind === "chatFiles") return chatFilesPage();
  if (kind === "groupManage") return groupManagePage();
  if (kind === "remarkTags") return remarkTagsPage();
  if (kind === "friendPrivacy") return friendPrivacyPage();
  if (kind === "accountSecurity") return accountSecurityPage();
  if (kind === "notificationSettings") return notificationSettingsPage();
  if (kind === "chatSettings") return chatSettingsPage();
  if (kind === "privacySettings") return privacySettingsPage();
  if (kind === "generalSettings") return generalSettingsPage();
  if (kind === "storageSettings") return storageSettingsPage();
  if (kind === "about") return aboutPage();
  if (kind === "addFriend") return addFriendPage();
  if (kind === "payCode") return payCodePage();
  if (kind === "sendCrypto") return sendCryptoPage();
  if (kind === "transfer") return transferPage();
  if (kind === "swapCrypto") return swapCryptoPage();
  if (kind === "help") return helpPage();
  if (kind === "favorites") return favoritesPage();
  if (kind === "requests") return requestList();
  if (kind === "groups") return groupList();
  if (kind === "tags") return tagList();
  if (kind === "official") return officialList();
  if (kind === "mini") return renderPluginPage();
  if (kind === "games") return renderGamesPage();
  if (kind === "cards") return passesPage();
  if (kind === "stickers") return stickersPage();
  if (kind === "nearby") return renderNearbyPage();
  return grid(["附近直播", "同城活动", "游戏礼包", "好友排行", "推荐内容", "工具入口"], "#12a0aa");
}

function renderMoment(item) {
  const id = item.id || item.author;
  const liked = state.likedMoments.includes(id);
  const likeNames = [...new Set((item.likes || []).concat(liked ? [people.self.name] : []))];
  const photos = Array.from({ length: Math.min(item.count || 1, 6) }, (_, index) => `<span class="moment-photo tone-${index}">${esc(index === 0 ? item.image : "")}</span>`).join("");
  return `<article class="moment">
    ${avatarMarkup(item, "avatar moment-author")}
    <div>
      <div class="moment-title"><h3>${esc(item.author)}</h3><button type="button" data-social-action="menu" data-moment-id="${esc(id)}" aria-label="${t("common.more")}">••</button></div>
      <p>${esc(item.text)}</p>
      <div class="moment-gallery count-${Math.min(item.count || 1, 6)}">${photos}</div>
      <div class="moment-meta"><small>${esc(item.time)} · ${esc(item.location)}</small><span class="moment-action-row"><button class="${liked ? "active" : ""}" type="button" data-social-action="like" data-moment-id="${esc(id)}">${t("social.like")}</button><button type="button" data-social-action="comment" data-moment-id="${esc(id)}">${t("social.comment")}</button></span></div>
      <div class="social-bar">
        <span class="like-line">${t("social.like")}：${esc(likeNames.join("、") || t("social.none"))}</span>
        ${item.comments.map((comment) => `<span>${esc(comment)}</span>`).join("")}
      </div>
    </div>
  </article>`;
}

function renderMomentsPage(kind) {
  const isMine = kind === "myMoments";
  return `
    <section class="moments-cover social-cover">
      <div class="cover-image"><span>${isMine ? t("social.myActivity") : t("social.friendActivity")}</span></div>
      <div class="cover-owner">
        <strong>${isMine ? esc(people.self.name) : t("social.today")}</strong>
        ${avatarMarkup(people.self, "avatar")}
        <button data-social-action="post">${t("social.camera")}</button>
      </div>
    </section>
    <div class="timeline-list social-feed">${moments.map(renderMoment).join("")}</div>`;
}

function renderVideoFeed() {
  return `<section class="short-video-shell">
    <div class="video-top-tabs"><button class="active">${t("social.recommended")}</button><button>${t("social.following")}</button><button>${t("social.live")}</button><button>${t("social.nearby")}</button></div>
    <div class="short-video-stack">
      ${videoFeed.map((item, index) => `
        <article class="short-video-card tone-${esc(item.tone)}">
          <div class="video-scene"><span>${esc(item.title)}</span></div>
          <div class="video-copy">
            ${avatarMarkup(item, "avatar")}
            <div><strong>${esc(item.author)}</strong><p>${esc(item.caption)}</p><small>#${esc(item.tag)} · ${index + 1}/${videoFeed.length}</small></div>
          </div>
          <div class="video-actions">
            <button data-video-action="like" data-video-id="${esc(item.id || index)}" aria-label="${t("social.like")}"><span class="video-glyph glyph-like"></span><em>${esc(item.likes)}</em></button>
            <button data-video-action="comment" data-video-id="${esc(item.id || index)}" aria-label="${t("social.comment")}"><span class="video-glyph glyph-comment"></span><em>${esc(item.comments)}</em></button>
            <button class="${state.savedVideos.includes(item.id || `${index}`) ? "active" : ""}" data-video-action="save" data-video-id="${esc(item.id || index)}" aria-label="${t("social.save")}"><span class="video-glyph glyph-save"></span><em>${esc(item.saves)}</em></button>
            <button data-video-action="share" data-video-id="${esc(item.id || index)}" aria-label="${t("social.share")}"><span class="video-glyph glyph-share"></span><em>${t("social.share")}</em></button>
          </div>
        </article>`).join("")}
    </div>
  </section>`;
}

function renderScanPage() {
  return `<section class="scanner glass-card">
    <div class="scan-frame"><span></span></div>
    <h3>${t("scan.aim")}</h3>
    <p>${t("scan.desc")}</p>
    <div class="segmented scan-modes"><button class="active">${t("scan.qr")}</button><button>${t("scan.translate")}</button><button>${t("scan.object")}</button><button>${t("scan.cover")}</button></div>
    <div class="scan-result"><strong>${t("scan.result")}</strong><small>${t("scan.mock")}</small></div>
  </section>
  <section class="settings-list glass-card settings-group">${["GLASS-LOGIN-2048", "https://example.local/pay", "CONTACT-CARD-72"].map((item) => `<button type="button" data-action="scanHistory"><span>${esc(item)}</span><em>${t("scan.history")}</em></button>`).join("")}</section>`;
}

function renderNearbyPage() {
  return `<section class="nearby-map glass-card"><div><strong>${t("nearby.map")}</strong><span></span><span></span><span></span></div></section>
  <section class="nearby-list">${nearbyPlaces.map((item) => `<button class="nearby-row glass-card" type="button" data-action="nearby" style="--nearby-color:${esc(item.color)}"><span class="nearby-pin"></span><strong>${esc(localText(item, "title"))}</strong><small>${esc(localText(item, "meta"))}</small></button>`).join("")}</section>`;
}

function renderPluginCards(items) {
  return `<div class="plugin-grid">${items.map((item) => `<button class="plugin-card glass-card" type="button" data-action="plugin" style="--plugin-color:${esc(item.color)}"><span class="plugin-mark"></span><strong>${esc(localText(item, "name"))}</strong><small>${esc(localText(item, "desc"))}</small><em>${t("plugin.open")}</em></button>`).join("")}</div>`;
}

function renderPluginPage() {
  return `<section class="recent-strip"><h3>${t("plugin.recent")}</h3>${renderPluginCards(pluginGroups.recent || [])}</section><section class="recent-strip"><h3>${t("plugin.suggested")}</h3>${renderPluginCards(pluginGroups.suggested || [])}</section>`;
}

function renderGamesPage() {
  return `<section class="game-board glass-card"><strong>${t("game.rank")}</strong><div>${gameCards.map((item, index) => `<button type="button" data-action="game" style="--game-color:${esc(item.color)}"><span>${index + 1}</span><strong>${esc(localText(item, "name"))}</strong><em>${esc(item.score)}</em></button>`).join("")}</div></section>
  <section class="game-grid">${gameCards.map((item) => `<button class="game-card glass-card" type="button" data-action="game"><span style="--game-color:${esc(item.color)}"></span><strong>${esc(localText(item, "name"))}</strong><small>${t("game.reward")} · ${esc(item.reward)}</small></button>`).join("")}</section>`;
}

function renderWalletPage() {
  const tabs = [
    ["assets", t("wallet.assets")],
    ["defi", t("wallet.defi")],
    ["nft", t("wallet.nft")],
    ["records", t("wallet.records")],
  ];
  return `<div class="wallet-home">
    <section class="wallet-hero glass-card">
      <div class="wallet-topline"><span>${esc(localText(walletSummary, "name"))}</span><button data-wallet-action="switchWallet">${esc(localText(walletSummary, "account") || t("wallet.main"))} ▾</button></div>
      <strong>${esc(walletSummary.total || "$0.00")}</strong>
      <p>${esc(localText(walletSummary, "summary") || t("wallet.mock"))}</p>
      <div class="wallet-actions">
        ${[
          [t("wallet.receive"), "payCode"],
          [t("wallet.pay"), "sendCrypto"],
          [t("wallet.transfer"), "transfer"],
          [t("wallet.swap"), "swapCrypto"],
        ].map(([label, page]) => `<a href="#page:${page}" data-page="${page}"><em>${label}</em></a>`).join("")}
      </div>
    </section>
    <section class="wallet-tabs segmented" role="tablist" aria-label="${t("wallet.portfolio")}">${tabs.map(([tab, label]) => `<button id="wallet-tab-${tab}" type="button" role="tab" aria-selected="${state.walletTab === tab}" aria-controls="wallet-panel-${tab}" tabindex="${state.walletTab === tab ? "0" : "-1"}" class="${state.walletTab === tab ? "active" : ""}" data-wallet-tab="${tab}">${label}</button>`).join("")}</section>
    ${renderWalletHomePanel()}
  </div>`;
}

function renderWalletHomePanel() {
  if (state.walletTab === "records") {
    return `<section id="wallet-panel-records" class="wallet-records wallet-home-panel" role="tabpanel" aria-labelledby="wallet-tab-records" data-wallet-panel="records"><h3>${t("wallet.recent")}</h3>${walletTransactions.length ? walletTransactions.map(renderWalletTx).join("") : renderWalletEmpty("records")}</section>`;
  }
  if (state.walletTab === "defi") {
    return `<section id="wallet-panel-defi" class="wallet-panel-grid wallet-home-panel" role="tabpanel" aria-labelledby="wallet-tab-defi" data-wallet-panel="defi">${walletDefiPositions.length ? walletDefiPositions.map(renderWalletDefiPosition).join("") : renderWalletEmpty("defi")}</section>`;
  }
  if (state.walletTab === "nft") {
    return `<section id="wallet-panel-nft" class="wallet-nft-grid wallet-home-panel" role="tabpanel" aria-labelledby="wallet-tab-nft" data-wallet-panel="nft">${walletNftCollections.length ? walletNftCollections.map(renderWalletNftCollection).join("") : renderWalletEmpty("nft")}</section>`;
  }
  return `<section id="wallet-panel-assets" class="asset-list wallet-home-panel" role="tabpanel" aria-labelledby="wallet-tab-assets" data-wallet-panel="assets">${cryptoAssets.length ? cryptoAssets.map(renderAssetRow).join("") : renderWalletEmpty("assets")}</section>`;
}

function assetNetworks(asset) {
  return (asset.networks || [asset.network]).filter(Boolean);
}

function renderCoinLogo(asset) {
  return `<span class="coin-logo coin-${esc(asset.logo || asset.symbol.toLowerCase())}" style="--coin-color:${esc(asset.color)}"><b>${esc(asset.mark || asset.symbol.slice(0, 1))}</b></span>`;
}

function renderWalletAssetChoice(asset, options = {}) {
  const networks = assetNetworks(asset);
  const action = options.action || "asset";
  const classes = ["asset-row", "wallet-asset-choice", options.active ? "active" : "", options.compact ? "compact" : ""].filter(Boolean).join(" ");
  const meta = options.meta || `${asset.fiat}${asset.change ? ` · ${asset.change}` : ""}`;
  return `<button class="${classes}" type="button" data-wallet-action="${esc(action)}" data-asset="${esc(asset.symbol)}">
    ${renderCoinLogo(asset)}
    <span class="asset-main"><strong><b>${esc(asset.symbol)}</b><em>${esc(asset.name)}</em></strong><small>${esc(networks.join(" · "))}</small></span>
    <em class="asset-balance"><strong>${esc(options.amount || asset.amount)}</strong><small>${esc(meta)}</small></em>
  </button>`;
}

function renderAssetRow(asset) {
  return renderWalletAssetChoice(asset, { action: "asset" });
}

function walletAssetBySymbol(symbol, color = "#67707a") {
  const asset = cryptoAssets.find((item) => item.symbol === symbol);
  if (asset) return asset;
  const fallbackSymbol = symbol || "ASSET";
  return { symbol: fallbackSymbol, name: fallbackSymbol, mark: fallbackSymbol.slice(0, 1), networks: ["Mock"], amount: "0", fiat: "$0.00", color };
}

function walletAssetsFor(symbols = [], fallbackSymbols = [], limit = 3) {
  const seen = new Set();
  const ordered = [...symbols, ...fallbackSymbols, ...cryptoAssets.map((asset) => asset.symbol)];
  return ordered
    .map((symbol) => walletAssetBySymbol(symbol))
    .filter((asset) => {
      if (!asset?.symbol || seen.has(asset.symbol)) return false;
      seen.add(asset.symbol);
      return true;
    })
    .slice(0, limit);
}

function renderWalletDefiPosition(position) {
  const asset = walletAssetBySymbol(position.assetSymbol, position.color);
  const title = localText(position, "name") || position.assetSymbol || t("wallet.position");
  const meta = localText(position, "meta") || `${asset.symbol} · ${t("wallet.position")}`;
  return `<button type="button" class="wallet-info-card glass-card" data-wallet-action="defi" data-asset="${esc(asset.symbol)}" data-position="${esc(position.id || asset.symbol)}">
    ${renderCoinLogo(asset)}
    <span><strong>${esc(title)}</strong><small>${esc(asset.symbol)} · ${esc(meta)}</small></span>
    <em>${esc(position.value || "")}</em>
  </button>`;
}

function renderWalletNftCollection(collection) {
  return `<button type="button" class="wallet-nft-card glass-card" data-wallet-action="nft" data-collection="${esc(collection.id || localText(collection, "name") || "collection")}">
    <span style="--nft-color:${esc(collection.color || "#4f7cff")}"></span>
    <strong>${esc(localText(collection, "name") || t("wallet.collection"))}</strong>
    <small>${t("wallet.collection")} · ${esc(collection.count || "0")}</small>
    <em>${t("wallet.floor")} ${esc(collection.floor || "-")}</em>
  </button>`;
}

function renderWalletEmpty(kind) {
  const label = kind === "assets" ? t("wallet.emptyAssets") : kind === "defi" ? t("wallet.emptyDefi") : kind === "nft" ? t("wallet.emptyNft") : t("wallet.emptyRecords");
  return `<div class="wallet-empty inline-empty" data-wallet-empty="${esc(kind)}">${esc(label)} · ${t("wallet.mockOnly")}</div>`;
}

function renderWalletTx(tx) {
  const glyph = tx.type === "receive" ? "receive" : tx.type === "send" ? "send" : "swap";
  return `<button class="tx-row glass-card" type="button" data-wallet-action="tx" data-tx="${esc(tx.id)}">
    <span class="wallet-glyph glyph-${glyph}" aria-hidden="true"></span>
    <span><strong>${esc(tx.symbol)} · ${esc(tx.status)}</strong><small>${esc(tx.peer)} · ${esc(tx.time)}</small></span>
    <em>${esc(tx.amount)}<small>${esc(tx.fiat)}</small></em>
  </button>`;
}

function grid(items, color) {
  return `<div class="module-grid">${items.map((item) => `<button class="module-tile glass-card" data-action="${esc(item)}">${iconMarkup("plugin", color)}<span>${esc(item)}</span></button>`).join("")}</div>`;
}

function settingsList(items) {
  return `<div class="settings-list glass-card">${items.map((item, index) => `<button data-action="${esc(item)}"><span>${esc(item)}</span>${index % 3 === 1 ? "<input type='checkbox' checked />" : "<em>›</em>"}</button>`).join("")}</div>`;
}

function groupedRows(rows) {
  return `<div class="settings-list glass-card settings-group">${rows
    .map(([label, meta, page]) => {
      const right = page === "toggle" ? "<input type='checkbox' checked />" : `<em>${esc(meta || "›")}</em>`;
      const attrs = page && page !== "toggle" ? `href="#page:${page}" data-page="${page}"` : `href="#action:${encodeURIComponent(label)}" data-action="${esc(label)}"`;
      return `<a ${attrs}><span>${esc(label)}</span>${right}</a>`;
    })
    .join("")}</div>`;
}

function requestList() {
  return `<div class="request-list">${contactRequests.map((request) => {
    const status = requestStatus(request);
    const actionLabel = status === "pending" ? t("contact.accept") : status === "ignored" ? t("contact.ignore") : t("contact.message");
    return `<article class="request-row glass-card" data-request-id="${esc(request.id)}">
      <span class="avatar" style="--avatar-color:${request.color}">${esc(request.avatar)}</span>
      <div><strong>${esc(localText(request, "name"))}</strong><small>${esc(localText(request, "source"))}</small><p>${esc(localText(request, "note"))}</p></div>
      <div class="request-actions">
        <span class="request-status ${esc(status)}">${esc(status === "pending" ? t("contact.pending") : status === "ignored" ? t("contact.ignore") : t("contact.added"))}</span>
        <button type="button" data-request-action="${status === "pending" ? "accept" : status === "ignored" ? "accept" : "message"}" data-request-id="${esc(request.id)}">${esc(actionLabel)}</button>
        ${status === "pending" ? `<button class="ghost" type="button" data-request-action="ignore" data-request-id="${esc(request.id)}">${t("contact.ignore")}</button>` : ""}
      </div>
    </article>`;
  }).join("")}</div>`;
}

function groupList() {
  const groups = chats.filter((chat) => chat.type === "group");
  return `<section class="contact-stats">${[
    [t("contact.pinned"), groups.filter((chat) => chat.pinned).length],
    [t("contact.muted"), groups.filter((chat) => chat.muted).length],
    [t("contact.files"), groups.reduce((total, chat) => total + (chat.files || []).length, 0)],
  ].map(([label, value]) => `<span><strong>${value}</strong><em>${label}</em></span>`).join("")}</section>
  <section class="group-list">${groups.map((chat) => `<a class="wide-card glass-card" href="#chat:${chat.id}" data-chat="${chat.id}">${avatarMarkup(chat)}<span><strong>${esc(chat.title)}</strong><small>${t("contact.members", { count: (chat.members || []).length })} · ${esc(chat.notice)}</small></span><em>${chat.muted ? t("contact.muted") : chat.unread ? `${chat.unread}` : "›"}</em></a>`).join("")}</section>`;
}

function tagList() {
  return `<section class="label-cloud">${contactLabels.map((label) => `<button type="button" class="label-pill glass-card" data-label-action="open" data-label-id="${esc(label.id)}" style="--label-color:${esc(label.color)}"><span></span><strong>${esc(localText(label, "name"))}</strong><small>${t("contact.members", { count: label.members.length })}</small></button>`).join("")}</section><button class="wide-action" data-action="newTag">${t("contact.labelNew")}</button>`;
}

function officialList() {
  return `<div class="channel-list">${channelSubscriptions.map((channel) => `<button class="wide-card glass-card channel-row" type="button" data-channel-id="${esc(channel.id)}" data-action="channel">${iconMarkup("broadcast", channel.color)}<span><strong>${esc(localText(channel, "name"))}</strong><small>${channel.pinned ? "Pinned · " : ""}${esc(localText(channel, "update"))}</small></span>${channel.unread ? `<b class="badge">${channel.unread}</b>` : "<em>›</em>"}</button>`).join("")}</div>`;
}

function chatSearchPage() {
  const chat = activeChat();
  const filters = ["全部", "图片及视频", "文件", "链接", "音乐", "交易", "日期", "成员"];
  const results = (chat.messages || []).filter((item) => item.text && item.type !== "date");
  return `<div class="search-large"><span class="icon search"></span><input placeholder="搜索 ${esc(chat.title)} 的聊天内容" /></div><div class="filter-strip">${filters.map((item, i) => `<button class="${i === 0 ? "active" : ""}" data-action="filter">${item}</button>`).join("")}</div><div class="search-summary">${results.length} 条结果 · 最近一年</div><div class="settings-list glass-card settings-group">${results.length ? results.map((item) => `<button data-action="messageJump"><span>${esc(person(item.from).name)}</span><em>${esc(item.text.slice(0, 24))}</em></button>`).join("") : `<div class="inline-empty">${t("common.noContent")}</div>`}</div>`;
}

function chatFilesPage() {
  const chat = activeChat();
  const files = (chat.files || []).length ? chat.files : [{ name: "meeting-notes.txt", meta: "12 KB · 今天", type: "TXT" }];
  return `<div class="file-tabs segmented"><button class="active">文件</button><button>图片</button><button>链接</button><button>音乐</button></div><section class="file-manager">${files.map((file) => `<a class="file-card glass-card" href="#action:file"><span>${esc(file.type)}</span><div><strong>${esc(file.name)}</strong><small>${esc(file.meta)}</small></div><em>•••</em></a>`).join("")}</section>${groupedRows([["按发送人筛选", "全部成员"], ["按时间筛选", "最近一年"], ["多选", "转发 / 删除 / 保存"]])}`;
}

function groupManagePage() {
  const chat = activeChat();
  return `<section class="group-card glass-card">${avatarMarkup(chat, "avatar profile-avatar")}<div><h3>${esc(chat.title)}</h3><p>${(chat.members || []).length} 位成员 · ${esc(chat.notice)}</p></div><span class="qr-card">群码</span></section>${groupedRows([["群组名称", chat.title], ["群二维码", "7 天内有效"], ["群公告", "已发布"], ["群管理权限", "仅群主和管理员"], ["邀请进群确认", "已开启", "toggle"], ["显示群成员昵称", "已开启", "toggle"]])}${dangerZone(["退出群组", "清空聊天记录"])}`;
}

function remarkTagsPage() {
  const p = person(state.activePersonId || "song");
  const labels = contactLabels.filter((label) => label.members.includes(p.id)).map((label) => localText(label, "name")).join(" / ") || t("contact.notGrouped");
  return `<div class="form-card glass-card"><label>备注名<input value="${esc(p.name)}" /></label><label>描述<textarea>${esc(p.title)} · ${esc(p.status)}</textarea></label><label>电话号码<input value="+86 138 0000 0000" /></label><button type="button" data-contact-action="saveRemark" data-person-id="${esc(p.id)}">${t("contact.save")}</button></div>${groupedRows([["分组标签", labels], [t("contact.mutual"), mutualGroups(p.id).join(" / ") || "-"], [t("contact.source"), t("contact.sourceMock")]])}`;
}

function friendPrivacyPage() {
  const p = person(state.activePersonId || "song");
  const blocked = state.blockedPeople.includes(p.id);
  const hidden = state.hiddenPeople.includes(p.id);
  const removed = state.deletedPeople.includes(p.id);
  return `<section class="relationship-card glass-card"><span>${esc(p.name)}</span><strong class="${blocked || removed ? "warn" : ""}">${esc(relationStatus(p.id))}</strong><small>${t("contact.mutual")} · ${mutualGroups(p.id).join(" / ") || "-"}</small></section>
  <div class="settings-list glass-card settings-group">
    ${[
      [t("privacy.chat"), blocked ? t("privacy.restricted") : t("privacy.allowed"), !blocked],
      [t("privacy.activity"), hidden ? t("privacy.hidden") : t("privacy.visible"), !hidden],
      [t("privacy.video"), hidden ? t("privacy.hidden") : t("privacy.visible"), !hidden],
      [t("privacy.hideFrom"), hidden ? t("privacy.on") : t("privacy.off"), hidden],
      [t("privacy.hideTo"), hidden ? t("privacy.on") : t("privacy.off"), hidden],
    ].map(([label, meta, checked], index) => `<button type="button" data-contact-action="${index === 0 ? "toggleBlock" : "toggleHidden"}" data-person-id="${esc(p.id)}"><span>${esc(label)}</span><em>${esc(meta)}</em><input type="checkbox" ${checked ? "checked" : ""} /></button>`).join("")}
  </div>
  <div class="settings-list danger-list glass-card">
    <button type="button" data-contact-action="toggleBlock" data-person-id="${esc(p.id)}"><span>${blocked ? t("contact.unblock") : t("contact.block")}</span><em>›</em></button>
    <button type="button" data-contact-action="toggleDelete" data-person-id="${esc(p.id)}"><span>${removed ? t("contact.restore") : t("contact.delete")}</span><em>›</em></button>
  </div>`;
}

function storagePanel() {
  return `<section class="storage-card glass-card"><div class="storage-ring"><strong>2.4GB</strong><span>${t("page.storageSettings.title")}</span></div><div class="storage-bars">${storageBuckets.map((bucket) => `<span style="--w:${esc(bucket.width)};--bar-color:${esc(bucket.color)}">${esc(localText(bucket, "name"))} ${esc(bucket.size)}</span>`).join("")}</div></section>`;
}

function aboutPage() {
  return `<section class="about-card glass-card"><div class="app-mark">G</div><h3>Glass IM Shell</h3><p>Original UI prototype inspired by common messaging app patterns. Not affiliated with, endorsed by, or connected to any third-party messaging platform, wallet product, or social app.</p><small>${t("settings.version")} ${GLASS_IM_VERSION} · ${t("settings.localOnly")}</small></section>${groupedRows([["Glass IM Shell", t("settings.disclaimer")], [t("settings.license"), "MIT"], ["Data", t("settings.localOnly")]])}`;
}

function addFriendPage() {
  return `<div class="search-large"><span class="icon search"></span><input placeholder="Chat ID / 手机号" /></div>${groupedRows([["近场添加", "面对面添加"], ["加入群组", "输入群号或扫码"], ["扫描添加", "二维码名片"], ["手机联系人", "匹配联系人"], ["频道", "搜索频道和服务账号"]])}`;
}

function payCodePage() {
  const flow = walletFlowConfig.receive;
  const asset = walletAssetBySymbol(flow.assetSymbol || cryptoAssets[0]?.symbol || "BTC");
  const assetNetwork = assetNetworks(asset)[0] || "Bitcoin";
  return `<section class="receive-card glass-card">
    <div class="receive-head">${renderCoinLogo(asset)}<div><h3>${t("wallet.receive")} ${esc(asset.symbol)}</h3><p>${esc(assetNetwork)} · ${t("wallet.mockOnly")}</p></div></div>
    <div class="qr-big crypto-qr"><span></span><em>${esc(flow.addressShort || flow.address)}</em></div>
    <div class="address-copy"><code>${esc(flow.address)}</code><button type="button" data-wallet-action="copyAddress">${t("wallet.copy")}</button></div>
  </section>
  <section class="asset-list wallet-asset-picker" aria-label="${t("wallet.assets")}">${walletAssetsFor([flow.assetSymbol], ["BTC", "ETH", "USDT", "USDC"], 4).map((item, index) => renderWalletAssetChoice(item, { action: "receiveAsset", active: index === 0, compact: true })).join("")}</section>
  ${groupedRows([["网络", assetNetwork], [t("wallet.addressBook"), `${walletContacts.length}`], [t("wallet.incoming"), flow.incoming || "0"]])}`;
}

function sendCryptoPage() {
  const flow = walletFlowConfig.pay;
  const assets = walletAssetsFor(flow.assetSymbols, ["USDT", "ETH", "BTC"], 3);
  const selected = assets[0];
  return `<section class="asset-list wallet-asset-picker" aria-label="${t("wallet.assets")}">${assets.map((asset, index) => renderWalletAssetChoice(asset, { action: "asset", active: index === 0, compact: true })).join("")}</section>
  <section class="form-card glass-card crypto-form wallet-form">
    <label>${t("wallet.assets")}<span class="selected-asset-field">${renderCoinLogo(selected)}<span><strong>${esc(selected.symbol)}</strong><small>${esc(assetNetworks(selected)[0] || "")}</small></span></span></label>
    <label>${t("wallet.address")}<input value="${esc(flow.address)}" /></label>
    <label>${t("wallet.amount")}<span class="amount-field"><input value="${esc(flow.amount)}" /><button type="button" data-wallet-action="max">${t("wallet.max")}</button></span></label>
    <section class="fee-card"><span>${t("wallet.networkFee")}</span><strong>${esc(flow.fee)}</strong><small>${esc(flow.feeMeta)}</small></section>
    <section class="risk-card"><span>${t("wallet.risk")}</span><strong>${t("wallet.riskClear")}</strong><small>${t("wallet.mockOnly")}</small></section>
    <button type="button" data-wallet-action="confirmSend">${t("wallet.confirm")} ${t("wallet.pay")}</button>
  </section>${groupedRows([[t("sheet.scan"), t("scan.qr"), "scan"], [t("wallet.addressBook"), `${walletContacts.length}`], [t("wallet.available"), flow.available || "$0.00"]])}`;
}

function transferPage() {
  const flow = walletFlowConfig.transfer;
  const assets = walletAssetsFor(flow.assetSymbols, ["USDT", "ETH", "SOL"], 3);
  const selected = assets[0];
  return `${renderWalletContactStrip()}
  <section class="asset-list wallet-asset-picker" aria-label="${t("wallet.assets")}">${assets.map((asset, index) => renderWalletAssetChoice(asset, { action: "asset", active: index === 0, compact: true })).join("")}</section>
  <section class="form-card glass-card crypto-form wallet-form"><label>${t("wallet.assets")}<span class="selected-asset-field">${renderCoinLogo(selected)}<span><strong>${esc(selected.symbol)}</strong><small>${esc(assetNetworks(selected)[0] || "")}</small></span></span></label><label>${t("wallet.amount")}<input value="${esc(flow.amount)}" /></label><label>${t("wallet.memo")}<input value="${esc(flow.memo)}" /></label><section class="fee-card"><span>${t("wallet.networkFee")}</span><strong>${esc(flow.fee)}</strong><small>${esc(flow.feeMeta)}</small></section><button type="button" data-wallet-action="confirmTransfer">${t("wallet.confirm")} ${t("wallet.transfer")}</button></section>`;
}

function renderWalletContactStrip() {
  if (!walletContacts.length) {
    return `<section class="wallet-contact-strip"><div class="wallet-empty inline-empty" data-wallet-empty="contacts">${t("wallet.contacts")} · ${t("common.noContent")}</div></section>`;
  }
  return `<section class="wallet-contact-strip">${walletContacts.map((item) => `<button type="button" class="wallet-contact glass-card" data-wallet-action="contact" data-wallet-contact="${esc(item.id)}"><span class="avatar" style="--avatar-color:${esc(item.color)}">${esc(item.avatar)}</span><strong>${esc(localText(item, "name"))}</strong><small>${esc(item.network)} · ${esc(item.address)}</small></button>`).join("")}</section>`;
}

function swapCryptoPage() {
  const flow = walletFlowConfig.swap;
  const fromAsset = walletAssetBySymbol(flow.fromSymbol || "USDT");
  const toAsset = walletAssetBySymbol(flow.toSymbol || "ETH");
  const route = Array.isArray(flow.route) && flow.route.length ? flow.route : ["Mock route"];
  return `<section class="swap-card glass-card">
    <section class="swap-asset-panel"><span>${t("wallet.pay")}</span>${renderWalletAssetChoice(fromAsset, { action: "asset", active: true, compact: true, amount: flow.fromAmount, meta: assetNetworks(fromAsset)[1] || assetNetworks(fromAsset)[0] || "" })}</section>
    <button class="swap-arrow" type="button" data-wallet-action="swapDirection">⇅</button>
    <section class="swap-asset-panel"><span>${t("wallet.receive")}</span>${renderWalletAssetChoice(toAsset, { action: "asset", compact: true, amount: flow.toAmount, meta: assetNetworks(toAsset)[0] || "" })}</section>
    <div class="swap-rate"><span>${t("wallet.route")}</span><strong>${esc(flow.rate)}</strong></div>
    <div class="route-steps">${route.map((step, index) => `${index ? "<i></i>" : ""}<span>${esc(step)}</span>`).join("")}</div>
    <button type="button" data-wallet-action="confirmSwap">${t("wallet.confirm")} ${t("wallet.swap")}</button>
  </section>${groupedRows([[t("wallet.slippage"), flow.slippage || "-"], [t("wallet.bridge"), flow.bridge || "-"], [t("wallet.networkFee"), flow.fee || "-"], [t("wallet.estimate"), flow.estimate || "-"]])}`;
}

function dangerZone(items) {
  return `<div class="settings-list danger-list glass-card">${items.map((item) => `<button data-action="${esc(item)}"><span>${esc(item)}</span><em>›</em></button>`).join("")}</div>`;
}

function settingsHomePage() {
  const cards = [
    ["accountSecurity", t("page.accountSecurity.title"), t("settings.security"), "96"],
    ["notificationSettings", t("page.notificationSettings.title"), t("settings.enabled"), "5"],
    ["privacySettings", t("page.privacySettings.title"), t("settings.manage"), "12"],
  ];
  return `<section class="settings-dashboard">${cards.map(([page, title, label, value]) => `<a class="settings-metric glass-card" href="#page:${page}" data-page="${page}"><span>${esc(label)}</span><strong>${esc(value)}</strong><em>${esc(title)}</em></a>`).join("")}</section>
  ${groupedRows([[t("page.accountSecurity.title"), t("settings.security"), "accountSecurity"], [t("page.notificationSettings.title"), t("settings.enabled"), "notificationSettings"], [t("page.chatSettings.title"), t("settings.backup"), "chatSettings"], [t("page.privacySettings.title"), t("settings.manage"), "privacySettings"], [t("settings.general"), `${t("settings.language")} / ${t("settings.dark")}`, "generalSettings"], [t("page.storageSettings.title"), "2.4 GB", "storageSettings"]])}
  ${groupedRows([[t("page.help.title"), "", "help"], [t("page.about.title"), "Glass IM Shell", "about"]])}`;
}

function accountSecurityPage() {
  const phoneLabel = state.lang === "zh" ? "手机号" : "Phone";
  const emailLabel = state.lang === "zh" ? "邮箱" : "Email";
  return `<section class="security-hero glass-card"><span>${t("settings.security")}</span><strong>96</strong><p>${t("settings.bound")} · Passkey · 2FA</p><button type="button" data-settings-action="securityCheck">${t("settings.run")}</button></section>
  ${groupedRows([["Chat ID", people.self.chatId], [phoneLabel, t("settings.bound")], [emailLabel, t("settings.unbound")], ["Passkey", t("settings.enabled")]])}
  <section class="device-list">${accountDevices.map((device) => `<button class="device-card glass-card" type="button" data-settings-action="device" data-device="${esc(device.id)}" style="--device-color:${esc(device.color)}"><span></span><strong>${esc(localText(device, "name"))}</strong><small>${esc(localText(device, "meta"))}</small><em>${esc(device.status)}</em></button>`).join("")}</section>
  ${dangerZone([t("settings.freeze"), t("settings.close")])}`;
}

function notificationSettingsPage() {
  return `<section class="settings-toggle-list glass-card">${[
    [t("settings.push"), true],
    [t("settings.preview"), true],
    [t("settings.callAlerts"), true],
    [t("settings.sound"), true],
    [t("settings.vibration"), true],
    [t("settings.quiet"), false],
  ].map(([label, checked]) => `<button type="button" data-settings-action="toggle"><span>${esc(label)}</span><input type="checkbox" ${checked ? "checked" : ""} /></button>`).join("")}</section>`;
}

function chatSettingsPage() {
  const migrationText = state.lang === "zh" ? "云端适配 / 本地导出 / 设备迁移" : "Cloud adapter / local export / device migration";
  const defaultText = state.lang === "zh" ? "默认" : "Default";
  return `<section class="backup-card glass-card"><span>${t("settings.backup")}</span><strong>${t("settings.lastBackup")}</strong><p>${esc(migrationText)}</p><button type="button" data-settings-action="backup">${t("settings.backup")}</button></section>
  ${groupedRows([[t("settings.chatBackground"), defaultText], [t("settings.stickerManager"), "38"], [t("settings.quickInput"), t("settings.enabled")], [t("settings.media"), t("settings.disabled")]])}
  ${storagePanel()}`;
}

function privacySettingsPage() {
  return `<section class="privacy-grid">${[
    [t("settings.discovery"), state.lang === "zh" ? "账号 / 群聊" : "Chat ID / groups", "#12b7a6"],
    [t("settings.activityVisibility"), state.lang === "zh" ? "最近 3 天" : "Last 3 days", "#4f7cff"],
    [t("settings.videoVisibility"), state.lang === "zh" ? "好友可见" : "Friends", "#7c5cff"],
    [t("settings.permissions"), state.lang === "zh" ? "12 项授权" : "12 grants", "#f3a23a"],
  ].map(([title, meta, color]) => `<button class="privacy-card glass-card" type="button" data-settings-action="privacy" style="--privacy-color:${color}"><span></span><strong>${title}</strong><small>${meta}</small></button>`).join("")}</section>
  ${groupedRows([[t("settings.blocked"), "2"], [state.lang === "zh" ? "授权管理" : "Authorization manager", "12"], [t("settings.recommendations"), t("settings.disabled")], [t("settings.phoneSearch"), t("settings.enabled")]])}`;
}

function generalSettingsPage() {
  const accessibilityText = state.lang === "zh" ? "字幕 / 朗读" : "Captions / read aloud";
  return groupedRows([[t("settings.language"), state.lang === "zh" ? "简体中文" : "English"], [t("settings.font"), t("settings.standard")], [t("settings.media"), t("settings.disabled")], [t("settings.dark"), t("settings.system")], [t("settings.accessibility"), accessibilityText]]);
}

function storageSettingsPage() {
  return storagePanel() + `<section class="cleanup-grid">${storageBuckets.map((bucket) => `<button class="cleanup-card glass-card" type="button" data-settings-action="clean" style="--cleanup-color:${esc(bucket.color)}"><span></span><strong>${esc(localText(bucket, "name"))}</strong><small>${esc(bucket.size)}</small><em>${t("settings.clean")}</em></button>`).join("")}</section>`;
}

function favoritesPage() {
  return `<section class="saved-tabs segmented"><button class="active">${t("saved.all")}</button><button>${t("saved.images")}</button><button>${t("saved.links")}</button><button>${t("saved.files")}</button></section>
  <section class="saved-list">${savedItems.map((item) => `<button class="saved-card glass-card" type="button" data-settings-action="saved" style="--saved-color:${esc(item.color)}"><span>${esc(item.type)}</span><strong>${esc(localText(item, "title"))}</strong><small>${esc(item.meta)}</small></button>`).join("")}</section>`;
}

function passesPage() {
  return `<section class="pass-list">${passItems.map((item) => `<button class="pass-card glass-card" type="button" data-settings-action="pass" style="--pass-color:${esc(item.color)}"><span></span><strong>${esc(localText(item, "title"))}</strong><small>${esc(localText(item, "meta"))}</small><em>${t("passes.available")}</em></button>`).join("")}</section>`;
}

function stickersPage() {
  return `<section class="recent-strip"><h3>${t("stickers.recent")}</h3><div class="sticker-grid">${["OK", "THX", "GO", "YES"].map((item) => `<button class="sticker-cell glass-card" type="button" data-settings-action="sticker">${esc(item)}</button>`).join("")}</div></section>
  <section class="recent-strip"><h3>${t("stickers.store")}</h3><div class="sticker-pack-grid">${stickerPacks.map((pack) => `<button class="sticker-pack glass-card" type="button" data-settings-action="stickerPack" style="--sticker-color:${esc(pack.color)}"><span></span><strong>${esc(localText(pack, "title"))}</strong><small>${esc(pack.count)}</small></button>`).join("")}</div></section>`;
}

function helpPage() {
  const diagnosticsText = state.lang === "zh" ? "网络 / 通知 / 存储检测" : "Network / notification / storage checks";
  return `<section class="help-list">${helpTopics.map((topic) => `<button class="help-card glass-card" type="button" data-settings-action="help"><strong>${esc(localText(topic, "title"))}</strong><small>${esc(localText(topic, "meta"))}</small><em>›</em></button>`).join("")}</section>
  <section class="backup-card glass-card"><span>${t("settings.diagnostics")}</span><strong>${t("settings.run")}</strong><p>${esc(diagnosticsText)}</p><button type="button" data-settings-action="diagnostics">${t("settings.run")}</button></section>`;
}

function renderModuleSide(page) {
  return `<header class="side-head"><h3>${esc(page.title)}详情</h3></header>
    <section class="side-section"><h4>当前状态</h4><p>页面由模拟数据驱动，支持列表进入、返回、空态和轻操作反馈。</p></section>
    <section class="side-section"><h4>流程覆盖</h4><p>入口、详情、设置项、操作菜单、状态反馈。</p></section>
    <section class="side-section switches"><label><span>消息提醒</span><input type="checkbox" checked /></label><label><span>浮层玻璃效果</span><input type="checkbox" checked /></label></section>`;
}

function renderEmpty() {
  els.work.innerHTML = `<div class="empty-work glass-card"><h2>选择一个项目</h2><p>从左侧列表进入聊天、联系人资料、探索模块或个人设置。</p></div>`;
  els.side.innerHTML = `<header class="side-head"><h3>流程说明</h3></header><section class="side-section"><p>该原型覆盖 IM 类产品的核心体验架构，不使用任何官方品牌素材。</p></section>`;
}

function renderWork() {
  if (state.route === "chat") renderChat();
  else if (state.route === "person") renderPersonPage();
  else if (state.route === "page") renderPage();
  else renderEmpty();
}

function renderShellState() {
  const resolvedTheme = state.appearance === "system" ? systemAppearance() : state.appearance;
  els.shell.classList.toggle("mobile-open", state.mobileChatOpen);
  els.shell.classList.toggle("detail-open", state.detailOpen);
  els.shell.dataset.glassShell = "";
  els.shell.dataset.glassVersion = GLASS_IM_VERSION;
  els.shell.dataset.glassView = state.view;
  els.shell.dataset.glassRoute = state.route;
  els.shell.dataset.glassPage = state.activePage || "";
  els.shell.dataset.glassLang = state.lang;
  els.shell.dataset.glassTheme = resolvedTheme;
  els.shell.dataset.glassDensity = state.density;
  els.shell.dataset.glassSurface = state.surface;
  els.shell.dataset.currentView = state.view;
  els.shell.dataset.density = state.density;
  document.documentElement.dataset.glassSurface = state.surface;
  document.documentElement.lang = state.lang === "zh" ? "zh-CN" : "en";
  document.documentElement.dataset.lang = state.lang;
  document.documentElement.dataset.appearance = state.appearance;
  document.documentElement.dataset.theme = resolvedTheme;
  document.documentElement.dataset.density = state.density;
  els.search.placeholder = t("common.search");
  els.search.setAttribute("aria-label", t("common.search"));
  els.plus?.setAttribute("aria-label", t("common.more"));
  if (els.lang) {
    els.lang.textContent = state.lang === "zh" ? "EN" : "中";
    els.lang.setAttribute("aria-label", state.lang === "zh" ? "Switch to English" : "切换到中文");
  }
}

function handleHashRoute() {
  const raw = window.location.hash.replace(/^#/, "");
  if (!raw) return false;
  if (navItems.some((item) => item.id === raw)) {
    setView(raw);
    return true;
  }
  const [kind, id] = raw.split(":");
  if (kind === "chat" && id) {
    openChat(id);
    return true;
  }
  if (kind === "person" && id) {
    openPerson(id);
    return true;
  }
  if (kind === "page" && id) {
    openPage(id);
    return true;
  }
  return false;
}

function render() {
  renderRail();
  renderList();
  renderWork();
  renderShellState();
  normalizeInteractiveElements(els.shell);
}

document.addEventListener("click", (event) => {
  const target = event.target;
  if (target.closest("[data-close-sheet]") || target === els.overlay) {
    closeSheet();
    return;
  }

  const messageMenu = target.closest("[data-message-menu]");
  if (messageMenu) {
    state.selectedMessageId = messageMenu.dataset.messageMenu;
    openSheet("message");
    emit("message:menu", { messageId: state.selectedMessageId });
    return;
  }

  const messageAction = target.closest("[data-message-action]");
  if (messageAction) {
    handleMessageAction(messageAction.dataset.messageAction);
    return;
  }

  const viewButton = target.closest("[data-view]");
  if (viewButton) {
    setView(viewButton.dataset.view);
    return;
  }

  const chatButton = target.closest("[data-chat]");
  if (chatButton) {
    openChat(chatButton.dataset.chat);
    return;
  }

  const personButton = target.closest("[data-person]");
  if (personButton) {
    openPerson(personButton.dataset.person);
    return;
  }

  const pageButton = target.closest("[data-page]");
  if (pageButton) {
    openPage(pageButton.dataset.page);
    return;
  }

  const jumpPageButton = target.closest("[data-jump-page]");
  if (jumpPageButton) {
    openPage(jumpPageButton.dataset.jumpPage);
    window.location.hash = `page:${jumpPageButton.dataset.jumpPage}`;
    return;
  }

  const explicitPage = target.closest("[data-open-page]");
  if (explicitPage) {
    const [type, id] = explicitPage.dataset.openPage.split(":");
    if (type === "profile") openPerson(id);
    else openPage(type);
    return;
  }

  if (target.closest("[data-mobile-back]")) {
    closeMobileLayer();
    return;
  }

  if (target.closest("[data-toggle-detail]")) {
    state.detailOpen = !state.detailOpen;
    render();
    return;
  }

  const tool = target.closest("[data-tool]");
  if (tool) {
    if (["image", "file"].includes(tool.dataset.tool)) {
      appendSimulatedMessage(tool.dataset.tool, tool.textContent.trim());
      toast(`${tool.textContent.trim()} · 模拟完成`);
      return;
    }
    state.toolDrawer = tool.dataset.tool === "more" ? !state.toolDrawer : true;
    renderChat();
    toast(`${tool.textContent}工具已打开`);
    emit("composer:tool", { tool: tool.dataset.tool });
    return;
  }

  const quick = target.closest("[data-quick]");
  if (quick) {
    const toolKind = quick.querySelector(".tool-glyph")?.className.match(/glyph-([a-z]+)/)?.[1] || "text";
    if (["image", "nearby", "bookmark", "pass", "gift", "transfer"].includes(toolKind)) {
      appendSimulatedMessage(toolKind, quick.textContent.trim());
      return;
    }
    const input = document.querySelector("#messageInput");
    if (input) {
      input.value += quick.dataset.quick;
      input.focus();
    }
    return;
  }

  if (target.closest("[data-cancel-reply]")) {
    state.replyTo = null;
    renderChat();
    return;
  }

  const startChat = target.closest("[data-start-chat]");
  if (startChat) {
    if (startChat.disabled) return;
    const id = startChat.dataset.startChat;
    const existing = chats.find((chat) => (chat.members || []).length === 2 && (chat.members || []).includes(id));
    if (existing) openChat(existing.id);
    else {
      const p = person(id);
      chats.unshift({ id: `dm-${id}`, title: p.name, type: "dm", avatar: p.avatar, color: p.color, subtitle: p.title, time: "刚刚", unread: 0, pinned: false, muted: false, preview: "开始聊天", notice: "单聊信息", members: ["self", id], files: [], messages: [{ type: "date", text: "刚刚" }, { from: "self", text: "你好，我们开始聊吧。", kind: "text" }] });
      openChat(`dm-${id}`);
    }
    return;
  }

  const requestAction = target.closest("[data-request-action]");
  if (requestAction) {
    handleRequestAction(requestAction);
    return;
  }

  const contactAction = target.closest("[data-contact-action]");
  if (contactAction) {
    handleContactAction(contactAction);
    return;
  }

  const labelAction = target.closest("[data-label-action]");
  if (labelAction) {
    handleLabelAction(labelAction);
    return;
  }

  const socialAction = target.closest("[data-social-action]");
  if (socialAction) {
    handleSocialAction(socialAction);
    return;
  }

  const videoAction = target.closest("[data-video-action]");
  if (videoAction) {
    handleVideoAction(videoAction);
    return;
  }

  const walletTab = target.closest("[data-wallet-tab]");
  if (walletTab) {
    handleWalletTab(walletTab);
    return;
  }

  const walletAction = target.closest("[data-wallet-action]");
  if (walletAction) {
    handleWalletAction(walletAction);
    return;
  }

  const settingsAction = target.closest("[data-settings-action]");
  if (settingsAction) {
    handleSettingsAction(settingsAction);
    return;
  }

  if (target.closest("[data-action]")) {
    const action = target.closest("[data-action]");
    toast(`${action.textContent.trim()} · 模拟完成`);
    emit("action", { action: action.dataset.action, label: action.textContent.trim() });
    return;
  }
});

els.plus.addEventListener("click", () => openSheet("plus"));
els.lang?.addEventListener("click", () => {
  state.lang = state.lang === "zh" ? "en" : "zh";
  if (bootConfig.persistLanguage !== false) localStorage.setItem("glass-im-lang", state.lang);
  render();
  toast(state.lang === "zh" ? "已切换为中文" : "Language set to English");
  emit("language:change", { lang: state.lang });
});
els.search.addEventListener("input", renderList);
els.list.addEventListener(
  "click",
  (event) => {
    const target = event.target;
    const chatButton = target.closest("[data-chat]");
    const personButton = target.closest("[data-person]");
    const pageButton = target.closest("[data-page]");
    if (chatButton) {
      event.stopPropagation();
      openChat(chatButton.dataset.chat);
      return;
    }
    if (personButton) {
      event.stopPropagation();
      openPerson(personButton.dataset.person);
      return;
    }
    if (pageButton) {
      event.stopPropagation();
      openPage(pageButton.dataset.page);
    }
  },
  true,
);

document.addEventListener("submit", (event) => {
  if (event.target.id !== "composer") return;
  event.preventDefault();
  const input = document.querySelector("#messageInput");
  const text = input.value.trim();
  if (!text) return;
  const chat = activeChat();
  if (!chat.messages) chat.messages = [];
  const replyMessage = currentReplyMessage();
  chat.messages.push({ id: `m-${Date.now()}`, from: "self", text, kind: "text", status: "delivered", replyTo: replyMessage ? `${person(replyMessage.from).name}: ${replyMessage.text}` : null });
  chat.preview = `我：${text}`;
  chat.time = "刚刚";
  state.replyTo = null;
  input.value = "";
  render();
  emit("message:send", { chatId: chat.id, text });
});

document.addEventListener("keydown", (event) => {
  const walletTab = event.target.closest?.("[data-wallet-tab]");
  if (walletTab && switchWalletTabByKey(walletTab, event.key)) {
    event.preventDefault();
    return;
  }
  if (event.key === "Tab" && !els.sheet.hidden) {
    const focusables = focusableWithin(els.sheet);
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
  if (event.target.id === "messageInput" && event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    document.querySelector("#composer")?.requestSubmit();
  }
  if (event.key === "Escape") {
    if (!els.sheet.hidden) closeSheet();
    else closeMobileLayer();
  }
});

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
  if (state.appearance !== "system") return;
  renderShellState();
  emit("appearance:change", { appearance: "system", resolvedTheme: systemAppearance() });
});

window.addEventListener("hashchange", handleHashRoute);

function setData(data) {
  applyData(data);
  render();
  emit("data:update", { keys: Object.keys(data || {}) });
}

function setLang(lang) {
  if (!i18n[lang]) return;
  state.lang = lang;
  if (bootConfig.persistLanguage !== false) localStorage.setItem("glass-im-lang", state.lang);
  render();
  emit("language:change", { lang });
}

function setAppearance(appearance = "system") {
  if (!validAppearances.has(appearance)) return;
  state.appearance = appearance;
  if (bootConfig.persistAppearance !== false) localStorage.setItem("glass-im-appearance", appearance);
  renderShellState();
  emit("appearance:change", { appearance, resolvedTheme: state.appearance === "system" ? systemAppearance() : state.appearance });
}

function setDensity(density = "comfortable") {
  if (!validDensities.has(density)) return;
  state.density = density;
  renderShellState();
  emit("density:change", { density });
}

function setSurface(surface = "fullscreen") {
  if (!validSurfaces.has(surface)) return;
  state.surface = surface;
  renderShellState();
  emit("surface:change", { surface });
}

function configure(options = {}) {
  if (options.data) applyData(options.data);
  if (options.theme) applyTheme(options.theme);
  if (options.lang && i18n[options.lang]) state.lang = options.lang;
  if (options.surface) setSurface(options.surface);
  if (options.appearance) setAppearance(options.appearance);
  if (options.density) setDensity(options.density);
  if (options.onEvent) eventSubscribers.add(options.onEvent);
  render();
  if (options.route) navigate(options.route);
  return window.GlassIMShell;
}

function mount(options = {}) {
  configure(options);
  emit("app:mount", { options: Object.keys(options) });
  return window.GlassIMShell;
}

window.GlassIMShell = {
  mount,
  render,
  navigate,
  setData,
  setLang,
  setTheme: applyTheme,
  setAppearance,
  setDensity,
  setSurface,
  configure,
  getVersion: () => GLASS_IM_VERSION,
  getState: snapshotState,
  getData: () => ({ people, chats, contactSections, contactRequests, contactLabels, channelSubscriptions, discoverItems, meItems, moments, cryptoAssets, walletNetworks, walletTransactions, walletDefiPositions, walletNftCollections, walletContacts, walletSummary, walletFlowConfig, videoFeed, nearbyPlaces, pluginGroups, gameCards, accountDevices, storageBuckets, savedItems, passItems, stickerPacks, helpTopics, modules }),
  on: (listener) => {
    eventSubscribers.add(listener);
    return () => eventSubscribers.delete(listener);
  },
};

render();
if (!handleHashRoute() && bootConfig.route) navigate(bootConfig.route);
if (typeof bootConfig.dataProvider === "function") {
  state.loading = true;
  render();
  Promise.resolve(bootConfig.dataProvider())
    .then((data) => {
      state.loading = false;
      state.error = null;
      data && setData(data);
    })
    .catch((error) => {
      state.loading = false;
      state.error = error.message || "Data error";
      render();
      emit("data:error", { message: error.message });
    });
}
emit("app:ready");
