#!/usr/bin/env node

const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const failures = [];

let packed = [];
try {
  const output = execFileSync("npm", ["pack", "--dry-run", "--json"], {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  packed = JSON.parse(output)[0]?.files?.map((file) => file.path).sort() || [];
} catch (error) {
  failures.push(`npm pack preview failed: ${error.message}`);
}

const packedSet = new Set(packed);
const expected = new Set([...(pkg.files || []), "package.json"]);

const requiredScalars = {
  name: "glass-im-shell",
  version: "0.1.0",
  license: "MIT",
  main: "./script.js",
  browser: "./script.js",
  style: "./styles.css",
  types: "./schema.d.ts",
};

for (const [field, value] of Object.entries(requiredScalars)) {
  if (pkg[field] !== value) failures.push(`package.json ${field} must be ${value}`);
}

if (!pkg.description?.includes("Original liquid-glass IM shell UI")) {
  failures.push("package.json description must keep original generic UI positioning");
}

for (const keyword of ["im", "chat", "ui-kit", "liquid-glass", "prototype"]) {
  if (!pkg.keywords?.includes(keyword)) failures.push(`package.json keywords missing ${keyword}`);
}

if (!pkg.sideEffects?.includes("./styles.css")) {
  failures.push("package.json sideEffects must include ./styles.css");
}

if (pkg.engines?.node !== ">=20") {
  failures.push("package.json engines.node must be >=20");
}

if (pkg.publishConfig?.access !== "public") {
  failures.push("package.json publishConfig.access must be public");
}

const requiredExports = [".", "./styles.css", "./schema", "./mobile", "./npm-minimal", "./vanilla", "./host-api"];
for (const entry of requiredExports) {
  if (!pkg.exports?.[entry]) failures.push(`package.json exports missing ${entry}`);
}

for (const script of ["release:check", "ci:verify", "smoke:playwright", "serve:local", "pack:dry", "audit:manifest", "audit:supply-chain"]) {
  if (!pkg.scripts?.[script]) failures.push(`package.json scripts missing ${script}`);
}

for (const field of ["repository", "homepage", "bugs"]) {
  const value = JSON.stringify(pkg[field] || "");
  if (/your-|example|placeholder/i.test(value)) {
    failures.push(`package.json ${field} must not use placeholder metadata`);
  }
}

for (const file of expected) {
  if (!packedSet.has(file)) failures.push(`Package preview missing expected file: ${file}`);
}

const disallowed = [
  ".github/",
  ".playwright-cli/",
  ".playwright-mcp/",
  "node_modules/",
  "output/",
  "package-lock.json",
  ".DS_Store",
];

for (const file of packed) {
  if (!expected.has(file)) failures.push(`Package preview contains unlisted file: ${file}`);
  if (disallowed.some((prefix) => file === prefix || file.startsWith(prefix))) {
    failures.push(`Package preview contains ignored local file: ${file}`);
  }
}

if (failures.length) {
  console.error("Package audit failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Package audit passed (${packed.length} files).`);
