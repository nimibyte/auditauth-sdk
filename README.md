<p align="center">
  <img src="./logo.png" alt="AuditAuth Logo" width="120" />
</p>

<h1 align="center">AuditAuth SDK</h1>

<p align="center">
  Identity and session infrastructure for modern applications.
</p>

## Overview

AuditAuth SDK gives you a consistent authentication and session API across
browser and server runtimes. It covers login redirect flows, callback handling,
token refresh, session persistence, logout, and request/navigation telemetry.

Use the package that matches your runtime:

- `@auditauth/web` for framework-agnostic browser apps
- `@auditauth/react` for React apps
- `@auditauth/next` for Next.js App Router apps
- `@auditauth/node` for token verification in Node runtimes

## Repository layout

This repository is an npm workspace monorepo with SDK packages and runnable
examples.

```text
packages/
  core   Shared protocol logic and types
  web    Browser SDK
  react  React provider and auth guard
  node   JWT verification helpers
  next   Next.js integration

examples/
  vanilla  Web SDK example
  react    React SDK example
  next     Next.js SDK example
```

## Requirements

- Node.js 18+
- npm 9+

## Install

Install the package for your runtime:

```bash
npm install @auditauth/web
# or
npm install @auditauth/react
# or
npm install @auditauth/next
# or
npm install @auditauth/node
```

## TypeScript import compatibility

All published SDK packages provide dual module output (ESM + CJS) with
export maps and bundled type declarations. You can use standard TypeScript
imports in consumer projects without adding `.js` extensions:

```ts
import { verifyAccessToken } from '@auditauth/node'
```

This works across common TypeScript module resolution modes, including
`node`, `nodenext`, and `bundler`.

## Shared config

All integrations use the same base config shape:

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
- `baseUrl`: app origin (for example `http://localhost:5173`)
- `redirectUrl`: post-login route in your app

## Quick start by framework

### Browser apps (`@auditauth/web`)

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
`fetch`, `goToPortal`, and navigation tracking helpers.

### Next.js apps (`@auditauth/next`)

```ts
import { createAuditAuthNext } from '@auditauth/next'

export const auditauth = createAuditAuthNext({
  apiKey: process.env.AUDITAUTH_API_KEY!,
  appId: process.env.AUDITAUTH_APP_ID!,
  baseUrl: 'http://localhost:3000',
  redirectUrl: 'http://localhost:3000/private',
})
```

Wire API route handlers:

```ts
// app/api/auditauth/[...auditauth]/route.ts
export const { GET, POST } = auditauth.handlers
```

### Appendix: Next.js proxy (`proxy.ts`)

For private route groups, wire the SDK middleware through Next.js proxy.

```ts
// proxy.ts
import { NextResponse, type NextRequest } from 'next/server'
import { auditauth } from '@/providers/auth'

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/private')) {
    return auditauth.middleware(request)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

This keeps `/private` protected server-side while leaving public routes and
assets untouched.

## Runtime lifecycle

1. Redirect user to AuditAuth login.
2. Handle callback code and exchange for tokens.
3. Persist session/tokens using runtime-appropriate storage.
4. Retry authenticated requests after token refresh on `401`.
5. Revoke and clear session state on logout.
6. Emit request and navigation metrics.

## API highlights

- `login()`: starts login redirect flow
- `logout()`: revokes and clears session state
- `goToPortal()`: redirects to AuditAuth portal
- `fetch(url, init)`: authenticated requests with automatic refresh handling
- `getSession()` or `getSessionUser()`: current user/session state
- `withAuthRequest(handler)`: protects server routes (Next.js)

## Run examples

From the SDK root:

```bash
npm install

# framework-agnostic browser example
npm run dev:example-vanilla

# react example
npm run dev:example-react

# next.js example
npm run dev:example-next
```

Example docs:

- `examples/vanilla/README.md`
- `examples/react/README.md`
- `examples/next/README.md`

## Package docs

- `packages/web/README.md`
- `packages/react/README.md`
- `packages/next/README.md`
- `packages/node/README.md`

## Development

Use workspace scripts from the SDK root:

```bash
npm install
npm run build
npm run test:consumers
```

`npm run test:consumers` validates package consumption from packed tarballs in
three TypeScript fixture projects:

- `CommonJS` + `moduleResolution: node`
- `NodeNext` + `moduleResolution: nodenext`
- Bundler mode + React and Next.js package type checks

Individual package dev scripts:

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
