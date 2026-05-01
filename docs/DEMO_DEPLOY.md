# Deploying the live demo

The repo includes a "demo mode" that loads the dashboard with hand-crafted mock data — no API keys, no real network calls. This is the page you put behind a `Try it live` link in the README.

The demo is a **static deploy** (no Node server). Cloudflare Pages is the simplest free host; Vercel and Netlify work identically. Total time: ~5 minutes.

## What the demo does

When the page is opened with `?demo` in the URL:

- All eight providers get fake "demo" keys so cards render
- The proxy is bypassed — `probe()` returns hand-crafted mock data (Anthropic critical, OpenAI critical, Mistral approaching, Groq healthy, OpenRouter healthy, Fireworks waiting, Together idle, Gemini OK)
- A small banner at the top of the dashboard says "Demo mode — fake data" and links to npm
- Each `Refresh all` jitters the numbers so the animation feels alive

Settings, themes, language switch, alerts — all real and interactive.

## Cloudflare Pages — recommended

Free, fast, automatic deploys on push.

1. Push the repo to GitHub if it isn't already.
2. Go to <https://pages.cloudflare.com/> → **Create application** → **Pages** → **Connect to Git**.
3. Authorize Cloudflare to read the repo, pick `llm-limits-tracker`.
4. Build settings:
   - **Framework preset:** None
   - **Build command:** *(leave empty)*
   - **Build output directory:** `public`
5. **Deploy.** First deploy takes ~30 seconds.
6. Cloudflare gives you a URL like `https://llm-limits-tracker.pages.dev`. The demo URL is `https://llm-limits-tracker.pages.dev/?demo`.
7. Update the README's "Live demo" link to point at this.

### Custom subdomain (optional)

In the Pages project → **Custom domains** → add e.g. `demo.yourdomain.com` if you have one.

## Vercel — alternative

1. Go to <https://vercel.com/new> → **Import Git Repository** → pick the repo.
2. **Framework Preset:** Other.
3. **Build & Output Settings** → toggle Override:
   - Build Command: *(leave empty)*
   - Output Directory: `public`
4. **Deploy.** Vercel gives you `llm-limits-tracker.vercel.app` — demo URL is `?demo`.

## Netlify — alternative

1. <https://app.netlify.com/start> → connect repo.
2. Publish directory: `public`.
3. Build command: *(leave empty)*
4. Deploy.

## Why this works

`public/index.html` is a fully self-contained single-page app — no relative imports, no API routes called outside `?demo`, no hidden dependencies on `server.js`. Static hosts can serve it as-is.

Without `?demo` the page would still load in production, but every probe would fail (CORS — there's no proxy on the static host). That's why we automatically activate demo mode via URL parameter rather than always-on.

## Linking from README

In the README hero section, replace the placeholder:

```md
[**Live demo**](https://llm-limits.pages.dev/?demo)
```

…with whatever URL Cloudflare/Vercel gave you.

## Updating the demo

Cloudflare Pages auto-deploys on every push to `main`. To update:

```bash
git add . && git commit -m "..." && git push
# Cloudflare deploys within 30s.
```

To verify: open the demo URL in incognito so cached version doesn't show.

## Custom-domain TLS

All three hosts (Cloudflare/Vercel/Netlify) provide free TLS via Let's Encrypt automatically. Nothing to configure.

## Cost

- Cloudflare Pages: free tier — 500 builds/month, unlimited bandwidth, unlimited requests. You'll never hit the cap.
- Vercel: free tier — 100 GB bandwidth/month. Plenty for a side project demo.
- Netlify: free tier — 100 GB bandwidth/month. Same.

## Troubleshooting

**Demo loads but bars don't fill in.** Open browser console — should see no errors. If you see `Failed to fetch /api/probe/...`, that means `?demo` isn't being detected. Check the URL has the literal `?demo` (case-sensitive).

**Demo mode shows but with no banner.** Check that `assets/social.svg` is included in the deployed `public/` directory. Actually no, the banner is text-only; if it's missing, check that the i18n keys for `demo.text` and `demo.cta` are present in `index.html`.

**Build fails.** None of these hosts need a build step. If you see "build command not found", the project's `package.json` might be running something. Override Build Command to empty string.
