# Rachida El Hady Portfolio

My personal portfolio showcasing web, mobile, backend, and creative development projects.

## Built With

- Nuxt 4
- Vue 3
- TypeScript
- SCSS
- GSAP
- Three.js

## Local Development

Copy `.env.example` to `.env`, then run:

```bash
yarn install --frozen-lockfile
yarn dev
```

Create a production build with:

```bash
yarn build
```

Run the checks with:

```bash
yarn typecheck
yarn test
yarn format:check
```

## Contact form

The contact form posts to the `api.rachida.dev` backend; nothing is sent from the browser
to a third-party mail service. The endpoint is a two-step flow: the form fetches a signed,
single-use challenge token when it is shown, then sends it back with the message, which is
what lets the server enforce a minimum time-to-submit. The hidden `website` field is a
honeypot and is always submitted empty.

`lib/contact-api.ts` owns the requests and maps each documented refusal — rate limited,
submitted too fast, expired challenge, invalid details, delivery failure — to a specific
message. The backend does not store submissions. A response lost in transit is
reported as unconfirmed delivery because the SMTP handoff may already have happened.

Set server-only `NUXT_CONTACT_API_ORIGIN` for local work and provide a matching
`NUXT_CONTACT_GATEWAY_TOKEN` / backend `CONTACT_GATEWAY_TOKEN`. Browser requests
remain same-origin. See [the reviewed release order](docs/contact-release.md).

## Public discovery

Pages render their content on the server; optional WebGL effects do not gate reading.
`public/llms.txt` provides a concise public profile and links for automated readers.
Keep it aligned with the experience, project, and contact content when those change.
Crawler access is covered by `public/robots.txt`. `server/routes/sitemap.xml.ts`
generates the sitemap from the published `PROJECTS` list, including project images.
The home, collection, experience, typing, and published project pages are prerendered
at build time; a failed page render fails the build. The home page also provides a
visible directory of ordinary project links independently of the carousel.
Prerendered pages use flat `.html` files so Cloudflare serves the canonical
extensionless URLs without redirecting them to trailing-slash variants.
Disabled projects stay out of the sitemap. Profile names and public social links
are defined in `constants/site.ts`.

To diagnose actual Google indexing decisions, inspect the URLs in the verified
`rachida.dev` Search Console property and submit `https://rachida.dev/sitemap.xml`.
Request indexing for the home page and published project URLs after meaningful
updates. Sitemap inclusion and valid metadata do not guarantee indexing or ranking.
