# Show HN draft

> Post on a Tuesday or Wednesday, ~9am Pacific. Don't post on Mondays or Fridays.
> Engage with every comment in the first 4 hours.

---

**Title (80 char limit, lowercase OK):**

Show HN: LLM Limits Tracker – local dashboard for API rate limits across 8 providers

---

**Body:**

I build with multiple LLM APIs and was tired of opening eight different consoles every time something hit a 429. Helicone, Langfuse, LiteLLM solve this for teams, but I just wanted a thing I could run in 30 seconds without instrumenting code or signing up for anything.

So I wrote LLM Limits Tracker — a single-file Node server (zero dependencies) plus a single-file HTML UI. Run `node server.js`, open localhost, drop in your API keys, see rate limits and quotas for Claude, GPT, Gemini, OpenRouter, Groq, Fireworks, Mistral, and Together in one screen.

How it works:

- The browser stores keys in localStorage. Nothing is persisted on the server.
- For each provider, the server forwards a tiny probe request and returns the upstream rate-limit headers (`anthropic-ratelimit-*`, `x-ratelimit-*`, etc.).
- The UI parses headers, draws progress bars, fires alerts at 80%/95%.
- Reason for the proxy: browsers can't call provider APIs directly because of CORS.

Caveats:

- Subscription limits for Claude Pro/Max, ChatGPT Plus, Gemini Advanced are NOT exposed via API — those are closed UI metrics. This tracks API-account limits. A browser-extension companion is on the roadmap.
- Gemini doesn't expose rate-limit headers, so for Gemini you only see "alive / 429 / auth".

MIT license, ~500 lines of code total. Would love feedback, especially from people running production traffic across 3+ providers.

GitHub: https://github.com/KovalevAnton/llm-limits-tracker

---

## Talking points / common HN comments to be ready for

**"Why not just use Helicone/Langfuse/LiteLLM?"**
> They're great if you want full traces and team observability. This is for the case where you don't want to instrument your code or run a separate gateway — you just want a glance at what's happening with your account-level rate limits.

**"Why a Node proxy instead of pure browser?"**
> CORS. Browsers won't let you call api.anthropic.com directly, and I didn't want to ship a Chrome extension as the only path.

**"Subscription limits would be the killer feature"**
> Agreed. That requires either a browser extension scraping the chat UIs or undocumented APIs. It's the next thing on the roadmap.

**"Security of putting all my keys in one place?"**
> Keys live only in your browser's localStorage and travel to the local proxy via X-Provider-Key on each request. Nothing on disk. The server is 200 lines you can read in 5 minutes. If you don't trust it, run `git diff` against your fork.

**"I'd love provider X"**
> Adding a provider is ~10 lines on the server and ~3 lines in the UI. PRs welcome — see CONTRIBUTING.md.
