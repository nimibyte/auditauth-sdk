# @auditauth/node

`@auditauth/node` is the AuditAuth SDK for Node.js backends. It verifies
AuditAuth access tokens with the AuditAuth public key and validates issuer and
audience claims for your application.

## Install

Install the package in your Node.js service.

```bash
npm install @auditauth/node
```

## TypeScript import compatibility

`@auditauth/node` ships dual module output (ESM + CJS) with declaration files.
You can import it in TypeScript projects with standard syntax:

```ts
import { verifyAccessToken } from '@auditauth/node'
```

You do not need to append `.js` in consumer imports.

## Verify a bearer token

Use `verifyAccessToken()` when you already have a raw JWT string.

```ts
import { verifyAccessToken } from '@auditauth/node'

const payload = await verifyAccessToken({
  token: accessToken,
  appId: process.env.AUDITAUTH_APP_ID!,
})

console.log(payload.sub)
console.log(payload.email)
```

The SDK validates:

- Signature (`RS256`)
- Issuer (`iss`) against AuditAuth settings
- Audience (`aud`) against the `appId` you pass

## Verify an incoming HTTP request

Use `verifyRequest()` to extract and validate the `Authorization` header in one
step.

```ts
import { verifyRequest } from '@auditauth/node'

export async function handler(request: Request) {
  const session = await verifyRequest({
    request,
    appId: process.env.AUDITAUTH_APP_ID!,
  })

  return Response.json({
    userId: session.sub,
    email: session.email,
  })
}
```

`verifyRequest()` accepts these request shapes:

- `Request`
- `{ headers: Headers }`
- `{ headers: Record<string, string> }`

This makes it compatible with native Fetch handlers and common Node.js server
adapters.

## Express middleware example

Use `verifyRequest()` in middleware to protect private routes.

```ts
import express from 'express'
import { verifyRequest } from '@auditauth/node'

const app = express()

app.get('/private', async (req, res) => {
  try {
    const session = await verifyRequest({
      request: { headers: req.headers as Record<string, string> },
      appId: process.env.AUDITAUTH_APP_ID!,
    })

    res.json({ accountId: session.account_id, email: session.email })
  } catch {
    res.status(401).json({ error: 'Unauthorized' })
  }
})
```

## Token payload type

The SDK returns `AuditAuthTokenPayload`, which extends `JWTPayload` and
includes these AuditAuth claims:

- `sub: string`
- `email: string`
- `aud: string`
- `account_id: string`
- `app_id: string`

## API reference

Exports from `@auditauth/node`:

- `verifyAccessToken(input): Promise<AuditAuthTokenPayload>`
- `verifyRequest(input): Promise<AuditAuthTokenPayload>`
- `AuditAuthTokenPayload` (type)
- `VerifyAccessTokenPayload` (type)
- `VerifyRequestParams` (type)

## Errors

Verification throws an error when:

- The token is missing.
- The `Authorization` header is missing or not `Bearer <token>`.
- The JWT signature is invalid.
- `iss` or `aud` claims do not match expected values.

Handle these errors in your framework and return `401 Unauthorized` for failed
authentication.

## Compatibility

This package requires Node.js `>=18.18.0`.

## Resources

- Repository: https://github.com/nimibyte/auditauth-sdk
- Documentation: https://docs.auditauth.com

## License

MIT
