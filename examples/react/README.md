# React example (`example-react`)

This example shows how to integrate `@auditauth/react` in a Vite and
React Router app. It demonstrates provider setup, route-level auth guard,
session actions, and authenticated API requests.

## Run the example

From the repository root, run the React workspace.

```bash
npm install
npm run dev:example-react
```

The app starts on `http://localhost:5173`.

## What this example demonstrates

This example maps each integration step to a simple file structure.

- Provider setup in `src/App.tsx`
- Router-level navigation metrics in `NavigationTracker`
- Public page in `src/pages/public.tsx`
- Protected page with `RequireAuth` in `src/pages/private.tsx`
- Session actions with `logout()` and `goToPortal()`
- Authenticated API calls using `useAuditAuth().fetch()`

## Main integration flow

The React example uses the same SDK lifecycle you would use in production.

1. Wrap your app with `AuditAuthProvider` and pass the SDK config.
2. Use `RequireAuth` for private routes.
3. Read user info from `useAuditAuth().user`.
4. Use `useAuditAuth().fetch()` for authenticated HTTP calls.
5. Track route changes with `trackNavigationPath()`.

## Important note

This example currently contains hardcoded sample credentials for local
development only. Replace them with environment variables before using the
pattern in a real project.
