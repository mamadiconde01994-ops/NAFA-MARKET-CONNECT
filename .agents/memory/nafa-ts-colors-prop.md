---
name: NAFA TS colors prop pattern
description: Correct TypeScript type to use when passing the colors object as a component prop
---

## Rule
Internal component functions that receive `colors` as a prop must type it as `ReturnType<typeof useColors>`, not `Record<string, string>`.

**Why:** `useColors()` returns `ColorTheme & { colors: ColorTheme; radius: number }`. The `colors` sub-property is an object (not a string) and `radius` is a number — both violate `Record<string, string>` constraint, causing TS2322 errors.

**How to apply:**
- Import `useColors` from `@/hooks/useColors` (it's always already imported in files that use it).
- Replace `colors: Record<string, string>` with `colors: ReturnType<typeof useColors>` in prop type definitions.
- Files historically affected: favorites.tsx, search.tsx, app/notifications.tsx, change-password.tsx.
