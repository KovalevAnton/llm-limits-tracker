# Provider audit — top 30 LLM APIs and what they actually expose

Research that drives the dashboard's provider roster. For each candidate I checked three questions:

1. Does the **chat-completion (or equivalent) response include `x-ratelimit-*` headers** we can read off the wire?
2. Is there a **public balance / usage endpoint** that works with a regular API key (no admin scope)?
3. What's the **signup friction** for non-Chinese, non-Russian developers (most of our likely user base)?

Verdict scale:
- ✅ **Add** — has real usable data + accessible signup
- ⚠️ **Maybe** — partial data, niche audience, or signup quirk worth flagging
- ❌ **Skip** — no usable data, or signup blocked for typical users

Knowledge basis: May 2025. Some endpoints may have evolved since — re-verify before integrating.

---

## Tier 1 — Frontier model labs (must-have)

| # | Provider | Signup | Rate-limit hdrs | Balance endpoint | Verdict |
|---|----------|--------|------------------|-------------------|---------|
| 1 | **Anthropic** (Claude) | email | ✅ `anthropic-ratelimit-*` (RPM, input/output TPM separate) | admin-key only | ✅ **already** |
| 2 | **OpenAI** (ChatGPT, GPT-5) | email | ✅ `x-ratelimit-*` (RPM + TPM) | `/v1/organization/costs` (admin) | ✅ **already** |
| 3 | **Google** (Gemini) | email | ❌ none | Cloud Quotas API (service-account auth) | ✅ **already** as health-check |
| 4 | **xAI** (Grok) | email | ✅ OpenAI-compatible `x-ratelimit-*` | none public | ✅ **add** — OpenAI-compatible, easy |
| 5 | **DeepSeek** | email | ❌ on `/chat/completions` | ✅ `/user/balance` (USD/CNY) | ✅ **already** with balance probe |

---

## Tier 2 — Aggregators / multi-model platforms

| # | Provider | Signup | Rate-limit hdrs | Balance endpoint | Verdict |
|---|----------|--------|------------------|-------------------|---------|
| 6 | **OpenRouter** | email | ✅ `x-ratelimit-*` on chat | ✅ `/api/v1/auth/key` (balance + RPS) | ✅ **already** |
| 7 | **Hugging Face** Inference | email | ⚠️ partial — depends on which inference type (Inference Endpoints vs Inference API) | ✅ `/api/whoami-v2` shows quota & period for free tier | ✅ **add** — popular, has quota |
| 8 | **Replicate** | email/GitHub | ❌ no rate-limit headers (focus is async runs, not RPM) | none for credit balance via API | ❌ **skip** — model-as-a-service shape, not chat-RPM-shaped |
| 9 | **AI/ML API** (`aimlapi.com`) | email | ✅ OpenAI-compatible | none documented | ⚠️ small audience, OpenAI-shape ok |
| 10 | **Glama** | email | ✅ OpenAI-compatible | unknown | ⚠️ small but growing aggregator |

---

## Tier 3 — Fast inference / hosting

| # | Provider | Signup | Rate-limit hdrs | Balance endpoint | Verdict |
|---|----------|--------|------------------|-------------------|---------|
| 11 | **Groq** | email | ✅ full `x-ratelimit-*` | none | ✅ **already** |
| 12 | **Cerebras Cloud** | email | ✅ OpenAI-compatible (claims to return rate-limit headers; needs verify) | none | ✅ **add** — fastest Llama, gaining traction |
| 13 | **SambaNova Cloud** | email | ✅ OpenAI-compatible | none | ⚠️ smaller audience but fast |
| 14 | **Fireworks AI** | email | ✅ partial `x-ratelimit-*` | none | ❌ already removed — usage signal weak |
| 15 | **Together AI** | email | ✅ partial `x-ratelimit-*` | `/v1/api-keys` shows usage info but admin-shape | ❌ already removed |
| 16 | **DeepInfra** | email | ⚠️ inconsistent | usage on dashboard, no public billing API | ⚠️ low priority |
| 17 | **Hyperbolic** | email | ⚠️ unknown / inconsistent | none | ⚠️ niche, skip for now |
| 18 | **Modal** | email | ❌ async-job model, no per-request RPM | none for LLM-style limits | ❌ **skip** — wrong shape |
| 19 | **Lambda Labs Inference** | email | ⚠️ unknown | none | ⚠️ skip for now |

---

## Tier 4 — Major Chinese labs

| # | Provider | Signup | Rate-limit hdrs | Balance endpoint | Verdict |
|---|----------|--------|------------------|-------------------|---------|
| 20 | **Moonshot** (Kimi) | 🇨🇳 phone required | ⚠️ inconsistent | none | ❌ already removed — phone barrier |
| 21 | **Qwen** (Alibaba DashScope) | email via alibabacloud.com (intl) | ❌ none on compatible-mode | none public | ❌ already removed — no useful data; Qwen also on OpenRouter |
| 22 | **Zhipu** (GLM) | 🇨🇳 phone required | ❌ none useful | balance endpoint exists but admin-only | ❌ already removed |
| 23 | **MiniMax** | email via minimaxi.com | ❌ none | none public | ❌ already removed |
| 24 | **01.AI** (Yi) | email | ⚠️ varies | none | ❌ skip — momentum has shifted, mostly via OpenRouter now |
| 25 | **Baichuan** | 🇨🇳 phone | ❌ | none | ❌ skip |
| 26 | **Tencent Hunyuan** | 🇨🇳 phone | ❌ | admin only | ❌ skip |

---

## Tier 5 — European / smaller frontier

| # | Provider | Signup | Rate-limit hdrs | Balance endpoint | Verdict |
|---|----------|--------|------------------|-------------------|---------|
| 27 | **Mistral** | email | ✅ `x-ratelimit-*` (limited) | none public | ⚠️ already removed — re-add if user demand returns |
| 28 | **Cohere** | email | ✅ `x-ratelimit-*` (RPM) | none public, dashboard-only credits | ✅ **add** — accessible, real headers |
| 29 | **AI21 Labs** | email | ⚠️ inconsistent | none public | ⚠️ low priority |
| 30 | **Aleph Alpha** | enterprise mostly | ❌ | none | ❌ skip — enterprise contract gate |

---

## Tier 6 — Specialty (worth mention)

| # | Provider | Signup | Rate-limit hdrs | Balance endpoint | Verdict |
|---|----------|--------|------------------|-------------------|---------|
| 31 | **Perplexity Sonar API** | email | ✅ OpenAI-compatible | none public | ✅ **add** — only web-grounded model, popular |
| 32 | **Voyage AI** (embeddings) | email | ⚠️ for embeddings, but rare in our use case | none | ⚠️ skip — dashboard is chat-focused |
| 33 | **Reka** (Core / Flash / Edge) | email | ⚠️ varies | none | ⚠️ skip — small market share |

---

## Recommended additions (Phase 2 — beyond v0.3)

Based on this audit, the **highest-leverage adds** that have real data AND accessible signup:

### Round A (~15 min each, easy wins)
1. **xAI Grok** — frontier name, OpenAI-compatible, clean rate-limit headers
2. **Cohere** — proper `x-ratelimit-*` headers, very accessible signup
3. **Cerebras Cloud** — fastest Llama inference, growing audience

### Round B (more work but high value)
4. **Hugging Face Inference API** — has `whoami-v2` quota endpoint, hugely popular for indie devs
5. **Perplexity Sonar** — only web-grounded LLM API, popular niche

### Round C (maybe later)
6. **AI/ML API**, **Glama** — multi-provider aggregators, OpenAI-shape compatible. Compete with OpenRouter; only add if OpenRouter alone feels limiting.

### Definite skips (re-confirmed by audit)
- All Chinese providers except DeepSeek (signup barriers OR no useful data)
- Replicate, Modal — wrong API shape (async jobs, not chat RPM)
- Aleph Alpha — enterprise gate

---

## Total verdict

After this audit, the realistic ceiling for our dashboard is **~10-11 providers** that all give real data:

- **Already in v0.3**: Anthropic, OpenAI, Gemini (health), Groq, OpenRouter, DeepSeek (balance) — 6
- **Round A adds**: xAI Grok, Cohere, Cerebras — would bring us to 9
- **Round B adds**: Hugging Face, Perplexity Sonar — would bring us to 11

That's the maximum quality ceiling. Beyond 11, marginal returns drop sharply because we'd be including providers with weak signal or niche audiences.

## Caveats / re-verify before adding

1. **Cerebras Cloud rate-limit headers** — claimed in their OpenAI-compat docs but I haven't directly tested. Run a probe with a real key first.
2. **Hugging Face Inference** — has multiple shapes (Inference API, Inference Endpoints, Inference Providers). The `whoami-v2` endpoint is the simplest path but only covers free-tier quota.
3. **Cohere** — they're rebranding parts of their API around RAG / Embed / Rerank vs Chat; verify which endpoint we'd probe.
4. **xAI / Grok** — endpoint is `api.x.ai/v1/chat/completions` (OpenAI-compatible). Confirmed accessible.
5. **2026 reality check** — this is May 2025 knowledge. If a provider's API changed shape since (e.g. Hugging Face redesigned the `whoami` route, or Cohere dropped a public chat endpoint), this audit needs updating.
