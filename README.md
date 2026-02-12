<p align="center">
  <img src="./logo.png" alt="AuditAuth Logo" width="120" />
</p>

<h1 align="center">AuditAuth SDK</h1>

<p align="center">
  Identity & Session Infrastructure for modern applications.
</p>

---

## Overview

**AuditAuth SDK** is a modular identity and session infrastructure designed to provide consistent authentication, session management, token lifecycle handling, and navigation-level observability across different runtimes.

This repository contains the core SDK packages and official integration examples.

It is framework-agnostic at its foundation and provides dedicated adapters for specific environments.

---

## Architecture

The SDK is organized as a monorepo containing multiple packages:

```
packages/
  core     → Shared identity primitives and protocol logic
  web      → Framework-agnostic browser SDK
  react    → React integration layer
  node     → Server-side JWT verification utilities
  next     → Next.js integration layer

examples/
  vanilla  → Web SDK integration example
  react    → React SDK integration example
```

Each package has its own README with detailed usage instructions.

---

## Design Goals

- Runtime-agnostic core identity logic
- Explicit session lifecycle management
- Token refresh orchestration
- Cross-tab session synchronization
- Minimal assumptions about application architecture
- Clear separation between protocol logic and framework adapters

AuditAuth is not just an authentication helper.  
It is an identity and session coordination layer intended to sit between your application and your identity backend.

---

## Packages

| Package | Description |
|----------|-------------|
| `@auditauth/core` | Shared protocol logic and identity primitives |
| `@auditauth/web` | Browser SDK (framework-agnostic) |
| `@auditauth/react` | React bindings for the Web SDK |
| `@auditauth/node` | Server-side verification utilities |
| `@auditauth/next` | Next.js integration layer |

---

## Examples

Official examples are included in this repository:

- `examples/vanilla` – Minimal framework-agnostic integration
- `examples/react` – React integration example

These examples demonstrate:

- Authentication flow
- Session persistence
- Token refresh handling
- Cross-tab synchronization
- Navigation metrics

They are integration references, not UI showcases.

---

## Development

This repository uses **npm workspaces**.

Install dependencies from the root:

```bash
npm install
```

Build all packages:

```bash
npm run build
```

Run individual packages:

```bash
npm run dev:core
npm run dev:web
npm run dev:react
npm run dev:node
npm run dev:next
```

Run examples:

```bash
npm run dev:example-vanilla
npm run dev:example-react
```

---

## Status

The SDK ecosystem is currently under active development toward the `1.0.0` release.

Interfaces may evolve as the infrastructure stabilizes.

---

## Philosophy

AuditAuth is built with a strict separation of concerns:

- Identity protocol logic lives in `core`
- Environment-specific adapters remain thin
- Session state is explicit
- Refresh flow is deterministic
- Observability is first-class

The objective is predictable identity infrastructure — not opaque authentication helpers.

---

## License

MIT
