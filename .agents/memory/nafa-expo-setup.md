---
name: NAFA Marché Expo setup
description: Key config facts for the NAFA Marché mobile project (Expo SDK 54, pnpm workspace)
---

## Workflow
- Command: `PORT=18115 pnpm --filter @workspace/mobile run dev`
- PORT must be set explicitly — `$PORT` env var does not expand in workflow config

## Artifact registration
- `listArtifacts()` returns `[]` — artifact is NOT registered in Replit system
- `presentArtifact()` will fail; app is accessible via Expo domain only
- artifact.toml exists at `artifacts/mobile/.replit-artifact/artifact.toml`

## CORS warning
- Expo CorsMiddleware blocks requests from Replit proxy domain — non-blocking, app renders fine

## Route convention
- Nested routes use `name="checkout/index"` (not `name="checkout"`) in Stack.Screen

## What NOT to touch
- All existing screens are complete and high-quality — login, register, home, vehicles, jobs, restaurants, real-estate, services, warehouses, search, orders, profile, partners
- No Supabase/SQL/backend changes
