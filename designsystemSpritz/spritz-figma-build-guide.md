# Spritz — Guía de construcción en Figma paso a paso

> Orden: Átomos → User Flows → Moléculas → Organismos → Templates → Pantallas

---

## PASO 1: ÁTOMOS — Componentes base (~1-2h)

Los átomos son componentes sin lógica de negocio.
Cada uno debe usar Auto Layout + estar linkeado a tus variables.

### 1.1 Button

**Crear como componente con 3 propiedades:**

| Property     | Type    | Options                           |
|-------------|---------|-----------------------------------|
| Variant     | Variant | primary, secondary, accent, ghost |
| Size        | Variant | sm, md, lg                        |
| Icon left   | Boolean | true/false                        |

**Especificaciones por variante:**

```
PRIMARY (dark ink)
├── Fill: semantic/bg/inverse (cream-900)
├── Text: semantic/text/inverse (cream-50)
├── Radius: 12px
└── Font: DM Sans Medium

SECONDARY (cream surface)
├── Fill: semantic/bg/surface (cream-100)
├── Text: semantic/text/secondary (cream-700)
├── Radius: 12px
└── Border: 0.5px semantic/border/subtle

ACCENT (terracotta — adapts with scent mode)
├── Fill: accent/primary (terracotta-400 by default)
├── Text: white
├── Radius: 12px
└── No border

GHOST (transparent)
├── Fill: none
├── Text: semantic/text/secondary
├── Radius: 12px
└── No border
```

**Tamaños (Auto Layout padding):**
```
SM:  paddingH: 16px  paddingV: 8px   font: 13px  height: 32px
MD:  paddingH: 24px  paddingV: 12px  font: 14px  height: 40px
LG:  paddingH: 32px  paddingV: 14px  font: 16px  height: 48px
```

**Auto Layout config:**
- Direction: Horizontal
- Gap: 8px (entre icono y texto)
- Alignment: Center center
- Sizing: Hug contents (width) × Fixed (height)

---

### 1.2 Input

**Propiedades del componente:**

| Property    | Type    | Options                    |
|------------|---------|----------------------------|
| State      | Variant | default, focused, error, filled |
| Type       | Variant | text, search, password     |
| Label      | Boolean | true/false                 |
| Helper text| Boolean | true/false                 |

**Especificaciones:**
```
CONTAINER
├── Fill: semantic/bg/page (cream-50)
├── Border: 1px semantic/border/default (cream-300)
├── Border (focused): 1.5px accent/primary
├── Border (error): 1.5px feedback/error
├── Radius: 12px
├── Height: 44px
├── Padding: 12px 16px

PLACEHOLDER TEXT
├── Font: DM Sans Regular 14px
├── Color: semantic/text/muted (cream-500)

VALUE TEXT
├── Font: DM Sans Regular 14px
├── Color: semantic/text/primary (cream-900)

LABEL (si visible)
├── Font: DM Sans Medium 13px
├── Color: semantic/text/secondary (cream-700)
├── Margin bottom: 6px

SEARCH VARIANT
├── Lucide icon "Search" a la izquierda (16px, cream-500)
├── Padding left extra: 40px
```

---

### 1.3 Scent Tag (Pill)

**Este es el componente más identitario de Spritz.**

| Property    | Type    | Options                                        |
|------------|---------|------------------------------------------------|
| Scent      | Variant | woody, fresh, floral, oriental, green, amber   |
| Size       | Variant | sm, md                                         |

**Especificaciones:**
```
SM (para cards y listas)
├── Padding: 3px 8px
├── Radius: 999px (full pill)
├── Font: DM Sans Medium 10px
├── Letter spacing: 0.04em
├── Text transform: UPPERCASE

MD (para filtros y detail)
├── Padding: 5px 12px
├── Radius: 999px
├── Font: DM Sans Medium 12px
├── Letter spacing: 0.04em
├── Text transform: UPPERCASE
```

**Colores por variante (usar variables semánticas scent/):**
```
WOODY:    bg: terracotta-50   text: terracotta-700
FRESH:    bg: teal-50         text: teal-700
FLORAL:   bg: rose-50         text: rose-700
ORIENTAL: bg: violet-50       text: violet-700
GREEN:    bg: sage-50         text: sage-700
AMBER:    bg: gold-50         text: gold-700
```

💡 **Truco Figma:** Si configuraste los Scent Modes en la colección
Semantic, al cambiar el Mode del frame padre todos los tags
hijos se re-colorean automáticamente.

---

### 1.4 Bottle Avatar

**Placeholder visual para el frasco de perfume.**

| Property | Type    | Options        |
|----------|---------|----------------|
| Size     | Variant | sm, md, lg     |
| Has image| Boolean | true/false     |

```
SM: 40×40px   radius: 10px
MD: 56×56px   radius: 12px
LG: 80×80px   radius: 16px

SIN IMAGEN:
├── Fill: accent/bg (scent-adaptive)
├── Icono centro: Lucide "Droplets" 
├── Icon color: accent/primary

CON IMAGEN:
├── Fill mode: image fill (cover)
├── Clip contents: true
```

---

### 1.5 Badge / Indicator

Para estados (casi vacío, nuevo, trending).

```
DOT INDICATOR
├── Size: 8px circle
├── Fill: varies (success, warning, error)

TEXT BADGE
├── Padding: 2px 8px
├── Radius: 6px
├── Font: DM Sans Medium 11px
├── Variants: new (teal), low (gold), trending (terracotta)
```

---

### 1.6 Divider

```
HORIZONTAL LINE
├── Height: 0.5px
├── Fill: semantic/border/subtle (cream-200)
├── Width: Fill container

CON LABEL
├── Line — Text — Line pattern
├── Text: DM Sans Regular 12px, cream-500
├── Gap: 12px each side
```

---

### 1.7 Spray Particle (brand element)

```
SINGLE PARTICLE
├── Shape: Circle
├── Sizes: 3px, 5px, 8px, 12px (variants)
├── Fill: accent/primary
├── Opacity: 0.3, 0.5, 0.7, 1.0 (variants)

PARTICLE CLUSTER (component set)
├── 5-8 partículas dispersas
├── Bounding box: ~60×60px
├── Posición: scattered, no simétrico
├── Opacity global: 0.10-0.15 (para background use)
```

---

### 1.8 Icon Set

**Usa Lucide Icons (mismo set que Shadcn UI).**
Descarga el plugin "Lucide Icons" para Figma.

Iconos esenciales para Spritz:
```
Navigation:    Home, Shirt, Plus, Compass, User
Actions:       Search, Filter, Heart, Share, Trash, Edit, Check
Fragrance:     Droplets, Wind, Sun, Moon, Cloud, Thermometer
Status:        Clock, Calendar, TrendingUp, Star, BarChart3
UI:            ChevronRight, ChevronLeft, X, MoreHorizontal, Settings
```

Crear componente Icon wrapper:
```
├── Size: 20×20px (default), 16px (small), 24px (large)
├── Color: semantic/text/secondary (default)
├── Stroke width: 1.5px
```

---

## PASO 2: USER FLOWS — Mapear journeys (~30min)

Antes de hacer moléculas, necesitamos saber QUÉ pantallas 
construir. Crea una página "Flows" en Figma con FigJam o 
simplemente con frames y flechas.

### Flow 1: Recomendación diaria (core loop)
```
[Abrir app]
    ↓
[Today's Pick screen]
    ├── Ver recomendación + razón
    ├── [Usar hoy] → Registra en Wear Log → Confirmación
    ├── [Otra opción] → Nueva recomendación (mismos factores)
    └── [Cambiar ocasión] → Selector → Nueva recomendación
```

### Flow 2: Gestionar colección
```
[Tab Wardrobe]
    ↓
[Grid de fragancias]
    ├── [Tap fragancia] → Detail screen
    │       ├── Ver info + notas + historial uso
    │       ├── [Editar] → Edit mode
    │       └── [Usar hoy] → Registra
    ├── [Buscar/Filtrar] → Filter sheet
    │       └── Por: familia, estación, ocasión, día/noche
    └── [+ Añadir] → Add flow
```

### Flow 3: Añadir fragancia
```
[Botón + (bottom nav o wardrobe)]
    ↓
[Search screen]
    ├── Buscar en DB
    │   └── [Seleccionar] → Pre-fill datos → [Confirmar]
    └── [Añadir manual]
        └── Nombre + Marca + Foto + Tags → [Guardar]
```

### Flow 4: Descubrir
```
[Tab Discover]
    ↓
[Discover screen]
    ├── "Basado en tu colección" → Carousel
    ├── "Trending" → Grid
    └── [Tap fragancia] → Detail (con botón "Add to wishlist")
```

### Flow 5: Historial
```
[Tab Log / desde Profile]
    ↓
[Calendar view]
    ├── Ver qué usaste cada día (dots de color)
    ├── [Tap día] → Detalle de ese día
    └── Stats: más usada, días sin usar, racha
```

---

## PASO 3: MOLÉCULAS — Componentes compuestos (~2-3h)

### 3.1 Fragrance Card

**El componente más usado de la app.**

| Property    | Type    | Options          |
|------------|---------|------------------|
| Size       | Variant | compact, full    |
| State      | Variant | default, active  |

```
COMPACT (para grids y listas) — 170×200px aprox
┌─────────────────────────┐
│  ┌──────────────────┐   │  Bottle avatar LG (80px)
│  │                  │   │  centrado, radius 16px
│  │    [Foto/Color]  │   │
│  │                  │   │
│  └──────────────────┘   │
│                         │
│  Terre d'Hermès         │  Font: DM Sans Medium 14px
│  Hermès                 │  Font: DM Sans Regular 12px, cream-500
│  [Woody] [Citrus]       │  Scent Tags sm
└─────────────────────────┘

Auto Layout:
├── Direction: Vertical
├── Padding: 12px
├── Gap: 8px (entre imagen y texto), 6px (entre texto y tags)
├── Fill: semantic/bg/card (white)
├── Border: 0.5px semantic/border/subtle
├── Radius: 16px
├── Effect: Shadow/sm
└── Sizing: Fixed width, Hug height

FULL (para recommendation y detail) — ancho completo
┌──────────────────────────────────────┐
│  ┌────┐                             │
│  │Foto│  Terre d'Hermès             │  
│  │56px│  Hermès · EDT               │  
│  └────┘  [Woody] [Citrus] [Día]     │  
└──────────────────────────────────────┘

Auto Layout:
├── Direction: Horizontal
├── Padding: 14px
├── Gap: 14px
├── Bottle avatar: MD (56px)
├── Text group: Vertical, gap 4px
└── Tags row: Horizontal, gap 5px, wrap
```

---

### 3.2 Recommendation Card

**El hero de la pantalla Today.**

```
┌──────────────────────────────────────┐
│  [Spray particles decorativas]       │  Particle cluster, opacity 0.1
│                                      │
│  VIERNES 29 MAR · 28°C SOLEADO     │  Overline style, cream-500
│  Buenos días, Miguel                 │  Body/sm, cream-700
│                                      │
│  Hoy te recomiendo                   │  Heading/lg, cream-900, Plus Jakarta
│                                      │
│  Día cálido — algo fresco           │  Body/sm, cream-500
│                                      │
│  ┌──────────────────────────────┐   │
│  │  [Fragrance Card full]       │   │  Molecule 3.1 (variant full)
│  └──────────────────────────────┘   │
│                                      │
│  [■ Usar hoy]  [Otra opción]       │  Button primary + secondary
│                                      │
└──────────────────────────────────────┘

Auto Layout:
├── Direction: Vertical
├── Padding: 20px
├── Gap: 4px (status), 16px (before title), 8px (after reason), 16px (before buttons)
├── Fill: semantic/bg/page (cream-50)
├── Radius: 20px
├── IMPORTANTE: aplicar Scent Mode al frame entero
│   → al cambiar mode, particles + accent cambian juntos
└── Sizing: Fill width, Hug height
```

---

### 3.3 Weather Pill

```
┌──────────────────────┐
│  ☀ 28°C · Soleado    │
└──────────────────────┘

├── Direction: Horizontal
├── Padding: 6px 12px
├── Gap: 6px
├── Radius: 999px (pill)
├── Fill: semantic/bg/surface (cream-100)
├── Icon: Lucide Sun/Cloud/etc (16px)
├── Text: DM Sans Regular 13px, cream-700
```

---

### 3.4 Stat Card

```
┌─────────────┐
│  Más usada   │  Caption, cream-500
│  Sauvage     │  Heading/sm, cream-900
│  12 veces    │  Body/sm, cream-700
└─────────────┘

├── Padding: 16px
├── Radius: 16px
├── Fill: semantic/bg/surface
├── Min width: 150px
```

---

### 3.5 Nav Item (Bottom navigation)

| Property | Type    | Options          |
|----------|---------|------------------|
| State    | Variant | active, inactive |

```
INACTIVE
├── Icon: 20px, cream-500
├── Label: 11px DM Sans Medium, cream-500
├── Gap: 4px vertical
├── Width: Fill (1/5 del bottom nav)

ACTIVE
├── Icon: 20px, accent/primary (terracotta-400)
├── Label: 11px DM Sans Medium, accent/primary
├── Dot indicator encima del icono (optional)
```

---

### 3.6 Search Bar

```
┌─────────────────────────────────────┐
│  🔍  Buscar fragancias...     [✕]  │
└─────────────────────────────────────┘

├── Usa átomo Input (variant: search)
├── Fill: semantic/bg/surface (cream-100)
├── Radius: 12px
├── Icon left: Search (cream-500)
├── Clear button right: X (cream-500), solo si hay texto
├── Height: 44px
```

---

## PASO 4: ORGANISMOS — Secciones completas (~2h)

### 4.1 App Header

```
┌──────────────────────────────────────┐
│  spritz.    📍 Madrid    ⚙ settings │
└──────────────────────────────────────┘

├── Height: 56px
├── Padding: 0 20px
├── Logo left: "spritz." text (Plus Jakarta Sans Semibold 18px)
│   con el dot en terracotta
├── Location center: Body/sm con Lucide MapPin
├── Settings right: Lucide Settings icon
├── Fill: transparent (se funde con bg/page)
```

---

### 4.2 Bottom Navigation Bar

```
┌──────────────────────────────────────┐
│  Today  Wardrobe  [+]  Discover  Me │
│   🏠      👔      ➕     🧭     👤  │
└──────────────────────────────────────┘

├── Height: 80px (incluyendo safe area bottom)
├── Padding: 8px 0 34px 0 (34px = safe area iPhone)
├── Fill: semantic/bg/card (white)
├── Border top: 0.5px semantic/border/subtle
├── 5 Nav Items en row, cada uno fill (1/5)
├── El botón central [+] es especial:
│   ├── Circle 48px
│   ├── Fill: accent/primary (terracotta)
│   ├── Icon: Plus (white, 24px)
│   └── Elevation: Shadow/md
```

---

### 4.3 Wardrobe Grid

```
┌──────────────────────────────────────┐
│  Mi colección (24)     [Grid][List]  │  Header con count + view toggle
│                                      │
│  [🔍 Buscar fragancias...]          │  Search bar molecule
│                                      │
│  [Woody] [Fresh] [All] [Floral]     │  Horizontal scroll de filter tags
│                                      │
│  ┌────────┐  ┌────────┐             │
│  │ Card 1 │  │ Card 2 │             │  Grid: 2 columnas
│  │compact │  │compact │             │  Gap: 12px
│  └────────┘  └────────┘             │  Padding: 20px horizontal
│  ┌────────┐  ┌────────┐             │
│  │ Card 3 │  │ Card 4 │             │
│  └────────┘  └────────┘             │
└──────────────────────────────────────┘
```

---

### 4.4 Today's Pick Section

Combina: App Header + Recommendation Card + Quick Stats

```
┌──────────────────────────────────────┐
│  [App Header]                        │
│                                      │
│  [Recommendation Card]               │  Molecule 3.2, full width
│                                      │
│  Últimas usadas                      │  Section title
│  ┌────┐ ┌────┐ ┌────┐              │  Horizontal scroll
│  │Mini│ │Mini│ │Mini│              │  de fragrance cards mini
│  └────┘ └────┘ └────┘              │
│                                      │
│  [Bottom Nav Bar]                    │
└──────────────────────────────────────┘
```

---

## PASO 5: TEMPLATES Y PANTALLAS

### Frame setup
```
Mobile frame: 393 × 852 (iPhone 15 Pro)
├── Fill: semantic/bg/page (cream-50)
├── Clip contents: true
└── Auto Layout vertical, gap 0
```

### Pantallas a construir (por prioridad):

```
PRIORIDAD 1 (core loop):
  1. Today's Pick (home)
  2. Wardrobe (grid)
  3. Fragrance Detail

PRIORIDAD 2 (add + log):
  4. Add Fragrance (search + form)
  5. Wear Log (calendar)

PRIORIDAD 3 (secondary):
  6. Discover
  7. Profile / Settings
  8. Onboarding
```

---

## TIPS FIGMA

### Auto Layout checklist por componente:
- [ ] Direction correcta (H o V)
- [ ] Padding con variables de spacing
- [ ] Gap con variables de spacing
- [ ] Sizing correcto (Hug vs Fill vs Fixed)
- [ ] Todos los colores linkeados a variables
- [ ] Todos los textos con Text Styles
- [ ] Responsive: probar en 375px y 430px

### Naming convention:
```
Atoms/Button/Primary/MD
Atoms/Input/Text/Default
Atoms/Tag/Scent/Woody/SM
Molecules/Fragrance Card/Compact
Molecules/Recommendation Card
Organisms/Bottom Nav
Templates/App Shell
Pages/Today
```

### Componente reutilizable checklist:
- [ ] ¿Tiene component properties? (variant, boolean, text)
- [ ] ¿Funciona con Auto Layout resize?
- [ ] ¿Los colores usan variables semánticas?
- [ ] ¿Funciona al cambiar Scent Mode del padre?
- [ ] ¿Tiene estados? (default, hover, active, disabled)
