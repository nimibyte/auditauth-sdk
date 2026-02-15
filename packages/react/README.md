# @auditauth/react

`@auditauth/react` is the AuditAuth SDK integration for React applications. It
provides a provider, a hook, and a route guard to handle redirect callbacks,
session state, login and logout actions, and authenticated HTTP calls.

## Install

Install the package in your React application.

```bash
npm install @auditauth/react
```

`@auditauth/react` has peer dependencies on `react` and `react-dom` version 18
or higher.

## Wrap your app with the provider

Create one top-level `AuditAuthProvider` and pass your AuditAuth config.

```tsx
import { AuditAuthProvider } from '@auditauth/react'

export function AppRoot() {
  return (
    <AuditAuthProvider
      config={{
        apiKey: import.meta.env.VITE_AUDITAUTH_API_KEY,
        appId: import.meta.env.VITE_AUDITAUTH_APP_ID,
        baseUrl: 'http://localhost:5173',
        redirectUrl: 'http://localhost:5173/private',
      }}
    >
      <App />
    </AuditAuthProvider>
  )
}
```

The provider runs `handleRedirect()` on startup and exposes the current user
and session actions through `useAuditAuth()`.

## Protect private UI with `RequireAuth`

Wrap private content with `RequireAuth` to trigger login when the user is not
authenticated.

```tsx
import { RequireAuth } from '@auditauth/react'

export function PrivatePage() {
  return (
    <RequireAuth>
      <h1>Private area</h1>
    </RequireAuth>
  )
}
```

`RequireAuth` renders children only after the SDK is ready and the user has a
valid session.

## Use auth state and actions in components

Use `useAuditAuth()` inside components that are children of
`AuditAuthProvider`.

```tsx
import { useAuditAuth } from '@auditauth/react'

export function AccountMenu() {
  const { user, ready, login, logout, goToPortal } = useAuditAuth()

  if (!ready) return null

  if (!user) {
    return <button onClick={() => login()}>Login</button>
  }

  return (
    <div>
      <span>{user.email}</span>
      <button onClick={() => goToPortal()}>Portal</button>
      <button onClick={() => logout()}>Logout</button>
    </div>
  )
}
```

## Make authenticated API calls

Use `fetch` from `useAuditAuth()` instead of `window.fetch()` for authenticated
requests. The SDK attaches the session token and handles refresh behavior when
needed.

```tsx
import { useAuditAuth } from '@auditauth/react'

export function ProfileButton() {
  const { fetch } = useAuditAuth()

  const loadProfile = async () => {
    const response = await fetch('https://api.example.com/private/profile')
    const data = await response.json()
    console.log(data)
  }

  return <button onClick={loadProfile}>Load profile</button>
}
```

## Track navigation metrics

If you use a client router such as React Router, call `trackNavigationPath()`
when the path changes.

```tsx
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuditAuth } from '@auditauth/react'

export function NavigationTracker() {
  const { pathname } = useLocation()
  const { trackNavigationPath } = useAuditAuth()

  useEffect(() => {
    trackNavigationPath(pathname)
  }, [pathname, trackNavigationPath])

  return null
}
```

## API reference

`useAuditAuth()` returns:

- `ready: boolean`
- `user: SessionUser | null`
- `fetch(input, init?): Promise<Response>`
- `login(): Promise<void>`
- `logout(): Promise<void>`
- `goToPortal(): Promise<void>`
- `isAuthenticated(): boolean`
- `trackNavigationPath(path: string): void`

Exports from `@auditauth/react`:

- `AuditAuthProvider`
- `useAuditAuth`
- `RequireAuth`

## Compatibility

This package requires:

- Node.js `>=18.18.0` for tooling and build environments
- React `>=18`
- React DOM `>=18`

## Resources

- Repository: https://github.com/nimibyte/auditauth-sdk
- Documentation: https://docs.auditauth.com

## Example

See `examples/react` for a complete Vite + React Router integration.

## License

MIT
