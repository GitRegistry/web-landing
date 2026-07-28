# web-landing

Monorepo for the Kopi, Pilotary, and Paluv landing pages.
It includes the Fest Map site and the UL Diplom print generator.

## Structure

- `kopi/`
- `pilotary/`
- `paluv/`
- `fest-map/`
- `ul-diplom/`

## Run

1. Set `MESSAGE_API_KEY` in `.env`.
2. Ensure the external Docker network `public` exists, for example with `docker network create public`.
3. Start everything with `docker compose up --build`.

## Paluv Landing Page

The Paluv homepage and legal pages are generated from shared German and English
content. Edit `paluv/scripts/content.js`, `paluv/scripts/templates.js`, or the
shared styles and scripts, then regenerate the deployable HTML:

```sh
node paluv/scripts/generate.js
```

The root route chooses German or English from the saved language preference and
the browser language. The localized `/de/` and `/en/` routes remain stable,
indexable URLs.

## Fest Map Manager

The Fest Map now uses JSON data files in `fest-map/data/`:

- `entities.json`
- `overlays.json`

To run the local-only Fest Map manager:

1. Install dependencies with `npm install`.
2. Start the manager with `npm run fest-map:manager`.
3. Open `http://localhost:4173/manager/`.

The manager writes directly into the repo and uploads images into `fest-map/assets/uploads/`.
