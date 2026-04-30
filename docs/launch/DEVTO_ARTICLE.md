# Dev.to / Hashnode / Medium article draft

**Title:** I built a local dashboard for LLM rate limits — here's what I learned about the providers' APIs

**Tags:** llm, opensource, javascript, ai

---

If you build with multiple LLMs in 2026, you've probably had this moment: a request hits a 429 in production, and you spend the next ten minutes alt-tabbing between four different dashboards trying to figure out which provider is the bottleneck.

I had this moment one too many times last month. And rather than build the same observability stack I've already configured at work (Langfuse, Helicone, LiteLLM — all great products, all kind of overkill for a side project), I wanted the dumbest possible thing that could work: one local screen, zero setup, zero accounts.

So I built [LLM Limits Tracker](https://github.com/KovalevAnton/llm-limits-tracker). It's a single-file Node server, a single HTML file UI, no dependencies. Run it, paste in your API keys, see the rate limits for 8 providers (Anthropic, OpenAI, Gemini, OpenRouter, Groq, Fireworks, Mistral, Together) on one screen with progress bars and threshold alerts.

This post is half "here's the thing" and half "here's what I learned about how each provider exposes rate limits", because that turned out to be more interesting than I expected.

## The good: providers that actually tell you what's left

The cleanest API for this purpose is **Anthropic's**. Every Messages API response carries a small zoo of headers:

```
anthropic-ratelimit-requests-limit:        50
anthropic-ratelimit-requests-remaining:    49
anthropic-ratelimit-input-tokens-limit:    20000
anthropic-ratelimit-input-tokens-remaining: 19990
anthropic-ratelimit-output-tokens-limit:   8000
anthropic-ratelimit-output-tokens-remaining: 7999
```

Separate counters for input and output tokens is genuinely thoughtful — input-token limits are usually the bottleneck if you're doing RAG, output-token limits if you're streaming long responses. The fact that they're surfaced separately means I can show users which one to worry about.

**OpenAI** uses the now-standard `x-ratelimit-*` schema:

```
x-ratelimit-limit-requests:     500
x-ratelimit-remaining-requests: 499
x-ratelimit-limit-tokens:       60000
x-ratelimit-remaining-tokens:   59998
```

Less granular than Anthropic (no input/output split) but reliable and present on every response.

**Groq, Fireworks, Mistral, Together AI** all use OpenAI-compatible APIs and inherit the same headers. That's one reason picking up new providers in this category is trivial — copy an OpenAI entry, change the host, done.

## The interesting: OpenRouter

**OpenRouter** is the odd one out, and in a good way. They expose `/api/v1/auth/key`, which returns your account state as JSON:

```json
{
  "data": {
    "label": "my-key",
    "usage": 0.013,
    "limit": 5,
    "limit_remaining": 4.987,
    "is_free_tier": false,
    "rate_limit": { "requests": 200, "interval": "10s" }
  }
}
```

This is more useful than rate-limit headers because it tells you about credit balance — the thing you actually want to know on a pay-as-you-go account. Worth a look if you're integrating their API.

## The frustrating: Google Gemini

**Gemini** is the one I couldn't make great. The `generativelanguage.googleapis.com` endpoint just doesn't return rate-limit headers. The Google Cloud Quotas API would let you query your quota with a service-account token, but that requires a different auth flow than the API key most users have, so the UX trade-off didn't feel worth it for v0.1.

The compromise: for Gemini I just show "alive / 429 / auth" status based on the response code. Not great, but at least you know if you're getting rate-limited at all.

If anyone reading this has a clever way to surface Gemini quotas with just the standard API key, I'd love a PR.

## The architecture: why a proxy at all

The simple version of this app would be a static HTML file that calls `api.anthropic.com` directly from the browser. That doesn't work because of CORS — none of these APIs ship the right headers for browser-side calls.

So there's a tiny Node server (200 lines) that does two things: serve the static HTML, and proxy `/api/probe/<provider>` requests to the actual provider with an `X-Provider-Key` header forwarded as the auth token. It's stateless. The browser holds the keys in localStorage and passes them on each call.

You could replace this with a service worker or a browser extension, but the Node version means anyone can clone the repo and run it without dealing with extension manifests.

## The thing I couldn't do: subscription limits

The most-requested feature already, before I've even posted: tracking the limits of **Claude Pro/Max**, **ChatGPT Plus/Pro**, and **Gemini Advanced** chat subscriptions.

Those don't have public API endpoints. They're enforced server-side and shown only inside the chat UIs. The only way to surface them is a browser extension that scrapes the relevant pages — which is on the roadmap, but is a separate project in spirit.

If you have ideas for how to do this without a brittle DOM-scraping extension, drop me a line.

## What's next

Roadmap, in rough order of how much I want them:

1. Browser-extension companion for chat-subscription limits.
2. Slack / Discord webhooks at threshold crossings.
3. SQLite history for 7-day usage graphs.
4. More providers — Cohere, Replicate, Perplexity, DeepInfra, xAI.

It's MIT-licensed and adding a provider is about 10 lines of code. If your favorite isn't on the list, that's an invitation, not an oversight.

Repo: <https://github.com/KovalevAnton/llm-limits-tracker>

---

*If this scratched an itch, the kindest thing you can do is star the repo or send the link to one other person who builds with multiple LLMs. That's how good tools spread when you don't have a marketing budget.*
