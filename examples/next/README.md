# Next.js example (`example-next`)

This example shows a complete App Router integration with `@auditauth/next`.
It includes SDK route handlers, middleware protection, server-side session
access, authenticated server requests, and protected API route handlers.

## Run the example

From the repository root, run the Next.js example workspace.

```bash
npm install
npm run dev:example-next
```

The app starts on `http://localhost:5173`.

## What this example demonstrates

This example maps each integration concern to one file so you can copy patterns
into your own app.

- SDK provider setup in `src/providers/auth.ts`
- Auth API handlers in `src/app/api/auditauth/[...auditauth]/route.ts`
- Middleware protection in `src/proxy.ts`
- Session read in `src/app/private/page.tsx`
- Protected API route with token verification in
  `src/app/api/test/protected/route.ts`
- Server-side authenticated request in `src/app/private/actions.ts`

## Main integration flow

The example follows the standard flow used by `@auditauth/next`.

1. Create one `auditauth` instance with `createAuditAuthNext()`.
2. Export `GET` and `POST` handlers from `auditauth.handlers`.
3. Route private pages through `auditauth.middleware()`.
4. Read user session with `auditauth.getSession()` in server components.
5. Use `auditauth.fetch()` for server-to-server protected API calls.
6. Wrap sensitive route handlers with `auditauth.withAuthRequest()`.

## Important note

This example currently contains hardcoded sample credentials for local
development only. Replace them with environment variables before using the
pattern in a real project.
