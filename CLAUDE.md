# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Mystic Tarot (타로카드 리딩) — a Korean-language tarot card reading web app. Pure vanilla HTML/CSS/JS with no build step, no framework, and no package.json.

## Running Locally

```bash
node server.js
# Serves on http://localhost:3000
```

The dev server is also configured in `.claude/launch.json` as "tarot" (preview_start compatible).

## Deployment

Deployed to Vercel as a static site. `vercel.json` sets `outputDirectory: "."` with no build command. Just push to deploy.

## Architecture

**No build pipeline.** All JS files are loaded directly via `<script>` tags in `index.html` in dependency order:

1. `tarot-data.js` — 78-card tarot deck data (`TAROT_CARDS` global) + `getAllCards()` helper. Major arcana (22) + 4 minor suits (Wands, Cups, Swords, Pentacles, 14 each). `generateSuit()` creates minor arcana card objects.
2. `spreads.js` — `SPREADS` array defining 5 spread types (One Card, Three Card, Celtic Cross, Relationship, Career) with position names, layout coordinates, and card counts.
3. `app.js` — All application logic. Manages global `state` object, UI rendering, card shuffling (Fisher-Yates), fan-based card selection, spread layout positioning, and local interpretation generation.
4. `style.css` — Full styling including card flip animations, shuffle effects, modals, and responsive layout.
5. `server.js` — Minimal Node.js static file server (only needed for local dev).

**Key flow:** Spread selection → Shuffle animation → Fan card selection → Place cards in spread layout → Flip reveal → Context modal (category + question) → Local interpretation generation.

**Interpretation is fully client-side** — `generateLocalInterpretation()` in `app.js` builds readings from templates using card data, position energy mappings, and category context. No external API calls.

## Conventions

- **모든 결과값과 설명은 반드시 한글로 작성한다.** 코드 주석, 커밋 메시지, 사용자에게 보여주는 출력, 에러 메시지 설명 등 모두 한글을 사용할 것.
- UI text is in Korean. Card names exist in both English (`name`) and Korean (`nameKr`).
- All JS uses global scope (no modules). Order of `<script>` tags in `index.html` matters.
- CSS uses class toggling (`.active`, `.flipped`, `.selected`, `.filled`) for state-driven UI.
- Card reversal is random (30% chance) during shuffle, tracked via `isReversed` property.
