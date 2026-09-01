import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CalendarRange,
  Clapperboard,
  ImageIcon,
  Megaphone,
  MessageCircle,
  PenLine,
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { MarketingNav } from "@/components/MarketingNav";
import { PLANS, formatInr, formatUsd } from "@/lib/credits";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [{ title: "Looply — Run marketing 24/7." }],
  }),
});

const TICKER = [
  "Nimrah Atelier",
  "Farmer's India Market",
  "Turning Heads Studio",
  "Root & Reign",
  "Jo's Space",
  "Harbour Cafe",
  "Elrose Clinic",
  "Drip Drop Towing",
];

const FEATURES = [
  {
    title: "It posts",
    body: "Captions and stills for Instagram, Facebook and Google, written in your city's voice.",
    icon: PenLine,
  },
  {
    title: "It makes Reels",
    body: "A four-beat storyboard and 9:16 stills. Not an AI actor. You shoot or stitch.",
    icon: Clapperboard,
  },
  {
    title: "It shoots",
    body: "Product and shop stills from the brand kit — linen, lighting, and the actual offer.",
    icon: ImageIcon,
  },
  {
    title: "It advertises",
    body: "Export square creatives and copy. Looply does not spend your ad budget.",
    icon: Megaphone,
  },
  {
    title: "It answers",
    body: "Drafts WhatsApp, Instagram and Google replies. You paste. Nothing is live-connected.",
    icon: MessageCircle,
  },
  {
    title: "It gets you found",
    body: "A one-page site: hero, offer, proof, visit, CTA — so search has somewhere to land.",
    icon: CalendarRange,
  },
];

const HERO =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2400&q=80";

function Home() {
  return (
    <div className="bg-ink text-cream">
      <MarketingNav />
      <section className="relative min-h-[100svh] overflow-hidden">
        <img
          src={HERO}
          alt="A busy independent cafe at dusk"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/70 to-ink" />
        <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-6 pb-24 pt-36">
          <p className="rise text-sm uppercase tracking-[0.22em] text-mint">
            AI marketing partner
          </p>
          <h1 className="rise rise-2 mt-4 font-serif text-[14vw] leading-[0.9] tracking-[-0.04em] sm:text-7xl md:text-8xl lg:text-9xl">
            Run marketing
            <br />
            <span className="text-mint">/</span> 24/7.
          </h1>
          <p className="rise rise-3 mt-6 max-w-xl text-base leading-relaxed text-cream/80 sm:text-lg">
            Looply keeps a business growing online — creating, posting, answering
            and advertising while the owner runs the shop.
          </p>
          <div className="rise rise-4 mt-8 flex flex-wrap gap-3">
            <Link
              to="/signup"
              className="rounded-full bg-mint px-6 py-3 text-sm font-medium text-mint-ink transition-transform duration-150 active:scale-[0.96]"
            >
              Get the app
            </Link>
            <Link
              to="/login"
              className="rounded-full border border-white/15 px-6 py-3 text-sm text-cream transition-transform duration-150 active:scale-[0.96]"
            >
              Open studio
            </Link>
          </div>
          <p className="mt-6 text-sm text-cream/55">
            Demo studio · demo@looply.app / demo1234
          </p>
        </div>
      </section>

      <div className="border-y border-white/10 bg-ink py-4 overflow-hidden">
        <div className="flex w-max marquee-track">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center gap-10 pr-10">
              {TICKER.map((name) => (
                <span
                  key={`${copy}-${name}`}
                  className="whitespace-nowrap font-serif text-lg text-cream/70"
                >
                  {name}
                  <span className="ml-10 text-mint">/</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <section id="features" className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="max-w-3xl font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
          The internet never stops. Now your marketing doesn’t either.
        </h2>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <article key={f.title} className="card-surface p-6">
              <f.icon className="size-5 text-mint" />
              <h3 className="mt-4 font-serif text-2xl">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] lg:grid-cols-2">
          <div className="flex flex-col justify-center p-8 sm:p-12">
            <p className="text-sm uppercase tracking-[0.18em] text-mint">Brand kit</p>
            <h2 className="mt-3 font-serif text-4xl tracking-tight sm:text-5xl">
              Learn the brand once. Approve the rest.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
              No blank prompt box after setup. Looply writes from the shop you
              already run — city, offer, products, tone. You approve. Credits
              meter every generation.
            </p>
          </div>
          <div className="border-t border-white/10 p-8 lg:border-l lg:border-t-0 sm:p-12">
            <div className="rounded-3xl border border-white/10 bg-ink p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-cream/40">On file</p>
              <h3 className="mt-2 font-serif text-3xl">Nimrah Atelier</h3>
              <dl className="mt-6 space-y-3 text-sm">
                {[
                  ["City", "Delhi"],
                  ["Tone", "Warm, confident"],
                  ["Offer", "New linen drop + free hemming this week"],
                  ["Products", "Linen sets, kurtas, silk shirts"],
                  ["Colors", "Ivory · forest green · warm gold"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 border-b border-white/8 pb-3">
                    <dt className="text-cream/45">{k}</dt>
                    <dd className="text-right text-cream/90">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <h2 className="font-serif text-4xl tracking-tight">Pick a pace.</h2>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {Object.values(PLANS).map((plan) => (
            <article
              key={plan.id}
              className="card-surface flex flex-col p-6"
            >
              <p className="text-sm text-mint">{plan.name}</p>
              <p className="mt-3 font-serif text-4xl">
                {plan.usd === 0 ? "Free" : formatUsd(plan.usd)}
              </p>
              <p className="text-sm text-muted">{formatInr(plan.inr)} · {plan.credits} credits</p>
              <p className="mt-4 text-sm leading-relaxed text-muted">{plan.blurb}</p>
              <Link
                to="/pricing"
                className="mt-8 rounded-full border border-white/10 px-4 py-2 text-center text-sm hover:bg-white/5"
              >
                See plan
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-mint px-8 py-16 text-mint-ink sm:px-16">
          <h2 className="font-serif text-4xl tracking-tight sm:text-6xl">
            Go run the shop.
            <br />
            We’ll keep the internet busy.
          </h2>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/signup"
              className="rounded-full bg-mint-ink px-6 py-3 text-sm font-medium text-mint"
            >
              Start free
            </Link>
            <Link
              to="/login"
              className="rounded-full border border-mint-ink/20 px-6 py-3 text-sm"
            >
              Demo studio
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
