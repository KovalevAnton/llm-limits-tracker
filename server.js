#!/usr/bin/env node
/**
 * LLM Limits Tracker — local proxy + static server.
 *
 * Zero dependencies. Run with `node server.js` (or `npx llm-limits-tracker`).
 *
 * Why a proxy? Browsers block direct calls to api.anthropic.com / api.openai.com /
 * generativelanguage.googleapis.com because of CORS. This tiny server sits on
 * localhost, forwards calls, and returns the upstream rate-limit headers (which
 * is exactly what we want to show in the UI).
 *
 * The browser keeps API keys in localStorage and passes them on each request via
 * X-Provider-Key. The server never persists keys.
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT ? Number(process.env.PORT) : 5173;
// Local-only by design (SECURITY.md scope). Override with HOST=0.0.0.0 for LAN.
const HOST = process.env.HOST || '127.0.0.1';
const PUBLIC_DIR = path.join(__dirname, 'public');

// Single source of truth for the version: read it from package.json at boot
// so we never have to remember to bump it in two places.
const VERSION = require('./package.json').version;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', ...headers });
  res.end(typeof body === 'string' ? body : JSON.stringify(body));
}

// Routes file 404s: HTML clients (browser navigations) get the styled
// public/404.html; everything else (API consumers, /api/* paths, curl with
// no Accept) gets the JSON envelope.
function notFound(req, res, pathname) {
  const accept = String(req.headers.accept || '');
  const wantsHtml =
    !pathname.startsWith('/api/') &&
    accept.includes('text/html');
  if (!wantsHtml) return send(res, 404, { error: 'not found', path: pathname });
  fs.readFile(path.join(PUBLIC_DIR, '404.html'), (err, data) => {
    if (err) return send(res, 404, { error: 'not found', path: pathname });
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    if (req.method === 'HEAD') return res.end();
    res.end(data);
  });
}

function serveStatic(req, res) {
  let pathname = decodeURIComponent(url.parse(req.url).pathname);
  if (pathname === '/') pathname = '/index.html';
  const filePath = path.join(PUBLIC_DIR, pathname);
  if (!filePath.startsWith(PUBLIC_DIR)) return send(res, 403, { error: 'forbidden' });

  fs.readFile(filePath, (err, data) => {
    if (err) return notFound(req, res, pathname);
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    if (req.method === 'HEAD') return res.end();
    res.end(data);
  });
}

/**
 * Forwards an HTTPS request and returns the upstream response (status, headers, body)
 * to the caller as JSON. The browser-side code always gets back { status, headers, body }
 * regardless of the provider, so parsing logic lives in one place (in the UI).
 */
function forward({ host, pathReq, method = 'POST', headers = {}, body = null }) {
  return new Promise((resolve, reject) => {
    const req = https.request({ host, path: pathReq, method, headers }, (resp) => {
      const chunks = [];
      resp.on('data', (c) => chunks.push(c));
      resp.on('end', () => {
        const buf = Buffer.concat(chunks).toString('utf8');
        let parsed = null;
        try { parsed = JSON.parse(buf); } catch (_) { parsed = buf; }
        resolve({ status: resp.statusCode, headers: resp.headers, body: parsed });
      });
    });
    req.on('error', reject);
    if (body) req.write(typeof body === 'string' ? body : JSON.stringify(body));
    req.end();
  });
}

// ---------- Provider registry ----------
//
// Each provider exposes a `probe(apiKey)` that hits a tiny endpoint and
// returns the upstream response so the UI can read rate-limit headers.
// To add a provider: append an entry below and mirror it in public/app.js.

const tinyChat = [{ role: 'user', content: 'hi' }];

// Most providers speak OpenAI's chat-completions dialect (Bearer auth, same body).
const openaiCompat = (host, pathReq, model) => (key) => forward({
  host, pathReq, method: 'POST',
  headers: { Authorization: `Bearer ${key}`, 'content-type': 'application/json' },
  body: { model, max_tokens: 1, messages: tinyChat },
});

const providers = {
  anthropic: {
    label: 'Anthropic · Claude',
    probe: (key) => forward({
      host: 'api.anthropic.com',
      pathReq: '/v1/messages',
      method: 'POST',
      headers: {
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: { model: 'claude-haiku-4-5-20251001', max_tokens: 1, messages: tinyChat },
    }),
  },

  gemini: {
    label: 'Google · Gemini',
    probe: (key) => forward({
      host: 'generativelanguage.googleapis.com',
      pathReq: `/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(key)}`,
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: {
        contents: [{ parts: [{ text: 'hi' }] }],
        generationConfig: { maxOutputTokens: 1 },
      },
    }),
  },

  // OpenRouter exposes /api/v1/auth/key with balance + rate-limit info — more
  // useful than a chat probe.
  openrouter: {
    label: 'OpenRouter',
    probe: (key) => forward({
      host: 'openrouter.ai',
      pathReq: '/api/v1/auth/key',
      method: 'GET',
      headers: { Authorization: `Bearer ${key}` },
    }),
  },

  openai:    { label: 'OpenAI · ChatGPT', probe: openaiCompat('api.openai.com', '/v1/chat/completions',        'gpt-4o-mini') },
  groq:      { label: 'Groq',             probe: openaiCompat('api.groq.com',   '/openai/v1/chat/completions', 'llama-3.1-8b-instant') },

  // DeepSeek doesn't return rate-limit headers on /chat/completions, but it
  // does expose /user/balance — much more useful (real USD/CNY balance).
  deepseek: {
    label: 'DeepSeek',
    probe: (key) => forward({
      host: 'api.deepseek.com',
      pathReq: '/user/balance',
      method: 'GET',
      headers: { Authorization: `Bearer ${key}` },
    }),
  },
};

// ---------- Cost endpoints (admin keys only) ----------

async function anthropicCost(adminKey, startDate) {
  return forward({
    host: 'api.anthropic.com',
    pathReq: `/v1/organizations/cost_report?starting_at=${encodeURIComponent(startDate)}`,
    method: 'GET',
    headers: { 'x-api-key': adminKey, 'anthropic-version': '2023-06-01' },
  });
}

async function openAICost(adminKey, startUnix) {
  return forward({
    host: 'api.openai.com',
    pathReq: `/v1/organization/costs?start_time=${startUnix}`,
    method: 'GET',
    headers: { Authorization: `Bearer ${adminKey}` },
  });
}

// ---------- Outgoing webhooks (Slack / Discord) ----------
//
// The browser can't POST to hooks.slack.com directly because Slack rejects
// browser CORS preflights. We relay through this endpoint instead. Allowlist
// of upstream hosts is intentional — we don't want to be a generic SSRF proxy.
const WEBHOOK_HOSTS = new Set([
  'hooks.slack.com',
  'discord.com',
  'discordapp.com',
  'ptb.discord.com',
  'canary.discord.com',
]);

function readJsonBody(req, maxBytes = 64 * 1024) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let total = 0;
    req.on('data', (c) => {
      total += c.length;
      if (total > maxBytes) {
        req.destroy();
        return reject(new Error('body too large'));
      }
      chunks.push(c);
    });
    req.on('end', () => {
      try {
        const buf = Buffer.concat(chunks).toString('utf8');
        resolve(buf ? JSON.parse(buf) : {});
      } catch (e) { reject(e); }
    });
    req.on('error', reject);
  });
}

function postWebhook(targetUrl, payload) {
  const u = new URL(targetUrl);
  const body = JSON.stringify(payload);
  return new Promise((resolve, reject) => {
    const req = https.request({
      host: u.hostname,
      path: u.pathname + u.search,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
    }, (resp) => {
      const chunks = [];
      resp.on('data', (c) => chunks.push(c));
      resp.on('end', () => resolve({
        status: resp.statusCode,
        body: Buffer.concat(chunks).toString('utf8').slice(0, 512),
      }));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ---------- Routing ----------

const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true);
  const { pathname } = parsed;

  // /api/probe/<provider>
  const probeMatch = pathname.match(/^\/api\/probe\/([a-z]+)$/);
  if (probeMatch && req.method === 'POST') {
    const provider = providers[probeMatch[1]];
    const key = req.headers['x-provider-key'];
    if (!provider) return send(res, 404, { error: 'unknown provider' });
    if (!key) return send(res, 400, { error: 'missing X-Provider-Key header' });
    try {
      const result = await provider.probe(key);
      return send(res, 200, result);
    } catch (e) {
      return send(res, 502, { error: 'upstream failure', detail: String(e) });
    }
  }

  // /api/cost/<anthropic|openai>
  if (pathname === '/api/cost/anthropic' && req.method === 'GET') {
    const key = req.headers['x-provider-key'];
    if (!key) return send(res, 400, { error: 'missing X-Provider-Key header' });
    try {
      const start = parsed.query.start || new Date(Date.now() - 7 * 86400e3).toISOString();
      return send(res, 200, await anthropicCost(key, start));
    } catch (e) {
      return send(res, 502, { error: 'upstream failure', detail: String(e) });
    }
  }
  if (pathname === '/api/cost/openai' && req.method === 'GET') {
    const key = req.headers['x-provider-key'];
    if (!key) return send(res, 400, { error: 'missing X-Provider-Key header' });
    try {
      const start = Number(parsed.query.start) || Math.floor((Date.now() - 7 * 86400e3) / 1000);
      return send(res, 200, await openAICost(key, start));
    } catch (e) {
      return send(res, 502, { error: 'upstream failure', detail: String(e) });
    }
  }

  // /api/webhook/notify — relay alerts to Slack / Discord webhook URLs.
  // Body: { url, payload }. URL must be on the WEBHOOK_HOSTS allowlist.
  if (pathname === '/api/webhook/notify' && req.method === 'POST') {
    let body;
    try { body = await readJsonBody(req); }
    catch (e) { return send(res, 400, { error: 'invalid json body', detail: String(e) }); }
    if (!body || typeof body.url !== 'string' || !body.payload) {
      return send(res, 400, { error: 'expected { url, payload }' });
    }
    let parsedUrl;
    try { parsedUrl = new URL(body.url); }
    catch (_) { return send(res, 400, { error: 'invalid url' }); }
    if (parsedUrl.protocol !== 'https:' || !WEBHOOK_HOSTS.has(parsedUrl.hostname)) {
      return send(res, 400, { error: 'url not in allowed webhook hosts', allowed: [...WEBHOOK_HOSTS] });
    }
    try {
      const result = await postWebhook(body.url, body.payload);
      return send(res, 200, result);
    } catch (e) {
      return send(res, 502, { error: 'upstream failure', detail: String(e) });
    }
  }

  // Tiny health/version endpoint. Cheap to add, useful for "what version is
  // running on this port?" and as a smoke test during deploys.
  if (req.method === 'GET' && url.parse(req.url).pathname === '/api/version') {
    return send(res, 200, { name: 'llm-limits-tracker', version: VERSION });
  }

  if (req.method === 'GET' || req.method === 'HEAD') return serveStatic(req, res);
  send(res, 404, { error: 'not found' });
});

server.listen(PORT, HOST, () => {
  // eslint-disable-next-line no-console
  const shown = HOST === '0.0.0.0' || HOST === '::' ? 'localhost' : HOST;
  console.log(`LLM Limits Tracker v${VERSION} running at http://${shown}:${PORT}`);
});
