# anatomy.md

> Auto-maintained by OpenWolf. Last scanned: 2026-07-19T14:55:30.948Z
> Files: 14 tracked | Anatomy hits: 0 | Misses: 0

## ./

- `CLAUDE.md` — everyday — monorepo (~478 tok)
- `package.json` — Node.js package manifest (~145 tok)

## core/service-aggregator/test/

- `process-source-events.use-case.test.js` — Declares events (~582 tok)

## core/service-booking/test/

- `booking.repository.test.js` — Fake withTransaction that just runs fn against a mock `query`, mirroring @everyday/datasource's cont (~493 tok)
- `create-booking.use-case.test.js` — Declares bookingRepo (~330 tok)

## core/service-event/src/application/use-cases/

- `get-pending-events.use-case.js` — Exports makeGetPendingEvents (~60 tok)

## core/service-event/test/

- `create-event.use-case.test.js` — Declares mockEventData (~239 tok)
- `list-events.use-case.test.js` — Declares mockEvents (~171 tok)
- `require-admin.test.js` — Declares eventRepo (~282 tok)

## core/service-identity/

- `jest.config.js` (~29 tok)

## core/service-identity/test/

- `login-user.use-case.test.js` — Declares password (~528 tok)
- `register-user.use-case.test.js` — Declares userRepo (~423 tok)

## services/everyday-web-gateway/src/

- `boot.js` — API routes: GET (1 endpoints) (~388 tok)
- `route.js` — Injects the verified user as x-user-id / x-user-role headers before (~822 tok)
