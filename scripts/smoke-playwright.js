#!/usr/bin/env node

const fs = require("fs");
const http = require("http");
const net = require("net");
const path = require("path");

const root = path.resolve(__dirname, "..");
const outputDir = path.join(root, "output", "smoke");
const portStart = Number(process.env.GLASS_SMOKE_PORT_START || 5500);
const portEnd = Number(process.env.GLASS_SMOKE_PORT_END || 5509);
const externalBaseUrl = process.env.GLASS_SMOKE_BASE_URL;

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
};

function hasPlaywright() {
  try {
    require.resolve("playwright");
    return true;
  } catch {
    return false;
  }
}

function freePort(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once("error", () => resolve(false));
    server.once("listening", () => server.close(() => resolve(true)));
    server.listen(port, "127.0.0.1");
  });
}

async function findPort() {
  for (let port = portStart; port <= portEnd; port += 1) {
    if (await freePort(port)) return port;
  }
  throw new Error(`No free port in ${portStart}-${portEnd}`);
}

function createServer() {
  return http.createServer((request, response) => {
    const url = new URL(request.url, "http://127.0.0.1");
    const pathname = decodeURIComponent(url.pathname);
    const requested = pathname === "/" ? "/index.html" : pathname;
    const filePath = path.resolve(root, `.${requested}`);
    if (!filePath.startsWith(root) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }
    response.writeHead(200, { "content-type": contentTypes[path.extname(filePath)] || "application/octet-stream" });
    fs.createReadStream(filePath).pipe(response);
  });
}

async function startServer() {
  if (externalBaseUrl) return { baseUrl: externalBaseUrl.replace(/\/$/, ""), close: async () => {} };
  const port = await findPort();
  const server = createServer();
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, "127.0.0.1", resolve);
  });
  return {
    baseUrl: `http://127.0.0.1:${port}`,
    close: () => new Promise((resolve) => server.close(resolve)),
  };
}

function attachConsoleGuard(page, errors) {
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => {
    errors.push(error.message);
  });
}

async function assertPage(page, expression, message, arg) {
  const passed = await page.evaluate(expression, arg);
  if (!passed) throw new Error(message);
}

async function assertMobileSurface(page, label) {
  const result = await page.evaluate(() => {
    const title = document.querySelector(".work-head h2")?.textContent.trim();
    const shell = document.querySelector("[data-glass-shell]");
    const workPane = document.querySelector(".work-pane");
    const modulePage = document.querySelector(".module-page, .profile-page");
    const overflowTargets = [shell, workPane, modulePage].filter(Boolean).map((element) => ({
      className: element.className || element.dataset.glassShell || element.tagName,
      delta: Math.ceil(element.scrollWidth - element.clientWidth),
    })).filter((item) => item.delta > 2);
    const visibleBox = workPane?.getBoundingClientRect();
    return {
      ok: Boolean(title) && Boolean(modulePage?.textContent.trim()) && overflowTargets.length === 0 && visibleBox.left < window.innerWidth,
      title,
      overflowTargets,
      page: shell?.dataset.glassPage,
      view: shell?.dataset.glassView,
    };
  });
  if (!result.ok) throw new Error(`${label} mobile surface failed: ${JSON.stringify(result)}`);
}

async function assertPersonRouteState(page, id, expectedView) {
  const result = await page.evaluate((expected) => {
    const shell = document.querySelector("[data-glass-shell]");
    const state = window.GlassIMShell?.getState?.();
    const fields = document.querySelector(".profile-fields");
    const actions = document.querySelector(".profile-actions");
    const fieldsBox = fields?.getBoundingClientRect();
    const actionsBox = actions?.getBoundingClientRect();
    const overlaps = Boolean(fieldsBox && actionsBox && !(fieldsBox.bottom <= actionsBox.top || actionsBox.bottom <= fieldsBox.top));
    return {
      hash: window.location.hash,
      route: state?.route,
      activePersonId: state?.activePersonId,
      view: state?.view,
      datasetView: shell?.dataset.glassView,
      mobileOpen: shell?.classList.contains("mobile-open"),
      activeNav: document.querySelector(".rail-icon.active em")?.textContent.trim(),
      overlaps,
    };
  }, { id, expectedView });
  if (result.hash !== `#person:${id}` || result.route !== "person" || result.activePersonId !== id || result.view !== expectedView || result.datasetView !== expectedView || !result.mobileOpen || result.overlaps) {
    throw new Error(`person:${id} route state failed: ${JSON.stringify(result)}`);
  }
}

async function assertHashRouteState(page, route) {
  const result = await page.evaluate((expected) => {
    const shell = document.querySelector("[data-glass-shell]");
    const state = window.GlassIMShell?.getState?.();
    return {
      hash: window.location.hash,
      datasetPage: shell?.dataset.glassPage,
      statePage: state?.activePage,
      mobileOpen: shell?.classList.contains("mobile-open"),
    };
  }, route);
  if (result.hash !== `#page:${route}` || result.datasetPage !== route || result.statePage !== route || !result.mobileOpen) {
    throw new Error(`${route} hash route state mismatch: ${JSON.stringify(result)}`);
  }
}

async function assertWalletControlsStyled(page, label) {
  const result = await page.evaluate(() => {
    const controls = [...document.querySelectorAll(".wallet-form input, .wallet-form select, .wallet-form button")];
    return controls.map((control) => {
      const styles = getComputedStyle(control);
      return {
        tag: control.tagName,
        radius: styles.borderRadius,
        height: Math.round(control.getBoundingClientRect().height),
        background: styles.backgroundColor,
      };
    });
  });
  if (!result.length || result.some((item) => item.radius === "0px" || item.height < 38)) {
    throw new Error(`${label} wallet controls are not styled: ${JSON.stringify(result)}`);
  }
}

async function assertWalletAssetRows(page, label, selector, expectedMinimum) {
  const result = await page.evaluate(({ selector: targetSelector, expectedMinimum: minimum }) => {
    const rows = [...document.querySelectorAll(targetSelector)];
    const summaries = rows.map((row) => {
      const box = row.getBoundingClientRect();
      return {
        text: row.textContent.trim().replace(/\s+/g, " ").slice(0, 120),
        hasCoin: Boolean(row.querySelector(".coin-logo")),
        hasSymbol: Boolean(row.querySelector(".asset-main strong b")),
        hasName: Boolean(row.querySelector(".asset-main strong em")),
        hasNetwork: Boolean(row.querySelector(".asset-main small")?.textContent.trim()),
        hasAmount: Boolean(row.querySelector(".asset-balance strong")?.textContent.trim()),
        hasMeta: Boolean(row.querySelector(".asset-balance small")?.textContent.trim()),
        width: Math.round(box.width),
        height: Math.round(box.height),
      };
    });
    return {
      ok: rows.length >= minimum && summaries.every((item) => item.hasCoin && item.hasSymbol && item.hasName && item.hasNetwork && item.hasAmount && item.hasMeta && item.width > 240 && item.height >= 56),
      count: rows.length,
      summaries,
    };
  }, { selector, expectedMinimum });
  if (!result.ok) throw new Error(`${label} wallet asset row structure failed: ${JSON.stringify(result)}`);
}

async function assertWalletDeepRoute(page, route) {
  if (route === "pay") {
    await assertWalletAssetRows(page, route, ".asset-list:not(.wallet-asset-picker) .asset-row", 8);
    await assertWalletHomeLayout(page);
    await assertWalletHomeTabs(page);
    return;
  }
  if (["payCode", "sendCrypto", "transfer"].includes(route)) {
    await assertWalletAssetRows(page, route, ".wallet-asset-picker .wallet-asset-choice", route === "payCode" ? 4 : 3);
    if (["sendCrypto", "transfer"].includes(route)) {
      await assertPage(page, () => Boolean(document.querySelector(".selected-asset-field .coin-logo") && document.querySelector(".selected-asset-field strong")?.textContent.trim()), `${route} missing selected asset field`);
    }
    return;
  }
  if (route === "swapCrypto") {
    await assertWalletAssetRows(page, route, ".swap-asset-panel .wallet-asset-choice", 2);
    await assertPage(page, () => Boolean(document.querySelector(".route-steps")?.textContent.includes("Bridge")), "swap route steps missing");
  }
}

async function assertWalletHomeLayout(page) {
  const result = await page.evaluate(() => {
    const shell = document.querySelector("[data-glass-shell]");
    const hero = document.querySelector(".wallet-hero")?.getBoundingClientRect();
    const firstAsset = document.querySelector(".asset-list:not(.wallet-asset-picker) .asset-row")?.getBoundingClientRect();
    const homeList = document.querySelector(".wallet-home .asset-list:not(.wallet-asset-picker)");
    const activeNav = document.querySelector(".rail-icon.active em")?.textContent.trim();
    const listStyles = homeList ? getComputedStyle(homeList) : null;
    return {
      view: shell?.dataset.glassView,
      page: shell?.dataset.glassPage,
      heroHeight: Math.round(hero?.height || 0),
      firstAssetTop: Math.round(firstAsset?.top || 0),
      activeNav,
      listMarginBottom: listStyles?.marginBottom || "",
    };
  });
  if (result.view !== "me" || result.page !== "pay" || result.heroHeight > 200 || result.firstAssetTop > 360 || !result.listMarginBottom || result.listMarginBottom === "0px") {
    throw new Error(`wallet home layout failed: ${JSON.stringify(result)}`);
  }
}

async function assertWalletHomeTabs(page) {
  const tabs = [
    ["defi", "[data-wallet-panel='defi'] .wallet-info-card", "wallet:tab"],
    ["nft", "[data-wallet-panel='nft'] .wallet-nft-card", "wallet:tab"],
    ["records", "[data-wallet-panel='records'] .tx-row", "wallet:tab"],
    ["assets", "[data-wallet-panel='assets'] .asset-row", "wallet:tab"],
  ];
  await page.evaluate(() => {
    window.__glassSmokeEvents = [];
    if (!window.__glassSmokeUnsubscribe) {
      window.__glassSmokeUnsubscribe = window.GlassIMShell.on((event) => window.__glassSmokeEvents.push(event));
    }
  });
  for (const [tab, panelSelector, eventType] of tabs) {
    await page.click(`[data-wallet-tab='${tab}']`);
    const result = await page.evaluate(({ tab: expectedTab, panelSelector: expectedPanel, eventType: expectedEvent }) => {
      const state = window.GlassIMShell?.getState?.();
      const active = document.querySelector(".wallet-tabs .active")?.getAttribute("data-wallet-tab");
      const tabButton = document.querySelector(`[data-wallet-tab='${expectedTab}']`);
      const selected = tabButton?.getAttribute("aria-selected");
      const controls = tabButton?.getAttribute("aria-controls");
      const tabIndex = tabButton?.getAttribute("tabindex");
      const panel = controls ? document.getElementById(controls) : null;
      const event = window.__glassSmokeEvents.find((item) => item.type === expectedEvent && item.payload?.tab === expectedTab);
      return {
        walletTab: state?.walletTab,
        active,
        selected,
        controls,
        tabIndex,
        panelRole: panel?.getAttribute("role"),
        panelLabel: panel?.getAttribute("aria-labelledby"),
        panelCount: document.querySelectorAll(expectedPanel).length,
        toastVisible: document.querySelector("#toast")?.classList.contains("show"),
        event: Boolean(event),
      };
    }, { tab, panelSelector, eventType });
    if (result.walletTab !== tab || result.active !== tab || result.selected !== "true" || result.tabIndex !== "0" || result.controls !== `wallet-panel-${tab}` || result.panelRole !== "tabpanel" || result.panelLabel !== `wallet-tab-${tab}` || result.panelCount < 1 || result.toastVisible || !result.event) {
      throw new Error(`wallet tab ${tab} failed: ${JSON.stringify(result)}`);
    }
  }
  await page.focus("[data-wallet-tab='assets']");
  await page.keyboard.press("ArrowRight");
  await page.waitForFunction(() => document.activeElement?.getAttribute("data-wallet-tab") === "defi");
  const keyboardResult = await page.evaluate(() => ({
    walletTab: window.GlassIMShell?.getState?.().walletTab,
    active: document.querySelector(".wallet-tabs .active")?.getAttribute("data-wallet-tab"),
    focused: document.activeElement?.getAttribute("data-wallet-tab"),
    panel: document.querySelector(".wallet-home-panel")?.getAttribute("data-wallet-panel"),
    event: window.__glassSmokeEvents.some((item) => item.type === "wallet:tab" && item.payload?.tab === "defi"),
  }));
  if (keyboardResult.walletTab !== "defi" || keyboardResult.active !== "defi" || keyboardResult.focused !== "defi" || keyboardResult.panel !== "defi" || !keyboardResult.event) {
    throw new Error(`wallet keyboard tab failed: ${JSON.stringify(keyboardResult)}`);
  }
  await page.click("[data-wallet-tab='assets']");
}

async function assertWalletEmptyStates(page) {
  await page.evaluate(() => {
    window.GlassIMShell.setData({
      cryptoAssets: [],
      walletDefiPositions: [],
      walletNftCollections: [],
      walletTransactions: [],
      walletContacts: [],
    });
    window.GlassIMShell.navigate("page:pay");
  });
  for (const tab of ["assets", "defi", "nft", "records"]) {
    await page.click(`[data-wallet-tab='${tab}']`);
    const result = await page.evaluate((expectedTab) => {
      const panel = document.querySelector(`[data-wallet-panel='${expectedTab}']`);
      return {
        empty: panel?.querySelector(`[data-wallet-empty='${expectedTab}']`)?.textContent.trim() || "",
        buttons: panel?.querySelectorAll("button").length || 0,
      };
    }, tab);
    if (!result.empty || result.buttons !== 0) {
      throw new Error(`wallet empty state ${tab} failed: ${JSON.stringify(result)}`);
    }
  }
  await page.evaluate(() => window.GlassIMShell.navigate("page:transfer"));
  await assertPage(page, () => {
    const empty = document.querySelector("[data-wallet-empty='contacts']");
    return Boolean(empty?.textContent.includes("No results") || empty?.textContent.includes("没有匹配内容"));
  }, "wallet transfer contact empty state failed");
}

async function assertWalletEvent(page, route, selector, expectedType, expectedPayload = {}) {
  await page.evaluate(() => {
    window.__glassSmokeEvents = [];
    if (!window.__glassSmokeUnsubscribe) {
      window.__glassSmokeUnsubscribe = window.GlassIMShell.on((event) => window.__glassSmokeEvents.push(event));
    }
  });
  await page.click(selector);
  const result = await page.evaluate((type) => {
    const event = window.__glassSmokeEvents.find((item) => item.type === type);
    return event ? { type: event.type, payload: event.payload, state: event.state } : null;
  }, expectedType);
  if (!result) throw new Error(`${route} did not emit ${expectedType}`);
  for (const [key, value] of Object.entries(expectedPayload)) {
    if (result.payload?.[key] !== value) {
      throw new Error(`${route} ${expectedType} payload mismatch for ${key}: ${JSON.stringify(result)}`);
    }
  }
  if (result.state?.activePage !== route) {
    throw new Error(`${route} ${expectedType} state mismatch: ${JSON.stringify(result)}`);
  }
}

async function assertA11yBasics(page, label) {
  const result = await page.evaluate(() => {
    const visible = (element) => {
      const box = element.getBoundingClientRect();
      const styles = getComputedStyle(element);
      return box.width > 0 && box.height > 0 && styles.visibility !== "hidden" && styles.display !== "none";
    };
    const missingButtonTypes = [...document.querySelectorAll("button:not([type])")].map((button) => button.textContent.trim().slice(0, 32));
    const unnamedControls = [...document.querySelectorAll("button, a[href], input, select, textarea")]
      .filter(visible)
      .filter((element) => !element.textContent.trim() && !element.getAttribute("aria-label") && !element.getAttribute("title") && !element.closest("label"))
      .map((element) => element.outerHTML.slice(0, 120));
    const smallTargets = [...document.querySelectorAll(".work-pane button, .work-pane a[href], .rail button, .sheet button, .sheet a[href]")]
      .filter(visible)
      .map((element) => {
        const box = element.getBoundingClientRect();
        return { text: element.textContent.trim().slice(0, 32), width: Math.round(box.width), height: Math.round(box.height) };
      })
      .filter((item) => item.width < 24 || item.height < 24);
    return { missingButtonTypes, unnamedControls, smallTargets };
  });
  if (result.missingButtonTypes.length || result.unnamedControls.length || result.smallTargets.length) {
    throw new Error(`${label} a11y basics failed: ${JSON.stringify(result)}`);
  }
}

async function assertFocusVisible(page, selector, label) {
  await page.focus(selector);
  const result = await page.evaluate(() => {
    const active = document.activeElement;
    const styles = getComputedStyle(active);
    return {
      tag: active?.tagName,
      outlineWidth: styles.outlineWidth,
      outlineStyle: styles.outlineStyle,
      boxShadow: styles.boxShadow,
    };
  });
  if (result.outlineStyle === "none" && result.boxShadow === "none") {
    throw new Error(`${label} missing visible focus style: ${JSON.stringify(result)}`);
  }
}

async function run() {
  if (!hasPlaywright()) {
    console.error("Playwright is not installed. Run `npm i -D playwright && npx playwright install chromium`, then `npm run smoke:playwright`.");
    process.exit(1);
  }

  const { chromium } = require("playwright");
  fs.mkdirSync(outputDir, { recursive: true });
  const server = await startServer();
  const browser = await chromium.launch({ headless: true });
  const results = [];

  try {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
    const page = await context.newPage();
    const errors = [];
    attachConsoleGuard(page, errors);

    await page.goto(`${server.baseUrl}/index.html?device=mobile&smoke=fullscreen#page:about`, { waitUntil: "networkidle" });
    await assertPage(page, () => window.GlassIMShell?.getState().surface === "fullscreen", "fullscreen surface state did not initialize");
    await assertPage(page, () => document.querySelector("[data-glass-shell]")?.dataset.glassPage === "about", "about deep route did not open");
    await page.screenshot({ path: path.join(outputDir, "fullscreen-about.png"), fullPage: true });
    results.push({ case: "fullscreen-about", url: page.url() });

    for (const route of ["pay", "settings", "notificationSettings", "chatSettings", "privacySettings", "storageSettings"]) {
      await page.goto(`${server.baseUrl}/index.html?device=mobile&smoke=route#page:${route}`, { waitUntil: "networkidle" });
      await assertPage(page, (expected) => document.querySelector("[data-glass-shell]")?.dataset.glassPage === expected, `${route} deep route failed`, route);
      await assertPage(page, () => Boolean(document.querySelector(".work-head h2")?.textContent.trim()), `${route} missing page title`);
    }
    results.push({ case: "mobile-deep-routes", routes: 6 });

    const mobileRoutes = [
      "newFriends",
      "groups",
      "tags",
      "officialAccounts",
      "moments",
      "channels",
      "scan",
      "nearby",
      "miniPrograms",
      "games",
      "pay",
      "payCode",
      "sendCrypto",
      "transfer",
      "swapCrypto",
      "favorites",
      "myMoments",
      "cards",
      "stickers",
      "settings",
      "accountSecurity",
      "notificationSettings",
      "chatSettings",
      "privacySettings",
      "generalSettings",
      "storageSettings",
      "about",
      "help",
      "chatSearch",
      "chatFiles",
      "groupManage",
      "remarkTags",
      "friendPrivacy",
      "addFriend",
    ];
    for (const route of mobileRoutes) {
      await page.goto(`${server.baseUrl}/index.html?device=mobile&smoke=matrix#page:${route}`, { waitUntil: "networkidle" });
      await assertPage(page, (expected) => document.querySelector("[data-glass-shell]")?.dataset.glassPage === expected, `${route} matrix route failed`, route);
      await assertHashRouteState(page, route);
      await assertMobileSurface(page, route);
      await assertA11yBasics(page, route);
      if (["pay", "payCode", "sendCrypto", "transfer", "swapCrypto"].includes(route)) await assertWalletDeepRoute(page, route);
      if (["sendCrypto", "transfer"].includes(route)) await assertWalletControlsStyled(page, route);
      if (route === "transfer") await page.screenshot({ path: path.join(outputDir, "mobile-wallet-transfer.png"), fullPage: true });
      if (route === "channels") await page.screenshot({ path: path.join(outputDir, "mobile-video-feed.png"), fullPage: true });
    }
    const walletEventChecks = [
      ["pay", ".asset-list:not(.wallet-asset-picker) .asset-row", "wallet:asset", { id: "BTC", action: "asset" }],
      ["payCode", ".wallet-asset-picker .wallet-asset-choice", "wallet:receiveAsset", { id: "BTC", action: "receiveAsset" }],
      ["sendCrypto", "[data-wallet-action='max']", "wallet:max", { id: null, action: "max" }],
      ["transfer", "[data-wallet-action='contact']", "wallet:contact", { id: "song", action: "contact" }],
      ["swapCrypto", "[data-wallet-action='swapDirection']", "wallet:swapDirection", { id: null, action: "swapDirection" }],
    ];
    for (const [route, selector, eventType, expectedPayload] of walletEventChecks) {
      await page.goto(`${server.baseUrl}/index.html?device=mobile&smoke=wallet-events#page:${route}`, { waitUntil: "networkidle" });
      await assertHashRouteState(page, route);
      await assertWalletDeepRoute(page, route);
      await assertWalletEvent(page, route, selector, eventType, expectedPayload);
    }
    await page.goto(`${server.baseUrl}/index.html?device=mobile&smoke=wallet-empty#page:pay`, { waitUntil: "networkidle" });
    await assertWalletEmptyStates(page);
    await page.goto(`${server.baseUrl}/index.html?device=mobile&smoke=wallet-back#page:payCode`, { waitUntil: "networkidle" });
    await assertHashRouteState(page, "payCode");
    await page.click("[data-mobile-back]");
    await assertPage(page, () => !document.querySelector("[data-glass-shell]")?.classList.contains("mobile-open"), "wallet mobile back did not return to list");
    await page.goto(`${server.baseUrl}/index.html?device=mobile&smoke=person#person:chen`, { waitUntil: "networkidle" });
    await assertPage(page, () => window.GlassIMShell?.getState().activePersonId === "chen", "person deep route failed");
    await assertMobileSurface(page, "person:chen");
    await assertA11yBasics(page, "person:chen");
    await page.click("[data-mobile-back]");
    await assertPage(page, () => !document.querySelector("[data-glass-shell]")?.classList.contains("mobile-open"), "mobile back did not return to list");
    await page.goto(`${server.baseUrl}/index.html?device=mobile&smoke=person-self#person:self`, { waitUntil: "networkidle" });
    await assertPersonRouteState(page, "self", "me");
    await assertMobileSurface(page, "person:self");
    await assertA11yBasics(page, "person:self");
    await page.goto(`${server.baseUrl}/index.html?device=mobile&smoke=escape#page:settings`, { waitUntil: "networkidle" });
    await page.keyboard.press("Escape");
    await assertPage(page, () => !document.querySelector("[data-glass-shell]")?.classList.contains("mobile-open"), "Escape did not close mobile detail layer");
    await page.goto(`${server.baseUrl}/index.html?device=mobile&smoke=sheet`, { waitUntil: "networkidle" });
    await assertFocusVisible(page, "#plusButton", "plus button");
    await page.click("#plusButton");
    await assertPage(page, () => {
      const sheet = document.querySelector("#sheet");
      return !sheet.hidden && sheet.getAttribute("role") === "dialog" && sheet.getAttribute("aria-modal") === "true" && sheet.contains(document.activeElement);
    }, "sheet did not open as focused dialog");
    await page.keyboard.press("Tab");
    await assertPage(page, () => document.querySelector("#sheet")?.contains(document.activeElement), "Tab focus escaped sheet");
    await page.keyboard.press("Escape");
    await assertPage(page, () => document.querySelector("#sheet")?.hidden && document.activeElement?.id === "plusButton", "Escape did not close sheet and restore focus");
    results.push({ case: "mobile-route-matrix", routes: mobileRoutes.length, personRoutes: 2 });
    results.push({ case: "mobile-hash-wallet-regression", routes: walletEventChecks.length, backRoutes: 1 });

    await page.goto(`${server.baseUrl}/examples/vanilla.html?smoke=embedded`, { waitUntil: "networkidle" });
    await assertPage(page, () => window.GlassIMShell?.getState().surface === "embedded", "embedded surface state did not initialize");
    await assertPage(page, () => getComputedStyle(document.body).overflow === "auto", "embedded surface should not lock host body scroll");
    await page.screenshot({ path: path.join(outputDir, "embedded-wallet.png"), fullPage: true });
    results.push({ case: "embedded-wallet", url: page.url() });

    await page.goto(`${server.baseUrl}/examples/npm-minimal.html?smoke=npm-minimal`, { waitUntil: "networkidle" });
    await assertPage(page, () => {
      const state = window.GlassIMShell?.getState?.();
      const text = document.querySelector(".wallet-hero")?.textContent || "";
      return state?.surface === "embedded" && state?.activePage === "pay" && text.includes("Demo Wallet") && text.includes("$1,248.00");
    }, "npm minimal example did not render host data");
    results.push({ case: "npm-minimal", url: page.url() });

    await page.goto(`${server.baseUrl}/examples/vanilla.html?smoke=runtime-api`, { waitUntil: "networkidle" });
    await page.evaluate(() => {
      window.GlassIMShell.setLang("en");
      window.GlassIMShell.setAppearance("dark");
      window.GlassIMShell.setDensity("compact");
      window.GlassIMShell.navigate("page:pay");
    });
    await assertPage(page, () => {
      const state = window.GlassIMShell.getState();
      return state.lang === "en" && state.resolvedTheme === "dark" && state.density === "compact" && state.activePage === "pay";
    }, "runtime API state update failed");
    await page.screenshot({ path: path.join(outputDir, "api-wallet-dark.png"), fullPage: true });
    results.push({ case: "runtime-api", state: await page.evaluate(() => window.GlassIMShell.getState()) });

    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`${server.baseUrl}/examples/host-api.html?smoke=host-api`, { waitUntil: "networkidle" });
    await assertPage(page, () => window.GlassIMShell?.getState().surface === "embedded", "host API example did not use embedded surface");
    await page.click("[data-host-route='page:pay']");
    await assertPage(page, () => {
      const data = window.GlassIMShell.getData();
      const text = document.querySelector(".wallet-hero")?.textContent || "";
      return data.walletSummary.total === "$27,342.58" && data.walletDefiPositions.length === 1 && data.walletNftCollections.length === 1 && text.includes("Host Treasury") && text.includes("$27,342.58") && text.includes("Host-owned mock portfolio");
    }, "host wallet summary override did not render");
    await page.click("[data-wallet-tab='defi']");
    await assertPage(page, () => document.querySelector("[data-wallet-panel='defi']")?.textContent.includes("Operating pool"), "host wallet defi override did not render");
    await page.click("[data-wallet-tab='nft']");
    await assertPage(page, () => document.querySelector("[data-wallet-panel='nft']")?.textContent.includes("Access Keys"), "host wallet nft override did not render");
    await page.click("[data-host-route='page:transfer']");
    await assertPage(page, () => {
      const inputs = [...document.querySelectorAll(".wallet-form input")].map((input) => input.value);
      return document.querySelector("[data-glass-shell]")?.dataset.glassPage === "transfer" && inputs.includes("Host transfer memo");
    }, "host transfer flow override did not render");
    await page.evaluate(() => window.GlassIMShell.navigate("page:payCode"));
    await assertPage(page, () => document.querySelector(".address-copy")?.textContent.includes("host-mock-usdc-receive-address"), "host receive flow override did not render");
    await page.evaluate(() => window.GlassIMShell.navigate("page:sendCrypto"));
    await assertPage(page, () => document.querySelector(".wallet-form")?.textContent.includes("0.01 USDC") && document.querySelector(".wallet-form input")?.value === "host-mock-pay-recipient", "host pay flow override did not render");
    await page.evaluate(() => window.GlassIMShell.navigate("page:swapCrypto"));
    await assertPage(page, () => document.querySelector(".swap-rate")?.textContent.includes("3,230 USDC") && document.querySelector(".route-steps")?.textContent.includes("Router"), "host swap flow override did not render");
    await page.click("[data-host-theme='aurora']");
    await assertPage(page, () => getComputedStyle(document.querySelector("[data-glass-shell]")).getPropertyValue("--green").trim() === "#14b8a6", "host theme control did not apply token");
    await assertPage(page, () => document.querySelector("[data-event-log]")?.textContent.includes("page:open"), "host event log did not capture route event");
    await page.screenshot({ path: path.join(outputDir, "host-api.png"), fullPage: true });
    results.push({ case: "host-api", url: page.url() });

    if (errors.length) throw new Error(`Console errors:\n- ${errors.join("\n- ")}`);

    await context.close();
  } finally {
    await browser.close();
    await server.close();
  }

  console.log(JSON.stringify({ ok: true, baseUrl: server.baseUrl, screenshots: path.relative(root, outputDir), results }, null, 2));
}

run().catch((error) => {
  console.error("Playwright smoke failed:");
  console.error(error.stack || error.message);
  process.exit(1);
});
