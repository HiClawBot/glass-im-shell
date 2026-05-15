#!/usr/bin/env node

const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const failures = [];

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function exists(file) {
  return fs.existsSync(path.join(root, file));
}

function requireFile(file) {
  if (!exists(file)) failures.push(`Missing repository file: ${file}`);
}

function requireIncludes(file, terms) {
  const text = read(file);
  for (const term of terms) {
    if (!text.includes(term)) failures.push(`${file} missing ${term}`);
  }
}

function metadataValue(field) {
  const value = pkg[field];
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") return value.url || "";
  return String(value);
}

for (const file of [
  "README.md",
  "LICENSE",
  "SECURITY.md",
  "CONTRIBUTING.md",
  "CHANGELOG.md",
  "ARCHITECTURE.md",
  "INTEGRATION.md",
  "HOST_READINESS.md",
  "RELEASE_CHECKLIST.md",
  "docs/FIRST_COMMIT_MANIFEST.md",
  "docs/REPOSITORY_LAUNCH_CHECKLIST.md",
  "scripts/print-first-commit-files.js",
  ".github/pull_request_template.md",
  ".github/ISSUE_TEMPLATE/bug_report.md",
  ".github/ISSUE_TEMPLATE/feature_request.md",
  ".github/ISSUE_TEMPLATE/config.yml",
  ".github/workflows/ci.yml",
  ".gitignore",
]) {
  requireFile(file);
}

requireIncludes(".gitignore", [
  "node_modules/",
  ".playwright-cli/",
  ".playwright-mcp/",
  "output/smoke/",
  "dist/",
  ".cache/",
  "*.log",
  "*.tgz",
  ".DS_Store",
]);

requireIncludes("docs/REPOSITORY_LAUNCH_CHECKLIST.md", [
  "Repository Identity",
  "Required Files",
  "Git Ignore Boundary",
  "Metadata Gate",
  "Verification Gate",
  "Manual Gate",
  "Public Launch Gate",
  "GO",
  "FIX",
  "NO-GO",
]);

requireIncludes("docs/FIRST_COMMIT_MANIFEST.md", [
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

requireIncludes(".github/workflows/ci.yml", [
  "name: Verify",
  "permissions:\n  contents: read",
  "FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true",
  "npm ci",
  "npm run release:check",
  "npm run smoke:playwright",
  "npm pack --dry-run",
]);

if (!pkg.scripts?.["audit:repository"]) {
  failures.push("package.json scripts missing audit:repository");
}

if (!pkg.scripts?.["commit:plan"]) {
  failures.push("package.json scripts missing commit:plan");
}

if (!pkg.scripts?.["release:check"]?.includes("audit:repository")) {
  failures.push("package.json release:check must run audit:repository");
}

for (const keyword of ["im", "chat", "ui-kit", "liquid-glass", "prototype"]) {
  if (!pkg.keywords?.includes(keyword)) failures.push(`package.json keywords missing ${keyword}`);
}

for (const field of ["repository", "homepage", "bugs"]) {
  const value = metadataValue(field);
  if (!value) continue;
  if (!/^https?:\/\//.test(value) && !/^git\+https?:\/\//.test(value)) {
    failures.push(`package.json ${field} must use a public URL when present`);
  }
  if (/example|placeholder|your-|localhost|127\.0\.0\.1|private/i.test(value)) {
    failures.push(`package.json ${field} must not use placeholder or local metadata`);
  }
}

let trackedFiles = [];
try {
  trackedFiles = execFileSync("git", ["ls-files"], {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  })
    .split(/\r?\n/)
    .filter(Boolean);
} catch {
  trackedFiles = [];
}

const disallowedTracked = [
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

for (const file of trackedFiles) {
  if (disallowedTracked.some((pattern) => pattern.test(file))) {
    failures.push(`Generated or local file is tracked: ${file}`);
  }
}

if (failures.length) {
  console.error("Repository audit failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Repository audit passed.");
