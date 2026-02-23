# Vanilla example (`example-vanilla`)

This example shows a framework-agnostic browser integration using
`@auditauth/web` with plain JavaScript and Vite. It demonstrates redirect
handling, route protection, navigation tracking, and authenticated requests.

## Requirements

You need Node.js 18+ and npm 9+.

## Run in 60 seconds

Start from the SDK root:

```bash
npm install
cp examples/vanilla/.env.example examples/vanilla/.env.local
npm run dev:example-vanilla
```

Open `http://localhost:5173`.

If you run from `examples/vanilla` directly:

```bash
npm install
npm run dev
```

## Configure credentials

This example reads credentials from `examples/vanilla/.env.local`.

```bash
VITE_AUDITAUTH_API_KEY=your_api_key
VITE_AUDITAUTH_APP_ID=your_app_id
```

If either variable is missing, the example uses placeholder values and auth
requests fail until you set real credentials.

## Production and local infrastructure modes

The default dev command targets production infrastructure. Use local mode only
if you are developing SDK internals with local AuditAuth services running.

- Production: `npm run dev:example-vanilla`
- Local infrastructure: `npm run dev:example-vanilla:local`

## What this example covers

You can use this example as a blueprint for non-framework browser apps.

- SDK instance and storage adapter setup: `src/auth.js`
- Redirect callback handling: `src/router.js`
- Navigation tracking setup: `src/router.js`
- Private route protection and login redirects: `src/router.js`
- Session-based private view rendering: `src/pages/private.js`
- Authenticated calls with SDK `fetch()`: `src/pages/private.js`

## Expected behavior

Use this flow to verify your setup:

1. Open `/` and confirm the public page renders.
2. Open `/private` and confirm unauthenticated users are sent to login.
3. Complete login and confirm you return to `/private`.
4. Run the API test actions and confirm successful responses.
5. Click logout and confirm private access is blocked again.

## Troubleshooting

If the example does not work as expected, check these common issues first.

- Login fails or redirects to invalid config:
  update `examples/vanilla/.env.local` with valid credentials.
- Redirect mismatch after login:
  ensure your AuditAuth app allows `http://localhost:5173/private`.
- Session state not updating:
  hard refresh the browser after changing credentials.
- Calls hitting local infrastructure unexpectedly:
  run `npm run dev:example-vanilla` instead of
  `npm run dev:example-vanilla:local`.
