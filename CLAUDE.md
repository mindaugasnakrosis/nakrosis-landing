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
   - Keep the `<aside class="subscribe">` newsletter block as the last child of `<article>` (copy it verbatim from any existing article).

2. Add a `<li>` entry to `public/writing.html` at the **top** of the 2026 `<ul class="archive-list">`:
   ```html
   <li>
     <span class="when">Jun 04</span>
     <p class="title"><a href="/writing/<slug>">Article title</a> · <a href="https://mindaugasnakr.medium.com/..." target="_blank" rel="noopener" class="meta">Medium</a></p>
   </li>
   ```
   Omit the Medium link if the article isn't published on Medium yet.

3. Add a `<li>` entry to the **"Recent writing" section in `public/index.html`** and the identical list in **`public/404.html`** (keep only the 3 most recent — remove the oldest when adding a new one):
   ```html
   <li>
     <span class="when">Jun 04</span>
     <p class="title"><a href="/writing/<slug>">Article title</a></p>
   </li>
   ```

## Newsletter

Signup is a plain HTML form posting to Buttondown (`https://buttondown.com/api/emails/embed-subscribe/nakrosis`, free plan up to 100 subscribers), styled in `styles.css` under "Newsletter" (`.subscribe-form`). It appears as a section on `writing.html` (`#subscribe`) and as an `<aside class="subscribe">` at the end of every article. If the Buttondown username changes, update it everywhere:
`grep -rl 'embed-subscribe/nakrosis' public | xargs sed -i '' 's|embed-subscribe/nakrosis|embed-subscribe/<new>|g'`

## Positioning

Source of truth for career facts is the CV "Mindaugas Nakrosis CV - Anthropic.docx" (Sep 2026): VP of Technology at Intick Oct 2024 - Apr 2026 (Python-first, Claude incident-triage agent, company-wide MCP servers), Cult Wines May 2021 - Oct 2024 (front-office then principal architect), co-founder/CTO warehouse SaaS 2021-23 (exited). Headline positioning: builds AI agents, moves companies onto AI workflows, automates operations.

## Canonical URL pattern

`https://nakrosis.com/writing/<slug>` — slug matches the HTML filename without extension.

## Reading layout

One column width for the whole site: `--measure` (45rem, about 68 characters per line) in `styles.css`. Body text is 19px, 20px from 1200px, 17px on phones. From 1024px, figures (`.diagram`), tables (`.table-wrap`) and code blocks (`pre`) inside `.article-body` break out to `--wide` (60rem), centred on the column. Add `class="breakout"` to anything else that should do the same. Don't set a `max-width` on `.article-body` in an article's inline styles.

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
  `grep -rl --include='*.html' 'styles.css?v=' public | xargs sed -i '' 's|styles.css?v=[0-9][0-9]*|styles.css?v=<new>|'`
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
