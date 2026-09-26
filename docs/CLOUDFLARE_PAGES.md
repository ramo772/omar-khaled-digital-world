# Cloudflare Pages static deployment

## Architecture decision

This portfolio is compatible with fully static hosting. Vinext pre-renders the App Router route at build time and writes the deployable site to `dist/client`. Cloudflare Pages must publish that directory only; `dist/server` is a separate Worker artifact and is not part of this deployment.

The current app has:

- one static route (`/`) plus the generated 404 response;
- no API routes, route handlers, middleware, server actions, authentication, cookies, request headers, databases, or runtime environment reads;
- no dynamic route parameters or request-time rendering;
- browser-only Three.js/React Three Fiber code loaded after hydration;
- procedural world geometry and local files under `public/`, with no model, texture, font, or API downloads at runtime;
- a readable HTML fallback when WebGL is unavailable.

`next.config.ts` sets `output: 'export'` and disables the Next image optimizer. The latter is required because the optimizer endpoint (`/_next/image`) does not exist on a file-only host.

## Cloudflare build settings

Use a **Pages** project with the framework preset set to **None**. This is a Vinext static export, so do not choose the standard Next.js preset and do not deploy `dist/server`.

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Build command | `npm run build:pages` |
| Build output directory | `dist/client` |
| Root directory | Leave blank when this folder is the Git repository root |
| Node version | `22.13.0` or newer |

The production environment needs two non-secret build variables:

| Variable | Production value | Preview value |
| --- | --- | --- |
| `VITE_SITE_URL` | `https://<your-project>.pages.dev` initially; later the canonical custom-domain origin | Leave unset |
| `VITE_SITE_INDEX` | `true` | Leave unset or set to `false` |

Set those variables in the **Production** environment only. `VITE_SITE_URL` must be an HTTPS origin with no path or trailing slash. Preview builds intentionally stay `noindex` and omit canonical/social-image URLs.

`npm run build:pages` performs the static build and then checks that:

- the HTML and RSC outputs are marked static;
- no `/_next/image` runtime requests remain;
- every root-relative asset referenced by the HTML exists;
- the loader portrait, brand images, WebGL fallbacks, favicon, and Open Graph image were copied;
- production canonical, Open Graph, Twitter, and robots metadata match the configured origin;
- the export remains inside Cloudflare Pages' file-count and individual-file-size limits;
- a Pages `_headers` file supplies security headers and immutable caching for hashed bundles.

## First deployment steps

1. Push this feature branch to GitHub, review it, and merge it into `main` when ready.
2. In Cloudflare, open **Workers & Pages**, choose **Create application**, then **Pages**, then **Connect to Git**.
3. Authorize the GitHub repository and select it.
4. Set the production branch to `main`.
5. Set the framework preset to **None**, the build command to `npm run build:pages`, and the output directory to `dist/client`.
6. Add the two production variables above. The Pages project name determines the initial stable `https://<project>.pages.dev` origin used for `VITE_SITE_URL`.
7. Save and deploy. Cloudflare will issue the HTTPS `pages.dev` URL and will build every later push to `main` automatically. Pull requests and non-production branches can receive preview deployments.
8. Keep the production project outside Cloudflare Access so the public URL has no authentication wall. Preview protection may be configured separately if desired.

No runtime variables or secrets are required. Do not add a Pages Function, `_worker.js`, or a catch-all redirect; the site already exports real HTML and a real 404 page.

This stays within the Pages Free plan: the verified export contains 26 files, its largest asset is about 1.5 MB, and it invokes no Functions. Cloudflare currently allows 500 builds per month, 20,000 files per Free-plan site, 25 MiB per asset, and 100 custom domains per project; static asset requests are free and unlimited.

## Verification after Cloudflare creates the URL

1. Open the `pages.dev` URL in a private browser window and confirm it does not request authentication.
2. In browser developer tools, confirm the document, `/_next/static/*`, `/avatar/*`, `/brand/*`, and `/fallback/*` requests return 200. There should be no request to `/_next/image`.
3. Disable WebGL or select the site's text-only mode and confirm the fallback image and readable portfolio remain usable.
4. View the production HTML source and confirm `canonical`, `og:url`, `og:image`, and `twitter:image` use the public HTTPS origin.
5. Test the URL with LinkedIn Post Inspector. The preview image is the exported 1200 × 630 `/og.jpg` asset.

For a later custom domain, add it under **Pages → Custom domains**, wait for Cloudflare to provision HTTPS, change `VITE_SITE_URL` to the new origin, and trigger one production rebuild. Do not set a `basePath` or asset prefix; Pages and the custom domain both serve this portfolio from the origin root.

## Official references

- [Next.js static exports on Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/)
- [Git integration and build settings](https://developers.cloudflare.com/pages/get-started/git-integration/)
- [Pages build configuration and injected variables](https://developers.cloudflare.com/pages/configuration/build-configuration/)
- [Free-plan limits](https://developers.cloudflare.com/pages/platform/limits/)
- [Static asset pricing](https://developers.cloudflare.com/pages/functions/pricing/)
- [Custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)
