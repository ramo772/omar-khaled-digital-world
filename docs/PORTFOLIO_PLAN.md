# Omar's Small Digital World — portfolio plan

## Status and source integrity

Revision 2 incorporates the user's approved product changes. Phase 1 is authorized independently of CV availability. This document is not a claim that unverified implementation or testing is complete.

- The supplied brief and subsequent product changes have been read in full. The initial workspace had no application. This plan lives in `outputs/portfolio/docs/`.
- The supplied CV is `C:\Users\Asus\Downloads\Omar-Khaled-Cv.pdf`. Windows denied access even after read permission was granted. CV extraction and professional content verification are therefore pending. No companies, roles, dates, projects, metrics, qualifications, contact details, or skills may be invented.
- The reference URL, <https://messenger.abeto.co/>, was directly inspected in the browser after runtime access recovered on August 31. Observed its rotating introductory world, Begin action, short character-dialogue steps, and third-person street view with persistent side controls. Useful principles are a calm introduction, readable navigation, compact scale, and environmental character. This portfolio uses its own fixed elevated engineering-diorama view and immediate text access. No reference assets or code were reused. This was an experience review, not a complete gameplay audit.
- Concept decisions below come from the user's brief. No reference assets, code, models, textures, layouts, audio, or characters will be downloaded or reused.
- Phase 1 visual/world implementation may proceed now with neutral labels such as Experience, Project, and Role. Professional content remains blocked until the CV is readable. Then extract facts, build a provenance table, populate `portfolio.ts`, and only then implement professional copy. No realistic fictional employment content is permitted.

## 1. Product concept

**Omar's Small Digital World** is a miniature engineering environment where a software engineer builds, experiments, and learns. Its identity is immediately technical: a prominent open engineering workshop, small infrastructure racks, architecture boards, code screens, deployment signals, and an active experimental lab. Warm natural materials, modest greenery, and handmade geometry keep the world human. It is a professional portfolio presented as an explorable place.

The introduction identifies **Omar Khaled / Software Engineer** immediately. A brief positioning sentence will be written only after reading the CV. The primary action is **Enter portfolio**; a equally discoverable **Quick view** opens semantic portfolio content without requiring WebGL or movement.

The world combines cream composite surfaces, timber platforms, graphite engineering frames, seafoam instruments, restrained orange signals, tactile paths, and a little nature. Terracotta roofs, olive trees, and rustic buildings are not the primary identity. Subtle futuristic objects are welcome; cyberpunk, neon overload, and generic AI imagery are not. It avoids the reference's delivery narrative, spherical planet, characters, and exact composition. There are no quests, scores, account requirements, mandatory tutorials, or locked portfolio sections.

### Recruiter path

Within ten seconds a visitor can see Omar's name, verified professional focus, strongest verified work, and contact/CV actions. Clicking Projects or Experience from the persistent navigation bypasses exploration entirely.

### Explorer path

Enter the island, walk or tap towards a destination, and open a concise panel. Environmental details make the destinations memorable, but do not replace evidence about the work.

## 2. World map and composition

Use one compact, bounded island rather than several distant levels. An elevated three-quarter camera makes paths and landmarks visible together. One legible ribbon path tells a story: **Who I am → My journey → What I built → What I am exploring now → What I want to build next**. Branches are short and reconnect; nothing requires jumping. Persistent navigation and Quick View always bypass the physical route.

| Location               | Position                              | Visual role                                                                                      | Portfolio content                                                                                |
| ---------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| Arrival / About        | Front left                            | Human developer avatar, work desk, notebook, coffee, code terminal                               | Who I am: identity and later verified biography                                                  |
| Experience trail       | Left, leading inward                  | Connected milestone modules, architecture board, small infrastructure units                      | My journey: verified roles only; neutral modules until CV                                        |
| Project Workshop       | Center, largest visual landmark       | Open structural frame, large screens, miniature system models, status lights, artifact pedestals | What I built: CV-backed work represented in-world before opening panels                          |
| AI Lab                 | Right, next along the main path       | Experimental ring, activating nodes, tool connections, small environmental robot                 | What I am exploring now: explicitly labeled interactive simulations                              |
| Skills / learning nook | Short branch between workshop and lab | Books, tool drawer, workbench                                                                    | Verified skills kept separate from Learning topics                                               |
| Next / Contact         | Front right, end of journey           | Unfinished blank prototype plinth, signal mast, open notebook                                    | What I want to build next: invitation to collaborate, no invented commitments or contact details |

Illustrative map, not final geometry:

```text
             02 JOURNEY ------ 03 PROJECT WORKSHOP
                 /                  |          \
                /              SKILLS NOOK     04 AI LAB
               /                                  |
         01 ABOUT / ARRIVAL                  05 NEXT / CONTACT
```

Buildings stay behind their interaction zones so the avatar and paths remain legible. Low foliage frames the scene without blocking routes. The default composition gives the world most of the viewport and keeps UI at its edges. On narrow screens, the camera fits the island width and the persistent menu becomes a compact, labeled destination drawer.

The Project Workshop is the visual centerpiece, not a collection of ordinary cards. Before CV access, its screens and system blocks are labeled as generic foundation artifacts. After verification, visual artifacts may represent only documented project properties. Do not invent architecture, uptime, deployments, transactions, or impact numbers. Decorative status lamps indicate the world simulation, not employer production status.

## 3. Interaction model

- **Desktop movement:** WASD or arrow keys in camera-relative directions. Normalize diagonal movement, use frame-time-based speed, cap large frame deltas, and clear input on blur/visibility changes.
- **Point movement:** click or tap navigable ground to walk to it. Use simple collision-aware routing or bounded path waypoints; never direct the avatar through buildings.
- **Touch:** large touch targets and a small optional directional control. Touches on UI never move the avatar. Support pointer cancel and release outside a control.
- **Open a location:** click its accessible label, use the persistent destination menu, or approach and press E/Enter. Keyboard focus in a panel suspends movement.
- **Camera:** a stable elevated view, gentle bounded zoom, and a reset-view action. Avoid free camera rotation in V1 because it complicates orientation and controls. Reconsider only after usability testing.
- **Panels:** a readable desktop side panel and mobile sheet. They include titles, context, content, and clear close/back controls. Use dialog primitives with focus trapping, Escape dismissal, focus restoration, and background inertness.
- **Quick View:** semantic HTML for About, Experience, Projects, AI Lab, Skills, and Contact. Accessible from the introduction and world. Does not depend on successful loading of Three.js.
- **Progress:** optional small visited-place indicator for orientation, without presenting exploration as a required checklist.
- **Sound:** off initially. An explicit control starts original synthesized ambience or a licensed, documented asset. Pause when the page is hidden; failure must not affect navigation.
- **Personal detail:** a football, a coffee cup, an architecture board, and a deployment indicator. These are original environmental details, not claims of professional work or skills.

## 4. Visual direction

- **Palette:** warm canvas `#F3F0E8`, graphite `#293A3A`, seafoam `#8CAFA4`, signal orange `#DF7950`, butter yellow `#DEC789`, and sky `#DCE8E7`. Dark graphite frames and warm cream engineering structures define the identity; nature provides supporting color.
- **Typography:** a readable humanist sans for content and a restrained monospace for location indexes, technical captions, and keyboard hints. Bundle licensed fonts locally or use system fallbacks; do not depend on a runtime font CDN.
- **Geometry:** original low-poly/cel-influenced models with a few deliberate asymmetries. Geometry and materials are authored for real-time 3D, not CSS illustrations or copied models.
- **Lighting:** warm key light, cool ambient fill, soft economical shadows, gentle atmospheric depth. No expensive postprocessing is necessary for the main identity.
- **UI:** solid paper-like surfaces, fine borders, careful spacing, and minimal chrome. Avoid glass panels, purple SaaS gradients, logo grids, and neon effects.
- **Motion:** short panel transitions, a gentle arrival transition, subtle environmental movement. Reduced-motion mode removes camera travel, walking bob, particles, and nonessential animation.
- **Avatar:** a HUMAN stylized temporary developer with deliberately generic features, never a robot/rover and never an attempt to resemble Omar. Establish human proportions, walk cycle, camera framing, and collider now so a future cartoon made from Omar's real photo can replace the visual model without redesigning the world. A small robot may be an environmental character in the AI Lab only.

## 5. Content and truth model

All public professional copy is derived from the CV. The current brief supports Omar's name, the Software Engineer heading, and an interest in AI engineering. It does not establish specific employers, tenure, outcomes, or technology proficiency.

After CV extraction, create a private working provenance table linking each public fact to its CV page/section. Transform the wording into concise portfolio copy while preserving meaning and scope. Preserve approximate dates as approximate; do not calculate or advertise years of experience unless the chronology supports it.

Projects use optional fields:

```ts
type Project = {
  id: string;
  name: string;
  summary: string;
  context?: string;
  problem?: string;
  contribution?: string[];
  approach?: string[];
  technologies?: string[];
  challenges?: string[];
  impact?: string[];
  links?: { label: string; url: string }[];
};
```

Only populated, supported fields render. Do not manufacture architecture, challenges, metrics, screenshots, or GitHub links to fill a layout. Employment-related work uses only publicly shareable CV details. Where the CV is insufficient for a case study, present an honest concise summary rather than a speculative narrative.

AI Lab is separately labeled **Currently exploring / Experiments / Learning**. It is an active laboratory, not a static skills list. Organize the user-provided interests into agent systems, retrieval/context, evaluation/observability, automation, and voice. Mention AI Agents, tool calling, MCP, n8n, OpenClaw, LangChain, LangGraph, Langfuse, evals, RAG, embeddings, context engineering, hooks, BMAD, Voice AI, and automation as learning topics—not employment experience, credentials, or shipped projects unless proven by the CV.

Implement local, explicitly labeled simulations: a step/run/reset agent → tool → observation loop; MCP tool connections; a retrieval animation showing query, matching documents, and context; workflow nodes activating; and an evaluation board with synthetic illustrative results. Never imply real AI calls, use fake streaming as a real model response, or present simulated scores as Omar's achievements. Phase 1 builds the environmental stage and a simple signal-loop preview; richer simulations belong to Phase 4.

Do not publish the raw CV PDF automatically if it contains private identifiers or details inappropriate for a public website. Inspect it first. Public contact links must use actual supplied values. Never ship fake forms, placeholder email addresses, or fabricated external links.

## 6. Architecture and stack

Use TypeScript, React, Three.js, and React Three Fiber. Use Drei selectively for camera/HTML helpers where it reduces implementation complexity. Avoid a physics engine and GSAP in V1 unless a demonstrated need justifies them.

The Sites workflow uses its required generated scaffold with the `shadcn` add-on and preserves the scaffold's package manager and architecture. Target a server-rendered React application with a separately lazy-loaded client world. Confirm the generated framework and deployment contract before documenting platform-specific commands. For a standard Next.js deployment, Vercel is the preferred alternative; the Sites-compatible generated build targets Cloudflare Workers through Sites. Do not claim those targets are interchangeable without checking configuration.

```text
app/
  page.tsx                  # Server-rendered introduction + semantic content
  layout.tsx                # Metadata, fonts, document structure
  globals.css               # Theme and responsive UI rules
src/
  data/
    portfolio.ts            # CV-derived professional content
    exploration.ts          # Learning interests, clearly distinguished
    world-map.ts            # Destination IDs, coordinates, labels
  types/
    portfolio.ts
  world/
    World.tsx               # Composition only
    environment/            # Terrain, paths, trees, lighting, atmosphere
    character/              # Controller + replaceable neutral avatar
    locations/              # Original landmark models
    interactions/           # Ground targeting, proximity, collision logic
    camera/                 # Fit, resize, and camera constraints
  ui/
    Introduction.tsx
    WorldNavigation.tsx
    PortfolioPanel.tsx
    QuickView.tsx
    TouchControls.tsx
    Settings.tsx
  hooks/
    useInput.ts
    useQuality.ts
    useReducedMotion.ts
  lib/
    audio.ts
    analytics.ts            # Disabled-by-default event adapter; no tracking vendor
public/
  avatar/README.md           # Replacement contract and asset requirements
  og.png                    # Original branded social preview
docs/
  PORTFOLIO_PLAN.md
  CONTENT_GUIDE.md
  QA.md
README.md
```

Use React state/context for panel/navigation state; mutable refs for per-frame movement. Rendering does not update React state every frame. Keep pure movement/collision functions independent of React for meaningful tests. A single destination ID connects world markers, the menu, panels, and accessible sections.

### Avatar replacement contract

`src/world/character/Avatar.tsx` exposes a stable root transform. The placeholder is a stylized human, about 1.7 world units tall, feet at Y=0, Y-up, facing +Z, with a 0.28-unit horizontal collider radius independent of its model. The camera frames this human scale. Idle and walk presentation is separate from motion/collision; later GLB assets should supply Idle and Walk clips or use the procedural fallback. Future model files belong in `public/avatar/`; its README records exact scale, axes, origin, material/texture budgets, and replacement steps. Replacing the visual model must not change controller, collider, interaction radius, paths, or camera. No personal face or likeness is generated.

## 7. Accessibility, SEO, and graceful failure

- Render substantive headings and portfolio text on the server; do not hide the only content inside a canvas or client-only dialog.
- Provide a skip link and a full text/Quick View route or mode. Basic content remains available with JavaScript disabled.
- Detect WebGL support before world initialization. Catch renderer/asset failures, handle context loss, and retain the readable portfolio.
- Offer a clear low-graphics/text-view action when sustained performance is poor; never leave a visitor behind an endless loader.
- Respect reduced motion, keyboard navigation, focus visibility, dialog behavior, contrast, and touch target size.
- Use truthful title/description, canonical URL once known, Open Graph/X metadata, and an original social image. Do not invent awards or credentials in structured data.
- Add a sitemap only once routes and the canonical deployment origin are known. Keep owner-only review deployments out of search indexing; enable indexing for an approved public release.

## 8. Performance strategy

- Lazy-load the world independently of the readable portfolio UI.
- Start with procedural low-poly geometry and flat-color materials, minimizing texture/model downloads.
- Reuse geometries and materials; instance repeated vegetation where helpful.
- Cap device pixel ratio: initially 1–1.5 on desktop and 1 on constrained/mobile devices.
- Limit shadow resolution and shadow casters; disable shadows and particles in low mode.
- Pause rendering or use demand rendering when the document is hidden or the world is covered by a full content view, while ensuring animations resume correctly.
- Sample sustained frame performance, not isolated spikes, before reducing quality. Avoid oscillating quality levels.
- Quantify the production world chunk and total compressed transfer. Set budgets after inspecting the scaffold and library cost, and record actual values in QA; never claim smooth performance without measurement.
- Draco/Meshopt are relevant only if compressed external models are later introduced. Do not add decoder dependencies to a procedural scene unnecessarily.

## 9. Implementation phases and acceptance gates

| Phase               | Deliverables                                                                                                                                                                              | Required checks before moving on                                                                                                                                           |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Foundation       | Scaffold, engineering identity, narrative island, centerpiece workshop, camera, lighting, HUMAN generic avatar, movement, responsive controls, truthful placeholder navigation/Quick View | Run locally; inspect desktop/mobile framing; verify diagonal speed, world bounds, blur cleanup, touch release; first meaningful preview; no realistic fictional CV content |
| 2. Portfolio world  | Distinct landmarks, labels, proximity/click interactions, persistent navigation, panels, Quick View                                                                                       | Every destination opens correct content; keyboard and touch access; Escape and focus restoration; background movement suspended                                            |
| 3. Verified content | CV-derived about, employment, projects, skills, education, contact                                                                                                                        | Audit every claim against CV; no unsupported outcomes/links; verify project details and visible contact actions                                                            |
| 4. AI Lab           | Learning groups, robot/environmental detail, labeled local agent-loop simulation                                                                                                          | Clear separation from work history; simulation controls actually work; no implied live AI or fabricated completed experiments                                              |
| 5. Polish           | Transitions, original details, audio opt-in, adaptive quality, accessibility, mobile refinements                                                                                          | Desktop/mobile visual checks; reduced motion; WebGL failure; no overflow; readable contrast; audio off by default; memory/performance checks                               |
| 6. Production       | SEO, social preview, analytics adapter, docs, build, deployment, source delivery                                                                                                          | Type check/build succeed; inspect console; verify metadata and semantic output; verify deployed URL; record actual test results and remaining limits                       |

Phase 1 should be a deliberately small, recognizable slice. Open the first preview only when the theme, island, and main interaction are recognizable and the route compiles. Continue from that same preview tab through subsequent phases and deployment.

## 10. Validation and delivery

Meaningful automated tests cover movement normalization, bounds/collision resolution, destination mapping, and content validity where they protect real behavior. Browser checks cover entry, all destinations, project details, Quick View, keyboard focus, sound consent, touch controls, resize, reduced motion, and fallback. Test at a normal laptop viewport and a narrow mobile viewport after each implemented phase, and record pass/fail honestly. A desktop emulator is not a substitute for claiming real-device performance.

README must document prerequisites, the actual package manager, install/dev/build/production commands, environment variables, deployment steps, architecture, content editing, and the avatar contract. Include the lockfile and omit caches, credentials, local logs, and private extracted CV working files from source delivery.

Deployment proceeds only after a successful production build. A private Sites review URL is the initial deployment; public access is handled as a distinct, explicit release choice. Provide source under `outputs/portfolio/` and, when complete, a clean downloadable archive without node_modules or secrets. The final response must distinguish completed implementation, verified tests, deployed access, and any outstanding blocker.

## Current next actions

1. Implement the authorized Phase 1 world foundation using only neutral professional-content placeholders.
2. Verify the implemented foundation with desktop/mobile browser checks, typecheck, movement tests, and a production build. Record any deployment or device-test limitations.
3. When the CV is accessible, extract facts, build the provenance table, populate `portfolio.ts`, and only then implement professional content.

No user design approval is required for routine implementation choices. CV availability blocks professional content, not Phase 1. Browser/build/deployment checks must be reported as unverified if runtime access prevents them.
