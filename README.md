# Draftly — AI Content Assistant

A full-stack app where an authenticated user generates AI-powered content,
saves it, and revisits their history. Built with **Next.js 16 (App Router)**,
**Supabase** (Auth + Postgres), **Drizzle ORM**, and the **OpenAI API**.

- **What it does & acceptance criteria:** [`spec/1.0-foundation.md`](./spec/1.0-foundation.md)
- **How it's built & why:** [`ARCHITECTURE.md`](./ARCHITECTURE.md)

## Features

- Email/password auth (Supabase Auth) with protected routes and client-side
  credential validation
- Generate content by **type**, **tone**, and **topic** via OpenAI
- Save results and browse a per-user **history** (newest first)
- Open any saved draft in a **modal** to read it in full, and **delete** drafts
  with a confirmation step
- Dark / light mode (persisted, no flash), copy-to-clipboard, export to `.txt`
- End-to-end type safety, Zod validation, and consistent API error responses

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router) + React 19, TypeScript |
| Styling | Tailwind CSS v4 |
| Auth | Supabase Auth (`@supabase/ssr`) |
| Database | Supabase Postgres via Drizzle ORM + `drizzle-kit` |
| AI | OpenAI Chat Completions |
| Validation | Zod |

## Prerequisites

- **Node.js 20.9+** (required by Next.js 16) and npm
- A free [Supabase](https://supabase.com) project
- An [OpenAI API key](https://platform.openai.com/api-keys) with billing enabled

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Supabase project and collect credentials

From your Supabase project dashboard:

- **Project Settings → API**
  - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
  - `Publishable key` (`sb_publishable_...`, the modern replacement for the
    legacy anon key) → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- **Project Settings → Database → Connection string → "Session" (pooler)**
  - The full URI → `DATABASE_URL` (replace `[YOUR-PASSWORD]` with your DB password)

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL="https://<ref>.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="sb_publishable_..."
DATABASE_URL="postgresql://postgres.<ref>:<password>@<region>.pooler.supabase.com:5432/postgres"
OPENAI_API_KEY="sk-..."
OPENAI_MODEL="gpt-4o-mini"   # optional, this is the default
```

> `.env.local` is gitignored — never commit real secrets. `.env.example` is the
> template that stays in version control.

### 4. Create the database tables

The SQL migration is already generated in `drizzle/`. Apply it to Supabase:

```bash
npm run db:migrate
```

This creates the `profiles` and `contents` tables. Profile rows are created
automatically by the app the first time a user saves content, so there is no
extra SQL to run by hand.

To regenerate after changing `src/db/schema.ts`:

```bash
npm run db:generate   # writes a new SQL file to drizzle/
npm run db:migrate    # applies it
```

### 5. (Optional) Disable email confirmation for quick testing

**Supabase → Authentication → Providers → Email**: turn off "Confirm email" so
sign-up logs you straight in. (Leave it on for production.)

### 6. Run the app

```bash
npm run dev
```

Open http://localhost:3000 — you'll be redirected to `/login`.

## Usage

1. **Register** at `/register`, then sign in.
2. On the dashboard, pick a **Content Type** and **Tone**, enter a **Topic**,
   and click **Generate**.
3. Review the result — **Copy**, **Export**, **Save to history**, or **Discard**.
4. Saved items appear instantly in **History** and persist across reloads.
5. **Click any history card** to read the full draft in a modal (Copy/Export are
   available inside too). Use the **🗑 delete** button — on the card or in the
   modal — to remove a draft after confirming.
6. Toggle **dark/light** from the header; **Sign out** to end the session.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run db:generate` | Generate SQL migrations from the schema |
| `npm run db:migrate` | Apply migrations to the database |
| `npm run db:studio` | Open Drizzle Studio |

## Deployment (Vercel)

1. Push the repo to GitHub and import it in Vercel.
2. Add the four env vars from `.env.local` to the Vercel project settings.
3. Ensure the database has been migrated (`npm run db:migrate`).
4. Deploy, then in **Supabase → Authentication → URL Configuration** set the
   **Site URL** to your deployment URL and add it (plus `http://localhost:3000`)
   to **Redirect URLs**, so confirmation/redirect links resolve correctly.

> **Email confirmation in production:** Supabase's built-in email sender is
> rate-limited (a few messages/hour) and meant only for testing. For real
> signups, either turn off "Confirm email" (Authentication → Providers → Email)
> or configure **custom SMTP** (e.g. Resend) and raise the email rate limit.

## Project structure

See [`ARCHITECTURE.md`](./ARCHITECTURE.md#6-project-structure) for the full tree
and rationale.
