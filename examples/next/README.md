# Next.js example (`example-next`)

Next.js App Router integration example for `@auditauth/next`.

## Requirements

- Run commands from `sdk/`
- Node.js 18+
- npm 9+

## Run the example

```bash
npm install
npm run dev:example-next
```

App URL: `http://localhost:5173`

## What this example covers

- SDK instance setup in `src/providers/auth.ts`
- Auth callback/login handlers in `src/app/api/auditauth/[...auditauth]/route.ts`
- Route protection through SDK middleware in `src/proxy.ts`
- Server-side session read with `auditauth.getSession()` in
  `src/app/private/page.tsx`
- Protected API route wrapper with `auditauth.withAuthRequest()` in
  `src/app/api/test/protected/route.ts`
- Authenticated server request with `auditauth.fetch()` in
  `src/app/private/actions.ts`

## Integration flow

1. Create a single `auditauth` instance using `createAuditAuthNext()`.
2. Export `GET`/`POST` from `auditauth.handlers` for auth routes.
3. Protect private routes through `auditauth.middleware()`.
4. Read user session in server components with `auditauth.getSession()`.
5. Use `auditauth.fetch()` for authenticated server-side calls.
6. Wrap protected API handlers with `auditauth.withAuthRequest()`.

## Local testing notes

- `Normal fetch` in the private page calls `/api/test/protected` with native
  `fetch`.
- `Auth fetch` calls the same endpoint through server action logic that uses
  `auditauth.fetch()`.

## Credentials note

This example uses hardcoded sample credentials in `src/providers/auth.ts` for
local testing. Replace them with environment-driven values before production
use.
