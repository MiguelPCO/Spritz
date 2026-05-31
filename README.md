# Spritz 🌸

**AI-powered fragrance wardrobe & daily recommendation app.**

Spritz helps you manage your perfume collection and get personalized fragrance recommendations based on the weather, your mood, and the occasion — powered by Claude AI.

**Live demo:** [spritz-jet.vercel.app](https://spritz-jet.vercel.app)

---

## Features

- **Smart search** — find fragrances from a catalog of 230+ entries across 14 olfactory families, with AI fallback for niche picks
- **Wardrobe management** — add fragrances manually or from the catalog; multi-family tags, personal notes, photos, and status tracking
- **Daily AI recommendation** — Claude selects the best fragrance from your wardrobe based on real-time weather, time of day, occasion, mood, and freetext context
- **Wear log** — track what you wear and when; calendar view with monthly stats
- **Discover** — cross-recommendations from your collection and wishlist management
- **Scent-adaptive theming** — UI accent colors shift based on the active fragrance family
- **14 olfactory families** — Fresh, Floral, Oriental, Woody, Green, Amber, Citrus, Fougère, Chypre, Gourmand, Aromatic, Aquatic, Fruity, Leather

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 App Router + React 19 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Auth & DB | Supabase (PostgreSQL + RLS) |
| AI | Anthropic Claude claude-haiku-4-5-20251001 |
| State | Zustand + TanStack Query v5 |
| UI | Radix UI, Vaul, Sonner, Lucide |
| Animations | Motion, GSAP |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- A [Supabase](https://supabase.com) project
- An [Anthropic](https://console.anthropic.com) API key
- An [OpenWeather](https://openweathermap.org/api) API key (free tier)

### Installation

```bash
git clone https://github.com/MiguelPCO/Spritz.git
cd Spritz
pnpm install
```

### Environment variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

OPENWEATHER_API_KEY=your-openweather-key
ANTHROPIC_API_KEY=sk-ant-...

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Database setup

Run the schema in your Supabase SQL editor:

```bash
# Apply base schema
supabase/schema.sql

# Apply migration (custom_families column)
supabase/migration_custom_families.sql
```

### Run locally

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login, register pages
│   ├── (protected)/     # Today, Wardrobe, Discover, Log, Profile, Add
│   └── api/             # fragrance-search, recommendations, weather
├── components/
│   ├── features/        # Feature-specific components (wardrobe, today, add…)
│   ├── layout/          # AppShell, TopBar, BottomNav
│   └── ui/              # Shared primitives
├── lib/
│   ├── actions/         # Server actions (fragrance, wear, profile)
│   ├── api/             # AI client, parfumo search, weather
│   ├── constants/       # Scent families, occasions, moods, query keys
│   ├── hooks/           # useWardrobe, useWeather, useRecommendation…
│   └── stores/          # Zustand stores (addFragrance, recommendation)
├── types/               # Database types, fragrance, recommendation
└── supabase/            # Schema SQL + migrations
```

---

## How the AI recommendation works

1. User selects occasion(s), mood(s), and optional free-text context
2. App sends wardrobe + weather + time-of-day to `/api/recommendations`
3. Claude haiku scores each fragrance against the context and returns the best match with a reason
4. If Claude is unavailable, a rule-based fallback scores fragrances by temperature, time, family, and tag matches

---

## Deployment

The app is deployed on Vercel with automatic deploys from the `main` branch.

Required environment variables on Vercel (same as `.env.example`). After deploying, update the Supabase Auth **Site URL** and **Redirect URLs** to your production domain:

**Supabase → Authentication → URL Configuration**
- Site URL: `https://your-domain.vercel.app`
- Redirect URLs: `https://your-domain.vercel.app/**`

---

## License

MIT
