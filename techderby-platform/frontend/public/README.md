# Public assets

Files in this folder are served at the site root by Vite.

## Poster template

The `/create-poster` page composites an uploaded portrait on top of a fixed
poster template. Save the master EMTW 2026 poster artwork as:

```
techderby-platform/frontend/public/poster-template.png
```

Recommended dimensions: square, 1080×1080 or 2048×2048 PNG. For the cleanest
results, export a variant with the existing person silhouette erased to
transparency so the uploaded portrait sits in empty space.

If the file is missing the page shows a non-blocking warning and lets the user
upload a template manually for the current session.
