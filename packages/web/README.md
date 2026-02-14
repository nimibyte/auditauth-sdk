# @auditauth/web

`@auditauth/web` is the framework-agnostic AuditAuth SDK for browser
applications. It handles login redirects, callback processing, session state,
token refresh, and request and navigation metrics.

## Install

Install the package in your app.

```bash
npm install @auditauth/web
```

## Create an SDK instance

Create one `AuditAuthWeb` instance with your AuditAuth config and a storage
adapter. In browser apps, local storage is the common default.

```ts
import { AuditAuthWeb } from '@auditauth/web'

export const auditauth = new AuditAuthWeb(
  {
    apiKey: process.env.VITE_AUDITAUTH_API_KEY!,
    appId: process.env.VITE_AUDITAUTH_APP_ID!,
    baseUrl: 'http://localhost:5173',
    redirectUrl: 'http://localhost:5173/private',
  },
  {
    get: (name) => localStorage.getItem(name),
    set: (name, value) => localStorage.setItem(name, value),
    remove: (name) => localStorage.removeItem(name),
  }
)
```

## Initialize on app startup

Handle callback redirects before rendering protected pages, then enable
navigation tracking.

```ts
await auditauth.handleRedirect()
auditauth.initNavigationTracking()
```

## Protect private pages

Before rendering private views, check if the user has a session. If not,
redirect to login.

```ts
if (!auditauth.isAuthenticated()) {
  await auditauth.login()
}
```

You can access the current user at any time with `auditauth.getSessionUser()`.

## Make authenticated API calls

Use `auditauth.fetch()` instead of `window.fetch()` for authenticated requests.
The SDK attaches the access token and automatically attempts refresh when a
request returns `401`.

```ts
const response = await auditauth.fetch('https://api.example.com/private')
```

## Use session actions

You can trigger user session actions from your UI.

- `auditauth.login()` starts the login flow
- `auditauth.logout()` revokes and clears the session
- `auditauth.goToPortal()` redirects to the AuditAuth portal

## API reference

These methods are available in `AuditAuthWeb`.

- `handleRedirect(): Promise<void | null>`
- `isAuthenticated(): boolean`
- `getSessionUser(): SessionUser | null`
- `login(): Promise<void>`
- `logout(): Promise<void>`
- `goToPortal(): Promise<void>`
- `fetch(input, init?): Promise<Response>`
- `trackNavigationPath(path: string): void`
- `initNavigationTracking(): void`

## Example

See the complete integration in `examples/vanilla/src`.
