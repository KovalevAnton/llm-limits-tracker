# r/SideProject draft

> r/SideProject likes: personal stories, "I made this for myself", screenshots, transparency.
> Tone: casual, first person.

---

**Title:**

Built a thing because I was tired of opening 8 LLM consoles every day

---

**Body:**

My side project uses Claude for the heavy stuff, GPT-4o-mini for cheap stuff, and Groq for fast stuff. So three different consoles, three different rate limit pages, three different bills to track.

This week I had a 429 in production and lost 20 minutes figuring out *which* provider was the bottleneck. That was the moment I gave up and built the thing I'd been wishing existed.

It's a local web app — `node server.js`, open localhost, drop in your API keys, see all your rate limits in one screen with progress bars. Currently covers 8 providers (Anthropic, OpenAI, Gemini, OpenRouter, Groq, Fireworks, Mistral, Together).

**What I tried to do well:**

- Zero dependencies. No `npm install`. The whole thing is a single Node file plus a single HTML file you can read end-to-end in 10 minutes.
- Keys live only in your browser's localStorage. Nothing is persisted on the server side.
- Threshold alerts at 80% / 95% so you see problems coming.
- MIT license, full source on GitHub.

**What I'd love feedback on:**

- Is the "single file Node server, no deps" approach actually more or less appealing than a Docker image / Electron app for this kind of utility?
- The biggest missing piece is *subscription* limits (Claude Pro, ChatGPT Plus, Gemini Advanced) — those aren't exposed by any API. Best ideas welcome: browser extension that reads from the chat UIs? Anything else?
- Which providers should I add next? Cohere, Replicate, Perplexity, DeepInfra, xAI?

Repo: https://github.com/KovalevAnton/llm-limits-tracker

If you give it a spin, let me know what breaks. I want this to actually be useful, not just sit on GitHub with 3 stars.
