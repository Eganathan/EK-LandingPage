# Eknath — static personal site

The new Landing uses HTML, CSS and browser JavaScript. Node renders the shared profile and recent-content snapshot at build time; production needs no Node or PHP server and no installed packages.

```sh
npm run build
npm run preview
```

Open http://127.0.0.1:1318/. Deploy only the contents of `dist/`.

## Editing

- `src/index.html`: page composition and metadata template.
- `css/home.css`: Landing layout and responsive typography.
- `js/home.js`: theme preference and optional recent-content refresh.
- `data/landing.json`: Landing-specific introduction and editorial copy.
- `data/profile.json`: generated from Command Center `shared/brand/profile.json`.
- `data/recent.json`: fallback snapshot from Command Center `npm run content:sync`.
- `css/ek-tokens.css`: generated from Command Center `shared/site-theme/ek-tokens.css`.

Change shared sources in Command Center, run `npm run theme:sync`, then rebuild this site. Manrope headings and DM Sans body type use Google Fonts with system fallbacks. Body text is at least 16px; metadata is secondary.

The generated HTML contains profile copy, socials, talk notes and recent items without JavaScript. Browser fetch failures leave that snapshot intact. Assets use relative URLs so the output works at both a GitHub project path and a custom domain.

## Publishing

This public repository owns both static source and deployment. The workflow builds on pushes to main and publishes only dist/. No PHP files, credentials or legacy source history are part of this repository.

GitHub Pages: https://eganathan.github.io/landingPage/

Canonical, social image and structured-data URLs are rendered from SITE_URL; configure-pages supplies the current configured Pages URL. After setting the custom domain, rerun the deployment so metadata uses it. Domain/DNS remapping is managed by the owner.

Legacy PHP source/history remains in the separate private eknath_dev repository. Do not copy it into this public repository.

## Contact

Contact and feedback now use `mailto:mail@eknath.dev`, opening the visitor's email client. No message is sent by the site. The old anonymous PHP mail form is not present in the static version. A future anonymous form requires an explicitly selected external service or backend; no service has been silently added.

## Verification

Use build, JavaScript syntax, local asset, and browser checks. Do not add tests. Deployment is handled by the Pages workflow. Domain remapping is managed separately by the owner.

## Interactions

The Builder / Volunteer / Speaker explorer supports click, Left/Right, Home and End navigation. All panels are visible when JavaScript is unavailable. Recent projects and references use native expandable summaries; article links remain a horizontal scroll strip with Previous/Next controls when needed. Copy email reports success or a usable fallback, and light/dark preference persists locally. No messages are sent by these controls.
