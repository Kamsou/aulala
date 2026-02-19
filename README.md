# auklm

Menstrual cycle tracking app.

## Stack

- **Nuxt 4** — Vue framework with SSR, file-based routing, server API routes
- **Turso** — Distributed SQLite database (libSQL)
- **Drizzle ORM** — Type-safe SQL queries and schema management
- **Better Auth** — Authentication with magic link (passwordless email login)
- **Resend** — Transactional emails for magic link login
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
turso db create auklm
turso db show auklm --url       # copy the URL
turso db tokens create auklm    # copy the token
```

### 3. Configure environment

```bash
cp .env.example .env
```

Fill in `.env`:

```
NUXT_TURSO_DATABASE_URL=libsql://auklm-xxx.turso.io
NUXT_TURSO_AUTH_TOKEN=eyJ...
NUXT_BETTER_AUTH_SECRET=<run: openssl rand -base64 32>
NUXT_RESEND_API_KEY=re_...
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

The app redirects to `/login`. Enter an email — in dev, the magic link URL is printed in the server console. In production, emails are sent via Resend.

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

Set `BETTER_AUTH_URL` to your production URL and `NUXT_RESEND_API_KEY` to your Resend API key. Emails are sent via Resend in production (dev mode prints magic links to the console).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
