# Architecture

How Draftly (an AI Content Assistant) is built and why. For scope and acceptance
criteria see [`spec/1.0-foundation.md`](./spec/1.0-foundation.md); for setup see
[`README.md`](./README.md).

## 1. High-level overview

A single **Next.js 16 (App Router)** application serves both the UI and the
API. There is no separate backend service — Route Handlers *are* the backend.

```
Browser (Client Components)
  │  fetch() via typed content-client
  ▼
Next.js Route Handlers  ── Zod validation ──► AI service (OpenAI)
  │                                              │
  │  Drizzle ORM (typed queries)                 ▼
  ▼                                         generated text
Supabase Postgres  (data)                Supabase Auth  (cookie sessions)
```

## 2. Key decisions & trade-offs

| Decision | Why | Trade-off |
| --- | --- | --- |
| **One Next.js app** for FE + API | Simplest deploy, shared types, less to break in 48h. | Backend scales with the frontend; fine at this size. |
| **Supabase Auth** (not dummy) | Real, secure sessions with minimal code; cookie-based SSR. | Adds an external dependency and env setup. |
| **Drizzle ORM** + `drizzle-kit` migrations | Type-safe schema and queries; SQL migrations are reviewable and versioned. | Auth tables stay Supabase-managed; we own `profiles`/`contents`. |
| **Two layers of route protection** (Proxy + per-route/page check) | Defence in depth: the proxy redirects unauthenticated users, and every route and the dashboard re-verify the session so nothing renders or returns data without a valid user. | Slight redundancy, intentionally. |
| **Provider-agnostic AI module** | Prompt building is isolated from the OpenAI call, so the model/provider can change without touching routes. | One indirection layer. |
| **Explicit save step** | Users generate freely; only deliberate results are stored, keeping history clean. | One extra click. |

## 3. Request flows

### Generate
1. `GenerationForm` submits `{ contentType, tone, topic }`.
2. `useContentGeneration` calls `POST /api/generate`.
3. The route authenticates the user, validates with Zod, then
   `buildContentPrompt()` → `generateContent()` (OpenAI).
4. Returns `{ output, prompt }`. Nothing is persisted yet.

### Save
1. User clicks **Save**; the last input + generated output are posted to
   `POST /api/content`.
2. The route validates, `ensureProfile()` guarantees the FK target exists,
   then inserts a `contents` row and returns it.
3. The hook prepends the saved record to the in-memory history — instant UI.

### History
`GET /api/content` returns the user's rows (newest first), read through the
`(user_id, created_at desc)` index.

## 4. Authentication & authorization
- **Sessions:** `@supabase/ssr` stores the session in cookies. `proxy.ts`
  (Next.js 16's renamed Middleware) refreshes it on every request and redirects
  unauthenticated users away from protected routes.
- **Per-request check:** every API route and the dashboard page call
  `getAuthenticatedUser()`, which uses `supabase.auth.getUser()` to *verify* the
  token rather than trusting the cookie.
- **Data isolation:** every content query is scoped in application code to the
  authenticated user's id (`where user_id = <session user>`). That id comes from
  the verified session, never from client input, so a user can only ever read or
  write their own rows.
- **Profiles:** a `profiles` row is created on demand the first time a user saves
  content (`ensureProfile`, idempotent), so the `contents` foreign key is always
  valid — no database trigger required.

### Login feedback vs. email enumeration (a deliberate trade-off)
Supabase returns an identical `invalid_credentials` error for both a wrong
password and a non-existent email — intentional protection against **email
enumeration**. To give first-time users a helpful "no account — create one"
message (instead of a dead end), the login form calls
`POST /api/auth/account-exists`, which checks `auth.users` via the existing
`DATABASE_URL`. This reintroduces an enumeration oracle (someone can learn which
emails are registered). Accepted here because the data is low-sensitivity and
the UX gain is significant. **Production mitigation:** put a shared-store rate
limit (e.g. Upstash) in front of that endpoint — an in-memory limiter is
useless on serverless, so it was deliberately left out.

## 5. Validation & error handling
- **Zod** schemas in `lib/validation` are the single source of truth for input
  shape, shared by the generate and save endpoints.
- All API responses use one envelope (`lib/api/api-response.ts`): `{ data }` on
  success, `{ error: { code, message, fields? } }` on failure, with codes mapped
  to HTTP status.
- The browser client throws a typed `ApiRequestError`; the generation hook maps
  `VALIDATION_ERROR` to per-field messages and everything else to a banner.
- AI failures are wrapped in `AiProviderError` → surfaced as a retryable 502.

## 6. Project structure

```
src/
  app/
    (auth)/{login,register}/     # public auth screens
    (dashboard)/dashboard/       # protected page (server component)
    api/
      generate/                  # POST — generate content (auth required)
      content/                   # POST save + GET history (auth required)
      auth/account-exists/       # POST — public sign-in UX helper
  components/{ui,auth,dashboard,theme}/   # reusable, presentational-first
  hooks/                         # generation & history state
  db/                            # Drizzle schema, client, queries
  lib/{ai,api,auth,validation,supabase,constants,utils}/
  proxy.ts                       # session refresh + route guards
drizzle/                         # generated SQL migrations
```

## 7. Conventions
- Files `kebab-case`; components `PascalCase`; functions/vars verb-first
  `camelCase`; DB identifiers `snake_case`.
- Every file is single-responsibility and under **250 LOC**.
- Constants (content types/tones) are defined once and drive both validation
  and UI, so the two can never drift apart.
