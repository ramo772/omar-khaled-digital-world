# Omar Khaled — A Small Digital World

An original TypeScript/React portfolio foundation with a real-time Three.js world. **Phase 1 only:** professional content is intentionally pending CV verification. It is not a completed professional portfolio.

## Prerequisites and commands

Use Node.js **22.13 or newer** (Node 24 LTS recommended) and npm. The lockfile is committed; do not use `--force` or disable security checks to install.

```sh
npm install
npm run dev
npm run typecheck
npm run lint
npm test
npm run build
npm run build:pages
npm start
```

The development command prints its local URL. `build` produces Vinext's build artifacts in `dist/`; `build:pages` also verifies and prepares the static `dist/client` output for Cloudflare Pages. `start` uses Wrangler to serve the separate Worker build locally. No environment variables, AI API key, database, or external account are required for local development.

## What is implemented

- Original miniature engineering world: arrival desk → experience trail → centerpiece project workshop → AI Lab → next/contact station; skills nook branches off the path.
- Human placeholder avatar, camera-relative WASD/arrows, collision boundaries, tap/click routing, touch directional controls, and reset/zoom controls.
- Destination labels and persistent navigation, accessible dialogs, Quick View, and server-rendered semantic content.
- A labeled local agent-loop simulation with run/pause/step/reset; no real AI calls.
- Graphics quality controls and automatic reduction after sustained slow frames; capped DPR, paused hidden rendering, reduced-motion support, renderer error/context-loss fallback, and text-only mode.
- No audio autoplay. The audio indicator is status-only; ambient sound belongs to the later polish phase.

## Architecture

This project uses the official Sites scaffold: React, Vinext's Next-compatible app router, Vite, the Sites Vite plugin, and Cloudflare Workers. Three.js and React Three Fiber are lazy-loaded in the browser. Drei provides HTML labels. UI controls compose the scaffold's Base UI/shadcn Button and Dialog primitives.

`app/` holds server-rendered content, metadata, and theme. `src/data/world-map.ts` owns destination labels/coordinates and neutral content. `src/ui/` owns the portfolio shell, dialogs, simulation, and touch UI. `src/world/` separates geometry, landmarks, camera, avatar, and input controller. `src/lib/movement.ts` contains framework-independent collision/routing math with behavioral tests. `src/hooks/usePreferences.ts` handles visibility and accessibility preferences.

The world uses locally authored procedural geometry and materials, no copied Messenger assets, no model downloads, no texture packs, and no runtime font CDN. `public/og.jpg` is an original generated social illustration, not a screenshot or a claim of professional work.

Read [the plan](docs/PORTFOLIO_PLAN.md), [content guide](docs/CONTENT_GUIDE.md), [avatar replacement contract](public/avatar/README.md), and [validation record](docs/QA.md).

## Content and avatar changes

Do not populate professional content before reading the CV. Follow `docs/CONTENT_GUIDE.md` to extract facts, make the provenance table, and then create `src/data/portfolio.ts`. AI exploration remains explicitly separate from employment and verified skills.

Replace only `src/world/character/Avatar.tsx` to use a future cartoon model. Place that GLB in `public/avatar/developer.glb`; preserve the documented scale, origin, facing direction, collider, controller, and animation boundary.

## Deployment

The portfolio is prepared for a fully static **GitHub → Cloudflare Pages** deployment. Use `npm run build:pages`, publish `dist/client`, and set the production branch to `main`. Do not deploy `dist/server`: it is the separate Worker output and is unnecessary for this site.

Production builds need `VITE_SITE_URL` for absolute canonical/Open Graph URLs and `VITE_SITE_INDEX=true` to opt into indexing. With those values unset, local and preview builds remain `noindex`. No runtime variables, secrets, Pages Functions, database, or paid service are required by the application. No third-party analytics are active.

Follow the exact settings, Git integration steps, custom-domain procedure, and post-deploy checks in [the Cloudflare Pages guide](docs/CLOUDFLARE_PAGES.md).

## Remaining phases

CV provenance and real content, verified project-specific artifacts/case studies, richer learning simulations, optional original ambience, extended real-device performance/accessibility checks, analytics consent integration if needed, and an approved public launch are still future work. See the QA record for exact verified checks and limitations.
