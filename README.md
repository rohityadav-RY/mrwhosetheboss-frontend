# MRWHOSETHEBOSS — Fan / Community Website (editorial refinement)

An **unofficial fan/community project** for technology creator Arun Maini — Mrwhosetheboss. Not affiliated with or endorsed by him or his channel.

HTML5 · CSS3 · vanilla JavaScript. No build step. GitHub Pages compatible. Only two pages: `index.html` (Journey is the `#journey` section) and `community.html`.

## What changed in this pass
- **Type:** Bodoni Moda (high-contrast Didone serif, Google Fonts) for headlines, section titles, journey years and story titles; Inter for nav, metadata, body, buttons and form labels.
- **Nav:** search icon, hamburger and mobile menu removed. `HOME  JOURNEY  COMMUNITY` sit top-left on every screen size.
- **Animation system** (IntersectionObserver, once per element, respects `prefers-reduced-motion`): `.reveal`, `.reveal-up`, `.reveal-lines`, `.reveal-image`, `.reveal-hero`, `.reveal-stagger`. Optional delay: `style="--d:.2"`. Cinematic band has very subtle parallax.
- **Footer:** minimal editorial footer with YouTube, Instagram, X, TikTok, Facebook and the official website.

## Images — `images/`
| File | Status |
|---|---|
| `hero.jpg` | **Not in the zip you sent. Keep/put your existing hero here** (code and styling unchanged). |
| `video-01.jpg` `video-02.jpg` `video-03.jpg` | Optional overrides. If missing, the page loads each linked video's official YouTube thumbnail (`i.ytimg.com`). Drop your own files here for a fully local site. |
| `JOURNEY.jpg` `STORY-TECH.jpg` `STORY-WORLD.jpg` `STORY-COMMUNITY.jpg` `MOUNTAIN.jpg` | Included: monochrome procedural editorial art (not true AI renders). Replace with generated art — prompts below. Keep the filenames. |
| `CREATOR.jpg` | **Not included.** Use a real, licensed photo of Arun Maini (official site / Instagram). Shows a labelled placeholder until then. |

### Prompts for the AI-generated images
Add to each: *monochrome, warm off-white and charcoal, fine film grain, editorial magazine photography, no text, no logos, no people's faces.*
- `JOURNEY.jpg` (3:2) — a quiet winding road receding toward distant misty hills at dawn.
- `STORY-TECH.jpg` (3.6:1) — extreme macro of a camera lens, concentric glass rings, soft highlights, dark background.
- `STORY-WORLD.jpg` (3.6:1) — layered misty mountain valleys, atmospheric perspective.
- `STORY-COMMUNITY.jpg` (3.6:1) — a crowd silhouetted below thousands of soft points of light, shallow depth of field.
- `MOUNTAIN.jpg` (≈5:1) — cinematic dark mountain ridges fading into fog, wide.

## Featured videos
Currently: *I Tested the Rarest Tech in 2026!* (`UjRWQND6_ro`), *13 Tragic Tech Fails that need to DIE* (`HvbOESd9u1w`), *60 facts about me* (`Muv0wjyjSNs`). To swap, change the `href`, the `data-remote` video IDs, and the title/category in `index.html`.

## Social links
YouTube `youtube.com/@Mrwhosetheboss` · Instagram `instagram.com/mrwhosetheboss/` · X `x.com/Mrwhosetheboss` · TikTok `tiktok.com/@mrwhosetheboss` · Facebook `facebook.com/mrwhosetheboss/` · Website `mrwhosetheboss.com`. All open with `target="_blank" rel="noopener noreferrer"`.

## Journey years
2011 / 2015 / 2018 / 2020 / 2024 come from the original brief and are **not verified** — check before publishing.

## Backend
`submitToBackend(formData)` in `js/script.js` is unchanged and still simulates success. Replace the simulated promise with:
```js
return fetch("BACKEND_URL", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(formData)
}).then((r) => ({ ok: r.ok }));
```
`formData` = `{ name, email, category, message }`.

## Run locally
```
python -m http.server 8000
```
