# ADR-0004: next-intl for Internationalization
Date: 2026-05-24
Status: Accepted

## Context
OpsCore ships with two locales: English (`en`) and Farsi (`fa`). Farsi requires full RTL layout support. The i18n solution must integrate with Next.js 14 App Router and support Server Components.

## Decision
Use **next-intl** for internationalization.

## Consequences
- Positive: First-class Next.js App Router support including Server Components. Messages can be loaded per-route for optimal bundle splitting.
- Positive: Type-safe message keys with TypeScript. ICU MessageFormat for plurals, dates, numbers.
- Positive: Built-in `useFormatter` for Intl API integration (numbers, dates, currencies) — no string concatenation.
- Positive: Locale-aware routing and `<html dir>` management.
- Negative: Adds a provider component to the root layout. Minimal runtime overhead.

## Alternatives considered
- **Lingui:** Excellent library with macro-based extraction, but App Router support is less mature than next-intl. Extraction step adds build complexity.
- **react-i18next:** Battle-tested but designed for client-side React. Server Component support requires workarounds.
- **Manual Intl API:** Maximum control but no message management, no type safety, significant boilerplate.
