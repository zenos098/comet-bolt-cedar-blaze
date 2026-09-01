# Looply — project context for Antigravity

Read this first. It is the source of truth for what this repo is, what works, and what must not be rewritten blindly.

**Product name:** Looply (never Scalio).  
**Tagline:** Run marketing 24/7.  
**One-liner:** AI marketing partner for independent shops. Owner approves; studio generates; credits meter every generation.

Not affiliated with Scalio. Support copy: support@looply.app.

---

## 1. What this app is

Looply is a working SaaS demo for D2C / fashion / local businesses (India + English/Hindi).

Flow:

1. Owner saves a **brand kit** once (name, city, industry, products, offer, tone, language, colors, audience).
2. Studio tools generate posts, stills, Reels storyboards, ads, calendar, inbox replies, website copy — **from that kit**, not a blank prompt.
3. Owner **approves** and **publishes** to Instagram / Facebook / Google Business / WhatsApp.
4. Posts go live on a public **shop board** (`/live/{slug}`). Scheduled items auto-post when due.

Demo shop already seeded: **Nimrah Atelier**, boutique fashion, Delhi.

```
Login:  demo@looply.app
Pass:   demo1234
Plan:   growth
Brand:  Nimrah Atelier
Live:   /live/nimrah-atelier
```

Demo offer: *New linen drop + free hemming this week.*  
Products: linen sets, kurtas, silk shirts.  
Colors: ivory, forest green, warm gold.  
Language: English + Hindi. Tone: warm confident.  
Two sample inbox messages ship with the store.

---

## 2. Stack (important — do not assume Next.js)

The original product spec asked for Next.js 14 App Router. **This codebase is not Next.js.** It was built in a Grok App Builder sandbox that ships **TanStack Start**.

| Layer | Actual |
| --- | --- |
| Framework | TanStack Start v1.168 + TanStack Router (file routes) |
| UI | React 19, TypeScript |
| CSS | Tailwind CSS v4 (`@theme` in `src/styles.css`) |
| Bundler | Vite 8 + Nitro (Vercel preset) |
| Persistence | JSON file `data/store.json` via `fs` — **no Postgres in the product** |
| Auth | Custom scrypt + HMAC cookie `looply_session` in `src/lib/looply-auth.ts` |
| Copy AI | xAI `grok-4.5` via Node `https` (not `fetch`), Pollinations fallback, then local template |
| Images | `https://image.pollinations.ai/prompt/{encoded}?width=&height=&nologo=true&enhance=true&seed=` |
| Payments | None. Choosing a plan **adds credits** only |

**Do not migrate to Next.js unless the user asks.** The app is complete on TanStack Start.

Run:

```bash
npm install
npm run dev          # Vite, 0.0.0.0:8080 in this sandbox
npm run typecheck
npm run build
```

Required env (server-only, never `VITE_`):

- `XAI_API_KEY` — used in `src/lib/ai.ts` for Grok copy. If missing, Pollinations then local fallback still work.

No `.env` file is checked in. Do not create one with secrets in the repo.

---

## 3. What is actually working (verified)

These are real, not mock screens.

### Marketing site
- `/` cinematic landing (hero, ticker, features, plans, CTA, footer)
- `/pricing` — Start / Growth / Pro; logged-in “Choose plan” **adds credits**, no Stripe
- `/examples`, `/contact`, `/login`, `/signup`
- Login title: “AI Creative Studio”. Signup → `/studio/onboarding`. Login → `/studio`

### Auth
- `POST /api/auth/signup` — free plan, 20 credits, sets cookie
- `POST /api/auth/login` — sets cookie
- `POST /api/auth/logout` — clears cookie
- `GET /api/me` — `{ user, brand }` or 401
- Demo login **bypasses hash** for `demo@looply.app` / `demo1234`
- New users hashed with scrypt (`salt:hash`)
- Session: HMAC-SHA256, httpOnly, SameSite=Lax, 14 days, cookie name `looply_session`
- Studio layout fetches `/api/me`; 401 redirects to `/login`

### Brand kit
- `POST /api/brand` upserts the kit
- `/studio/onboarding` form: businessName, website, industry, city, language, tone, audience, offer, products, colors
- Every generate route injects this kit into the prompt via `brandContext()` / `writerSystem()`
- UI shows “Writing as this shop” chips (`BrandKit`)

### Generation tools (credits deducted, saved to store)

| Tool | Route | API | Cost | Output |
| --- | --- | --- | --- | --- |
| Posts | `/studio/posts` | `POST /api/generate/post` | 1 | caption + hashtags + 1024² still |
| Shoot | `/studio/shoot` | `POST /api/generate/image` | 1 | 1024×1280 still |
| Reels | `/studio/reels` | `POST /api/generate/reel` | 4 | title, hook, 4 beats, voiceover, caption, four 720×1280 stills |
| Ads | `/studio/ads` | `POST /api/generate/ad` | 2 | headline + primary + CTA + 1080² still |
| Calendar | `/studio/calendar` | `POST /api/generate/calendar` | 3 | 5–14 scheduled draft posts |
| Inbox | `/studio/inbox` | `POST /api/generate/reply` | 1 | draft reply, saved on the message |
| Website | `/studio/website` | `POST /api/generate/website` | 5 | HERO/ABOUT/OFFER/PROOF/VISIT/CTA + hero still |

Copy is **brand-specific**. Verified example (Grok, Nimrah Atelier): named the atelier, Delhi, ivory linen set size M, free hemming, and a Hindi line. Not a generic fashion caption.

`402` if not enough credits (`CreditError` in `src/lib/spend.ts`).

### Publish / social
- `/studio/publish` — connect Instagram, Facebook, Google, WhatsApp (handles + optional Meta token)
- `GET/POST /api/social` — accounts (token never returned; `hasToken` flag only)
- `POST /api/publish` `{ generationId, platforms, scheduledFor? }` — post now or queue
- `POST /api/publish` `{ action: "tick" }` — fires due jobs + due calendar items
- Studio shell polls tick every 20s while studio is open
- Demo accounts pre-connected: `@nimrahatelier`, Facebook Page, Google Business, WhatsApp
- Public live board `/live/{slug}` (Instagram grid + Facebook feed)
- Public permalink `/p/{id}`
- `GET /api/live?slug=` and `GET /api/live?id=` — no auth, posted items only

If a Facebook Page token + `pageId` / Instagram `igUserId` is saved, `src/lib/publish.ts` calls Meta Graph `/{page-id}/photos` and IG container + `media_publish`. Without tokens, the post still goes live on the Looply board (`remote: false`).

### Credits / plans
- Start $0 / ₹0 / 20 credits
- Growth $19.99 / ₹1,499 / 100 credits
- Pro $39.99 / ₹2,999 / 250 credits
- `POST /api/plan { plan }` adds that plan’s credits (no payment)

---

## 4. Honest limits (do not “fix” by faking)

| Feature | Limit |
| --- | --- |
| Reels | Storyboard + stills. **Not** a finished AI-actor MP4 |
| Inbox | Drafts a reply. **Does not** connect live Instagram / WhatsApp / Google |
| Ads | Exports creatives. **Does not** spend ad budget or attach a pixel |
| Calendar | Schedules drafts. Auto-posts to the **live board** when due. Does not publish to Meta without a token |
| Instagram / Facebook | Live board always. Real Graph push **only** with Page token + IDs |
| Google / WhatsApp | Live-board update only (no GBP / WhatsApp Cloud API) |
| Website tool | Copy + hero still. Does not host a domain |
| Plans | Adds credits. No Stripe |
| Persistence | JSON file. Fine locally. On serverless/Vercel the filesystem is ephemeral (`/tmp` fallback exists) |

---

## 5. File structure

```
/workspace
├── PROJECT_CONTEXT.md     ← this file
├── README.md              ← short user-facing
├── package.json           ← name: app-builder-workspace
├── vite.config.ts         ← TanStack Start + Tailwind + Nitro + Grok PWA plugin
├── tsconfig.json
├── startup.sh             ← sandbox revive: npm run dev on :8080
├── data/store.json        ← the entire database
├── public/
│   ├── favicon.svg
│   ├── og.jpg
│   └── __grok/            ← Grok App Builder PWA chrome (not product)
├── src/
│   ├── router.tsx         ← MUST export getRouter()
│   ├── routeTree.gen.ts   ← auto-generated, do not edit
│   ├── styles.css         ← tokens
│   ├── components/        ← Looply UI only
│   ├── lib/               ← product + leftover platform helpers
│   └── routes/            ← pages + API
├── scripts/               ← Vite wrappers, smoke tests, PWA (platform)
├── server/middleware/     ← grok-pwa.ts (platform)
└── migrations/auth/       ← Better Auth SQL (UNUSED by Looply)
```

### Product files (this is Looply)

**Core**
- `src/lib/types.ts` — all domain types
- `src/lib/store.ts` — JSON store, mutex chain, demo seed
- `src/lib/looply-auth.ts` — scrypt, HMAC session, demo bypass
- `src/lib/ai.ts` — `brandContext`, `generateText` (Grok → Pollinations → fallback), `imageUrl`, `parseLooseJson`
- `src/lib/copy.ts` — fallbacks + `writerSystem` + `stillPrompt`
- `src/lib/brand.ts` — `brandSlug`, `brandFacts`, `usedFromBrand`
- `src/lib/credits.ts` / `src/lib/spend.ts`
- `src/lib/publish.ts` — live board + optional Meta Graph
- `src/lib/http.ts` — `json`, `requireSession`, `handleError`, `readJson`
- `src/lib/client.ts` — browser `api()` with `credentials: 'include'`
- `src/lib/ids.ts` — `nid(prefix)`

**UI**
- `src/components/StudioShell.tsx` — sidebar, credits pill, auth gate, publish tick
- `src/components/MarketingNav.tsx`, `Footer.tsx`, `LoopMark.tsx`
- `src/components/ToolForm.tsx` — studio tool chrome (“Generating… 8–20s”)
- `src/components/BrandKit.tsx` — fact chips
- `src/components/PublishPanel.tsx` — network picker, Post now / Schedule, step UI
- `src/components/CopyBlock.tsx` — copy + result image

**Pages**
- Marketing: `src/routes/index.tsx`, `pricing.tsx`, `examples.tsx`, `contact.tsx`, `login.tsx`, `signup.tsx`
- Studio layout: `src/routes/studio.tsx` (wraps `<StudioShell><Outlet/></StudioShell>`)
- Studio: `src/routes/studio/{index,onboarding,posts,shoot,reels,ads,calendar,inbox,website,publish}.tsx`
- Public: `src/routes/live.$slug.tsx`, `src/routes/p.$id.tsx`

**API** (TanStack `createFileRoute` + `server.handlers`)
- `src/routes/api/auth/{login,logout,signup}.ts`
- `src/routes/api/{me,brand,generations,messages,plan,social,publish,live}.ts`
- `src/routes/api/generate/{post,image,reel,ad,calendar,reply,website}.ts`

### Platform leftovers (Grok App Builder — Looply does not use these)

Safe to ignore in Antigravity unless you keep the same Vite scaffold:

- `src/lib/auth/**` — Better Auth (prewired). Looply uses `looply-auth.ts`
- `src/lib/db.ts` — PGlite/Neon. Looply uses `store.ts`
- `src/lib/app-data/**`, `src/lib/multiplayer/**`
- `src/components/preview-host-bridge.tsx`
- `public/__grok/`, `scripts/grok-pwa-*`, `server/middleware/grok-pwa.ts`
- `migrations/auth/0001_auth.sql`
- `vite.config.ts` plugins: `grokPwaPlugin`, `appEnvPlugin`, auth popup, pglite bootstrap

`src/routes/__root.tsx` currently mounts `<AuthProvider>` (Better Auth) **and** `<PreviewHostBridge />`. Looply sessions do **not** go through Better Auth. Do not swap Looply cookie auth for Better Auth unless asked.

---

## 6. Data model (`data/store.json`)

```ts
Store = {
  users: User[]          // id, name, email, passwordHash, plan, credits, createdAt
  brands: Brand[]        // one per userId
  generations: Generation[]
  messages: InboxMessage[]
  accounts: SocialAccount[]
  jobs: PublishJob[]
}
```

`kind`: post | image | reel | ad | calendar | reply | review | website  
`status`: draft | ready | scheduled | posted  
`channel` / social: instagram | facebook | google | whatsapp

On first read, if the file is missing, seed demo user + brand + 2 messages + 4 connected social accounts.  
If demo user exists but accounts are empty, seed accounts.

Writes are serialized through a promise mutex (`chain` in `store.ts`). Persist tries `data/store.json` then `/tmp/looply-store.json`.

IDs: `nid("gen"|"user"|"msg"|"acc"|"job")` → `{prefix}_{time36}_{rand}`.

---

## 7. Auth contract

```
COOKIE          looply_session
SECRET          "looply-hmac-session-v1-run-marketing-24-7"   (src/lib/looply-auth.ts)
TOKEN           base64url( userId.exp.hmacSha256Hex )
Secure flag     only when request is HTTPS (x-forwarded-proto or url)
```

`authenticate(email, password)`:
- demo email+password → always ok
- else scrypt verify against `passwordHash`

Client calls must use `credentials: 'include'` (`src/lib/client.ts` already does).

---

## 8. AI pipeline (`src/lib/ai.ts`)

`generateText(messages, fallback, { maxTokens })` returns `{ text, source }` where source is `grok | pollinations | fallback`.

**Critical:** do **not** use global `fetch()` for xAI from this Vite SSR. It hangs/times out. Copy uses Node `https.request` (`postJson`) to `api.x.ai` and `text.pollinations.ai`.

Order:
1. Grok `grok-4.5`, 18s, `max_tokens` per tool (post 500, reply 220, calendar 900, …)
2. Pollinations POST `text.pollinations.ai` `{ messages, model: "openai" }`, 12s
3. Local fallback from `src/lib/copy.ts` (still brand-aware: name, city, products, offer, Hindi if language includes Hindi)

Images stay on Pollinations URLs. Binaries are never stored.

Every generate route: `requireSession` → inject brand → generate → `spend(kind)` → `addGeneration` → `{ item, credits }`.

---

## 9. Publish pipeline (`src/lib/publish.ts`)

`executePublish({ userId, generationId, platforms?, scheduledFor? })`

- If `scheduledFor` is > ~4s in the future → job `scheduled`, generation status `scheduled`
- Else `finishPublish`:
  - ensure an image URL (generate Pollinations still if missing)
  - for each connected platform: try Meta if token+ids, always succeed onto `/p/{id}`
  - generation `status: posted`, `postedTo`, `publishResults`, `permalink`

`tickPublish()` (studio interval + `{ action: "tick" }`):
- due jobs
- due `status: scheduled` generations (date-only treated as that day 09:00 UTC)

Public slug: `brandSlug(businessName)` e.g. `nimrah-atelier`.

---

## 10. Routes map

| Path | Auth | Purpose |
| --- | --- | --- |
| `/` `/pricing` `/examples` `/contact` | no | marketing |
| `/login` `/signup` | no | mint-wash cards |
| `/studio` | cookie | home + shortcuts + recent work |
| `/studio/onboarding` | cookie | brand kit |
| `/studio/posts` `/shoot` `/reels` `/ads` `/calendar` `/inbox` `/website` | cookie | tools |
| `/studio/publish` | cookie | connections + queue |
| `/live/$slug` | no | IG grid + FB feed |
| `/p/$id` | no | single posted item |
| `/api/*` | as above | JSON |

Studio nav: Home, Brand, Calendar, Posts, Shoot, Reels, Ads, Inbox, Website, Publish, Sign out. Credits pill in the top bar.

---

## 11. Design tokens

Dark cinematic. Do not invent a second palette. No raw extra hues in JSX; use tokens.

```
--color-ink        #070706   bg
--color-cream      #f4f1ea   text
--color-mint       #3ddc84   accent
--color-mint-ink   #082114   on mint buttons
--color-wash       #eafbee   login/signup
--font-sans        Outfit
--font-serif       Fraunces / Iowan / Palatino / Times
```

Cards: `rounded-3xl` / `--radius-card`, `border-white/10`, `bg-white/[0.03]` (utility `.card-surface`).  
Buttons: `rounded-full`.  
Marketing nav: floating glass, max 1440.  
Login/signup: light mint wash, white card, dark text.

Anti-slop: no emoji in chrome, no purple gradients, no placeholder lorem.

---

## 12. Generate API request/response shapes

All generate POSTs need the session cookie.

```
POST /api/generate/post     { topic, platform }           → { item, credits }
POST /api/generate/image    { brief, style }              → { item, credits }
POST /api/generate/reel     { topic }                     → { item, credits }
POST /api/generate/ad       { offer, platform }           → { item, credits }
POST /api/generate/calendar { days }                      → { items, credits }
POST /api/generate/reply    { text, channel, from, kind } → { item, message, credits }
POST /api/generate/website  {}                            → { item, credits }
POST /api/publish           { generationId, platforms, scheduledFor? } → { item, job, deferred }
POST /api/publish           { action: "tick" }            → { published, items }
POST /api/social            { platform, handle, connected, accessToken?, pageId?, igUserId? }
POST /api/plan              { plan: "start"|"growth"|"pro" }
PATCH /api/generations      { id, status?, scheduledFor? }
```

`item.source`: `grok` | `pollinations` | `fallback`  
`item.used`: `{ businessName, city, products, offer, … }` from the kit

---

## 13. Known gotchas

1. **Not Next.js.** File routes live under `src/routes`. APIs are `createFileRoute("/api/...")({ server: { handlers: { POST }}})` — not `app/api/.../route.ts`.
2. **Two auth systems exist.** Product = `looply-auth.ts` + `/api/auth/login`. Ignore `src/lib/auth/*` unless wiring Better Auth on purpose.
3. **Two databases exist.** Product = `store.ts` / `data/store.json`. Ignore `src/lib/db.ts` unless switching to Postgres.
4. **Vite `fetch` to api.x.ai hangs.** Always use `postJson` / `node:https` in `ai.ts`.
5. **`src/routeTree.gen.ts` is generated.** Add a file under `src/routes` and let the Vite plugin regenerate. Do not hand-edit.
6. **`getRouter` must stay a named export** in `src/router.tsx`.
7. **JSON store is not durable on Vercel.** Need Postgres/Neon if you want real multi-user prod. Seed + `/tmp` fallback keep the demo alive.
8. **HMAC secret is hardcoded.** Fine for demo. Rotate for production.
9. **Pollinations image URLs can take several seconds** to resolve the first time (live grid may look empty until the CDN finishes).
10. **Do not name anything Scalio.** Do not copy Scalio logos or customer names.

---

## 14. What to do next (if asked)

Useful, not gold-plating:

- Persist to Postgres (Neon is already in the scaffold) so deploy survives
- Mark ready → scheduled → posted from the calendar UI
- Copy-to-clipboard / download website HTML
- Real Meta OAuth (today: paste token)
- Replace Pollinations stills with xAI Imagine if quota allows
- Drop Grok App Builder chrome if this repo is leaving that sandbox

Do not rewrite the stack, add Stripe, or fake live Instagram DMs.

---

## 15. Quick mental model

```
Brand kit  →  generate* (Grok/Pollinations, spend credits, save Generation)
           →  PublishPanel / /studio/publish
           →  executePublish (schedule or now)
           →  /live/{slug} + /p/{id}
           →  optional Graph API if token present
```

Owner is always in the loop for generate. Publish can be immediate or timed. Credits only move on generate, not on publish.
