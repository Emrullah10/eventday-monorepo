# everyday-web-app

React 19 + Vite (SWC), plain JSX (no TypeScript). Full architecture and
conventions are documented in `../docs/MONOREPO-ARCHITECTURE-TEMPLATE.md`
section 10 — this file is a short pointer, not a duplicate.

## Commands
- `npm run dev -w everyday-web-app` — dev server on :5173, proxies `/api` to the gateway on :5000
- `npm run build -w everyday-web-app`

## Conventions (see template §10 for rationale)
- Path aliases: `@api @components @container @features @hooks @layouts @pages @router @shared @store @styles`
- State: Zustand for client/UI state (`src/store`), React Query for server state (`src/features/*/hooks`)
- Auth: httpOnly cookie set by the gateway; `AuthBootstrap` does hydration-then-verify against `/api/gateway/me`
- i18n: `useTranslation()` + `t('key')`, EN+TR in `src/shared/translation/keys`
- One feature = one folder under `src/features/<domain>/{components,hooks,forms,store,utils}`
