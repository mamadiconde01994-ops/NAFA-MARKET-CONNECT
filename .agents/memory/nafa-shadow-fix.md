---
name: NAFA shadow fix pattern
description: How to fix React Native Web shadow* deprecation warnings
---

## Rule
React Native Web 0.19+ deprecates `shadowColor/Offset/Opacity/Radius`. Use `boxShadow` on web.

## How to apply
```js
...Platform.select({
  web: { boxShadow: "0px 4px 8px rgba(0,0,0,0.15)" },
  default: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
}),
```

**Why:** Avoids console warnings on web while keeping native shadows intact. Must import Platform from 'react-native' first.
