#!/usr/bin/env node

const http = require("http");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const start = Number(process.env.GLASS_PREVIEW_PORT_START || 5500);
const end = Number(process.env.GLASS_PREVIEW_PORT_END || 5509);

const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
};

function send(res, status, body, type = "text/plain; charset=utf-8") {
  res.writeHead(status, {
    "content-type": type,
    "cache-control": "no-store",
  });
  res.end(body);
}

function filePathFor(urlPath) {
  const clean = decodeURIComponent(urlPath.split("?")[0]).replace(/^\/+/, "") || "index.html";
  const full = path.resolve(root, clean);
  if (!full.startsWith(root)) return null;
  return full;
}

function createServer() {
  return http.createServer((req, res) => {
    const target = filePathFor(req.url || "/");
    if (!target) return send(res, 403, "Forbidden");
    fs.stat(target, (statError, stat) => {
      if (statError) return send(res, 404, "Not found");
      const file = stat.isDirectory() ? path.join(target, "index.html") : target;
      fs.readFile(file, (readError, body) => {
        if (readError) return send(res, 404, "Not found");
        send(res, 200, body, types[path.extname(file).toLowerCase()] || "application/octet-stream");
      });
    });
  });
}

function listenOn(port) {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.once("error", reject);
    server.listen(port, "127.0.0.1", () => resolve(server));
  });
}

(async () => {
  for (let port = start; port <= end; port += 1) {
    try {
      await listenOn(port);
      const base = `http://127.0.0.1:${port}`;
      console.log(`Glass IM Shell local preview: ${base}/`);
      console.log(`Mobile preview: ${base}/mobile.html`);
      console.log(`Wallet preview: ${base}/mobile.html#page:pay`);
      console.log(`npm minimal example: ${base}/examples/npm-minimal.html`);
      console.log(`Embedded example: ${base}/examples/vanilla.html`);
      console.log(`Host API example: ${base}/examples/host-api.html`);
      console.log("Press Ctrl+C to stop.");
      return;
    } catch (error) {
      if (error.code !== "EADDRINUSE") throw error;
    }
  }
  console.error(`No free preview port found in ${start}-${end}.`);
  process.exit(1);
})();
