# Contributing

Thanks for considering a contribution. The codebase is small on purpose — about 1.7k lines split across `server.js` and three short files in `public/`, with no build step — so the bar for "I get how this works" is low.

## Development setup

```bash
git clone https://github.com/KovalevAnton/llm-limits-tracker
cd llm-limits-tracker
node server.js
# open http://localhost:5173
```

That's it. No build step, no bundler, no package manager. If you change `server.js` restart Node; if you change anything in `public/` reload the browser.

By default the server binds to `127.0.0.1`. If you need it reachable on your LAN (testing on a phone on the same Wi-Fi, etc.), run with `HOST=0.0.0.0 node server.js`.

## Project shape

- **`server.js`** — single-file Node HTTP server. Two responsibilities: serve files from `public/` and proxy requests to provider APIs (so the browser can read rate-limit headers without CORS errors). Provider definitions live in the `providers` registry near the top; the five OpenAI-compatible providers share a single `openaiCompat()` helper.
- **`public/index.html`** — markup only. A tiny inline boot script resolves the current theme before the stylesheet evaluates (avoids FOUC) and migrates legacy theme keys from older versions.
- **`public/styles.css`** — three themes (Apple Glass light/dark and Hacker) plus shared layout. CSS variables on `:root` are overridden per `[data-theme="..."]`.
- **`public/app.js`** — i18n strings (5 languages), the UI-side `PROVIDERS` array, parsers, settings auto-save, and rendering. State lives in `localStorage`.

When you add a provider, edit both: the registry on the server and the `PROVIDERS` array in `public/app.js`.

## Code style

Vanilla JS, no transpilation, no TypeScript (yet). Two-space indent. Comments only where they explain *why*, not *what*. If a function is doing something subtle, leave a sentence about the reasoning — those notes are how this stays readable.

## Good first issues

If you'd like to ship something but don't know where to start:

1. **Add a provider** — Cohere, Replicate, Perplexity, DeepInfra, Anyscale, xAI Grok, AI21, Hyperbolic. Pattern: copy an existing OpenAI-compatible entry in `providers` (server) and `PROVIDERS` (UI), point it at the right host/path. Most have OpenAI-compatible chat endpoints.
2. **Improve the Gemini integration** — Google Cloud Quotas API does expose limits with a service-account token; figure out the smallest-friction setup and wire it up.
3. **Add a Docker image** — small Dockerfile + GitHub Actions release.
4. **Write a real test suite** — there's currently none. Even basic snapshot tests of header parsing would be valuable.
5. **Slack / Discord webhook alerts** — when a provider crosses the bad threshold, optionally fire a webhook. Configurable from Settings.
6. **Persistent history** — SQLite file next to `server.js`, store readings every minute, render a 7-day sparkline in each provider card.
7. **Browser extension companion** — scrape Claude.ai / chat.openai.com / gemini.google.com to surface the *subscription* limits that aren't exposed via API. This is the most-requested missing piece.
8. **CLI mode** — `llm-limits status` prints all providers as a colored TUI table, no browser needed.
9. **Per-project tagging** — let users add named "projects" and manually log which usage came from which app.
10. **More languages** — the i18n table in `public/app.js` covers EN/RU/ES/ZH/JA. Adding a new language is a single object literal plus a button in the language pill (`public/index.html`) and a branch in `detectLang()`.

## Pull request guidelines

- Keep diffs focused — one feature/fix per PR.
- If you add a provider, mention which model you probe with and link to the rate-limit-header docs in the PR description.
- Screenshots help for UI changes.
- Don't add dependencies without a good reason. The "zero deps" badge is a feature.

## Reporting bugs

Open an issue with: what you tried, what happened, what you expected, what's in the browser console / server log. The proxy logs every upstream status — paste those if relevant.

## License

By contributing you agree your work is released under the project's MIT license.
