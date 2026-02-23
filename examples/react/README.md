# React example (`example-react`)

This example shows a React Router integration with `@auditauth/react` using
Vite. It covers provider setup, navigation tracking, protected routes, and
authenticated API calls.

## Requirements

You need Node.js 18+ and npm 9+.

## Run in 60 seconds

Start from the SDK root:

```bash
npm install
cp examples/react/.env.example examples/react/.env.local
npm run dev:example-react
```

Open `http://localhost:5173`.

If you run from `examples/react` directly:

```bash
npm install
npm run dev
```

## Configure credentials

This example reads credentials from `examples/react/.env.local`.

```bash
VITE_AUDITAUTH_API_KEY=your_api_key
VITE_AUDITAUTH_APP_ID=your_app_id
```

If either variable is missing, startup fails with a clear error from
`src/App.tsx`.

## Production and local infrastructure modes

The default dev command targets production infrastructure. Use local mode only
if you are developing SDK internals with local AuditAuth services running.

- Production: `npm run dev:example-react`
- Local infrastructure: `npm run dev:example-react:local`

## What this example covers

You can use this example as a blueprint for a client-only React integration.

- Provider setup: `src/App.tsx`
- Navigation tracking: `NavigationTracker` in `src/App.tsx`
- Public and private route split: `src/pages/public.tsx`, `src/pages/private.tsx`
- Route guard behavior: `RequireAuth` in `src/pages/private.tsx`
- Session actions (`logout`, `goToPortal`): `src/pages/private.tsx`
- Authenticated requests through SDK `fetch()`: `src/pages/private.tsx`

## Expected behavior

Use this flow to verify your setup:

1. Open `/` and confirm the public page renders.
2. Open `/private` and confirm unauthenticated users are sent to login.
3. Complete login and confirm you return to `/private`.
4. Run the API test button and confirm a successful JSON response.
5. Click logout and confirm private access is blocked again.

## Troubleshooting

If the example does not work as expected, check these common issues first.

- `Missing VITE_AUDITAUTH_API_KEY` or `Missing VITE_AUDITAUTH_APP_ID`:
  update `examples/react/.env.local`.
- Redirect mismatch after login:
  ensure your AuditAuth app allows `http://localhost:5173/private`.
- Cookies not persisted:
  check browser privacy settings for localhost.
- Calls hitting local infrastructure unexpectedly:
  run `npm run dev:example-react` instead of `npm run dev:example-react:local`.
