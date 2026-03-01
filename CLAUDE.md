# CLAUDE.md - auklm Project Conventions

## Tech Stack

- **Framework**: Nuxt 4 (SSR, Composition API, `<script setup>`)
- **Styling**: Tailwind CSS 3 (`@nuxtjs/tailwindcss`) + CSS variables in `main.css`
- **Auth**: Better Auth (email OTP via Resend)
- **Database**: Turso (libSQL) + Drizzle ORM
- **PWA**: `@vite-pwa/nuxt` (standalone, iOS safe areas)
- **Package Manager**: npm

## Commands

| Command         | Purpose              |
| --------------- | -------------------- |
| `npm run dev`   | Start local dev      |
| `npm run build` | Production build     |

## Auto-Imports

Nuxt auto-imports from `composables/`, `utils/`, and Vue APIs. No explicit imports needed in `.vue` files for:

- **Vue**: `ref`, `computed`, `watch`, `onMounted`, etc.
- **Nuxt**: `navigateTo`, `definePageMeta`, `useRuntimeConfig`, `useState`
- **Project**: `useCycle`, `useOnboarding`, `useToast`, `MONTHS_FULL`, `capitalize`, `getToday`

## File Organization

```
app/
  assets/css/     Global CSS (main.css with variables, animations, utilities)
  components/     Reusable UI (GouttyMascot, CycleCalendar, CycleHistory, AppToast)
  composables/    Vue composables (useCycle, useOnboarding, useToast)
  middleware/     Route middleware (auth.global.ts)
  pages/          File-based routing (index, login, onboarding, history, account)
  utils/          Pure utilities (months.ts, auth-client.ts)
server/
  api/            API routes (dates/, auth/)
  db/             Drizzle schema + migrations
  utils/          Server utilities (auth.ts, db.ts, rate-limit.ts)
```

## Script Setup Order

In `<script setup>`, follow this order:

1. `definePageMeta` / `defineProps` / `defineEmits`
2. Types / interfaces
3. Composables / stores
4. Refs / reactive state
5. Constants
6. Computed
7. Functions
8. Watch
9. Lifecycle hooks (`onMounted`, `onUnmounted`, etc.)

## Naming Conventions

- **Booleans**: `is` or `has` prefix (`isLate`, `hasPredictions`, `isDateValid`)
- **Composables**: `use*` prefix (`useCycle`, `useOnboarding`)
- **Constants**: SCREAMING_SNAKE_CASE (`MONTHS_FULL`, `MONTHS_SHORT`)

## Styling

- Prefer **Tailwind inline classes** for layout, spacing, typography, colors
- Use **scoped CSS** only for: animations (`@keyframes`), complex transitions, radial gradients, vendor prefixes
- Design tokens in `tailwind.config.ts`: `accent`, `warm-rose`, `lilac`, `text-primary`, `text-secondary`, `text-muted`
- CSS variables available in `main.css`: `--font-heading`, `--gradient-accent`, `--radius-*`, `--space-*`, `--ease-out`

## Environment Variables

| Variable                | Description            |
| ----------------------- | ---------------------- |
| `NUXT_TURSO_DATABASE_URL` | Turso database URL   |
| `NUXT_TURSO_AUTH_TOKEN`   | Turso auth token     |
| `NUXT_RESEND_API_KEY`     | Resend API key       |
| `NUXT_BETTER_AUTH_SECRET` | Better Auth secret   |

Copy `.env.example` to `.env` and fill in the values.

## App Language

The app UI is in **French**. All user-facing strings are in French, without accents (`e` not `é`).
