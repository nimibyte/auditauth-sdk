<p align="center">
  <img src="./logo.png" alt="AuditAuth Logo" width="120" />
</p>

<h1 align="center">AuditAuth SDK</h1>

<p align="center">
  Identity and session infrastructure for modern applications.
</p>

## What this SDK gives you

AuditAuth SDK helps you implement authentication flows with a consistent API
across browser and server runtimes. You get login, callback handling, token
refresh, session state, logout, and request and navigation metrics.

The SDK is modular. You can pick only what you need:

- `@auditauth/web` for framework-agnostic browser apps
- `@auditauth/react` for React apps
- `@auditauth/next` for Next.js App Router apps
- `@auditauth/node` for token verification in Node runtimes

## Monorepo structure

This repository is an npm workspace monorepo with SDK packages and runnable
examples.

```text
packages/
  core   Shared protocol logic and shared types
  web    Browser SDK
  react  React provider and auth guard
  node   JWT verification helpers
  next   Next.js integration

examples/
  vanilla  Web SDK example
  react    React SDK example
  next     Next.js SDK example
```

## Install

Install the package for your runtime.

```bash
npm install @auditauth/web
# or
npm install @auditauth/react
# or
npm install @auditauth/next
```

## Shared config

All integrations use the same base config shape, so it is easy to move between
frameworks.

```ts
type AuditAuthConfig = {
  apiKey: string
  appId: string
  baseUrl: string
  redirectUrl: string
}
```

- `apiKey`: AuditAuth API key for your application
- `appId`: AuditAuth application identifier
- `baseUrl`: your app origin, for example `http://localhost:5173`
- `redirectUrl`: post-login page in your app

## Quick start by framework

Use one of these integration patterns as your starting point.

### Browser apps (`@auditauth/web`)

The Web SDK is the lowest-level browser integration. You create an instance,
wire a storage adapter, handle redirects, and call helper methods.

```ts
import { AuditAuthWeb } from '@auditauth/web'

const auditauth = new AuditAuthWeb(
  {
    apiKey: process.env.AUDITAUTH_API_KEY!,
    appId: process.env.AUDITAUTH_APP_ID!,
    baseUrl: 'http://localhost:5173',
    redirectUrl: 'http://localhost:5173/private',
  },
  {
    get: (name) => localStorage.getItem(name),
    set: (name, value) => localStorage.setItem(name, value),
    remove: (name) => localStorage.removeItem(name),
  }
)

await auditauth.handleRedirect()
```

### React apps (`@auditauth/react`)

The React package wraps `@auditauth/web` in a provider and hooks API.

```tsx
import { AuditAuthProvider } from '@auditauth/react'

<AuditAuthProvider
  config={{
    apiKey: process.env.VITE_AUDITAUTH_API_KEY!,
    appId: process.env.VITE_AUDITAUTH_APP_ID!,
    baseUrl: 'http://localhost:5173',
    redirectUrl: 'http://localhost:5173/private',
  }}
>
  <App />
</AuditAuthProvider>
```

Use `useAuditAuth()` in child components to access `user`, `login`, `logout`,
`fetch`, and `goToPortal`.

### Next.js apps (`@auditauth/next`)

The Next.js package provides route handlers, middleware integration, server
helpers, and protected request wrappers.

```ts
import { createAuditAuthNext } from '@auditauth/next'

export const auditauth = createAuditAuthNext({
  apiKey: process.env.AUDITAUTH_API_KEY!,
  appId: process.env.AUDITAUTH_APP_ID!,
  baseUrl: 'http://localhost:3000',
  redirectUrl: 'http://localhost:3000/private',
})
```

Then wire the API handlers:

```ts
// app/api/auditauth/[...auditauth]/route.ts
export const { GET, POST } = auditauth.handlers
```

## Core runtime behavior

Every integration is built around the same lifecycle.

1. Redirect the user to AuditAuth login.
2. Handle callback code and exchange it for tokens.
3. Store session and tokens in runtime-appropriate storage.
4. Automatically refresh tokens when API calls return `401`.
5. Revoke and clear session data on logout.
6. Emit request and navigation metrics.

## API highlights

These are the most common methods you will use.

- `login()`: starts the login redirect flow
- `logout()`: revokes and clears session state
- `goToPortal()`: redirects to the AuditAuth portal
- `fetch(url, init)`: performs authenticated requests with auto-refresh
- `getSession()` or `getSessionUser()`: returns current user data
- `withAuthRequest(handler)`: protects server routes (Next.js)

## Run the examples

The repository includes runnable examples that mirror production integration
patterns.

```bash
npm install

# browser app example
npm run dev:example-vanilla

# react example
npm run dev:example-react

# next.js app example
npm run dev:example-next
```

Read the example-specific docs for setup details:

- `examples/vanilla/README.md`
- `examples/react/README.md`
- `examples/next/README.md`

## Package docs

For package-level API details, read:

- `packages/web/README.md`
- `packages/next/README.md`

## Development

If you are contributing to this repository, use workspace scripts from the root
package.

```bash
npm install
npm run build
```

You can also run individual package watchers:

```bash
npm run dev:core
npm run dev:web
npm run dev:react
npm run dev:node
npm run dev:next
```

## Status

This SDK is under active development toward `1.0.0`. Minor API and behavior
changes can still happen while integration patterns stabilize.

## License

MIT
