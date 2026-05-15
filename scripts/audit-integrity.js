#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const pkg = JSON.parse(read("package.json"));
const script = read("script.js");
const schema = read("schema.d.ts");
const readme = read("README.md");
const integration = read("INTEGRATION.md");
const failures = [];

function collectKeys(source) {
  const keys = new Set();
  source.replace(/"([^"]+)":/g, (_, key) => {
    keys.add(key);
    return "";
  });
  return keys;
}

const zhBlock = script.match(/\n\s*zh:\s*\{([\s\S]*?)\n\s*\},\n\s*en:/);
const enBlock = script.match(/\n\s*en:\s*\{([\s\S]*?)\n\s*\},\n\};/);
if (!zhBlock || !enBlock) {
  failures.push("Could not locate zh/en i18n dictionaries in script.js");
} else {
  const zhKeys = collectKeys(zhBlock[1]);
  const enKeys = collectKeys(enBlock[1]);
  for (const key of zhKeys) if (!enKeys.has(key)) failures.push(`Missing English i18n key: ${key}`);
  for (const key of enKeys) if (!zhKeys.has(key)) failures.push(`Missing Chinese i18n key: ${key}`);
  const literalRefs = [...script.matchAll(/\bt\("([^"]+)"/g)].map((match) => match[1]);
  for (const key of literalRefs) {
    if (!zhKeys.has(key)) failures.push(`Referenced i18n key not found in zh: ${key}`);
    if (!enKeys.has(key)) failures.push(`Referenced i18n key not found in en: ${key}`);
  }
}

const versionMatch = script.match(/const GLASS_IM_VERSION = "([^"]+)"/);
if (!versionMatch) failures.push("Missing GLASS_IM_VERSION constant");
else if (versionMatch[1] !== pkg.version) failures.push(`Version mismatch: package ${pkg.version}, script ${versionMatch[1]}`);

const requiredApi = [
  "mount",
  "render",
  "navigate",
  "setData",
  "setLang",
  "setTheme",
  "setAppearance",
  "setDensity",
  "setSurface",
  "configure",
  "getVersion",
  "getState",
  "getData",
  "on",
];

for (const name of requiredApi) {
  if (!script.includes(`${name}`)) failures.push(`Runtime API missing from script.js: ${name}`);
  if (!schema.includes(`${name}`)) failures.push(`Runtime API missing from schema.d.ts: ${name}`);
}

const requiredDocs = ["ARCHITECTURE.md", "docs/API_CONTRACT.md", "setAppearance", "setDensity", "setSurface", "configure", "surface", "data-glass-shell", "release:check"];
for (const term of requiredDocs) {
  if (!readme.includes(term) && !integration.includes(term)) failures.push(`Documentation missing term: ${term}`);
}

if (failures.length) {
  console.error("Integrity audit failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Integrity audit passed.");
