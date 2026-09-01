import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Footer } from "@/components/Footer";
import { MarketingNav } from "@/components/MarketingNav";
import { api, ApiError } from "@/lib/client";
import { CREDIT_COSTS, PLANS, formatInr, formatUsd } from "@/lib/credits";
import type { PlanId } from "@/lib/types";

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
  head: () => ({ meta: [{ title: "Pricing — Looply" }] }),
});

function PricingPage() {
  const navigate = useNavigate();
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState<PlanId | null>(null);

  async function choose(plan: PlanId) {
    setNotice(null);
    setBusy(plan);
    try {
      await api("/api/me");
      const res = await api<{ added: number }>("/api/plan", {
        method: "POST",
        body: JSON.stringify({ plan }),
      });
      setNotice(`Added ${res.added} credits. No payment taken.`);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setNotice("Sign in to add a plan’s credits.");
        setTimeout(() => navigate({ to: "/login" }), 900);
      } else {
        setNotice(err instanceof Error ? err.message : "Could not add plan");
      }
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="bg-ink text-cream">
      <MarketingNav />
      <main className="mx-auto max-w-6xl px-6 pb-24 pt-32">
        <p className="text-sm uppercase tracking-[0.18em] text-mint">Pricing</p>
        <h1 className="mt-3 font-serif text-5xl tracking-tight sm:text-6xl">
          Credits, not a blank cheque.
        </h1>
        <p className="mt-4 max-w-xl text-muted">
          Choosing a plan adds that plan’s credits. There is no Stripe, no ad
          spend, no surprise invoice.
        </p>
        {notice ? (
          <p className="mt-6 rounded-2xl border border-mint/30 bg-mint/10 px-4 py-3 text-sm text-mint">
            {notice}
          </p>
        ) : null}
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {Object.values(PLANS).map((plan) => (
            <article key={plan.id} className="card-surface flex flex-col p-6">
              <p className="text-sm text-mint">{plan.name}</p>
              <p className="mt-3 font-serif text-4xl">
                {plan.usd === 0 ? "₹0" : formatInr(plan.inr)}
              </p>
              <p className="text-sm text-muted">
                {plan.usd === 0 ? "Free" : formatUsd(plan.usd)} · {plan.credits} credits
              </p>
              <ul className="mt-6 space-y-2 text-sm text-cream/75">
                {plan.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <button
                type="button"
                disabled={busy === plan.id}
                onClick={() => choose(plan.id)}
                className="mt-8 rounded-full bg-mint px-4 py-3 text-sm font-medium text-mint-ink disabled:opacity-60"
              >
                {busy === plan.id ? "Adding…" : "Choose plan"}
              </button>
            </article>
          ))}
        </div>
        <h2 className="mt-20 font-serif text-3xl">What a credit buys</h2>
        <div className="mt-6 overflow-hidden rounded-3xl border border-white/10">
          <table className="w-full text-left text-sm">
            <tbody>
              {Object.entries(CREDIT_COSTS).map(([kind, cost]) => (
                <tr key={kind} className="border-t border-white/10 first:border-0">
                  <td className="px-5 py-3 capitalize">{kind}</td>
                  <td className="px-5 py-3 text-right tabular-nums text-muted">{cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-6 text-sm text-muted">
          Already have an account?{" "}
          <Link to="/login" className="text-mint">
            Open studio
          </Link>
        </p>
      </main>
      <Footer />
    </div>
  );
}
