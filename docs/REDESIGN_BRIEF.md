# LLM Limits Tracker — Redesign Brief

A self-contained handoff document. Read this once and you have everything you need to redesign the app's UI without touching the proxy server, the API parsing, or anything functional.

---

## What this app is (60-second context)

A local dashboard that shows API rate limits across 8 LLM providers (Anthropic, OpenAI, Gemini, OpenRouter, Groq, Fireworks, Mistral, Together). It runs as a tiny Node proxy + a single HTML file. Users drop API keys into Settings, hit "Refresh", and see RPM/TPM as progress bars with threshold alerts. Everything is local — keys live in `localStorage`, the proxy just dodges CORS.

## What you're being asked to do

Redesign the visual layer of `public/index.html` to match Anthropic's Claude.ai design language. Keep all functionality unchanged. Add a proper light theme alongside the existing dark theme, with a toggle.

**Do not touch:**

- `server.js` — the proxy is fine.
- API probe logic, header parsers, alert thresholds, `localStorage` schema — all functional code stays.
- The 8-provider registry (it's the source of truth for which cards render).

**Do touch:**

- All CSS in `public/index.html`.
- Markup structure if it helps (but keep `id`s and `data-*` attributes that JS depends on).
- Any small JS additions needed to support theme toggling.

---

## Design principles

Three rules, in priority order. When they conflict, the earlier one wins.

**1. Editorial calm over SaaS density.** This is a dashboard for paying-attention moments, not a control center for screaming alerts. Generous whitespace. Few colors. One typeface family for body, optional serif for display. The interface should feel like reading a well-set page, not piloting a spaceship.

**2. Warm, not cool.** The current dark theme uses cool blue-grays (`#0e1014`). Replace with warm off-blacks and creamy off-whites — closer to an old library or letterpress book than a tech product. The accent is Claude's coral (`#d97757`), used sparingly for CTAs and active states only.

**3. Lightweight is non-negotiable.** Everything must still ship as a single HTML file with vanilla JS. No Tailwind, no React, no CSS-in-JS, no build step. **At most one** web font loaded (and only if it's worth it — system stacks are preferred). Total CSS under 400 lines.

---

## Visual system

### Color tokens

Implement as CSS custom properties on `:root` (light) and `[data-theme="dark"]`. Components reference variables only — never hard-coded hex values.

**Light theme:**

```css
:root {
  /* Surfaces */
  --bg:           #faf9f5;   /* page background, warm cream */
  --surface:      #ffffff;   /* cards, modals */
  --surface-2:    #f3f1ea;   /* nested elements, subtle wells */

  /* Text */
  --text:         #1a1916;   /* primary text, warm near-black */
  --text-muted:   #6c6a63;   /* secondary text, captions, labels */
  --text-faint:   #9d9a92;   /* placeholder, very subtle */

  /* Borders */
  --border:       #e8e6dc;   /* hairlines, card edges */
  --border-strong:#d6d3c5;   /* focused inputs, emphasis */

  /* Accents (used sparingly) */
  --accent:       #c96442;   /* Claude coral, CTAs and active */
  --accent-soft:  #f4e6df;   /* coral wash, hover/selected backgrounds */

  /* Semantic */
  --good:         #6b8a5a;   /* muted sage green */
  --warn:         #c98e3f;   /* muted amber */
  --bad:          #b94a4a;   /* muted brick red */
  --good-soft:    #ebf0e2;
  --warn-soft:    #f6ead2;
  --bad-soft:     #f4dede;

  /* Provider dots — keep brand recognition, slightly desaturated */
  --p-anthropic:  #d97757;
  --p-openai:     #19c37d;
  --p-gemini:     #4285f4;
  --p-openrouter: #a78bda;
  --p-groq:       #f55036;
  --p-fireworks:  #e6a52f;
  --p-mistral:    #ff7000;
  --p-together:   #2b8fd9;
}
```

**Dark theme:**

```css
[data-theme="dark"] {
  --bg:           #1a1816;   /* warm dark, not black */
  --surface:      #221f1c;
  --surface-2:    #2a2723;

  --text:         #ece9e1;
  --text-muted:   #a39e92;
  --text-faint:   #6f6b62;

  --border:       #322e29;
  --border-strong:#42403b;

  --accent:       #d97757;
  --accent-soft:  #3b2a23;

  --good:         #8aae72;
  --warn:         #d9a35c;
  --bad:          #d97070;
  --good-soft:    #2b3325;
  --warn-soft:    #3b2f1d;
  --bad-soft:     #3a2625;

  /* Provider dots: same hexes, they read fine on dark */
}
```

**No pure black or pure white anywhere.** Every neutral has a slight warm tint.

### Typography

Stick to system stacks for zero font-loading cost. If you want one accent typeface, load **only** `Source Serif 4` or `Tiempos Text` from a CDN, and only use it for `h1`/`h2` display headings — body and UI stay system sans.

```css
:root {
  --font-sans: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Inter",
               "Segoe UI", "Helvetica Neue", sans-serif;
  --font-serif: ui-serif, "Iowan Old Style", "Apple Garamond", Georgia, serif;
  --font-mono: ui-monospace, "SF Mono", "Cascadia Mono", "Roboto Mono", monospace;
}

body { font-family: var(--font-sans); }
h1, h2 { font-family: var(--font-serif); font-weight: 500; letter-spacing: -0.015em; }
code { font-family: var(--font-mono); font-size: 0.9em; }
```

Type scale (use these, no others):

| Role            | Size      | Line height | Weight |
|-----------------|-----------|-------------|--------|
| Page heading H2 | 28px      | 1.25        | 500    |
| Section H3      | 17px      | 1.4         | 600    |
| Body            | 14.5px    | 1.55        | 400    |
| Small           | 12.5px    | 1.5         | 400    |
| Caption / label | 11.5px    | 1.4         | 500, uppercase, letter-spacing 0.06em |
| Numbers (metrics) | 14px tabular | 1.4    | 500, font-variant-numeric: tabular-nums |

### Spacing scale

Multiples of 4px. Use these tokens, no inline values:

```css
:root {
  --s-1: 4px;
  --s-2: 8px;
  --s-3: 12px;
  --s-4: 16px;
  --s-5: 24px;
  --s-6: 32px;
  --s-7: 48px;
  --s-8: 64px;
}
```

Generous internal padding on cards (24px). Generous gaps between cards (16-20px). Generous breathing room above headings (32-48px).

### Radii and shadows

```css
:root {
  --r-sm: 6px;    /* pills, small buttons */
  --r-md: 10px;   /* inputs, secondary cards */
  --r-lg: 14px;   /* primary cards */

  --shadow-1: 0 1px 2px rgba(26, 25, 22, 0.04);             /* resting cards (light only) */
  --shadow-2: 0 4px 16px rgba(26, 25, 22, 0.06);            /* hover / elevated */
}
[data-theme="dark"] {
  --shadow-1: none;                                          /* dark cards rely on borders */
  --shadow-2: 0 4px 16px rgba(0, 0, 0, 0.3);
}
```

Dark mode: shadows mostly disappear; cards separate via 1px borders only.

### Motion

```css
:root {
  --ease: cubic-bezier(0.2, 0, 0, 1);
  --d-fast: 120ms;
  --d-base: 180ms;
  --d-slow: 320ms;
}
```

Apply transitions to: theme switch (background, color, border-color, fill — `--d-base`), button hover (`--d-fast`), progress bar fill (`--d-slow`).

`prefers-reduced-motion: reduce` → set all durations to 0ms.

---

## Component specs

### Page layout

Two-column: 220px left rail + flexible main. Main has max-width of 1080px and is centered with `margin: 0 auto`. Top padding of 48px, bottom of 96px.

On screens narrower than 720px, the rail collapses into a small top bar (logo + theme toggle + hamburger that opens nav as a drawer). Mobile is a stretch goal — desktop must look great first.

### Left rail

- Background: `var(--surface)` in light, `var(--surface)` in dark.
- 1px right border in `var(--border)`.
- Padding: `--s-5` all around.
- Logo + product name at top: small dot in `--accent`, then "LLM Limits" in serif h1 (18px, 600).
- Nav buttons: plain text, full-width, 10px vertical padding, 8px border-radius. Inactive: `var(--text-muted)`, no background. Hover: `var(--text)` color, `var(--surface-2)` background. Active: `var(--text)`, `var(--accent-soft)` background.
- Theme toggle pinned at the bottom: a small icon button (sun/moon), 32×32, ghost-style. Sits above a "View on GitHub" link.

### Main: page header

- H2 in serif, 28px, weight 500, color `var(--text)`.
- One-line subtitle below in 14.5px, `var(--text-muted)`.
- 24px gap before the alerts/toolbar.

### Alerts strip

- Above the toolbar.
- Each alert is one row: dot (8px, severity color) + text + spacer + dismiss × on hover.
- Background: severity `*-soft` token. Text: severity token (`--warn`, `--bad`).
- Border-radius: `--r-md`. Padding: 12px 16px.
- 1px left border in severity color (the only "stripe", subtle).
- No icons or emoji — keep it text.

### Toolbar

- One row, 16px gap between items, 24px gap below.
- Primary button (Refresh): coral background `--accent`, white text, 14.5px medium, 10px×16px padding, `--r-md` radius, subtle hover (filter brightness or background `darken 5%`).
- Secondary button (Auto-refresh): ghost — transparent bg, 1px `--border` outline, `--text` color. When ON, swap to `--accent-soft` background and `--accent` text.
- Right-aligned: "Last checked" caption in `--text-faint`, 12.5px.

### Provider card

This is the soul of the redesign. Get this right and the rest follows.

```
┌──────────────────────────────────────────┐
│  ●  Anthropic · Claude              OK   │
│                                          │
│  Requests / min        47 / 50  (94%)    │
│  ▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰░░         │
│                                          │
│  Input tokens / min    19,800 / 20,000   │
│  ▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰░░░░         │
└──────────────────────────────────────────┘
```

Specs:

- Background: `var(--surface)`. Border: 1px `var(--border)`. Radius: `--r-lg` (14px). Padding: 24px.
- Shadow `--shadow-1` in light, none in dark.
- Hover: shadow lifts to `--shadow-2`, border becomes `--border-strong`. 180ms transition. No translate or scale.
- Header row: 12px gap from body. Provider dot (8px circle, color `--p-{name}`) + provider name (15px, 600) + status pill (right-aligned).
- Status pill: 11px, uppercase, 0.06em letter-spacing, weight 500. Padding 4px 10px. Radius `--r-sm`. Variants:
  - **OK** — `--good-soft` bg, `--good` text.
  - **Warn** — `--warn-soft` bg, `--warn` text.
  - **Critical** — `--bad-soft` bg, `--bad` text.
  - **Idle** — `--surface-2` bg, `--text-faint` text.
  - **Auth** / **Error** — `--bad-soft` bg, `--bad` text.
- Metrics list: each metric in two lines.
  - Line 1: label (12.5px `--text-muted`) on left, value (14px tabular nums, `--text`) on right with the percentage in `--text-faint` parentheses.
  - Line 2: progress bar.
- Progress bar: 4px tall (was 6px — thinner is more refined), `--surface-2` track, fill in `--good`/`--warn`/`--bad` per threshold. Radius 999px (pill). Fill animates 320ms.
- Bottom note (e.g. OpenRouter rate-limit interval): 12px `--text-muted`, top margin 12px.

Empty state inside a card (no key set, idle): the body becomes a single muted line, italic, `--text-muted`, "Add an API key in Settings to start tracking." No giant illustration, no oversized icon.

Error state (HTTP 401, etc.): same shape, but the body shows a small monospace block with the error message in `--text-muted` on `--surface-2` background, `--r-md` radius, 8px×12px padding.

### Provider grid

CSS grid: `repeat(auto-fill, minmax(340px, 1fr))`, gap `--s-4` (16px). Cards never wider than ~440px even on big screens.

### Settings page

- Same overall canvas (page header, max-width 1080).
- Each provider gets a card identical in shape to the dashboard card, but its body is a labeled input + "Get key" link.
- Input: `var(--surface-2)` background, 1px `var(--border)`, `--r-md` radius, 11px×14px padding, 14px text. Focus state: border becomes `--accent`, soft 3px box-shadow ring `var(--accent-soft)`. No outline.
- "Show key" toggle: a small ghost button next to the input that toggles `type="password"` ↔ `type="text"`. Eye icon would be tempting — resist; use the word "Show" / "Hide".
- Threshold card at the bottom: two number inputs side-by-side, same input styling.
- Save button: same primary-button styling as Refresh. Sticks to bottom of viewport on scroll? Optional polish — not required.

### About page

Editorial. Wider line-height (1.7), narrower max-width (640px), serif h2, body in sans. The architecture diagram stays as ASCII in a `<pre>` block but uses `var(--font-mono)` and `--surface-2` background.

---

## Theme toggle (functional spec)

The user's choice persists in `localStorage` under key `llm-limits-tracker.theme` with values `"light"`, `"dark"`, or `"system"` (default).

**On page load**, before any rendering, set `document.documentElement.dataset.theme` based on stored choice or `matchMedia('(prefers-color-scheme: dark)')`. Do this in a `<script>` tag in `<head>` to avoid a flash of wrong theme.

**Toggle button** in the left rail bottom: clicking cycles `system` → `light` → `dark` → `system`. The icon reflects current effective theme (sun in light, moon in dark, half-moon for system). Tooltip shows current mode in plain text.

**Listen** to `prefers-color-scheme` changes and react if mode is `system`.

```js
function applyTheme() {
  const stored = localStorage.getItem('llm-limits-tracker.theme') || 'system';
  const dark = stored === 'dark' || (stored === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
}
applyTheme();
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);
```

---

## What stays the same

- All `id`s on key DOM elements (`#provider-grid`, `#alerts`, `#last-checked`, `#refresh-btn`, `#auto-refresh-toggle`, `#tab-dashboard`, `#tab-settings`, `#tab-about`, `#save-settings`, `#threshold-warn`, `#threshold-bad`, `#settings-grid`).
- All `data-*` attributes (`data-tab`, `data-key`).
- The `PROVIDERS` array in JS — drives both dashboard and settings rendering. Don't refactor it.
- The `parseAnthropic`, `parseOpenAICompat`, `parseGemini`, `parseOpenRouter` functions.
- `localStorage` schema (`STORAGE_KEY = 'llm-limits-tracker.v2'`).
- The proxy endpoints (`/api/probe/<provider>`).

---

## Constraints (do not violate)

1. **Single HTML file**, no external CSS/JS files. Inline only.
2. **Zero npm dependencies.** No Tailwind, no PostCSS, no bundler.
3. **At most one** web font loaded. None is preferred.
4. **No JS framework.** Vanilla, same as today.
5. **Total CSS under 400 lines** (current ~150 — there's room).
6. **No layout-shift on theme toggle.** Same metrics, just colors change.
7. **No emoji icons.** SVG inline if absolutely necessary (theme toggle, "Get key" external-link arrow). Keep them tiny.
8. **Keep "Refresh all" / "Auto-refresh" / "Settings" labels in the user's current language.** Right now the UI is bilingual Russian/English — leave the strings as they are unless a string is being added or replaced.

---

## Acceptance criteria

You're done when:

- [ ] Both light and dark themes look intentionally designed, not auto-inverted.
- [ ] Theme toggle works, persists, and follows system preference by default. No flash on load.
- [ ] No pure black, no pure white, no cool grays in either theme.
- [ ] Provider cards feel calm and readable — at least one designer would describe the look as "editorial" or "Claude-like".
- [ ] All 8 providers render correctly, with provider color dots intact.
- [ ] Existing functionality unchanged: refresh works, auto-refresh works, alerts fire at 80% / 95%, settings save, OpenRouter shows credit balance, Gemini shows status note.
- [ ] Tested on a clean Chrome and Safari, both modes.
- [ ] CSS still under 400 lines, no new dependencies, no build step.

---

## Optional polish (only if time)

- A subtle animated "ping" dot next to "Last checked" for ~2 seconds after a refresh completes.
- A keyboard shortcut: `R` to refresh, `T` to toggle theme, `?` to show shortcuts. Document in About.
- The Refresh button shows a tiny inline spinner (CSS-only) while a refresh is in flight.
- Numbers on metrics use `Intl.NumberFormat` with the user's locale for nicer separators.

None of these are required. Don't sacrifice the core look for them.

---

## Reference files (in this repo)

- `public/index.html` — the file to edit.
- `server.js` — DO NOT EDIT. Read only if you need to understand probe endpoints.
- `README.md` — has the architecture diagram and provider table for context.

When done, update `README.md` with one fresh screenshot per theme (cards visible, at least one alert showing). Replace the current `<!-- ![Screenshot](docs/screenshot.png) -->` placeholder with two side-by-side images.
