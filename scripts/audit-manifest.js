#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "release-manifest.json"), "utf8"));
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const failures = [];

function sorted(values) {
  return [...values].sort();
}

function sameList(name, actual, expected) {
  const actualSorted = sorted(actual);
  const expectedSorted = sorted(expected);
  if (actualSorted.length !== expectedSorted.length) {
    failures.push(`${name} length mismatch: ${actualSorted.length} != ${expectedSorted.length}`);
    return;
  }
  for (let index = 0; index < actualSorted.length; index += 1) {
    if (actualSorted[index] !== expectedSorted[index]) {
      failures.push(`${name} mismatch at ${index}: ${actualSorted[index]} != ${expectedSorted[index]}`);
      return;
    }
  }
}

if (manifest.schema !== 1) failures.push("release-manifest schema must be 1");
if (manifest.name !== pkg.name) failures.push("release-manifest name must match package.json");
if (manifest.version !== pkg.version) failures.push("release-manifest version must match package.json");
if (!/^\d{4}-\d{2}-\d{2}$/.test(manifest.date)) failures.push("release-manifest date must be YYYY-MM-DD");
if (manifest.status !== "pre-beta-release-candidate") failures.push("release-manifest status must be pre-beta-release-candidate");
if (manifest.positioning !== pkg.description) failures.push("release-manifest positioning must match package description");

sameList("packageFiles", manifest.packageFiles, [...pkg.files, "package.json"]);

for (const file of manifest.packageFiles) {
  if (!fs.existsSync(path.join(root, file))) failures.push(`release-manifest package file missing on disk: ${file}`);
}

for (const file of manifest.releaseDocuments) {
  if (!fs.existsSync(path.join(root, file))) failures.push(`release document missing on disk: ${file}`);
  if (!manifest.packageFiles.includes(file)) failures.push(`release document missing from package files: ${file}`);
}

for (const file of manifest.publicSurfaces) {
  if (!fs.existsSync(path.join(root, file))) failures.push(`public surface missing on disk: ${file}`);
  if (!manifest.packageFiles.includes(file)) failures.push(`public surface missing from package files: ${file}`);
}

for (const command of [
  "npm run audit:manifest",
  "npm run audit:repository",
  "npm run release:check",
  "npm run smoke:playwright",
  "npm run serve:local",
  "npm run ci:verify",
  "npm pack --dry-run",
]) {
  if (!manifest.commands.includes(command)) failures.push(`release-manifest commands missing ${command}`);
}

for (const shot of [
  "output/smoke/fullscreen-about.png",
  "output/smoke/mobile-wallet-transfer.png",
  "output/smoke/mobile-video-feed.png",
  "output/smoke/embedded-wallet.png",
  "output/smoke/host-api.png",
  "output/smoke/api-wallet-dark.png",
  "output/smoke/readme-preview.png",
]) {
  if (!manifest.smokeScreenshots.includes(shot)) failures.push(`release-manifest smoke screenshots missing ${shot}`);
}

sameList("entryPoints", manifest.entryPoints, Object.keys(pkg.exports || {}));

for (const boundary of [
  "fictional mock data only",
  "no third-party product identity",
  "wallet surfaces are display-only mock UI",
  "embedded styles stay scoped to the shell surface",
]) {
  if (!manifest.boundaries.includes(boundary)) failures.push(`release-manifest boundaries missing ${boundary}`);
}

if (failures.length) {
  console.error("Manifest audit failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Manifest audit passed.");
