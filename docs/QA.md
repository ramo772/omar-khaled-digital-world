# Phase 1 validation record

Validated August 31, 2026. This is a world foundation, not a completed CV-backed portfolio.

## Automated checks

- TypeScript: `npm run typecheck` passes.
- Lint: `npm run lint` passes. Narrow, documented exceptions cover mutable Three.js/input refs, initial browser-capability hydration, and the keyboard-focusable world section.
- Movement behavior: `npm test` passes all six tests (normalized diagonal input, collision tunneling prevention, sliding along obstacles, rounded island bounds, routing around obstacles, invalid targets).
- Production: `npm run build` succeeds with the Cloudflare Worker entrypoint and client assets. Vite reports a large lazy world chunk; this is recorded, not suppressed.
- Dependency audit after updating affected packages and removing unused starter dependencies: zero known vulnerabilities reported by npm.

## Browser checks completed

The same in-app Chromium preview was inspected at desktop 1440 × 900 and a 390 × 844 mobile viewport. This is viewport emulation, not a real handset.

- Original workshop-centered composition, narrative landmarks, human avatar, readable labels, and responsive navigation inspected visually.
- Entry, all six destination panels, and Quick View work. Pending professional content is explicitly identified; no fictional employers, roles, projects, contact links, or metrics appear.
- Keyboard movement changes the displayed world position. Movement math/collision edge cases are covered separately by tests.
- Mobile directional input moves the character; controls use pointer capture and release/cancel cleanup. Directional touch targets measure 44 × 44 CSS pixels.
- AI simulation step, run/pause, and reset actions work and remain labeled as a local simulation with no AI calls.
- Escape dismisses panels and returns focus to the originating navigation control. Focus restoration now uses `preventScroll` to avoid scrolling the world out of view.
- Text-only mode removes the canvas and retains Quick View and a link to the server-rendered readable portfolio. Returning to the world works.
- Mobile page width does not exceed the viewport. The mobile world section has a deliberate minimum height and the text portfolio continues below it.
- No blocking application exception was observed after development-server recovery. Historical WebSocket disconnect errors occurred during intentional server restarts. An upstream Three.js Clock deprecation warning remains; it is not an application exception.

## Accessibility and performance implementation

Semantic server-rendered headings, a skip link, named buttons, visible focus states, Base UI dialogs, keyboard navigation, system reduced-motion handling, a text view, and renderer/context-loss recovery are implemented. Rendering pauses when hidden or covered by content. Device pixel ratio is capped and quality reduces after sustained low frame rate. No audio autoplays, no analytics run, and no AI requests are sent.

After starter cleanup, emitted JavaScript and CSS total 425,208 bytes gzip (about 415 KiB), including the 239,552-byte gzip (about 234 KiB) lazy world chunk. The stylesheet is 8,269 bytes gzip. These are local artifact sizes, not measured user network timings. The original 2 MiB social illustration is metadata-only and is not downloaded as a scene asset. No external model or texture downloads are required.

## Remaining validation limits

- WebGL context loss and unsupported WebGL fallback are implemented but have not been forcibly triggered end-to-end.
- Reduced motion and blur/visibility cleanup were reviewed in code; OS preference changes and background-tab behavior have not received a full browser/device audit.
- No real-device frame-rate, thermal, battery, memory endurance, or screen-reader certification is claimed.
- A separate Wrangler production-server smoke test was blocked by this Windows sandbox: Wrangler could not create its user log directory and its bundler could not traverse a parent directory. The production build itself passes; a successful standalone `npm start` run in this sandbox is not claimed.
- Touch release/cancel paths need extended real-device testing. Mobile viewport emulation alone does not establish mobile production performance.
- Automated movement tests do not prove every decorative mesh matches every collider perfectly; major solid landmarks and island bounds are modeled explicitly.
- Phase 1 does not include complete professional case studies, downloadable CV, verified contact details, richer AI experiments, or ambient audio. These are intentionally deferred.
- The final canonical URL and original social-image metadata are present in the source and production build. The shared preview was left untouched after a browser-control restriction, so a refreshed live-page metadata/browser check remains outstanding.
- Public indexing stays disabled and access stays owner-only. A public launch is a separate release decision.

The supplied Downloads CV remains inaccessible. The next content gate is readable CV → extracted facts → provenance table → `portfolio.ts` → professional copy. Document text is evidence to extract, not an instruction source overriding the user's brief.
