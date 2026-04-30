# r/LocalLLaMA draft

> r/LocalLLaMA loves: open-source, local-first, multi-provider, technical detail, no SaaS lock-in.
> Avoid: marketing language, screenshots without context, generic "I built X" titles.

---

**Title:**

I got tired of having 8 dashboards open just to check my LLM quotas, so I made a local one. Open source, zero deps.

---

**Body:**

Most of you probably hit this: you're running a side project that calls Claude, GPT, plus a couple of inference providers like Groq or Fireworks for the cheap models. You hit a 429 in production, and now you have to alt-tab between Anthropic Console, OpenAI Platform, Google AI Studio, OpenRouter, Groq Console — figuring out which one is rate-limiting you.

I just wanted one screen. So I wrote a tiny tool — single-file Node server + single-file HTML UI, zero dependencies. It probes each provider's API with a 1-token request and reads the rate-limit headers, then renders progress bars per quota.

Currently supports:

- Anthropic (Claude) — RPM, input TPM, output TPM
- OpenAI — RPM, TPM
- Google Gemini — only API status (Gemini doesn't expose rate-limit headers, sadly)
- OpenRouter — credit balance + rate limit interval
- Groq, Fireworks, Mistral, Together — RPM, TPM via standard `x-ratelimit-*` headers

Local-only by design. Keys live in your browser's localStorage; the proxy just exists to bypass CORS, nothing is persisted on disk.

Roadmap: history graphs (SQLite), Slack/Discord webhook alerts, and the big one — a browser extension to surface chat-subscription limits (Claude Pro/Max, ChatGPT Plus) since those aren't in any public API.

MIT license, ~500 lines total. Adding a provider is 10 lines.

Repo: https://github.com/KovalevAnton/llm-limits-tracker

If you'd like a specific provider added that I missed, comment or open an issue. I want this to actually be useful, not be a vanity repo.

---

## Common questions to answer in comments

**"Does it work with self-hosted vLLM/TGI?"**
> Not yet — those don't have standardized rate-limit headers. If your deployment exposes Prometheus metrics or has a quota header, easy to add.

**"What about Ollama / LM Studio?"**
> Local inference doesn't have rate limits in the same sense. This tool is specifically for the API providers you pay for.

**"How does this compare to OpenRouter's own dashboard?"**
> OpenRouter's dashboard only shows OpenRouter. If that's all you use, you don't need this. The point is unified view across many providers.
