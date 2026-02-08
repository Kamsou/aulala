# Ausan

Menstrual cycle tracking app. Built for personal use, designed to scale.

## Stack

- **Nuxt 4** — Vue framework with SSR, file-based routing, server API routes
- **Turso** — Distributed SQLite database (libSQL)
- **Drizzle ORM** — Type-safe SQL queries and schema management
- **Better Auth** — Authentication with magic link (passwordless email login)
- **PWA** — Installable, works offline via service worker

## Features

- Record period start dates on a calendar
- Cycle length estimation based on recorded dates
- Next period prediction with confidence level
- Late period detection
- Per-user data isolation (each account sees only their own data)
- Magic link login (no password)

## Setup

### Prerequisites

- Node.js 20+
- A Turso account ([turso.tech](https://turso.tech))

### 1. Install dependencies

```bash
npm install
```

### 2. Create the database

```bash
turso db create ausan
turso db show ausan --url       # copy the URL
turso db tokens create ausan    # copy the token
```

### 3. Configure environment

```bash
cp .env.example .env
```

Fill in `.env`:

```
NUXT_TURSO_DATABASE_URL=libsql://ausan-xxx.turso.io
NUXT_TURSO_AUTH_TOKEN=eyJ...
NUXT_BETTER_AUTH_SECRET=<run: openssl rand -base64 32>
BETTER_AUTH_URL=http://localhost:3000
```

### 4. Push the database schema

```bash
npx drizzle-kit push
```

### 5. Run

```bash
npm run dev
```

The app redirects to `/login`. Enter an email — the magic link URL is printed in the server console (no email provider configured yet).

## Project structure

```
app/
  components/        UI components (calendar, dashboard, history)
  composables/       useCycle — cycle logic, predictions, API calls
  middleware/         Auth guard (redirects to /login if not authenticated)
  pages/             index (main app), login (magic link form)
  utils/             Better Auth client
server/
  api/auth/          Better Auth catch-all handler
  api/dates/         CRUD endpoints for period dates
  db/schema.ts       Drizzle schema (users, sessions, period_dates)
  utils/             Database and auth singletons
```

## Database schema

Better Auth manages `user`, `session`, `account`, and `verification` tables.

The app adds one table:

| Column     | Type    | Description            |
|------------|---------|------------------------|
| id         | integer | Auto-increment primary key |
| user_id    | text    | Foreign key to user.id |
| date       | text    | Period date (YYYY-MM-DD) |
| created_at | text    | Timestamp              |

All queries filter by `user_id` from the authenticated session.

## Scripts

```bash
npm run dev          # Start dev server
npm run build        # Production build
npx drizzle-kit push # Apply schema changes to database
```

## Production

Set `BETTER_AUTH_URL` to your production URL. Configure a real email provider in `server/utils/auth.ts` (replace the `console.log` in `sendMagicLink` with Resend, Mailgun, or similar).
