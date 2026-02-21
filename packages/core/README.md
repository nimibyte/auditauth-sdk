# @auditauth/core

`@auditauth/core` is the shared foundation used by the AuditAuth SDK packages.
It provides token and portal helpers, request metrics helpers, shared types,
and runtime settings used across the SDK ecosystem.

## Install

Install the package in your project.

```bash
npm install @auditauth/core
```

## TypeScript import compatibility

`@auditauth/core` ships dual module output (ESM + CJS) with declaration files.
You can import it in TypeScript projects with standard syntax:

```ts
import { CORE_SETTINGS } from '@auditauth/core'
```

You do not need to append `.js` in consumer imports.

## Minimal example

Import and use the core helpers directly.

```ts
import { buildAuthUrl, CORE_SETTINGS } from '@auditauth/core'

const url = await buildAuthUrl({
  apiKey: process.env.AUDITAUTH_API_KEY!,
  redirectUrl: 'https://app.example.com/auth/callback',
})

console.log(url)
console.log(CORE_SETTINGS.jwt_issuer)
```

## Compatibility

This package requires Node.js `>=18.18.0`.

## Resources

- Repository: https://github.com/nimibyte/auditauth-sdk
- Documentation: https://docs.auditauth.com

## License

MIT
