# CLAUDE.md — Spritz

## Coding Principles

1. **Think Before Coding** — Surface assumptions, tradeoffs, and ambiguity. Ask before picking silently.
2. **Simplicity First** — Minimum code that solves the problem. No speculative features, abstractions for single-use code, or impossible-scenario error handling.
3. **Surgical Changes** — Touch only what's needed. Match existing style. Don't "improve" adjacent code.
4. **Goal-Driven Execution** — Transform tasks into verifiable criteria. Plan multi-step tasks before starting.

---

## Project Overview

**Spritz** — AI-powered fragrance wardrobe & daily recommendation app.
**Live:** https://spritz-jet.vercel.app
**Repo:** https://github.com/MiguelPCO/Spritz (branch: `main`)

---

## Tech Stack

| Layer      | Tech                                             |
| ---------- | ------------------------------------------------ |
| Framework  | Next.js 16 App Router + React 19                 |
| Language   | TypeScript (strict)                              |
| Styling    | Tailwind CSS v4                                  |
| Auth & DB  | Supabase (PostgreSQL + RLS)                      |
| AI         | Anthropic Claude claude-haiku-4-5-20251001       |
| State      | Zustand + TanStack Query v5                      |
| UI         | Radix UI, Vaul (drawer), Sonner (toasts), Lucide |
| Animations | Motion, GSAP                                     |
| Deployment | Vercel                                           |

---

## Architecture

- **App Router** — `src/app/(auth)/` login/register, `src/app/(protected)/` all main routes
- **Server Actions** — `src/lib/actions/` for all DB mutations; use `revalidatePath` after writes
- **Supabase SSR** — cookie-based auth via `@supabase/ssr`; always `await createSupabaseServerClient()`
- **RLS active** — every table has `auth.uid() = user_id` policy; server actions enforce ownership too
- **Zustand stores** — `src/lib/stores/` for add-fragrance wizard draft and recommendation state
- **TanStack Query v5** — client-side data; invalidate with `queryClient.invalidateQueries`
- **AI singleton** — `src/lib/api/ai.ts` exports `anthropicClient` created once at module level
- **Search route** — `/api/fragrance-search` requires auth, 200-char limit, seed first then AI fallback

### Key patterns

- Server Components for initial data fetch → pass as props to Client Components
- `"use server"` actions for mutations; `"use client"` isolated to leaf interactive components
- Drawer components use Vaul (`import { Drawer } from "vaul"`)
- Scent families drive UI accent colors — `SCENT_FAMILIES` in `src/lib/constants/`

---

## Security (completed)

- `/api/fragrance-search` — requires auth session + 200-char query limit
- `logWear` — ownership check before insert (IDOR fix)
- `freeText` in AI prompt — sanitized via `sanitizeUserText()`
- `addToWardrobe` — atomic upsert on `external_id` (TOCTOU fix)
- `updateWishlistPositions` — throws on DB errors
- AI response validation — `validateAndNormalize()` used on both primary and fallback parse paths

### Pending security items

- `#8` — `/api/recommendations` accepts wardrobe from request body instead of fetching server-side
- `#9` — custom_name/brand from manual fragrances passed to AI prompt unsanitized (blocked by #8)

---

## Known Issues & Pending Improvements

### React/Performance

- **Inline components** (5 instances) — `NoteGroup` in `CatalogFragranceCard.tsx:21`, `ChipGroup` in `TagsStep.tsx:23` and `EditFragranceDrawer.tsx:39`, `NoteRow` in `NotesDisplay.tsx:13`, `TagGroup` in `PersonalTags.tsx:21` — extract to top-level
- **`<img>` tags** missing `width`/`height` — `CatalogFragranceCard.tsx:119`, `DailyFragranceCard.tsx:76`, `WishlistItem.tsx:75` — replace with Next.js `<Image>`

### Accessibility

- Icon-only buttons use `title` instead of `aria-label` — `DetailActions.tsx:64,73`, `WardrobeFilters.tsx:40`
- Search inputs missing associated `<label>` — `WardrobeFilters.tsx:27`, `ExternalSearch.tsx:74`
- `focus-visible` styles inconsistent on custom family/tag selector buttons

### SEO

- Missing `public/robots.txt` and `public/sitemap.xml`
- Protected routes have no metadata exports (intentional for auth-gated pages)
- `wardrobe/[id]/page.tsx` missing `generateMetadata` for dynamic fragrance titles

---

## Installed Skills (.agents/skills/)

| Skill                                               | Purpose                                      |
| --------------------------------------------------- | -------------------------------------------- |
| `next-best-practices`                               | RSC, caching, data fetching patterns         |
| `next-cache-components`                             | Cache boundaries and streaming               |
| `react-best-practices`                              | 70 rules: waterfalls, bundle, rerenders      |
| `vercel-composition-patterns`                       | Compound components, avoid boolean prop hell |
| `frontend-design`                                   | Production-grade UI, distinctive aesthetics  |
| `supabase-postgres-best-practices`                  | RLS, queries, schema                         |
| `typescript-advanced-types`                         | Strict TS patterns                           |
| `nodejs-best-practices` + `nodejs-backend-patterns` | API routes, server code                      |
| `gsap-core/react/scrolltrigger/performance/...`     | GSAP 8 skills for animations                 |
| `shadcn`                                            | shadcn/ui component patterns                 |
| `tailwind-css-patterns`                             | Tailwind v4 utilities                        |
| `accessibility`                                     | WCAG 2.2, POUR principles                    |
| `seo`                                               | Technical SEO, structured data, sitemaps     |
| `deploy-to-vercel`                                  | Vercel deployment workflow                   |

---

## DB Schema (key tables)

- `fragrances` — catalog, unique on `external_id`
- `user_fragrances` — user's collection; `fragrance_id` nullable (manual entries)
- `wear_logs` — wear history with weather, occasion, mood
- Enums: `fragrance_status` (`active|empty|wishlist|sold`)
- RLS: ALL commands on all tables require `auth.uid() = user_id`

---

## Supabase SQL Files

```
supabase/schema.sql                   # base schema
supabase/migration_custom_families.sql # custom_families column
```

---

## Gotchas

- `createSupabaseServerClient()` is async — always `await` it
- Zustand `useAddFragranceStore` draft persists across wizard steps — read from draft on component mount
- `sonner` toast library — import `toast` from `"sonner"`, not from any UI component
- GSAP in React — use `useGSAP()` hook from `@gsap/react`, clean up in return callback
- Tailwind v4 — no `tailwind.config.js`; uses CSS `@theme` block in globals.css
- Vaul drawer — use `Drawer.Root`, `Drawer.Portal`, `Drawer.Overlay`, `Drawer.Content`
