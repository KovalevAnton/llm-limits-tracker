# Recording the README assets

Two things to capture: 5 theme screenshots + 1 hero GIF. Total work — about 30–60 minutes.

## Setup (do once)

You need the dashboard with realistic-looking data. Easiest way: start in **demo mode**, which loads mock data without any API keys.

```bash
cd llm-limits-tracker
node server.js
```

Open <http://localhost:5173/?demo> — the dashboard renders with 6 active providers (Anthropic critical, OpenAI critical, Mistral critical, Groq healthy, OpenRouter healthy, Fireworks waiting) and one idle (Together).

Click **Refresh all** once so the bars animate in.

## Theme screenshots — 5 files

For each theme, click the corresponding pill in the sidebar (`Lt / Dk / Hx / Gl / G+`), wait ~1 second for transitions, then screenshot.

**Browser window size: 1440 × 900.** Quick check: in Chrome DevTools open Device Toolbar → Responsive → set 1440 × 900 → "1×" zoom (NOT retina, the file gets 4× heavier). Or just resize the OS window.

| File path                        | Theme pill | What to verify before shooting                |
|----------------------------------|------------|-----------------------------------------------|
| `assets/themes/01-light.png`     | `Lt`       | Cream bg, coral accent, bars in good/warn/bad |
| `assets/themes/02-dark.png`      | `Dk`       | Warm dark, no pure black, all 7 cards visible |
| `assets/themes/03-hacker.png`    | `Hx`       | Green CRT, ASCII `[==---]` bars, dashed look  |
| `assets/themes/04-glass.png`     | `Gl`       | Translucent cards, colourful background mesh  |
| `assets/themes/05-gpro.png`      | `G+`       | Dark glass, animated aurora visible           |

### How to take

- **Mac (free):** `Cmd + Shift + 4` → Space → click the browser window. Saves to Desktop with shadow.
- **Mac (better):** [CleanShot X](https://cleanshot.com/) — gives clean shadow, controllable margin, optimized PNG.
- **Linux:** `gnome-screenshot -w` for window mode, or [Flameshot](https://flameshot.org/) for region+annotation.
- **Windows:** `Win + Shift + S` (Snipping Tool).

### After capture

Run each PNG through compression — they'll be 600KB+ otherwise:

```bash
# Optional but worth it. Install once:
brew install pngquant   # mac
sudo apt install pngquant   # linux

# Then for each file:
pngquant --quality=80-95 --strip --force --ext .png assets/themes/*.png
```

## Hero GIF — 1 file

The single biggest readme-page conversion lever. Should be 6–10 seconds long, looped, under 4 MB.

### What to record

The story is "look how it switches themes". Recommended sequence (rehearse before recording):

1. Start: Light theme, dashboard with the demo data
2. Click **Refresh all** — bars animate, accentdot pulses near "Updated"
3. Click **Dk** → wait 1s
4. Click **Hx** → wait 1s
5. Click **Gl** → wait 1s
6. Click **G+** → end on this theme (auroral background looks coolest)

Total: 8–10 seconds.

### How to record

**Mac (CleanShot X recommended):**
- Record screen → Record window → Choose browser window
- Output: GIF, FPS 24, max width 1280
- Most important: turn OFF the cursor highlight halo if you have one — it looks branded

**Mac (free, two-step):**
- `Cmd + Shift + 5` → Record selected portion → drag a tight rect around the window → Record
- Save as MOV
- Convert to GIF via <https://ezgif.com/video-to-gif> (resize to 1280 wide, FPS 18, optimize lossy 35)

**Linux:** [Peek](https://github.com/phw/peek) is the easiest GIF recorder

**Windows:** [ScreenToGif](https://www.screentogif.com/)

### Constraints

- Max width: **1280 px** (anything bigger is overkill on GitHub readme rendering)
- Max file size: **4 MB** (GitHub will slow-load larger files)
- FPS: 18–24 (smaller numbers = smaller file)
- If still too big: drop FPS to 15 or width to 1024

Save as: `assets/hero.gif`

## Folder structure when done

```
assets/
├── logo.svg          (already in repo)
├── logo-dark.svg     (already in repo)
├── social.svg        (already in repo — convert to social.png separately)
├── hero.gif          ← you record
└── themes/
    ├── 01-light.png  ← you take
    ├── 02-dark.png   ← you take
    ├── 03-hacker.png ← you take
    ├── 04-glass.png  ← you take
    └── 05-gpro.png   ← you take
```

## Social preview PNG (separate task)

GitHub uses a 1200×630 PNG for link unfurling on Twitter/Discord. The SVG source is at `assets/social.svg`; convert to PNG once:

**Browser way (no tools):**
1. Open `assets/social.svg` directly in Chrome → right-click → "Save image as..." → choose PNG.
2. The downloaded file might not be exactly 1200×630; resize via <https://squoosh.app> if needed.

**Inkscape (clean):**
```bash
inkscape assets/social.svg --export-type=png --export-filename=assets/social.png --export-width=1200
```

**Online (Figma, etc.):** drop the SVG, export as PNG 1200×630.

Save as `assets/social.png`. Then in your GitHub repo Settings → Social preview, upload it.

## Final commit

```bash
git add assets/ docs/SCREENSHOTS.md
git commit -m "docs: add hero GIF + theme screenshots + social preview"
git push

# bump version + republish
npm version patch   # 0.3.0 → 0.3.1
git push --tags
npm publish
```

Done. The npm page should now show the hero GIF, theme gallery, and proper social preview.
