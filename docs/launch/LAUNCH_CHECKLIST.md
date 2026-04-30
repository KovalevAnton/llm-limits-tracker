# Launch checklist

A practical, ordered checklist for taking this from "code on disk" to "actually launched". Don't skip the soft-launch steps — going straight to HN with no stars is the most common way these posts flop.

---

## Phase 1 — Pre-flight (1–2 hours)

- [ ] Replace every `USER` placeholder with your actual GitHub handle:
  - `package.json` (`repository.url`, `homepage`)
  - `README.md` (clone command, all repo links)
  - `CONTRIBUTING.md`
  - `launch/*.md` (every post draft)
- [ ] Create a fresh public GitHub repo named `llm-limits-tracker`.
- [ ] Push the code.
- [ ] Add GitHub repo description: *"Local dashboard for LLM API rate limits across 8 providers — zero deps, your keys never leave your machine."*
- [ ] Add GitHub topics: `llm`, `rate-limit`, `anthropic`, `openai`, `gemini`, `openrouter`, `groq`, `dashboard`, `monitoring`, `self-hosted`.
- [ ] Add a real `docs/screenshot.png` to the repo and uncomment the screenshot line in README.
- [ ] (Optional but high-impact) Record a 10-second GIF of clicking "Refresh" and watching the bars fill in. Tools: [Kap](https://getkap.co), [LICEcap](https://www.cockos.com/licecap/), or `Cmd+Shift+5` → save as MP4 → convert to GIF.
- [ ] Test on a clean machine — `git clone` → `node server.js` → does the dashboard render correctly with all 8 providers?

## Phase 2 — Soft launch (day 0, ~24 hours of feedback)

The goal here is to get the obvious bugs out and accumulate the first 10–30 stars before any public push. Hacker News reacts badly to a freshly-created repo with 0 stars.

- [ ] DM 5–10 dev friends. One sentence: "I made this for myself, would love a 60-second test drive — does it actually work for you?"
- [ ] Post in any private dev Discord/Slack you're in (your bootcamp alumni, your work's #side-projects channel, whatever).
- [ ] Fix anything embarrassing that comes back.
- [ ] Tweet/skeet one understated post: "made this for myself, sharing in case useful". This is calibration, not the launch.

## Phase 3 — Reddit round (day 1–3)

Reddit forgives "rough around the edges" much more than HN does. Start here.

- [ ] Post in **r/SideProject** (use `launch/REDDIT_SIDEPROJECT.md`) — best time: weekday afternoon US time.
- [ ] Wait 24 hours, post in **r/LocalLLaMA** (use `launch/REDDIT_LOCALLAMA.md`) — best time: weekday morning US time.
- [ ] Wait 24 hours, post in **r/ClaudeAI** and **r/OpenAI** (use `launch/REDDIT_CLAUDEAI_AND_OPENAI.md`). Don't cross-post the exact same text — use the per-sub variants.
- [ ] Reply to every comment within 30 minutes for the first 4 hours of each post. This is the single biggest determinant of whether a Reddit thread takes off.

## Phase 4 — Show HN (day 4–7, only if Reddit went OK)

- [ ] Polish the README based on the most common Reddit confusions.
- [ ] Make sure the repo has at least 30+ stars and a few real issues/PRs (or thoughtful issues you opened yourself).
- [ ] Use `launch/SHOW_HN.md`.
- [ ] **Best time:** Tuesday or Wednesday, between 9–10am Pacific. Avoid Mondays (slow), Fridays (everyone's checked out), weekends (low traffic).
- [ ] Be at your keyboard for the first 4 hours after posting. Reply to every comment, technical or not. Don't be defensive.

## Phase 5 — Long tail

- [ ] Submit to **awesome-* lists**:
  - awesome-llm
  - awesome-claude-code
  - awesome-selfhosted
  - awesome-ai-tools
- [ ] Publish the **Dev.to article** (use `launch/DEVTO_ARTICLE.md`) — best 2-3 days after the HN post so it has the link traffic context.
- [ ] Cross-post the article to **Hashnode** and **Medium**.
- [ ] Tweet the **Twitter thread** (use `launch/TWITTER.md`). Tag relevant accounts. Best time: Tuesday/Wednesday morning US time.
- [ ] If the project has any uptake, submit to **Product Hunt** (low ROI for dev tools but the backlink is worth it).

## Phase 6 — Sustain (week 2+)

- [ ] Publish the npm package so `npx llm-limits-tracker` works without cloning.
- [ ] Knock out 1-2 of the "good first issues" yourself to demonstrate momentum.
- [ ] When users open feature requests, label them (`good-first-issue`, `provider-request`, `enhancement`) — this is what makes the repo feel alive.
- [ ] Reply to every issue and PR within 24 hours, even if the reply is "thanks, I'll get to this next weekend".

## Common mistakes to avoid

1. **Posting on HN with 0 stars.** It needs to look like other people already use it.
2. **Cross-posting the exact same body to multiple subreddits.** Reddit shadow-bans this.
3. **Disappearing after posting.** First 4 hours of engagement determines the next 4 days.
4. **Over-explaining what it does.** The README headline should sell the value in 12 words. If a stranger has to scroll to figure out what it is, you lose them.
5. **Apologizing for v0.1.** State the limitations matter-of-factly. Apologetic tone reads as low-confidence.
6. **Treating Hacker News as the goal.** It's a moment, not a destination. Reddit + steady commits + a Dev.to article that ranks in Google for "claude rate limit dashboard" generate more compounding traffic than a single HN top spot.

---

## Metrics to watch (week 1)

- GitHub stars: if you're not above 100 by end of week 1, the positioning probably needs work.
- Repo clones (in GitHub Insights → Traffic).
- Issues / PRs opened by strangers — strongest signal that people are actually using it.
- npm install count (once published).

If week 1 generates real traction, double down on the browser-extension feature for chat subscriptions — that's the highest-leverage v0.2 because it's the most-asked-for thing that doesn't exist anywhere else.
