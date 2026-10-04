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

## Public discovery

Pages render their content on the server; optional WebGL effects do not gate reading.
`public/llms.txt` provides a concise public profile and links for automated readers.
Keep it aligned with the experience, project, and contact content when those change.
Crawler access is covered by `public/robots.txt`. `server/routes/sitemap.xml.ts`
generates the sitemap from the published `PROJECTS` list, including project images.
The home, collection, experience, typing, and published project pages are prerendered
at build time; a failed page render fails the build. The home page also provides a
visible directory of ordinary project links independently of the carousel.
Disabled projects stay out of the sitemap. Profile names and public social links
are defined in `constants/site.ts`.

To diagnose actual Google indexing decisions, inspect the URLs in the verified
`rachida.dev` Search Console property and submit `https://rachida.dev/sitemap.xml`.
Request indexing for the home page and published project URLs after meaningful
updates. Sitemap inclusion and valid metadata do not guarantee indexing or ranking.
