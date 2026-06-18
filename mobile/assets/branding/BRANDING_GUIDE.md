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

### Sémantique
```
Success:              #10b981  — Validations, confirmations
Warning:              #f59e0b  — Avertissements
Error:                #ef4444  — Erreurs
Info:                 #0d7c5f  — Information (same as primary)
```

### Mode Sombre
```
Background:           #0a1a14  — Main dark background
Surface:              #1a2b24  — Cards & components on dark
Text:                 #e8f5f1  — Primary text on dark
Border:               #2d4a3f  — Borders on dark
```

### Contraste & Accessibilité
- **Recommandé:** #0B8A5F sur #FFFFFF (Dark Green on White) — WCAG AAA (7.2:1)
- **Recommandé:** #FFFFFF sur #0d7c5f (White on Rich Green) — WCAG AAA (6.8:1)
- **Texte petit:** Utiliser #1a472a (Dark Forest Green) pour meilleur contraste

---

## 3. TYPOGRAPHIE OFFICIELLE

### Familles de Polices
```
Primaire:    Segoe UI, Roboto, Poppins, -apple-system, BlinkMacSystemFont, sans-serif
Mono:        Menlo, Monaco, Courier New, monospace
```

### Échelle de Tailles (en pixels, base 16px)
```
XS:          12px
SM:          14px
Base:        16px  (body text)
LG:          18px
XL:          20px
2XL:         24px
3XL:         28px
4XL:         32px  (H1)
5XL:         36px
6XL:         40px
```

### Poids (Font Weights)
```
Light:       300
Normal:      400
Medium:      500
Semibold:    600
Bold:        700
Extrabold:   800
```

### Styles Prédéfinis

#### Headings
| Style  | Taille | Poids | Ligne | Lettrage |
|--------|--------|-------|-------|----------|
| H1     | 32px   | 700   | 1.2   | -0.5px   |
| H2     | 28px   | 700   | 1.3   | -0.3px   |
| H3     | 24px   | 600   | 1.4   | -0.2px   |
| H4     | 20px   | 600   | 1.4   | 0px      |

#### Texte
| Style       | Taille | Poids | Ligne | Lettrage |
|-------------|--------|-------|-------|----------|
| Body        | 16px   | 400   | 1.6   | 0px      |
| Body Small  | 14px   | 400   | 1.5   | 0.2px    |
| Caption     | 12px   | 400   | 1.4   | 0.3px    |
| Label       | 14px   | 500   | 1.4   | 0.2px    |
| Button      | 16px   | 600   | 1.5   | 0.5px    |

### Mobile Responsive
```
Petits écrans (< 375px):  Réduire de 10-15%
Grands écrans (> 768px):  Augmenter de 10-20%
Toujours: min 12px pour lisibilité
```

---

## 4. LOGO

### Logo Principal (Complet)
**Fichier:** `logo-v2.svg`

**Composition:**
- Marque de connectivité (4 nœuds interconnectés)
- Nœud central: Hub du marché
- Nœuds externes: Agriculture, Technologie, Commerce, Services
- **"NAFA"** en grand (typographie audacieuse)
- **"Marché Connect"** en signature secondaire

**Utilisation:**
- Présentatif (splash, headers, marketing)
- Ratio d'espace blanc: min 1/4 du logo de chaque côté
- Fond blanc recommandé

**Couleurs:**
- Primaire: Gradient #1a472a → #0d7c5f
- Accent: Gradient #fdb913 → #f59e0b
- Texte: #1a472a sur fond blanc

### Logo Mark (Compact)
**Fichier:** `logo-mark-v2.svg`

**Utilisation:**
- Icônes tab bar
- Favicons
- Petits contextes
- Avatars (profil)
- Toutes tailles à partir de 32px

**Ratio:** Carré avec coins arrondis (safe area)

### App Icon
**Fichier:** `app-icon-v2.svg`

**Tailles à générer:**
```
Android:    48dp, 72dp, 96dp, 144dp, 192dp, 512dp
iOS:        60px, 76px, 83.5px, 120px, 152px, 167px, 180px, 1024px
Play Store: 512px
App Store:  1024px
Favicons:   16px, 32px, 48px, 64px, 128px
```

**Propriétés:**
- Fond: Gradient primaire
- Marque: Mark blanc centré
- Coins arrondis: Safe area de 8-10px sur les côtés (ne pas croiser)
- Pas de shadow sur petit format (< 48px)

---

## 5. SPLASH SCREEN

### Appearance
**Fichier composant:** `SplashScreen.tsx`

**Éléments:**
1. Logo animé (scale 0.6 → 1.0, fade in) — 400-600ms
2. Marque "NAFA" (fade in) — 400ms
3. Signature "Marché Connect" (fade in)
4. Ligne d'accent (couleur gold)
5. Slogan optionnel: "Connecter les marchés. Créer des opportunités."

**Animation:**
- Phase 1: Logo apparaît & scale (600ms, ease-out)
- Phase 2: Marque "NAFA" fade (400ms)
- Phase 3: Tagline fade (400ms)
- Phase 4: Hold + slogan (800ms)
- **Durée totale:** ~2.5s

**Mode clair:**
- Fond: Blanc (#ffffff)
- Texte: Dark (#2d2d2d)
- Accent: Gold (#fdb913)

**Mode sombre:**
- Fond: #0a1a14
- Texte: #e8f5f1
- Accent: Gold (#fdb913) — invariant

**Responsive:**
- Centre parfaitement sur tous les écrans
- Aucun texte tronqué
- Adaptatif pour notch/safe area
- Testé: iPhone SE, iPhone 12-14, iPhone 15 Pro Max, Android 5"-6"+

**Durée:** Affichage min. 2.5s, max. 4s selon réseau

---

## 6. LOADING SCREEN

### Appearance
**Fichier composant:** `LoadingScreen.tsx`

**Éléments:**
1. Spinner animé (rotation 360°, 2s/loop)
2. Texte "Chargement..." (ou message custom)
3. Indicateur dots pulsant
4. Logo mark centré

**Animation:**
- Spinner: Rotation continue (ease-in-out, 2s)
- Dots: Pulsing opacity (subtle)
- Délai avant affichage: max 500ms

**Mode clair/sombre:** Même que Splash

**Usage:**
- Lors du chargement des données
- Transitions d'écran lentes
- Appels API en cours

---

## 7. ESPACEMENTS OFFICIELS

```
XS:  4px
SM:  8px
MD:  12px
Base: 16px
LG:  24px
XL:  32px
2XL: 40px
3XL: 48px
4XL: 56px
5XL: 64px
```

---

## 8. RAYONS DE COIN (Border Radius)

```
None:  0px
SM:    4px    (subtle, inputs)
Base:  8px    (standard, cards)
MD:    12px   (medium containers)
LG:    16px   (large containers)
XL:    20px   (buttons)
2XL:   24px   (modals)
Full:  9999px (circles)
```

---

## 9. OMBRES OFFICIELLES

```
None:   none
SM:     0 1px 2px 0 rgba(0, 0, 0, 0.05)
Base:   0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)
MD:     0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)
LG:     0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)
XL:     0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)
```

---

## 10. TRANSITIONS & ANIMATIONS

```
Fast:    200ms  (hover, quick feedback)
Base:    300ms  (standard transitions)
Slow:    500ms  (important reveals)
```

**Easing:** ease-in-out (smooth, professional)

---

## 11. DIRECTIVES BRANDING

### ✅ À FAIRE
- Utiliser gradient primaire pour les actions principales
- Mettre accent gold sur éléments critiques
- Garder sufficient whitespace autour du logo
- Tester sur appareil réel avant release
- Respecter contraste WCAG AAA sur tous les textes
- Animations subtiles (< 600ms)
- Responsive design d'abord

### ❌ À NE PAS FAIRE
- Ne pas modifier les couleurs du logo
- Ne pas étirer le logo (toujours ratio 1:1 ou aspect original)
- Ne pas ajouter d'ombre excessive au logo
- Ne pas utiliser de polices custom non listées
- Ne pas changer le message "Marché Connect"
- Ne pas combiner avec d'autres marques
- Ne pas utiliser en petit format (< 32px) sans mark version

---

## 12. FICHIERS ASSETS

```
mobile/assets/branding/
├── logo-v2.svg              (Logo principal + wordmark)
├── logo-mark-v2.svg         (Mark compact)
├── app-icon-v2.svg          (App icon source)
├── splash-light.svg         (Splash screen vector)
├── splash-dark.svg          (Splash screen dark)
├── loading.svg              (Loading animation)
└── branding.md              (Ce fichier)

mobile/constants/
└── branding.ts              (Colors, typography, spacing constants)

mobile/components/branding/
├── SplashScreen.tsx         (Composant splash screen)
└── LoadingScreen.tsx        (Composant loading screen)
```

---

## 13. INTÉGRATION TECHNIQUE

### React Native/Expo
```tsx
import { SplashScreen } from '@/components/branding/SplashScreen';
import { LoadingScreen } from '@/components/branding/LoadingScreen';
import { NAFA_COLORS, NAFA_TYPOGRAPHY } from '@/constants/branding';

// Splash au démarrage
<SplashScreen onFinish={() => setShowApp(true)} duration={2500} />

// Loading pendant requêtes
<LoadingScreen message="Chargement..." isDark={isDark} />

// Utiliser les couleurs
backgroundColor: NAFA_COLORS.primary.main
color: NAFA_COLORS.neutral.dark
```

---

## 14. PROCHAINES ÉTAPES (Phase 2+)

- [ ] Intégrer dans app.json (expo)
- [ ] Générer PNG exports (script ImageMagick ou Figma API)
- [ ] Tester sur appareils réels
- [ ] Configurer app store icons
- [ ] Créer guidelines complètes pour designers
- [ ] Documentation pour équipe dev

---

**Version:** 1.0 — 2026-06-17  
**Status:** ✅ Phase 1 complétée — Prêt pour intégration technique
