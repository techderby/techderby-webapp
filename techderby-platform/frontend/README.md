# Tech Derby Frontend

Public-facing React app for Tech Derby, built with React + Vite + TypeScript + Tailwind CSS.

## Pages

| Route | Page |
|-------|------|
| `/` | Home |
| `/about` | About |
| `/events` | Events (Tech Derby + community, upcoming/past) |
| `/events/:slug` | Event detail |
| `/programmes` | Programmes |
| `/programmes/tech-star-women` | TechStar Women |
| `/programmes/tech-derby-accelerator` | Pre-seed Accelerator |
| `/membership` | Membership interest |
| `/partners` | Partners |
| `/insights` | Insights articles |
| `/insights/:slug` | Insight detail |
| `/contact` | Contact |
| `/directory` | Member directory |
| `/get-involved` | Get involved |
| `/create-poster` | EMTW 2026 "I will be attending" poster generator |
| `/login` | Login |

All pages are lazy-loaded for route-level code splitting.

## Local setup

Run via Docker from the platform root (recommended):

```bash
cd techderby-platform
docker compose up --build
```

Or run standalone:

```bash
cd frontend
cp .env.example .env   # VITE_API_URL=http://localhost:1337
npm install
npm run dev
```

App runs on http://localhost:3000.

## Scripts

```bash
npm run dev      # start dev server
npm run build    # production build
npm run test     # run Vitest tests
npm run lint     # ESLint
```

## Environment variables

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Strapi base URL (e.g. `http://localhost:1337`) |
| `VITE_CALLMEBOT_API_KEY` | WhatsApp notification key (optional) |

In production, `VITE_API_URL` and `VITE_CALLMEBOT_API_KEY` are baked in at Docker build time via `--build-arg`.

## Poster generator (`/create-poster`)

Client-side tool that lets visitors generate a personalised EMTW 2026 "I will be attending" poster from a fixed template plus their portrait.

### How it works

- Loads the template from `public/poster-template.png` (square PNG; export the variant where the person silhouette is erased to transparency for the cleanest result).
- The user uploads a portrait. The page composites it onto the template via HTML `<canvas>` with a soft-edged elliptical mask and adjustable position / scale / feather.
- Auto-detects whether the template has a transparent person area and picks the correct layer order (`Behind template` for cutout templates, `In front of template` for flat templates).
- Optional **Remove background (AI)** toggle removes the portrait background entirely in the browser using [`@huggingface/transformers`](https://huggingface.co/docs/transformers.js) running the `Xenova/modnet` ONNX model. The model (~25 MB) is fetched from the Hugging Face CDN once and cached by the browser.
- Download produces `emtw-2026-i-will-be-attending.png` at the template's native resolution.

### Files

- `src/pages/CreatePosterPage.tsx` — page + canvas pipeline
- `src/lib/removeBackground.ts` — MODNet inference helper
- `public/poster-template.png` — master artwork (not committed; supply per environment)
- Route: `src/router/routes.tsx`
- Footer link: `src/components/Footer.tsx` → *Tools → Poster Generation*

### Privacy

No image data leaves the user's device. Upload, compositing, background removal and download all run in the browser. The only outbound request is the one-time model fetch from the Hugging Face CDN when AI background removal is enabled.

### Licences

| Component | Licence |
|-----------|---------|
| `@huggingface/transformers` | Apache-2.0 |
| `Xenova/modnet` model | MIT |

### Vite configuration

`@huggingface/transformers` ships ESM workers and the ONNX runtime, so it is excluded from Vite's dependency pre-bundling in `vite.config.ts`:

```ts
optimizeDeps: { exclude: ['@huggingface/transformers'] }
```

For full platform setup, see [`techderby-platform/README.md`](../README.md).
