# React example (`example-react`)

Vite + React Router integration example for `@auditauth/react`.

## Requirements

- Run commands from `sdk/`
- Node.js 18+
- npm 9+

## Run the example

```bash
npm install
npm run dev:example-react
```

App URL: `http://localhost:5173`

## What this example covers

- Provider setup with `AuditAuthProvider` in `src/App.tsx`
- Route change tracking in `NavigationTracker` (`src/App.tsx`)
- Public route rendering in `src/pages/public.tsx`
- Private route protection with `RequireAuth` in `src/pages/private.tsx`
- Session actions (`logout()`, `goToPortal()`) in `src/pages/private.tsx`
- Authenticated HTTP calls with `useAuditAuth().fetch()`

## Integration flow

1. Wrap the app with `AuditAuthProvider` and SDK config.
2. Mount router and call `trackNavigationPath()` on route changes.
3. Gate private content with `RequireAuth`.
4. Read session user via `useAuditAuth().user`.
5. Use `useAuditAuth().fetch()` for authenticated requests.

## Local testing notes

- The private page includes an API test button that calls
  `https://jsonplaceholder.typicode.com/posts/1` via SDK `fetch()`.

## Credentials note

This example uses hardcoded sample credentials in `src/App.tsx` for local
testing. Replace them with environment-driven values before production use.
