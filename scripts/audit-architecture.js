#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const stat = (file) => fs.statSync(path.join(root, file));
const failures = [];

const architecturePath = path.join(root, "ARCHITECTURE.md");
const moduleMapPath = path.join(root, "src/module-map.json");

if (!fs.existsSync(architecturePath)) failures.push("Missing ARCHITECTURE.md");
if (!fs.existsSync(moduleMapPath)) failures.push("Missing src/module-map.json");

let moduleMap = null;
if (fs.existsSync(moduleMapPath)) {
  try {
    moduleMap = JSON.parse(read("src/module-map.json"));
  } catch (error) {
    failures.push(`Invalid src/module-map.json: ${error.message}`);
  }
}

if (moduleMap) {
  const requiredModules = ["runtime", "data", "navigation", "chat", "contacts", "explore", "wallet", "profile-settings", "styles", "release"];
  const ids = new Set((moduleMap.modules || []).map((item) => item.id));
  for (const id of requiredModules) {
    if (!ids.has(id)) failures.push(`Module map missing boundary: ${id}`);
  }
  for (const item of moduleMap.modules || []) {
    if (!Array.isArray(item.targetFiles) || !item.targetFiles.length) failures.push(`Module ${item.id} missing targetFiles`);
    if (!Array.isArray(item.owns) || !item.owns.length) failures.push(`Module ${item.id} missing owns`);
  }
}

const architecture = fs.existsSync(architecturePath) ? read("ARCHITECTURE.md") : "";
for (const term of ["Module Boundaries", "Public Contract", "Beta Refactor Rules", "Size Budgets"]) {
  if (!architecture.includes(term)) failures.push(`ARCHITECTURE.md missing section: ${term}`);
}

const pkg = JSON.parse(read("package.json"));
const packageFiles = new Set(pkg.files || []);
for (const file of ["ARCHITECTURE.md", "src/module-map.json", "scripts/audit-architecture.js", "scripts/audit-package.js", "docs/RELEASE_DRAFT.md"]) {
  if (!packageFiles.has(file)) failures.push(`package.json files missing ${file}`);
}

const scriptBytes = stat("script.js").size;
const styleBytes = stat("styles.css").size;
if (scriptBytes > 160000) failures.push(`script.js exceeds architecture budget: ${scriptBytes} bytes`);
if (styleBytes > 110000) failures.push(`styles.css exceeds architecture budget: ${styleBytes} bytes`);

if (failures.length) {
  console.error("Architecture audit failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Architecture audit passed.");
