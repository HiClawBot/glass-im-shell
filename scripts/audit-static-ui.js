#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const files = {
  index: "index.html",
  mobile: "mobile.html",
  npmMinimal: "examples/npm-minimal.html",
  example: "examples/vanilla.html",
  hostExample: "examples/host-api.html",
  ci: ".github/workflows/ci.yml",
  releaseAssets: "docs/RELEASE_ASSETS.md",
  apiContract: "docs/API_CONTRACT.md",
  betaReadiness: "docs/BETA_READINESS_REPORT.md",
  componentMatrix: "docs/COMPONENT_MATRIX.md",
  designTokens: "docs/DESIGN_TOKENS.md",
  firstCommitManifest: "docs/FIRST_COMMIT_MANIFEST.md",
  githubReleaseGuide: "docs/GITHUB_RELEASE_GUIDE.md",
  hostDataOverrides: "docs/HOST_DATA_OVERRIDES.md",
  humanAcceptanceRoute: "docs/HUMAN_ACCEPTANCE_ROUTE.md",
  localPreview: "docs/LOCAL_PREVIEW.md",
  maintainerGuide: "docs/MAINTAINER_GUIDE.md",
  packageMetadata: "docs/PACKAGE_METADATA.md",
  pageMatrix: "docs/PAGE_MATRIX.md",
  preReleaseAcceptance: "docs/PRE_RELEASE_ACCEPTANCE.md",
  publicationReadiness: "docs/PUBLICATION_READINESS.md",
  repositoryLaunchChecklist: "docs/REPOSITORY_LAUNCH_CHECKLIST.md",
  manifest: "release-manifest.json",
  releaseDraft: "docs/RELEASE_DRAFT.md",
  screenshotAcceptanceMap: "docs/SCREENSHOT_ACCEPTANCE_MAP.md",
  stateMatrix: "docs/STATE_MATRIX.md",
  supplyChain: "docs/SUPPLY_CHAIN.md",
  uiImplementationSpec: "docs/UI_IMPLEMENTATION_SPEC.md",
  walletImplementation: "docs/WALLET_IMPLEMENTATION.md",
  previewAsset: "docs/assets/glass-im-shell-preview.svg",
  gitignore: ".gitignore",
  styles: "styles.css",
  script: "script.js",
  readme: "README.md",
  integration: "INTEGRATION.md",
  firstCommitPlan: "scripts/print-first-commit-files.js",
  repositoryAudit: "scripts/audit-repository.js",
  smoke: "scripts/smoke-playwright.js",
};

const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const failures = [];
const stylesText = read(files.styles);

function assertBalanced(text, open, close, label) {
  let depth = 0;
  let line = 1;
  for (const char of text) {
    if (char === "\n") line += 1;
    if (char === open) depth += 1;
    if (char === close) depth -= 1;
    if (depth < 0) {
      failures.push(`${files.styles} has extra ${close} before line ${line} in ${label}`);
      return;
    }
  }
  if (depth !== 0) failures.push(`${files.styles} has unbalanced ${label}`);
}

function requireIncludes(file, terms) {
  const text = read(file);
  for (const term of terms) {
    if (!text.includes(term)) failures.push(`${file} missing ${term}`);
  }
}

for (const file of [files.index, files.mobile, files.npmMinimal, files.example, files.hostExample]) {
  requireIncludes(file, [
    "<!doctype html>",
    "<meta charset=\"UTF-8\"",
    "name=\"viewport\"",
    "<title>",
    "rel=\"icon\"",
  ]);
}

requireIncludes(files.index, [
  "data-glass-shell",
  "aria-label=\"主导航\"",
  "aria-live=\"polite\"",
  "autocomplete=\"off\"",
]);

requireIncludes(files.mobile, [
  "title=\"Glass IM Shell mobile app\"",
  "aria-label=\"Glass IM Shell mobile preview\"",
]);

requireIncludes(files.example, [
  "aria-label=\"Host controls\"",
  "surface: \"embedded\"",
  "--glass-shell-height",
  "data-host-action",
  "data-host-appearance",
  "data-host-density",
]);

requireIncludes(files.npmMinimal, [
  "surface: \"embedded\"",
  "route: \"page:pay\"",
  "Demo Wallet",
  "walletFlowConfig",
]);

requireIncludes(files.hostExample, [
  "aria-label=\"Host integration controls\"",
  "surface: \"embedded\"",
  "data-host-route",
  "data-host-theme",
  "data-event-log",
  "data-runtime-state",
  "GlassIMShell.configure",
]);

requireIncludes(files.script, [
  "data-glass-shell",
  "dataset.glassVersion",
  "dataset.glassSurface",
  "getVersion",
  "setSurface",
  "window.matchMedia(\"(prefers-color-scheme: dark)\")",
]);

requireIncludes(files.styles, [
  "@media (prefers-reduced-motion: reduce)",
  ":focus-visible",
  ":root[data-theme=\"light\"]",
  ":root[data-theme=\"dark\"]",
  ":root[data-glass-surface=\"embedded\"]",
  ":root[data-density=\"compact\"]",
]);

assertBalanced(stylesText, "{", "}", "block braces");
assertBalanced(stylesText, "(", ")", "function parentheses");

const disallowedGlobalSelectors = [
  /^body\s*\{/m,
  /^body::before\s*\{/m,
  /^\*\s*\{/m,
  /^button\s*\{/m,
  /^a\s*\{/m,
  /^h[1-6]\s*\{/m,
  /^p\s*\{/m,
  /^small\s*\{/m,
];

for (const pattern of disallowedGlobalSelectors) {
  if (pattern.test(stylesText)) failures.push(`styles.css contains unscoped global selector: ${pattern}`);
}

requireIncludes(files.readme, [
  "docs/assets/glass-im-shell-preview.svg",
  "Quick Start",
  "Embed",
  "Release Assets",
  "npm run release:check",
  "data-glass-shell",
  "License Scope",
]);

requireIncludes(files.releaseAssets, [
  "output/smoke/mobile-wallet-transfer.png",
  "output/smoke/mobile-video-feed.png",
  "output/smoke/host-api.png",
  "npm run smoke:playwright",
  "docs/assets/glass-im-shell-preview.svg",
  "docs/SCREENSHOT_ACCEPTANCE_MAP.md",
]);

requireIncludes(files.betaReadiness, [
  "Beta Readiness Report",
  "Pre-Beta release candidate",
  "Capability Matrix",
  "Verification Evidence",
  "npm run ci:verify",
  "Go / No-Go",
]);

requireIncludes(files.githubReleaseGuide, [
  "GitHub Release Guide",
  "Repository Setup",
  "Metadata Update",
  "Final Local Verification",
  "GitHub Release",
  "Optional Package Publish",
  "Post-Release Checks",
]);

requireIncludes(files.hostDataOverrides, [
  "Host Data Overrides",
  "Override Methods",
  "Minimal Static Embed",
  "Async Data Provider",
  "Runtime Replacement",
  "People And Directory",
  "Chats And Messages",
  "Activity And Video Feed",
  "Wallet Data",
  "Empty And Disabled Fixtures",
  "Validation",
]);

requireIncludes(files.localPreview, [
  "Local Preview",
  "5500-5509",
  "npm run serve:local",
  "mobile.html#page:pay",
  "Acceptance Rule",
]);

requireIncludes(files.maintainerGuide, [
  "Maintainer Guide",
  "Issue Triage",
  "Pull Request Review",
  "Release Process",
  "Package Boundary",
  "Boundary Review",
  "CI Expectations",
]);

requireIncludes(files.packageMetadata, [
  "Package Metadata",
  "Current Metadata",
  "Repository URL Fields",
  "sideEffects",
  "publishConfig",
  "npm pack --dry-run",
]);

requireIncludes(files.publicationReadiness, [
  "Publication Readiness",
  "Required Metadata",
  "Public Repository Checklist",
  "Final Local Gate",
  "Human Acceptance Gate",
  "Required Evidence",
  "Publisher Sign-Off Template",
]);

requireIncludes(files.pageMatrix, [
  "Page Matrix",
  "Primary Shell Views",
  "Contact Pages",
  "Explore Pages",
  "Wallet Pages",
  "Profile And Settings Pages",
  "Smoke Coverage",
]);

requireIncludes(files.componentMatrix, [
  "Component Matrix",
  "Navigation Components",
  "List Components",
  "Chat Components",
  "Wallet Components",
  "Overlay Components",
  "State Components",
  "Test Selectors",
]);

requireIncludes(files.designTokens, [
  "Design Tokens",
  "Runtime Axes",
  "Color Tokens",
  "Glass Material Tokens",
  "Typography Tokens",
  "Spacing Tokens",
  "Motion Tokens",
  "Embedded Host Tokens",
]);

requireIncludes(files.preReleaseAcceptance, [
  "Pre-Release Acceptance Checklist",
  "Automated Gate",
  "Screenshot Review",
  "Mobile Flow Review",
  "Wallet Review",
  "Release Boundary Review",
  "No-Go Conditions",
  "53 files",
  "docs/API_CONTRACT.md",
  "docs/HUMAN_ACCEPTANCE_ROUTE.md",
]);

requireIncludes(files.manifest, [
  "\"schema\": 1",
  "\"name\": \"glass-im-shell\"",
  "\"version\": \"0.1.0\"",
  "\"packageFiles\"",
  "\"smokeScreenshots\"",
  "\"releaseDocuments\"",
  "\"boundaries\"",
]);

requireIncludes(files.releaseDraft, [
  "Glass IM Shell 0.1.0",
  "Verification",
  "Release Notes",
  "Asset Boundary",
  "npm run ci:verify",
  "53 files",
  "npm-minimal",
]);

requireIncludes(files.apiContract, [
  "API Contract",
  "Runtime Methods",
  "Route Strings",
  "Stable Selectors",
  "Event Payloads",
  "Data Replacement Rules",
]);

requireIncludes(files.humanAcceptanceRoute, [
  "Human Acceptance Route",
  "Local Review URLs",
  "Screenshot Review",
  "Contract Review",
  "Release Boundary",
  "Sign-Off Decision",
  "total files: 53",
  "npm run ci:verify",
]);

requireIncludes(files.repositoryLaunchChecklist, [
  "Repository Launch Checklist",
  "Repository Identity",
  "Required Files",
  "Git Ignore Boundary",
  "Metadata Gate",
  "Verification Gate",
  "Manual Gate",
  "Public Launch Gate",
  "total files: 53",
  "npm run ci:verify",
]);

requireIncludes(files.firstCommitManifest, [
  "First Commit Manifest",
  "Commit Root",
  "Include In First Commit",
  "Exclude From First Commit",
  "First Commit Commands",
  "No-Go Conditions",
  "package-lock.json",
  "scripts/audit-repository.js",
  "scripts/print-first-commit-files.js",
  "total files: 53",
  "npm run commit:plan",
  "git status --short",
]);

requireIncludes(files.screenshotAcceptanceMap, [
  "Screenshot Acceptance Map",
  "Screenshot Matrix",
  "Wallet Regression Coverage",
  "output/smoke/fullscreen-about.png",
  "output/smoke/mobile-wallet-transfer.png",
  "output/smoke/mobile-video-feed.png",
  "output/smoke/embedded-wallet.png",
  "output/smoke/api-wallet-dark.png",
  "output/smoke/host-api.png",
  "mobile-hash-wallet-regression",
  "npm-minimal",
  "state.activePage",
]);

requireIncludes(files.stateMatrix, [
  "State Matrix",
  "State Contract",
  "Global Runtime States",
  "Navigation And List States",
  "Chat States",
  "Wallet States",
  "Host Integration Rules",
  "Acceptance Checklist",
]);

requireIncludes(files.supplyChain, [
  "Supply Chain",
  "Dependency Boundary",
  "Script Boundary",
  "CI Boundary",
  "Wallet Boundary",
  "npm run audit:supply-chain",
]);

requireIncludes(files.uiImplementationSpec, [
  "UI Implementation Spec",
  "Current Scope",
  "Public Runtime Contract",
  "Information Architecture",
  "Screen Documentation Model",
  "Component Documentation Model",
  "Wallet Implementation Model",
  "Acceptance Gates",
]);

requireIncludes(files.walletImplementation, [
  "Wallet Implementation",
  "Boundary",
  "Data Model",
  "Default Asset Universe",
  "Asset Row Anatomy",
  "Receive Flow",
  "Pay Flow",
  "Transfer Flow",
  "Swap Flow",
  "Host Events",
]);

requireIncludes(files.previewAsset, [
  "<svg",
  "Glass IM Shell",
  "Liquid Glass IM UI Kit",
  "Global Wallet",
]);

requireIncludes(files.integration, [
  "Test Selectors",
  "data-glass-version",
  "Embedded Surface",
  "Host API Example",
  "Use these for smoke tests",
]);

requireIncludes(files.smoke, [
  "GLASS_SMOKE_PORT_START",
  "5500",
  "fullscreen-about.png",
  "mobile-wallet-transfer.png",
  "mobile-video-feed.png",
  "embedded-wallet.png",
  "api-wallet-dark.png",
  "npm-minimal",
  "mobile-route-matrix",
  "mobile-hash-wallet-regression",
  "assertHashRouteState",
  "assertWalletDeepRoute",
  "assertA11yBasics",
  "assertFocusVisible",
  "Console errors",
]);

requireIncludes(files.repositoryAudit, [
  "Repository audit",
  "Repository Identity",
  "Git Ignore Boundary",
  "Metadata Gate",
  "Public Launch Gate",
  "audit:repository",
  "git",
  "ls-files",
]);

requireIncludes(files.firstCommitPlan, [
  "FIRST_COMMIT_MANIFEST",
  "Include In First Commit",
  "Exclude From First Commit",
  "git add --",
  "scripts/print-first-commit-files.js",
  "--json",
]);

requireIncludes(files.ci, [
  "npm ci",
  "npx playwright install --with-deps chromium",
  "npm run release:check",
  "npm run smoke:playwright",
  "npm pack --dry-run",
  "output/smoke",
]);

requireIncludes(files.gitignore, [
  ".playwright-cli/",
  ".playwright-mcp/",
  "*.tgz",
  "output/smoke/",
]);

if (failures.length) {
  console.error("Static UI audit failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Static UI audit passed.");
