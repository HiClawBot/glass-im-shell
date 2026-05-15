#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const workflow = fs.readFileSync(path.join(root, ".github/workflows/ci.yml"), "utf8");
const lockPath = path.join(root, "package-lock.json");
const failures = [];

if (!fs.existsSync(lockPath)) {
  failures.push("package-lock.json is required for deterministic CI installs");
} else {
  const lock = JSON.parse(fs.readFileSync(lockPath, "utf8"));
  if (lock.lockfileVersion < 3) failures.push("package-lock.json must use lockfileVersion 3 or newer");
  if (lock.packages?.[""]?.name !== pkg.name) failures.push("package-lock root package name must match package.json");
  if (lock.packages?.[""]?.version !== pkg.version) failures.push("package-lock root package version must match package.json");
}

const blockedLifecycleScripts = [
  "preinstall",
  "install",
  "postinstall",
  "prepare",
  "prepublish",
  "prepublishOnly",
  "prepack",
  "postpack",
  "publish",
  "postpublish",
];

for (const script of blockedLifecycleScripts) {
  if (pkg.scripts?.[script]) failures.push(`package.json must not define lifecycle script ${script}`);
}

if (pkg.dependencies && Object.keys(pkg.dependencies).length > 0) {
  failures.push("runtime dependencies must stay empty for the static UI package");
}

if (!pkg.devDependencies?.playwright) {
  failures.push("playwright dev dependency is required for browser smoke verification");
}

if (!workflow.includes("permissions:\n  contents: read")) {
  failures.push("CI workflow must use read-only contents permission");
}

if (!workflow.includes("FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true")) {
  failures.push("CI workflow must opt into Node 24 action runtime");
}

if (workflow.includes("pull_request_target")) {
  failures.push("CI workflow must not use elevated pull request workflows for untrusted changes");
}

if (/secrets\./.test(workflow)) {
  failures.push("CI workflow must not require repository secrets for verification");
}

for (const expected of [
  "actions/checkout@v5",
  "actions/setup-node@v6",
  "actions/upload-artifact@v5",
  "npm ci",
  "npx playwright install --with-deps chromium",
  "npm run release:check",
  "npm run smoke:playwright",
  "npm pack --dry-run",
]) {
  if (!workflow.includes(expected)) failures.push(`CI workflow missing ${expected}`);
}

if (pkg.private === true) failures.push("package.json private must not be true for public package preview");
if (pkg.publishConfig?.access !== "public") failures.push("publishConfig.access must be public");

if (failures.length) {
  console.error("Supply chain audit failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Supply chain audit passed.");
