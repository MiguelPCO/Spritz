# Spritz — Design Brief v1.0

> El armario inteligente para tus fragancias. Sabe qué ponerte hoy.

---

## 1. Problem statement

Los entusiastas de fragancias acumulan colecciones de 10-50+ perfumes pero no tienen una herramienta que les ayude a decidir cuál usar cada día. La decisión depende de múltiples factores simultáneos — clima, ocasión, hora del día, estado de ánimo, estación — y actualmente se resuelve con intuición, spreadsheets de Google, o preguntando en Reddit/TikTok.

**Las apps existentes resuelven solo la mitad del problema:**
- **Parfumo/Fragrantica** → Catálogos enciclopédicos con colección, pero sin recomendación contextual
- **Perfumist** → Recomendación por perfil de gusto, pero no por contexto del momento
- **WhatScent** → Contenido sobre clima/estación, pero es un magazine, no herramienta de decisión
- **Aromoshelf** → Organizador con estantes custom, pero sin inteligencia

**Nadie ocupa el cuadrante: colección personal robusta + recomendación contextual inteligente.**

---

## 2. Target user — Persona primaria

**Nombre:** Alex, 26 años
**Ocupación:** Profesional joven, le importa su imagen personal
**Colección:** 12-25 fragancias (mix de diseñador y nicho)
**Comportamiento:**
- Cada mañana piensa "¿qué me pongo hoy?" mirando su estante
- Consulta el clima en su móvil antes de elegir
- Tiene fragancias "de oficina", "de cita", "de fin de semana"
- Sigue fragrance YouTubers y participa en r/fragrance
- Compra 3-5 fragancias nuevas al año
- Le frustra no rotar bien su colección (siempre usa las mismas 3-4)

**Necesidades:**
- Saber qué fragancia de SU colección es mejor para HOY
- Descubrir fragancias nuevas que complementen lo que ya tiene
- Llevar registro de qué usa y cuándo
- No sobre-pensar la decisión cada mañana

---

## 3. Propuesta de valor

**Spritz es el armario inteligente de fragancias que sabe qué ponerte hoy.**

Combina tu colección personal con datos de clima real, ocasión, hora y estado de ánimo para recomendarte la fragancia perfecta de TU colección cada día. No es un catálogo enciclopédico — es tu asistente personal de fragancias.

### Diferenciadores clave
1. **Recomendación contextual:** No recomienda "perfumes populares" — recomienda de TU colección basándose en el momento
2. **Clima real:** Integración con Weather API para adaptar la recomendación a la temperatura y humedad actual
3. **Visual-first:** La experiencia es visual y rápida, no una base de datos con texto
4. **Smart rotation:** Detecta qué fragancias tienes abandonadas y las sugiere

---

## 4. Core features — MVP

### 4.1 Mi colección (Wardrobe)
- Agregar fragancias (búsqueda en base de datos + manual)
- Foto del frasco, nombre, marca, notas olfativas
- Tags personales: ocasión, estación, día/noche, mood
- Estado: activa, casi vacía, wishlist, vendida
- Vista grid visual (fotos de frascos) y vista lista

### 4.2 Recomendación diaria (Today's Pick)
- Al abrir la app: "Hoy te recomiendo X"
- Factores: clima actual (API), hora del día, día de semana vs weekend
- El usuario puede: aceptar, pedir otra, indicar ocasión específica
- Explica brevemente por qué recomienda esa (ej: "30°C hoy, fresca y ligera")
- IA para motor de recomendación (OpenAI/Claude API)

### 4.3 Descubrimiento (Discover)
- "Basado en tu colección, te podría gustar..."
- Fragancias trending en la comunidad
- Wishlist personal

### 4.4 Registro de uso (Wear Log)
- Un tap para registrar "hoy uso X"
- Historial visual: calendario de qué usaste cada día
- Stats: más usada, menos usada, días sin usar X

---

## 5. Features futuras (post-MVP)

- Social: compartir colección, ver qué usa la comunidad hoy (SOTD feed)
- Dupes & alternativas: "Tu Aventus se parece a estos más baratos"
- Layering suggestions: combinaciones de 2 fragancias
- Seasonal wardrobe: auto-organizar colección por estación
- Barcode/NFC scan para agregar fragancias rápido
- Integración con tiendas para comprar desde la app
- Fragrance DNA profile: tu perfil olfativo basado en tu colección

---

## 6. Dirección visual

### Concepto: "Clean canvas con explosiones de color contextual"

**Base:** Limpia, minimal, whitespace generoso — la colección es la protagonista
**Acentos:** Color que cambia según contexto:
- Cálidos (ambar, coral) cuando recomienda fragancias warm/spicy
- Frescos (teal, blue) cuando recomienda fragancias frescas/acuáticas
- Florales (pink, purple) para fragancias florales
- Verdes (green) para fragancias aromáticas/herbal

**Referencia visual:**
- La limpieza de Apple (espaciado, tipografía)
- El color contextual de Spotify (paleta adapta al contenido)
- La elegancia editorial de Aesop (tipografía serif para títulos)
- Las micro-animaciones de Linear (transiciones fluidas)

### Tipografía
- Display/Títulos: Serif moderna (Playfair Display, Fraunces, o similar)
- Body/UI: Sans-serif limpia (Inter, Satoshi, o similar)
- Contraste serif + sans = elegancia + funcionalidad

### Fotografía
- Frascos de perfume son el hero visual
- Fondo limpio o gradiente sutil
- Las fotos del usuario son el contenido principal

---

## 7. Tech stack

| Capa | Tecnología | Razón |
|------|-----------|-------|
| Framework | Next.js 15 (App Router) | SSR, RSC, performance |
| Styling | Tailwind CSS v4 | CSS-first, utility, design tokens |
| UI Components | Shadcn UI + Aceternity UI | Accesible + visual impact |
| Animaciones | GSAP + ScrollTrigger | Landing page, scrollytelling |
| UI Transitions | Motion.dev (Framer Motion) | Enter/exit, layout animations |
| State | Zustand | Client state ligero |
| Server State | TanStack Query v5 | Cache, revalidación |
| Backend | Supabase | Auth, PostgreSQL, Storage, Realtime |
| AI | OpenAI/Claude API | Motor de recomendación |
| Weather | OpenWeather API | Clima real para recomendaciones |
| Deployment | Vercel | Integración nativa Next.js |
| Design | Figma | Design system, prototipos |

---

## 8. Estructura de páginas (sitemap)

```
/ .......................... Landing page (marketing, GSAP animations)
/app
  /today .................. Recomendación diaria (home de la app)
  /wardrobe ............... Mi colección (grid/list)
  /wardrobe/[id] ......... Detalle de fragancia
  /wardrobe/add ........... Agregar fragancia
  /discover ............... Descubrir nuevas fragancias
  /log .................... Historial de uso
  /profile ................ Perfil + settings
/auth
  /login .................. Autenticación
  /register ............... Registro
```

---

## 9. Design system — Tokens iniciales

### Colores (pendiente definir en Figma)
- **Brand primary:** Por definir — candidatos: ámbar dorado, negro + gold, teal oscuro
- **Semantic colors:** Success, Warning, Error, Info
- **Nota colors:** Palette que mapea familias olfativas a colores
  - Woody/Spicy → Amber/Warm brown
  - Fresh/Citrus → Teal/Light blue
  - Floral → Pink/Lavender
  - Oriental/Gourmand → Deep purple/Burgundy
  - Green/Aromatic → Sage/Forest green
  - Aquatic → Ocean blue

### Spacing scale
- 4px base, escala: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96

### Border radius
- Cards de fragancia: 16px (rounded, premium feel)
- Botones: 12px
- Inputs: 8px
- Pills/tags: full (999px)

### Shadows
- Subtle para cards, más pronunciada en hover
- Glass-morphism sutil para overlays de recomendación

---

## 10. Métricas de éxito

- **Engagement:** Usuario abre app ≥4 días/semana
- **Colección:** ≥5 fragancias agregadas en primera semana
- **Recomendación:** ≥60% de aceptación del "Today's Pick"
- **Retention:** 30-day retention ≥40%
- **Task success:** Agregar fragancia en <60 segundos

---

## 11. Restricciones y riesgos

| Riesgo | Mitigación |
|--------|-----------|
| No existe API pública de fragancias completa | Crear DB propia + permitir entrada manual |
| Recomendación IA puede sentirse genérica | Usar datos reales del usuario + feedback loop |
| Fotos de frascos varían en calidad | Ofrecer fotos default de la DB + custom del usuario |
| Competidores pueden copiar | El design + UX + AI contextual son el moat |

---

## Siguiente paso

→ **Diamante 2, fase Develop:** Crear design system en Figma, wireframes de las pantallas core, y prototipar el flujo principal "abrir app → ver recomendación → registrar uso".
