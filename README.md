# Omar Khaled — A Small Digital World

An original TypeScript/React portfolio foundation with a real-time Three.js world. **Phase 1 only:** professional content is intentionally pending CV verification. It is not a completed professional portfolio.

## Prerequisites and commands

Use Node.js **22.13 or newer** (Node 24 LTS recommended) and npm. The lockfile is committed; do not use `--force` or disable security checks to install.

```sh
npm install
npm run dev
npm run typecheck
npm test
npm run build
npm start
```

The development command prints its local URL. `build` produces a Cloudflare Worker-compatible application in `dist/`. `start` uses Wrangler to serve that built output locally. No environment variables, AI API key, database, or external account are required to run this foundation.

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

The world uses locally authored procedural geometry and materials, no copied Messenger assets, no model downloads, no texture packs, and no runtime font CDN. `public/og.png` is an original generated social illustration, not a screenshot or a claim of professional work.

Read [the plan](docs/PORTFOLIO_PLAN.md), [content guide](docs/CONTENT_GUIDE.md), [avatar replacement contract](public/avatar/README.md), and [validation record](docs/QA.md).

## Content and avatar changes

Do not populate professional content before reading the CV. Follow `docs/CONTENT_GUIDE.md` to extract facts, make the provenance table, and then create `src/data/portfolio.ts`. AI exploration remains explicitly separate from employment and verified skills.

Replace only `src/world/character/Avatar.tsx` to use a future cartoon model. Place that GLB in `public/avatar/developer.glb`; preserve the documented scale, origin, facing direction, collider, controller, and animation boundary.

## Deployment

The generated app targets **Sites / Cloudflare Workers**, not the Next.js Vercel adapter. In the Sites workflow, build, push the exact source to the configured source repository, package the generated `dist` output with the Sites packaging helper, save a version, and deploy it. Keep source-write tokens out of repository files and remote URLs. `.openai/hosting.json` stores the opaque project identifier, never credentials.

For a standalone Cloudflare deployment, configure your own Worker name/account using the generated `dist/server/wrangler.json` and the current Wrangler deployment workflow; Cloudflare account configuration and quotas apply. No paid service is required by this application itself. Vercel requires a deliberate migration to standard Next.js build/runtime configuration; do not deploy the Vinext Worker artifact there unchanged.

The foundation is marked `noindex` until verified public content and an explicit public release are ready. Set a trusted canonical origin and social-image URL for any changed deployment domain. No third-party analytics are active.

## Remaining phases

CV provenance and real content, verified project-specific artifacts/case studies, richer learning simulations, optional original ambience, extended real-device performance/accessibility checks, analytics consent integration if needed, and an approved public launch are still future work. See the QA record for exact verified checks and limitations.
