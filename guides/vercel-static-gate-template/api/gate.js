const express = require('express');
const fs = require('fs');
const path = require('path');
const { agentToll } = require('agent-toll');

const app = express();
const SITE_ROOT = path.resolve(process.cwd(), '.gate-build');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

const toll = agentToll({
  wallet: process.env.AGENT_TOLL_WALLET
});

function sanitizePathname(rawPathname) {
  const decoded = decodeURIComponent(rawPathname || '/');
  const normalized = path.posix.normalize(decoded.startsWith('/') ? decoded : `/${decoded}`);
  if (!normalized.startsWith('/')) {
    return null;
  }
  if (normalized.includes('\0') || normalized.includes('..')) {
    return null;
  }
  return normalized;
}

function resolveCandidatePaths(sitePath) {
  const trimmed = sitePath.endsWith('/') ? sitePath.slice(0, -1) : sitePath;
  const base = trimmed.length > 0 ? trimmed : '/';
  return [
    base,
    `${base}.html`,
    `${base}/index.html`
  ];
}

function resolveSiteFile(sitePath) {
  for (const candidate of resolveCandidatePaths(sitePath)) {
    const relative = candidate.replace(/^\/+/, '');
    const absolute = path.resolve(SITE_ROOT, relative);
    if (!absolute.startsWith(`${SITE_ROOT}${path.sep}`) && absolute !== SITE_ROOT) {
      continue;
    }
    if (fs.existsSync(absolute) && fs.statSync(absolute).isFile()) {
      return absolute;
    }
  }
  return null;
}

app.use((req, _res, next) => {
  const url = new URL(req.url, 'http://localhost');
  const forwardedPath = url.searchParams.get('__site_path');
  if (!forwardedPath) {
    return next();
  }

  const normalizedPath = sanitizePathname(forwardedPath);
  if (!normalizedPath) {
    return next(new Error('Invalid forwarded __site_path.'));
  }

  url.searchParams.delete('__site_path');
  const query = url.searchParams.toString();
  req.url = `${normalizedPath}${query ? `?${query}` : ''}`;
  return next();
});

app.use(toll);

app.get('*', (req, res) => {
  const normalizedPath = sanitizePathname(req.path);
  if (!normalizedPath) {
    return res.status(400).send('Invalid path');
  }

  const fullPath = resolveSiteFile(normalizedPath);
  if (!fullPath) {
    return res.status(404).send('Not found');
  }

  const ext = path.extname(fullPath).toLowerCase();
  res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream');
  res.sendFile(fullPath);
});

module.exports = app;
