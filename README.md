# Looply

AI marketing partner for independent businesses. Tagline: **Run marketing 24/7.**

Looply keeps a shop growing online — creating, posting, answering and advertising while the owner runs the floor. The owner approves; the studio generates. Credits meter every generation.

**Full project context for another AI / Antigravity:** read [`PROJECT_CONTEXT.md`](./PROJECT_CONTEXT.md) first.

Not affiliated with Scalio.

## Run

```bash
npm install
npm run dev
```

Open the app, then:

- Marketing: `/`
- Studio login: `/login`
- Demo: `demo@looply.app` / `demo1234` (Growth plan, Nimrah Atelier)
- Live board: `/live/nimrah-atelier`

Signup lands on `/studio/onboarding`. Login lands on `/studio`.

## Stack

- TanStack Start + TypeScript + Tailwind CSS
- Persistence: `data/store.json` via `fs` (no database server)
- Auth: scrypt password hashes + HMAC-signed httpOnly cookie `looply_session` (14 days)
- Copy: xAI Grok when available, Pollinations fallback
- Images: `https://image.pollinations.ai/prompt/...`

## Demo brand

Nimrah Atelier — boutique fashion, Delhi, English + Hindi, warm confident tone. Offer: *New linen drop + free hemming this week.* Products: linen sets, kurtas, silk shirts. Colors: ivory, forest green, warm gold.

## Real vs placeholder

| Feature | What actually happens |
| --- | --- |
| Posts, stills, ads, website, replies | Written from the saved brand kit (name, city, products, offer, tone, language) |
| Reels | Storyboard + 9:16 stills — not a finished MP4 |
| Publish | Sends to the public live board immediately. Auto-posts scheduled items when due |
| Instagram / Facebook | Live on the shop board. Real Graph API push if you paste a Page token + IDs |
| Google / WhatsApp | Live board update (no Google Business or WhatsApp Cloud API without those keys) |
| Inbox | Drafts a reply — does not connect live Instagram DMs |
| Ads | Exports creatives — does not spend ad budget |
| Plans | Choosing a plan adds credits. No payment processor |

## Credit costs

post 1 · image 1 · reel 4 · ad 2 · calendar 3 · reply 1 · review 1 · website 5

Start 20 · Growth 100 · Pro 250
