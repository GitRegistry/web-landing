# web-landing

Monorepo for the Kopi, Pilotary, and Paluv landing pages.

## Structure

- `kopi/`
- `pilotary/`
- `paluv/`

## Run

1. Set `MESSAGE_API_KEY` in `.env`.
2. Ensure the external Docker network `public` exists, for example with `docker network create public`.
3. Start everything with `docker compose up --build`.
