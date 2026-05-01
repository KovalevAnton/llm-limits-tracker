# Generating PNG icons from the SVG sources

The repo ships SVG sources only — `public/favicon.svg` and `public/apple-touch-icon.svg`. SVG works in modern browsers, but you also need PNG fallbacks for:

- iOS home screen (apple-touch-icon, 180×180)
- Android home screen / PWA install (icon-192, icon-512)
- Older desktop browsers (favicon-32 fallback)

This is a 5-minute one-time job.

## Required outputs

| File path                        | Size      | Source                          |
|----------------------------------|-----------|---------------------------------|
| `public/favicon-32.png`          | 32×32     | `public/favicon.svg`            |
| `public/apple-touch-icon.png`    | 180×180   | `public/apple-touch-icon.svg`   |
| `public/icon-192.png`            | 192×192   | `public/apple-touch-icon.svg`   |
| `public/icon-512.png`            | 512×512   | `public/apple-touch-icon.svg`   |

## Method 1 — realfavicongenerator.net (recommended for non-coders)

The cleanest approach. Generates all sizes + an updated HTML snippet.

1. Open <https://realfavicongenerator.net/>
2. Upload `public/apple-touch-icon.svg` (180×180 source)
3. Configure each platform tab — defaults are fine. iOS: leave background blank (we want the SVG's coral fill).
4. Click "Generate your Favicons and HTML code"
5. Download the package zip
6. From the zip, copy these files into `public/`:
   - `favicon-32x32.png` → rename to `favicon-32.png`
   - `apple-touch-icon.png` (already named correctly)
   - `android-chrome-192x192.png` → rename to `icon-192.png`
   - `android-chrome-512x512.png` → rename to `icon-512.png`
7. The HTML it generates also gives you a more complete `<head>` block — but ignore it, our `index.html` already has the right tags.

## Method 2 — Inkscape (CLI, scriptable)

```bash
# Install once
brew install inkscape   # mac
sudo apt install inkscape   # linux

# Then from project root:
inkscape public/favicon.svg          --export-type=png --export-filename=public/favicon-32.png        --export-width=32
inkscape public/apple-touch-icon.svg --export-type=png --export-filename=public/apple-touch-icon.png  --export-width=180
inkscape public/apple-touch-icon.svg --export-type=png --export-filename=public/icon-192.png          --export-width=192
inkscape public/apple-touch-icon.svg --export-type=png --export-filename=public/icon-512.png          --export-width=512
```

## Method 3 — sharp (Node, scriptable)

If you have Node and don't mind one-off dependency:

```bash
npx --package sharp-cli -- sharp -i public/favicon.svg -o public/favicon-32.png resize 32 32
npx --package sharp-cli -- sharp -i public/apple-touch-icon.svg -o public/apple-touch-icon.png resize 180 180
npx --package sharp-cli -- sharp -i public/apple-touch-icon.svg -o public/icon-192.png resize 192 192
npx --package sharp-cli -- sharp -i public/apple-touch-icon.svg -o public/icon-512.png resize 512 512
```

## Method 4 — browser screenshot (works everywhere, slower)

For a single icon if all else fails:

1. Open the SVG file directly in Chrome
2. Resize the viewport so it shows at exactly the size you want
3. Right-click → "Capture node screenshot" (DevTools → element tab → Capture node screenshot)
4. Move the resulting PNG into `public/`

## Optional: favicon.ico (legacy)

Pure ICO format is needed for IE 11, Edge ≤79, Safari ≤9. Probably not worth supporting in 2026, but if you want:

1. <https://realfavicongenerator.net/> generates `favicon.ico` in the same package
2. Or via ImageMagick: `convert public/favicon.svg -resize 32x32 public/favicon.ico`
3. Or skip — modern browsers prefer the SVG link anyway.

## Generating the social.png from social.svg

For GitHub Open Graph (link unfurling on Twitter/Discord):

```bash
# Inkscape:
inkscape assets/social.svg --export-type=png --export-filename=assets/social.png --export-width=1200

# OR sharp:
npx --package sharp-cli -- sharp -i assets/social.svg -o assets/social.png resize 1200 630

# OR online: <https://squoosh.app> → upload SVG → export PNG 1200×630
```

Upload the resulting `social.png` to the GitHub repo Settings → Social preview.

## Checklist after generating

- [ ] `public/favicon-32.png` exists
- [ ] `public/apple-touch-icon.png` exists
- [ ] `public/icon-192.png` exists
- [ ] `public/icon-512.png` exists
- [ ] `assets/social.png` exists
- [ ] All visible at the right size when opened directly in a file viewer
- [ ] Commit with `git add public/*.png assets/social.png && git commit -m "icons: generate PNG sizes from SVG sources"`
