# Contributing

Thanks for considering a contribution. The codebase is small on purpose — under 500 lines split across `server.js` and `public/index.html` — so the bar for "I get how this works" is low.

## Development setup

```bash
git clone https://github.com/KovalevAnton/llm-limits-tracker
cd llm-limits-tracker
node server.js
# open http://localhost:5173
```

That's it. No build step, no bundler, no package manager. If you change `server.js` restart Node; if you change `index.html` reload the browser.

## Project shape

- **`server.js`** — single-file Node HTTP server. Two responsibilities: serve files from `public/` and proxy requests to provider APIs (so the browser can read rate-limit headers without CORS errors). Provider definitions live in the `providers` registry near the top of the file.
- **`public/index.html`** — single-page UI: dashboard, settings, alerts. State lives in `localStorage`. Provider definitions on the UI side live in the `PROVIDERS` array near the top of the `<script>` block.

When you add a provider, edit both: the registry on the server and the registry in the UI.

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
10. **i18n** — UI strings are currently mixed Russian/English; pick a structure (probably an `i18n` object), translate to one or two more languages.

## Pull request guidelines

- Keep diffs focused — one feature/fix per PR.
- If you add a provider, mention which model you probe with and link to the rate-limit-header docs in the PR description.
- Screenshots help for UI changes.
- Don't add dependencies without a good reason. The "zero deps" badge is a feature.

## Reporting bugs

Open an issue with: what you tried, what happened, what you expected, what's in the browser console / server log. The proxy logs every upstream status — paste those if relevant.

## License

By contributing you agree your work is released under the project's MIT license.
