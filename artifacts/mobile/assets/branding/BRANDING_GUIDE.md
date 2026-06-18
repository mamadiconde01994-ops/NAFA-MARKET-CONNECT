# NAFA Marché Connect — Guide d'Identité Visuelle Complète

**Phase 1 — Identité Visuelle Définitive**

---

## 1. VISION & POSITIONNEMENT

### Marque
- **Marque principale:** NAFA
- **Nom officiel:** NAFA Marché Connect
- **Positionnement:** Plateforme numérique moderne, sérieuse et ambitieuse pour l'Afrique

### Vision Produit
NAFA Marché Connect est une marketplace numérique couvrant :
- Agriculture & produits agricoles
- Commerce local
- Restaurants & restauration
- Immobilier & services immobiliers
- Services professionnels
- Artisans & produits artisanaux
- Transport & logistique
- Services numériques
- Opportunités commerciales futures

**Trajectoire:** Guinée → Afrique francophone → Afrique entière → International

---

## 2. PALETTE OFFICIELLE DE COULEURS

### Primaire (Confiance & Croissance)
```
Dark Forest Green:    #1a472a  — Primary brand color (logos, headings, CTAs)
Rich Green:           #0d7c5f  — Main interactions (buttons, links, accents)
Light Green:          #1da084  — Hover states, soft backgrounds
Very Light Green:     #e8f5f1  — Light backgrounds, info zones
```

### Accent (Énergie & Optimisme)
```
Bright Gold:          #fdb913  — Primary highlights & accents
Warm Orange:          #f59e0b  — Secondary accents & emphasis
Light Amber:          #fef3c7  — Soft backgrounds
```

### Neutre (Texte & Structure)
```
Black:                #0f0f0f  — Critical text
Dark Grey:            #2d2d2d  — Primary text
Medium Grey:          #666666  — Secondary text & borders
Light Grey:           #f5f5f5  — Light backgrounds
Lighter Grey:         #f9f9f9  — Very light backgrounds
White:                #ffffff  — Light backgrounds & text on dark
```

### Mode Sombre
```
Background:           #0a1a14  — Main dark background
Surface:              #1a2b24  — Cards & components on dark
Text:                 #e8f5f1  — Primary text on dark
Border:               #2d4a3f  — Borders on dark
```

---

## 3. TYPOGRAPHIE OFFICIELLE

### Familles de Polices
```
Primaire:    Segoe UI, Roboto, Poppins, -apple-system, BlinkMacSystemFont, sans-serif
Mono:        Menlo, Monaco, Courier New, monospace
```

### Échelle de Tailles
```
H1:   32px | H2:   28px | H3:   24px | H4:   20px
Body: 16px | Small: 14px | Caption: 12px
```

---

## 4. LOGO & ASSETS

### Logo Principal
**Fichier:** `logo-v2.svg`  
Utilisation présentatif (splash, headers, marketing)

### Logo Mark
**Fichier:** `logo-mark-v2.svg`  
Utilisation compacte (tabs, favicons, < 120px)

### App Icon
**Fichier:** `app-icon-v2.svg`  
Source pour générer PNG exports

---

## 5. SPLASH SCREEN

- **Composant:** `SplashScreen.tsx`
- **Durée:** 2.5s total (600ms logo scale, 400ms brand name, 400ms tagline, 800ms hold)
- **Mode clair & sombre:** Complètement responsive
- **Slogan:** "Connecter les marchés. Créer des opportunités."

---

## 6. LOADING SCREEN

- **Composant:** `LoadingScreen.tsx`
- **Animation:** Spinner rotatif 2s loop
- **Responsive:** Adaptatif sur tous les appareils

---

## Fichiers Créés

```
artifacts/mobile/assets/branding/
├── logo-v2.svg
├── logo-mark-v2.svg
├── app-icon-v2.svg
└── BRANDING_GUIDE.md

artifacts/mobile/constants/
└── branding.ts

artifacts/mobile/components/branding/
├── SplashScreen.tsx
├── SplashScreenWrapper.tsx
└── LoadingScreen.tsx
```

---

**Status:** ✅ Phase 1 — Assets & Components Created  
**Next:** Integrate SplashScreenWrapper into app._layout.tsx
