# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Slack and Discord webhook alerts.** Paste a webhook URL into Settings and the dashboard will ping it whenever a metric crosses the warning or critical threshold. Alerts fire only on upward severity transitions (ok → warn, ok → bad, warn → bad) — no spam on every refresh. A "Test" button next to each input fires a synthetic alert so you can verify the URL works.
- New server endpoint `POST /api/webhook/notify` — relays the alert to Slack/Discord because browsers can't POST to `hooks.slack.com` directly (CORS). Allowlist of upstream hosts: only `hooks.slack.com` and the Discord webhook hosts.
- Per-format payloads: Slack gets a `blocks` payload with mrkdwn; Discord gets an `embeds` payload with severity-coloured sidebar.
- **DeepSeek** added with a smart probe — instead of `/chat/completions` (which returns no useful headers), we hit `/user/balance` and surface the actual USD/CNY balance.
- Settings page split into two top-level sections: **Providers** (API keys) and **Alerts** (thresholds + Slack/Discord webhooks). Sidebar is now Dashboard / Providers / Alerts / About.

### Changed
- Provider roster trimmed to **6 cards that all show real numbers** (Anthropic / OpenAI / Groq / OpenRouter / DeepSeek with metrics + Gemini as health-check). Each provider now earns its place — no more `OK · —` empty cards.
- OpenRouter free-tier `rate_limit.requests = -1` no longer renders as `-1 req / 10s`; the line is omitted, only "free tier" stays in the footer.
- Gemini cards now use a proper info-state (small accent dot + the note + footer with timestamp) instead of an italic idle-style message.

### Removed
- Together AI, Fireworks AI, Mistral, Moonshot/Kimi, Qwen (Alibaba), Zhipu/GLM, MiniMax. Reasons: most returned no useful rate-limit data; Moonshot and Zhipu also required a Chinese phone number to register. Qwen models remain accessible via OpenRouter for those who want them.

## [0.2.1] - 2026-05-01

### Added
- Japanese (`ja`) translation for the full UI; the language pill now offers EN/ES/RU/中/日.
- GitHub link button in the sidebar (next to the aurora toggle).
- Auto-probe: pasting a brand-new key into Settings immediately fires a single probe for that provider — no need to click "Refresh all".
- Hero demo GIF and theme gallery in `README.md`; dynamic npm-version and monthly-downloads badges (replace previous static badges).
- Favicon (`public/favicon.svg`), Apple touch icon source (`public/apple-touch-icon.svg`), web app manifest (`public/manifest.webmanifest`), `robots.txt`, and styled `404.html` for static deploys.
- Brand assets in `assets/` (`logo.svg`, `logo-dark.svg`, `social.svg`) for use in README and Open Graph previews.
- `/api/version` endpoint returning `{ name, version }` for smoke tests and remote probes.
- Maintainer docs: `docs/ICONS.md`, `docs/SCREENSHOTS.md`, `docs/DEMO_DEPLOY.md`.

### Changed
- Settings auto-saves on input change (blur). The explicit **Save** button has been removed; threshold inputs persist the same way.
- Empty hero now reads as a single primary CTA ("Open settings") — no demo button.
- `server.js` reads its version from `package.json` at boot (single source of truth) and prints it on the startup line.

### Removed
- The coloured side stripe on `warn` / `bad` provider cards. The status pill in the top-right already conveys severity; the stripe was redundant.

## [0.2.0] - 2026-04-30

### Added
- Three-theme picker: **Apple Glass — Light**, **Apple Glass — Dark**, **Hacker** (plus a **System** mode that follows OS preference).
- Aurora background toggle as a compact icon button (visible in glass themes only).
- `HOST` environment variable to override the listen address.

### Changed
- Project layout: working docs and launch material moved to `docs/` (and `docs/launch/`); npm tarball still ships only `server.js`, `public/`, and the public-facing `.md` files.
- Frontend monolith split into `public/index.html` (markup), `public/styles.css`, and `public/app.js`. No build step.
- `server.js` now uses an `openaiCompat()` helper for the five OpenAI-compatible providers (~25% smaller).
- Glass-light typography upgraded to match glass-dark (large italic-serif `H1` with text-clip gradient, italic brand name, larger subtitle).
- Sidebar logo and primary "Refresh all" button now use a translucent white-glass treatment in both glass themes (no more purple gradient).
- Hacker progress bars: stretched full-width with a stepped CSS fill (was a fixed-length ASCII string that didn't fill wider cards).

### Fixed
- Server now binds to `127.0.0.1` by default to match the local-only threat model in `SECURITY.md` (override with `HOST=0.0.0.0` for LAN).

### Removed
- Plain `light`, `dark`, `gpro`, and `off` themes (consolidated into the glass family). Existing `localStorage` theme preferences are migrated automatically on first load: `dark→glass-dark`, `light→glass-light`, `glass→system`, `gpro→glass-dark`, `off→glass-light`.

## [0.1.0] - 2026-04-29

### Added
- Initial release.
- Local Node.js proxy + single-page UI dashboard.
- Support for 8 providers: Anthropic, OpenAI, Google Gemini, OpenRouter, Groq, Fireworks AI, Mistral, Together AI.
- Rate-limit metrics parsed from upstream response headers (RPM, input/output TPM where available).
- Threshold alerts at 80% (warning) and 95% (critical).
- Optional 60-second auto-refresh polling.
- API keys stored in browser `localStorage` only — never persisted by the server.

[Unreleased]: https://github.com/KovalevAnton/llm-limits-tracker/compare/v0.2.1...HEAD
[0.2.1]: https://github.com/KovalevAnton/llm-limits-tracker/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/KovalevAnton/llm-limits-tracker/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/KovalevAnton/llm-limits-tracker/releases/tag/v0.1.0
