<!-- Copilot / AI agent instructions for the Kindora NextJS theme -->
# Kindora NextJS — Copilot Instructions

This file gives concise, actionable guidance for AI coding agents working in this repository. Focus on discoverable patterns, important files, and the exact commands the project uses.

## Big Picture
- **Framework**: Next.js (v15) using the App Router. Entry layout is `src/app/layout.tsx` which wires global providers, `Header`, `Footer`, and site-wide CSS (`src/styles/main.css`).
- **Content-driven**: Markdown content lives under `src/content/` and is parsed by `src/lib/contentParser.ts` (functions `getListPage`, `getSinglePage`). Many pages/sections import these helpers to render content.
- **Theme/config**: Site settings are in `src/config/config.json` and `src/config/theme.json`. Use these as the single source of truth for site metadata, nav, and theme tokens.

## Where to make common changes
- **Hero / Menu / Footer**: Look under `src/layouts/partials/` and `src/layouts/components/`. The repository also contains a `.cursorrules` that expects `components/hero/**`, `components/menu/**`, `components/footer/**` — check both places when customizing.
- **Page-level banners**: Page-specific hero/banner content is often composed inside `src/app/*/page.tsx` files.
- **Styling**: Tailwind is used (plugin files in `tailwind-plugin/`); main styles are in `src/styles/` (e.g. `main.css`, `components.css`). Format styles with Prettier + `prettier-plugin-tailwindcss`.

## Repository cursor rules
- There is an additional instructions file at `.github/instructions/.cursor-rules.md.instructions.md` that codifies targeted editing areas. Merge or follow these globs when making CMS changes:
  - `components/hero/**`
  - `components/menu/**`
  - `components/footer/**`
  - `pages/**`
  - `styles/**`

- Focus: customize the hero banner, menu navigation, and footer components. Use page-level components for page-specific banners and prefer Tailwind utility classes for styling.

## Key files to reference (examples)
- `src/app/layout.tsx` — global layout, where `Header`/`Footer` are assembled and GTM is wired if enabled in config.
- `src/lib/contentParser.ts` — reads `src/content` markdown synchronously and returns frontmatter + content. Keep changes compatible with existing callers (`getListPage`, `getSinglePage`).
- `src/config/config.json` — site-wide toggles (e.g., `google_tag_manager`, `disqus`, `navigation_button`).
- `src/config/theme.json` — theme tokens (colors, fonts) used by components.

## Build / dev / maintenance commands
- Preferred package manager: Yarn v1 (see `package.json` `packageManager` field). The `scripts` defined are:
  - `yarn dev` (or `npm run dev`) — run Next dev server
  - `yarn build` — production build
  - `yarn start` — start built app
  - `yarn lint` — run linter
  - `yarn format` — run Prettier on `./src`

## Project-specific conventions and patterns
- **Content first**: Pages consume markdown via `getListPage` / `getSinglePage` rather than querying a headless API. If converting to a CMS, modify `src/lib/contentParser.ts` to check DB first and fallback to markdown — callers across `src/layouts/*` expect the same return shape.
- **Synchronous reads**: `contentParser` uses `fs.readFileSync`; this is intentional for build-time/static rendering in the App Router. Preserve synchronous semantics unless all callers are converted to async server functions.
- **Partial/Component locations**: The project groups UI into `src/layouts/components` and `src/layouts/partials`. Search these folders when updating site UI.
- **Tailwind plugin usage**: Custom Tailwind logic lives in `tailwind-plugin/` — refer to it when adding theme tokens or grid tweaks.

## Integration points & external services
- Google Tag Manager: controlled by `src/config/config.json` → `google_tag_manager.enable` and `gtm_id`; included in `src/app/layout.tsx` via `@next/third-parties/google`.
- Disqus: configured via `config.disqus` and used by the `Disqus` component in `src/layouts/components`.
- Newsletter: Mailchimp form action is in `config.subscription_in_footer.mailchimp_form_action` and is used by footer subscription markup.

## What to preserve when editing
- Keep `frontmatter` shape intact (date, draft, url, etc.) for `getSinglePage` and `getListPage` consumers.
- When refactoring components, preserve public props used in `src/layouts/*` to avoid breaking server-rendered pages.

## Quick examples
- Update homepage hero: edit the component under `src/layouts/partials/` (or `src/layouts/components/hero`) and adjust content via `src/content/homepage/_index.md`.
- Add a new program page: add a markdown file in `src/content/programs/` and its frontmatter; the pages use `getSinglePage('programs')` to collect entries.

## When in doubt
- Search for `getListPage` / `getSinglePage` to find how content is consumed.
- Follow the config files (`src/config/*.json`) rather than hardcoding values in components.

---
If any section is unclear or you'd like policy additions (tests, CI, commit message style), tell me which area to expand and I will iterate.
