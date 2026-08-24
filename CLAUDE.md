# nakrosis-landing

Personal website for Mindaugas Nakrošis at nakrosis.com. Static HTML/CSS — no build step, no framework. All files served directly from `public/`.

## Structure

```
public/
  index.html          — homepage
  writing.html        — writing index (archive list)
  writing/            — individual article pages
    azure-cost-review.html
    pre-merge-spec-review.html
    from-markdown-to-jira.html
    claude-code-azure-pr-review.html
  case-studies.html
  contact.html
  styles.css          — single stylesheet used by all pages
```

## How to add a new article

1. Create `public/writing/<slug>.html` — copy the structure of an existing article (e.g. `azure-cost-review.html`).
   - Update `<title>`, `<meta name="description">`, `<link rel="canonical">`, all OG/Twitter tags, and the JSON-LD `datePublished` + `headline`.
   - Set the eyebrow (`<p class="eyebrow">`), `<h1>`, `<p class="lede">`, and `<p class="article-meta">` (date + Medium link if applicable).
   - Convert the article body from markdown to HTML inside `<article class="article-body">`.
   - Keep the same `<header>`, `<footer>`, and inline `<style>` block as the other articles.

2. Add a `<li>` entry to `public/writing.html` at the **top** of the 2026 `<ul class="archive-list">`:
   ```html
   <li>
     <span class="when">Jun 04</span>
     <p class="title"><a href="/writing/<slug>">Article title</a> · <a href="https://mindaugasnakr.medium.com/..." target="_blank" rel="noopener" class="meta">Medium</a></p>
   </li>
   ```
   Omit the Medium link if the article isn't published on Medium yet.

3. Add a `<li>` entry to the **"Recent writing" section in `public/index.html`** (keep only the 3 most recent — remove the oldest when adding a new one):
   ```html
   <li>
     <span class="when">Jun 04</span>
     <p class="title"><a href="/writing/<slug>">Article title</a></p>
   </li>
   ```

## Canonical URL pattern

`https://nakrosis.com/writing/<slug>` — slug matches the HTML filename without extension.

## Style notes

- British English throughout (colour, optimise, artefact, etc.)
- No emojis
- No hype language
- Tone: direct, conversational, first-person — like explaining to a colleague
- The footer and `<em>Written with Claude Code...</em>` closing line appear on every article

## Article source files

Draft articles and LinkedIn posts live in `/Users/mindaugasnakrosis/Darbas/claude/posts/<nn>-<slug>/`:
- `medium-post.md` — the full article in Medium-compatible markdown
- `linkedin-post.md` — the LinkedIn post with posting notes
- The original prompt/brief file if applicable

## Assets and caching

`public/_headers` serves every `.css`, `.jpg`, `.png`, `.webp` and `.avif` with
`max-age=31536000, immutable`. Nothing is re-fetched by returning visitors, so
**cache-busting is manual**:

- **Stylesheet** — every page links it as `styles.css?v=<yyyymmdd>`. After
  editing `public/styles.css`, bump the version in all pages at once:
  `grep -rl 'styles.css?v=' public | xargs sed -i '' 's|styles.css?v=[0-9]*|styles.css?v=<new>|'`
- **Images** — never overwrite an image in place; ship a new filename.

## Hero portrait

The homepage avatar is a square crop of `mindaugas.jpg` (768x1024, kept as the
OG/Twitter card image) pre-rendered at three densities in AVIF, WebP and JPEG:
`avatar-140.*`, `avatar-280.*`, `avatar-420.*`. To regenerate after a new photo:

```python
from PIL import Image
src = Image.open('mindaugas.jpg').convert('RGB')
w, h = src.size
sq = src.crop((0, round((h - w) * 0.18), w, round((h - w) * 0.18) + w))
for size in (140, 280, 420):
    sq.resize((size, size), Image.LANCZOS).save(f'avatar-{size}.jpg', quality=86, optimize=True, progressive=True)
```

then `cwebp -q 82 -sharp_yuv` and `avifenc -q 62 -s 4` from the same square crop.
The 0.18 vertical offset matches the old `object-position: 50% 18%` framing.
