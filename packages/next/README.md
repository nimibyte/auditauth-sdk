# @auditauth/next

`@auditauth/next` is the AuditAuth integration for Next.js App Router. It
provides route handlers, auth middleware, protected server handlers, session
helpers, and authenticated fetch wrappers.

## Install

Install the package in your Next.js application.

```bash
npm install @auditauth/next
```

## TypeScript import compatibility

`@auditauth/next` ships dual module output (ESM + CJS) with declaration files.
You can import it in TypeScript projects with standard syntax:

```ts
import { createAuditAuthNext } from '@auditauth/next'
```

You do not need to append `.js` in consumer imports.

## Create the AuditAuth provider

Create one shared instance with `createAuditAuthNext()`.

```ts
// src/providers/auth.ts
import { createAuditAuthNext } from '@auditauth/next'

export const auditauth = createAuditAuthNext({
  apiKey: process.env.AUDITAUTH_API_KEY!,
  appId: process.env.AUDITAUTH_APP_ID!,
  baseUrl: 'http://localhost:3000',
  redirectUrl: 'http://localhost:3000/private',
})
```

## Register auth API handlers

Expose the SDK handlers through a catch-all route.

```ts
// src/app/api/auditauth/[...auditauth]/route.ts
import { auditauth } from '@/providers/auth'

export const { GET, POST } = auditauth.handlers
```

The handler covers these endpoints:

- `GET /api/auditauth/login`
- `GET /api/auditauth/callback`
- `GET /api/auditauth/logout`
- `GET /api/auditauth/portal`
- `GET /api/auditauth/session`
- `GET /api/auditauth/refresh`
- `POST /api/auditauth/metrics`

## Protect private routes with middleware

Call `auditauth.middleware()` on route groups that require authentication.

```ts
// src/proxy.ts
import { NextResponse, type NextRequest } from 'next/server'
import { auditauth } from '@/providers/auth'

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/private')) {
    return auditauth.middleware(request)
  }

  return NextResponse.next()
}
```

## Access session data in server components

Use `auditauth.getSession()` in server components, route handlers, or server
actions.

```ts
const session = await auditauth.getSession()
if (!session) return null
```

## Protect custom route handlers

Wrap handlers with `auditauth.withAuthRequest()` to enforce token validation and
inject the verified token payload.

```ts
import { auditauth } from '@/providers/auth'
import { NextResponse } from 'next/server'

export const GET = auditauth.withAuthRequest(async (_req, _ctx, session) => {
  return NextResponse.json({ email: session.email })
})
```

## Call protected APIs from the server

Use `auditauth.fetch()` for server-side requests with automatic refresh and
request metrics.

```ts
const response = await auditauth.fetch('https://api.example.com/private')
```

## Client helpers

For client-side navigation shortcuts, import these helpers:

- `login()`
- `logout()`
- `goToPortal()`

You can also use `AuditAuthGuard` and `useAuditAuth` to gate client-rendered
UI sections.

## Compatibility

This package requires:

- Node.js `>=18.18.0`
- Next.js `>=13`
- React `>=18`
- React DOM `>=18`

## Resources

- Repository: https://github.com/nimibyte/auditauth-sdk
- Documentation: https://docs.auditauth.com

## Example

See `examples/next` for a complete App Router integration.

## License

MIT
