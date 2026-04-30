# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[Unreleased]: https://github.com/KovalevAnton/llm-limits-tracker/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/KovalevAnton/llm-limits-tracker/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/KovalevAnton/llm-limits-tracker/releases/tag/v0.1.0
