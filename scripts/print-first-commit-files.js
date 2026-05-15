#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const manifestPath = path.join(root, "docs/FIRST_COMMIT_MANIFEST.md");
const manifest = fs.readFileSync(manifestPath, "utf8");
const failures = [];

function sectionText(title) {
  const pattern = new RegExp(`## ${title}\\n([\\s\\S]*?)(?=\\n## |$)`);
  return manifest.match(pattern)?.[1] || "";
}

function manifestFiles(title) {
  return sectionText(title)
    .split(/\r?\n/)
    .map((line) => line.match(/^- `([^`]+)`$/)?.[1])
    .filter(Boolean);
}

const includeFiles = manifestFiles("Include In First Commit");
const excludePatterns = manifestFiles("Exclude From First Commit");
const disallowed = [
  /^node_modules\//,
  /^\.playwright-cli\//,
  /^\.playwright-mcp\//,
  /^output\/smoke\//,
  /^dist\//,
  /^\.cache\//,
  /\.log$/,
  /\.tgz$/,
  /(^|\/)\.DS_Store$/,
];

if (!includeFiles.length) failures.push("FIRST_COMMIT_MANIFEST has no include files");
if (!excludePatterns.length) failures.push("FIRST_COMMIT_MANIFEST has no exclude patterns");

const seen = new Set();
for (const file of includeFiles) {
  if (seen.has(file)) failures.push(`Duplicate first commit file: ${file}`);
  seen.add(file);
  if (!fs.existsSync(path.join(root, file))) failures.push(`Missing first commit file: ${file}`);
  if (disallowed.some((pattern) => pattern.test(file))) failures.push(`Disallowed first commit file: ${file}`);
}

for (const expected of [
  ".github/workflows/ci.yml",
  ".gitignore",
  "package-lock.json",
  "package.json",
  "docs/FIRST_COMMIT_MANIFEST.md",
  "scripts/print-first-commit-files.js",
]) {
  if (!seen.has(expected)) failures.push(`First commit manifest missing ${expected}`);
}

for (const expected of [
  "node_modules/",
  ".playwright-cli/",
  ".playwright-mcp/",
  "output/smoke/",
  "*.tgz",
  ".DS_Store",
]) {
  if (!excludePatterns.includes(expected)) failures.push(`First commit exclude list missing ${expected}`);
}

if (failures.length) {
  console.error("First commit plan failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

const command = `git add -- ${includeFiles.map((file) => JSON.stringify(file)).join(" ")}`;

if (process.argv.includes("--json")) {
  console.log(JSON.stringify({ count: includeFiles.length, files: includeFiles, command }, null, 2));
} else {
  console.log(`# First commit file count: ${includeFiles.length}`);
  console.log(command);
}
