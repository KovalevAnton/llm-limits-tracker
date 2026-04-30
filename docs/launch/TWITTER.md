# Twitter / X drafts

> Mix of standalone tweet (with GIF/screenshot) + a thread for context.
> Tag @AnthropicAI @OpenAI @GoogleAI @GroqInc @OpenRouterAI when posting — they sometimes amplify community tools.

---

## Standalone tweet (post first, with screenshot/GIF)

> I was tired of opening 8 different dashboards to check my LLM rate limits.
>
> So I built one screen that does it all.
>
> Open source, zero dependencies, your keys never leave your machine.
>
> github.com/KovalevAnton/llm-limits-tracker

---

## Thread (post 2-4 hours after, references the standalone)

**1/** Quick context on this. If you build with multiple LLMs, you know the pain: production hits a 429, and you spend 10 minutes alt-tabbing between consoles trying to figure out which provider is rate-limiting you.

**2/** Helicone, Langfuse, LiteLLM all solve this for teams. They're great. But for a side project I just wanted *one screen* I could pull up, no SaaS signup, no code instrumentation.

**3/** So: single Node file (zero deps), single HTML file. Run `node server.js`, drop in your keys, see all 8 providers in one view with progress bars and alerts at 80% / 95%.

Currently covers: Anthropic, OpenAI, Gemini, OpenRouter, Groq, Fireworks, Mistral, Together.

**4/** How: the Node server proxies to provider APIs (browsers can't call them directly because of CORS) and pipes back the rate-limit headers (`anthropic-ratelimit-*`, `x-ratelimit-*`). The UI parses and renders.

Keys live in localStorage. Nothing on the server side.

**5/** Caveat I'm not happy about: subscription limits for Claude Pro, ChatGPT Plus, Gemini Advanced aren't exposed by any API. The roadmap has a browser extension to surface them by reading the chat UIs.

If anyone has a better idea, all ears.

**6/** MIT license. ~500 lines of code total. Contributions wildly welcome — adding a provider is 10 lines.

Repo: github.com/KovalevAnton/llm-limits-tracker

---

## Reply-bait tweet (post separately, day 2 or 3)

> Quick poll for people building with LLM APIs:
>
> When you hit a rate limit in production, what's your first move?
>
> 🔄 RT if you also wish there was one place to see all your provider limits.

(Follow up with link to repo in a reply.)
