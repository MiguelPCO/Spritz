# Spritz — Design System Setup Guide (Figma)

## Overview

Este documento te guía paso a paso para crear el design system de Spritz en Figma,
siguiendo el framework de "The Brand Design System" (Atomic Design) adaptado al proyecto.

---

## Estructura del archivo Figma

```
📄 Spritz Design System
├── 📑 Cover (portada del proyecto)
├── 📑 Atoms: Variables & Styles
│   ├── Color primitives (colecciones)
│   ├── Color semantic (alias)
│   ├── Typography scale
│   ├── Spacing & radius
│   └── Shadows & effects
├── 📑 Atoms: Scent Palette
│   ├── Terracotta (woody/spicy)
│   ├── Teal (fresh/citrus)
│   ├── Rose (floral)
│   ├── Violet (oriental)
│   ├── Sage (green/aromatic)
│   └── Gold (amber/musk)
├── 📑 Molecules: Brand Identity
│   ├── Logo (all lockups)
│   ├── Spray particles motif
│   ├── Icon set
│   └── Art direction references
├── 📑 Molecules: UI Components
│   ├── Buttons (primary, secondary, accent, ghost)
│   ├── Inputs (text, search, select)
│   ├── Tags (scent family tags)
│   ├── Cards (fragrance card, recommendation card)
│   └── Bottom navigation
├── 📑 Organisms: Sections
│   ├── Header / Navigation
│   ├── Today's Pick (recommendation)
│   ├── Wardrobe Grid
│   ├── Fragrance Detail
│   └── Wear Log Calendar
├── 📑 Templates: Layouts
│   ├── App shell (mobile)
│   ├── Landing page (desktop)
│   └── Auth pages
├── 📑 Pages: Screens
│   ├── Today's Pick (home)
│   ├── Wardrobe (collection)
│   ├── Fragrance detail
│   ├── Add fragrance
│   ├── Discover
│   ├── Wear log
│   └── Profile
└── 📑 Brand Guidelines
    ├── Voice & tone
    ├── Do's and don'ts
    ├── Spray particles usage
    └── Color context rules
```

---

## Step 1: Variables — Color primitives

### Collection: "Primitive"
| Variable name         | Value     | Description            |
|-----------------------|-----------|------------------------|
| cream/50              | #FBF8F4   | Page background        |
| cream/100             | #F0EBE3   | Surface                |
| cream/200             | #E5E2DB   | Border subtle          |
| cream/300             | #D6D0C5   | Border default         |
| cream/500             | #A39E94   | Muted text             |
| cream/700             | #6B6760   | Secondary text         |
| cream/900             | #2D2926   | Primary text (Ink)     |
| terracotta/50-900     | (see tokens.json) | Woody/Spicy   |
| teal/50-900           | (see tokens.json) | Fresh/Citrus  |
| rose/50-900           | (see tokens.json) | Floral        |
| violet/50-900         | (see tokens.json) | Oriental      |
| sage/50-900           | (see tokens.json) | Green         |
| gold/50-900           | (see tokens.json) | Amber/Musk    |

### Collection: "Semantic"
| Variable name         | References           | Description         |
|-----------------------|----------------------|---------------------|
| bg/page               | {cream/50}           | Page background     |
| bg/surface            | {cream/100}          | Card surfaces       |
| bg/card               | #FFFFFF              | White card bg       |
| bg/inverse            | {cream/900}          | Dark sections       |
| text/primary          | {cream/900}          | Headlines, body     |
| text/secondary        | {cream/700}          | Supporting text     |
| text/muted            | {cream/500}          | Hints, captions     |
| text/inverse          | {cream/50}           | On dark bg          |
| border/subtle         | {cream/200}          | Default borders     |
| border/default        | {cream/300}          | Stronger borders    |
| accent/primary        | {terracotta/400}     | Brand accent        |
| accent/bg             | {terracotta/50}      | Accent surface      |

### Modes: "Scent Theme"
Configure these as modes within the Semantic collection.
Each mode overrides accent variables:

| Mode name  | accent/primary    | accent/bg         |
|------------|-------------------|--------------------|
| Woody      | terracotta/400    | terracotta/50      |
| Fresh      | teal/400          | teal/50            |
| Floral     | rose/400          | rose/50            |
| Oriental   | violet/400        | violet/50          |
| Green      | sage/400          | sage/50            |
| Amber      | gold/400          | gold/50            |

→ This way switching mode on a frame instantly re-themes
  the entire recommendation card to match the fragrance family.

---

## Step 2: Text Styles

| Style name      | Font              | Size | Weight | Line-height | Spacing  |
|-----------------|-------------------|------|--------|-------------|----------|
| Display/xl      | Plus Jakarta Sans | 48px | 600    | 1.2         | -0.02em  |
| Display/lg      | Plus Jakarta Sans | 36px | 600    | 1.2         | -0.02em  |
| Display/md      | Plus Jakarta Sans | 30px | 600    | 1.2         | -0.02em  |
| Heading/lg      | Plus Jakarta Sans | 24px | 600    | 1.2         | -0.02em  |
| Heading/md      | Plus Jakarta Sans | 20px | 600    | 1.35        | -0.02em  |
| Heading/sm      | Plus Jakarta Sans | 18px | 500    | 1.35        | -0.01em  |
| Body/lg         | DM Sans           | 18px | 400    | 1.5         | 0        |
| Body/base       | DM Sans           | 16px | 400    | 1.5         | 0        |
| Body/sm         | DM Sans           | 14px | 400    | 1.5         | 0        |
| Caption         | DM Sans           | 12px | 400    | 1.5         | 0        |
| Tag             | DM Sans           | 12px | 500    | 1           | 0.04em   |
| Overline        | DM Sans           | 11px | 500    | 1           | 0.08em   |

---

## Step 3: Effect Styles

| Style name     | Type        | Values                              |
|----------------|-------------|--------------------------------------|
| Shadow/sm      | Drop shadow | Y:1 Blur:2 Color:cream-900@6%      |
| Shadow/md      | Drop shadow | Y:4 Blur:12 Color:cream-900@8%     |
| Shadow/lg      | Drop shadow | Y:8 Blur:24 Color:cream-900@10%    |
| Shadow/glow    | Drop shadow | Blur:20 Color:terracotta-400@15%    |

---

## Step 4: Component Architecture

### Atoms (base components)
- **Button**: 3 variants (primary/secondary/accent) × 3 sizes (sm/md/lg)
  - Radius: 12px, padding: 12px 24px (md)
  - Use Auto Layout, hug contents
- **Input**: text, search (with icon), select
  - Radius: 12px, bg: cream-50, border: cream-300
- **Tag**: scent family tag (pill shape)
  - Radius: full (999px), padding: 4px 10px
  - 6 color variants matching scent palette
- **Icon**: use Lucide icon set (same as Shadcn UI)
- **Avatar/Bottle**: rounded square (12px radius)
  - 3 sizes: 40px, 56px, 80px

### Molecules (composed components)
- **Fragrance Card**: bottle image + name + brand + tags
  - Use component properties for variant/size
- **Recommendation Card**: greeting + title + reason + fragrance card + actions
  - Apply scent mode to change theme dynamically
- **Search Bar**: icon + input + clear button
- **Stat Card**: label + value + trend indicator
- **Nav Item**: icon + label, active/inactive states

### Organisms (sections)
- **App Header**: logo + location + settings
- **Bottom Nav**: 5 items (Today, Wardrobe, Add, Discover, Profile)
- **Wardrobe Grid**: responsive grid of fragrance cards
- **Wear Log**: calendar view with fragrance dots
- **Today's Pick Section**: full recommendation experience

---

## Step 5: Auto Layout Settings

| Component type    | Direction  | Padding     | Gap  | Sizing       |
|-------------------|-----------|-------------|------|--------------|
| Button            | Horizontal | 12px 24px   | 8px  | Hug          |
| Card              | Vertical   | 16px        | 12px | Fill width   |
| Tag               | Horizontal | 4px 10px    | 4px  | Hug          |
| Input             | Horizontal | 12px 16px   | 8px  | Fill width   |
| Section           | Vertical   | 24px        | 16px | Fill width   |
| Screen            | Vertical   | 0px         | 0px  | Fixed 393px  |

Frame size for mobile: **393 × 852** (iPhone 15 Pro)

---

## Step 6: Spray Particles System

The brand element (spray/mist dots) should be built as:

1. **Particle Component**: circle with opacity variants (0.3, 0.5, 0.7, 1.0)
   - 4 sizes: 3px, 5px, 8px, 12px
   - Color: accent/primary (changes with scent mode)

2. **Particle Cluster Component**: group of 5-8 particles
   - Used as background decoration
   - Placed with constraints: top-right corner, subtle

3. **Usage rules**:
   - Max 1 cluster per screen section
   - Always positioned in top-right or bottom-left corner
   - Low opacity (never above 0.15 for background use)
   - Animate in code with GSAP/Motion (scale + opacity stagger)

---

## Figma MCP — Commands to get started

With the Figma MCP connected, we can:
1. Create a new file from Claude
2. Search existing design system resources
3. Read variables and components from any shared file
4. Generate component specifications

---

## Export to Code

### Tokens Studio workflow:
1. Install Tokens Studio plugin in Figma
2. Import `spritz-tokens.json` into the plugin
3. Connect to GitHub repo for sync
4. Export → Style Dictionary transforms → Tailwind CSS v4

### Or manual:
1. Use `spritz-theme.css` directly as your Tailwind v4 theme
2. Import Google Fonts: Plus Jakarta Sans (400,500,600,700) + DM Sans (400,500)
3. All semantic variables are CSS custom properties ready to use

```bash
# In your Next.js project:
npm install @fontsource-variable/plus-jakarta-sans @fontsource/dm-sans
```
