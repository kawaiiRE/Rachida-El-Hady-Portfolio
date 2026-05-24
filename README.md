# Rachida El Hady Portfolio

Nuxt 4 portfolio for Rachida El Hady, focused on frontend engineering, mobile app work, selected projects, and contact conversion.

## Tech Stack

- Nuxt 4
- Vue 3 Composition API
- TypeScript
- SCSS
- EmailJS for the contact form
- Vanta/Three.js for the hero background

## Setup

Install dependencies:

```bash
npm install
```

The repository includes a Yarn lockfile, so Yarn can also be used when it is available:

```bash
yarn install
```

Create a local `.env` file from `.env.example` and fill in the deployment URL plus EmailJS values:

```env
NUXT_PUBLIC_SITE_URL=https://your-domain.com
NUXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key_here
NUXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id_here
NUXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id_here
```

## Development

Start the local dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Deployment Notes

For Cloudflare, set the same `NUXT_PUBLIC_*` variables in the Cloudflare environment before triggering a deployment. Client-visible Nuxt public variables are read during build for static output, so redeploy after changing them.

If the live domain changes, update:

- `NUXT_PUBLIC_SITE_URL`
- `public/sitemap.xml`
- the `Sitemap:` entry in `public/robots.txt`

## Content To Maintain

- Project data lives in `constants/projects.ts`.
- Contact form delivery is wired through EmailJS.
- To show the Download CV button, add the CV file under `public/` and set `APP_LINKS.CV_DOWNLOAD` in `constants/routes.ts`.
- Global SEO metadata is configured in `nuxt.config.ts`.
