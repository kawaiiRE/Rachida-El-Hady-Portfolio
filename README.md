# Rachida El Hady Portfolio

Nuxt 4 portfolio for Rachida El Hady, focused on frontend engineering, mobile app work, selected projects, and contact conversion.

## Tech Stack

- Nuxt 4
- Vue 3 Composition API
- TypeScript
- SCSS
- EmailJS for the contact form
- Vanta Birds for the hero and Three.js/GLSL for the section particle field

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

## Styling Conventions

- Each Vue page or component has one meaningful root class.
- Scoped child classes stay short and local, such as `.title`, `.content`, `.media`, and `.actions`.
- Do not repeat the parent name in child classes; avoid names such as `.hero__title` and `.project-detail__gallery`.
- Use SCSS nesting for relationships that only exist inside a component.
- Use concise state or variant classes such as `.is-active`, `.primary`, and `.wide`.
- Keep global classes limited to shared utilities such as `.app-container` and `.section-title`.

## Motion System

- The hero owns its original Vanta Birds canvas; the persistent GPU particle field begins after it.
- Section formations and their visual score live in `lib/particle-field/looks.ts`.
- `components/Home/SectionField` directs section changes, pointer interaction, and lifecycle cleanup.
- Do not layer another full-screen engine over either system; extend the field formations or score instead.

## Content To Maintain

- Project data lives in `constants/projects.ts`.
- Contact form delivery is wired through EmailJS.
- To show the Download CV button, add the CV file under `public/` and set `APP_LINKS.CV_DOWNLOAD` in `constants/routes.ts`.
- Global SEO metadata is configured in `nuxt.config.ts`.
