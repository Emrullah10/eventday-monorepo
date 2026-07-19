# Cerebrum — cross-session memory

## User Preferences
(none recorded yet)

## Key Learnings
- This repo was converted from a single Express monolith
  (`eventday_iam_service`) into a Tropiq-style monorepo: `core/*` (framework-free
  domain logic, `make*` factories, no classes), `services/*` (runnable shells:
  main.js → boot.js → container.js), `packages/modules/*` (shared libs),
  `everyday-web-gateway` (the only service that owns auth/JWT/cookies/CSRF —
  downstream services trust `x-user-id`/`x-user-role` headers it sets),
  `everyday-web-app` (React 19 + Vite, plain JSX).
- ESM everywhere (`"type": "module"`), npm workspaces, no DI framework —
  composition roots are hand-wired in each service's `src/container.js`.

## Do-Not-Repeat
- Don't let downstream services (event/booking/aggregator) re-verify JWTs —
  only the gateway does that; services trust its forwarded headers.
- Don't do the booking quota check as separate non-transactional queries —
  `core/service-booking` uses `SELECT ... FOR UPDATE` inside one transaction
  specifically to close a race condition that existed in the original
  monolith.

## Decision Log
- Chose multi-service + gateway (not single-service) and full template code
  style (ESM + factories) per explicit user request during the initial
  monorepo conversion.
