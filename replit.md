# NAFA Marché

A premium mobile marketplace app for Guinea — covering agriculture, restaurants, real estate, services, logistics/warehouses, and more. Built with Expo + React Native.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Mobile: Expo SDK 54, React Native 0.81, Expo Router (file-based)
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/mobile/app/` — Expo Router file-based screens
  - `(tabs)/index.tsx` — Home screen (premium multi-module hub)
  - `(tabs)/profile.tsx` — Profile + theme switcher
  - `restaurants/` — Restaurant listing + details
  - `real-estate/` — Property listing + details
  - `services/` — Services marketplace
  - `warehouses/` — Warehouse listing
  - `product/` — Agriculture product detail + create
- `artifacts/mobile/constants/colors.ts` — 3 themes: light (Navy/Gold), dark, green
- `artifacts/mobile/constants/mockData.ts` — All mock data (products, restaurants, properties, services, warehouses, market prices)
- `artifacts/mobile/context/ThemeContext.tsx` — Theme persistence + switching
- `artifacts/mobile/types/index.ts` — All TypeScript interfaces

## Architecture decisions

- **ThemeProvider must wrap ErrorBoundary** — ErrorFallback uses useColors which needs ThemeContext
- **3-theme system**: `light` (Navy #1E293B + Gold #F59E0B, default), `dark`, `green` (agriculture heritage)
- **Category colors**: each vertical has its own brand color (agriculture=green, restaurants=orange, real estate=blue, services=purple, logistics=red)
- **Typed routes**: Expo Router `typedRoutes: true` is enabled — use `as any` for dynamic router.push calls
- **All new modules use mock data only** — no backend required yet

## Product

NAFA is the future digital marketplace of Guinea, organized around sub-brands:
- **NAFA Market** — Agriculture (flagship)
- **NAFA Food** — Restaurants & delivery
- **NAFA Immo** — Real estate (buy/rent)
- **NAFA Services** — Artisans & professionals
- **NAFA Warehouses** — Storage & logistics
- **NAFA Pay** — Payments (future)

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- ThemeProvider must be the outermost provider (above ErrorBoundary) so ErrorFallback can call useColors
- Expo Router typed routes: all new route files must be registered in `_layout.tsx` Stack.Screen list
- Router.push with dynamic paths: use `as any` cast due to typed routes enforcement
- Screenshots of the app always show the splash screen (2.2s timer) — the app IS working, the tool just captures the initial render

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
