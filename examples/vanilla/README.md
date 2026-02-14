# Vanilla example (`example-vanilla`)

This example shows how to integrate `@auditauth/web` in a framework-agnostic
browser app using plain JavaScript and Vite.

## Run the example

From the repository root, run the vanilla workspace.

```bash
npm install
npm run dev:example-vanilla
```

The app starts on `http://localhost:5173`.

## What this example demonstrates

This example keeps everything explicit so you can see the raw SDK lifecycle.

- SDK instance and local storage adapter in `src/auth.js`
- Redirect handling and route rendering in `src/router.js`
- Public page in `src/pages/public.js`
- Private page in `src/pages/private.js`
- Session actions with `login()`, `logout()`, and `goToPortal()`
- Authenticated requests and refresh behavior with `auditauth.fetch()`

## Main integration flow

The app runs through the same sequence used in larger frameworks.

1. Create `AuditAuthWeb` with config and storage adapter.
2. Call `handleRedirect()` on startup.
3. Enable `initNavigationTracking()`.
4. Gate private routes with `isAuthenticated()`.
5. Start login with `login()` when no session exists.
6. Read the current user from `getSessionUser()`.

## Important note

This example currently contains hardcoded sample credentials for local
development only. Replace them with environment variables before using the
pattern in a real project.
