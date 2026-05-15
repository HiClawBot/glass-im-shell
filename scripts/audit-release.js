#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const requiredFiles = [
  "README.md",
  "LICENSE",
  "CHANGELOG.md",
  "CONTRIBUTING.md",
  "HOST_READINESS.md",
  "INTEGRATION.md",
  "ARCHITECTURE.md",
  "RELEASE_CHECKLIST.md",
  "SECURITY.md",
  "docs/API_CONTRACT.md",
  "docs/RELEASE_ASSETS.md",
  "docs/BETA_READINESS_REPORT.md",
  "docs/COMPONENT_MATRIX.md",
  "docs/DESIGN_TOKENS.md",
  "docs/FIRST_COMMIT_MANIFEST.md",
  "docs/GITHUB_RELEASE_GUIDE.md",
  "docs/HOST_DATA_OVERRIDES.md",
  "docs/HUMAN_ACCEPTANCE_ROUTE.md",
  "docs/LOCAL_PREVIEW.md",
  "docs/MAINTAINER_GUIDE.md",
  "docs/PACKAGE_METADATA.md",
  "docs/PAGE_MATRIX.md",
  "docs/PRE_RELEASE_ACCEPTANCE.md",
  "docs/PUBLICATION_READINESS.md",
  "docs/REPOSITORY_LAUNCH_CHECKLIST.md",
  "docs/RELEASE_DRAFT.md",
  "docs/SCREENSHOT_ACCEPTANCE_MAP.md",
  "docs/STATE_MATRIX.md",
  "docs/SUPPLY_CHAIN.md",
  "docs/UI_IMPLEMENTATION_SPEC.md",
  "docs/WALLET_IMPLEMENTATION.md",
  "docs/assets/glass-im-shell-preview.svg",
  "release-manifest.json",
  "schema.d.ts",
  "scripts/audit-manifest.js",
  "scripts/audit-repository.js",
  "scripts/audit-supply-chain.js",
  "scripts/serve-local.js",
  "examples/host-api.html",
  ".github/ISSUE_TEMPLATE/bug_report.md",
  ".github/ISSUE_TEMPLATE/feature_request.md",
  ".github/ISSUE_TEMPLATE/config.yml",
  ".github/pull_request_template.md",
  ".github/workflows/ci.yml",
  ".gitignore",
];
const scanExt = new Set([".html", ".css", ".js", ".md", ".json", ".ts", ".yml", ".yaml", ".svg"]);
const skipDirs = new Set([".git", "node_modules", ".playwright-cli", ".playwright-mcp", "output"]);

const riskyTerms = [
  ["we", "chat"].join(""),
  ["ten", "cent"].join(""),
  "\u5fae\u4fe1",
  "\u817e\u8baf",
  ["safe", "pal"].join(""),
  "\u670b\u53cb\u5708",
  "\u89c6\u9891\u53f7",
  ["1", ":", "1"].join(""),
  ["cl", "one"].join(""),
];

const restrictedAssetExt = new Set([".psd", ".sketch", ".fig", ".ai"]);

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skipDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

const failures = [];

for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) failures.push(`Missing required release file: ${file}`);
}

for (const file of walk(root)) {
  const rel = path.relative(root, file);
  const ext = path.extname(file).toLowerCase();
  if (restrictedAssetExt.has(ext)) failures.push(`Restricted design source asset: ${rel}`);
  if (!scanExt.has(ext)) continue;
  const text = fs.readFileSync(file, "utf8").toLowerCase();
  for (const term of riskyTerms) {
    if (rel === "scripts/audit-release.js") continue;
    if (text.includes(term.toLowerCase())) failures.push(`Risky term "${term}" in ${rel}`);
  }
}

if (failures.length) {
  console.error("Release audit failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Release audit passed.");
