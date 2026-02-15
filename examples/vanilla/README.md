# Vanilla example (`example-vanilla`)

Framework-agnostic integration example for `@auditauth/web` using plain
JavaScript and Vite.

## Requirements

- Run commands from `sdk/`
- Node.js 18+
- npm 9+

## Run the example

```bash
npm install
npm run dev:example-vanilla
```

App URL: `http://localhost:5173`

## What this example covers

- SDK instance creation and storage adapter in `src/auth.js`
- Redirect callback handling in `src/router.js`
- Navigation tracking with `initNavigationTracking()` in `src/router.js`
- Client-side route protection and login redirects in `src/router.js`
- Session-driven private UI in `src/pages/private.js`
- Authenticated requests with `auditauth.fetch()` in `src/pages/private.js`

## Integration flow

1. Create `AuditAuthWeb` with config and storage adapter.
2. Call `handleRedirect()` during bootstrap.
3. Enable `initNavigationTracking()`.
4. Protect private routes with `isAuthenticated()`.
5. Trigger `login()` when private route access has no session.
6. Read user data with `getSessionUser()`.

## Local testing notes

- `Test Public API` calls `https://jsonplaceholder.typicode.com/posts/1`.
- `Force 401 (Refresh Flow)` calls `http://localhost:4000/v1/auth/testing`.

## Credentials note

This example uses hardcoded sample credentials in `src/auth.js` for local
testing. Replace them with environment-driven values before production use.
