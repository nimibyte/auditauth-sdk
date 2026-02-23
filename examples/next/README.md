# Next.js example (`example-next`)

This example shows a complete Next.js App Router integration using
`@auditauth/next`, including route handlers, middleware protection, session
access, and authenticated server-side requests.

## Requirements

You need Node.js 18+ and npm 9+.

## Run in 60 seconds

Start from the SDK root:

```bash
npm install
cp examples/next/.env.example examples/next/.env.local
npm run dev:example-next
```

Open `http://localhost:5173`.

If you run from `examples/next` directly:

```bash
npm install
npm run dev
```

## Configure credentials

This example reads credentials from `examples/next/.env.local`.

```bash
AUDITAUTH_API_KEY=your_api_key
AUDITAUTH_APP_ID=your_app_id
```

If either variable is missing, startup fails with a clear error from
`src/providers/auth.ts`.

## Production and local infrastructure modes

The default dev command targets production infrastructure. Use local mode only
if you are developing SDK internals with local AuditAuth services running.

- Production: `npm run dev:example-next`
- Local infrastructure: `npm run dev:example-next:local`

## What this example covers

You can use this example as a blueprint for a complete App Router integration.

- SDK instance setup: `src/providers/auth.ts`
- Auth handlers: `src/app/api/auditauth/[...auditauth]/route.ts`
- Route protection: `src/proxy.ts`
- Session reads in server components: `src/app/private/page.tsx`
- Protected API route wrapper: `src/app/api/test/protected/route.ts`
- Authenticated server call flow: `src/app/private/actions.ts`

## Expected behavior

Use this flow to verify your setup:

1. Open `/` and confirm the public page renders.
2. Open `/private` and confirm middleware redirects unauthenticated users.
3. Complete login and confirm you return to `/private`.
4. Click `Normal fetch` and `Auth fetch` in the API tester.
5. Confirm both calls return JSON from `/api/test/protected`.
6. Click `Logout` and confirm `/private` redirects again.

## Troubleshooting

If the example does not work as expected, check these common issues first.

- `Missing AUDITAUTH_API_KEY` or `Missing AUDITAUTH_APP_ID`:
  update `examples/next/.env.local`.
- Redirect mismatch after login:
  ensure your AuditAuth app allows `http://localhost:5173/api/auditauth/callback`.
- Session loop on `/private`:
  confirm browser cookies are enabled for localhost.
- Calls hitting local infrastructure unexpectedly:
  run `npm run dev:example-next` instead of `npm run dev:example-next:local`.
