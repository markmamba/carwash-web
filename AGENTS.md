# Scorpio Carwash Web — Agent Instructions (OpenAI Codex)

Read and follow all instructions in `.ai/instructions.md`. That file is the single source of truth for architecture, conventions, and coding patterns.

## Quick Reference

- React 19, JavaScript (`.js`/`.jsx`) — no TypeScript
- React Router v7 framework mode, SSR, Vite
- react-bootstrap + Bootstrap 5 SCSS, react-hook-form + zod, ky
- Single segment: Admin portal at `/admin`
- API client: `adminApiClient` → `carwash-api` at `admins/`
- Pattern: Route page → API client → domain components
- URL-driven list filters (`useSearchParams`)
- All admin pages: `robots: noindex, nofollow`

## Commands

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint
```
