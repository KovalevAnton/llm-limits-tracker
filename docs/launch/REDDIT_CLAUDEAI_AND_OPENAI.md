# r/ClaudeAI and r/OpenAI drafts

> Smaller communities — keep it focused on *their* provider with mention that it covers more.
> Don't post the same text in both, slight rewrites.

---

## r/ClaudeAI version

**Title:** Local dashboard for tracking your Claude API rate limits (also handles GPT, Gemini, etc.)

**Body:**

If you build with the Anthropic API, you've probably noticed the response includes really detailed rate-limit headers — separate counters for requests per minute, input tokens per minute, and output tokens per minute. The Console shows them, but only one model tier at a time, and only after you click around.

I made a small open-source tool that surfaces all of those at once: `anthropic-ratelimit-requests-*`, `anthropic-ratelimit-input-tokens-*`, `anthropic-ratelimit-output-tokens-*`, all on one screen as progress bars with alerts at 80% / 95%.

Bonus: it also tracks 7 other providers (OpenAI, Gemini, OpenRouter, Groq, Fireworks, Mistral, Together) so if your project uses Claude alongside others you get one unified view.

Setup: clone the repo, `node server.js`, paste your `sk-ant-...` key. Zero dependencies, MIT license, ~500 lines of code total. Keys never leave your machine.

Caveat: this is for **API** limits. Claude Pro/Max subscription limits aren't exposed by any API endpoint, so they're not here yet. A browser extension to scrape those is on the roadmap.

Repo: https://github.com/KovalevAnton/llm-limits-tracker

Feedback welcome — especially from folks running Claude in production who've hit weird rate-limit edge cases.

---

## r/OpenAI version

**Title:** Free open-source dashboard for OpenAI API rate limits (and 7 other providers)

**Body:**

Quick share for anyone running production traffic against the OpenAI API: I made a small open-source tool that reads the `x-ratelimit-*` headers from your API responses and shows your RPM and TPM as progress bars with alerts at 80% / 95%.

It's a `node server.js`, no dependencies, single HTML file UI. Drop in your API key, get a live view. Bonus: same dashboard tracks Anthropic, Gemini, OpenRouter, Groq, Fireworks, Mistral, Together — so if you use multiple providers you don't need separate tools.

Limits shown are for your **API account**. ChatGPT Plus/Pro subscription limits are not in any API and aren't here. Browser extension companion for that is planned.

Local-only: keys live in localStorage in your browser. The Node proxy is there only to dodge CORS — it doesn't store anything.

MIT license, ~500 lines of code. PRs welcome.

Repo: https://github.com/KovalevAnton/llm-limits-tracker
