import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Footer } from "@/components/Footer";
import { MarketingNav } from "@/components/MarketingNav";
import { fieldClass } from "@/components/ToolForm";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({ meta: [{ title: "Contact — Looply" }] }),
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSent(true);
  }
  return (
    <div className="bg-ink text-cream">
      <MarketingNav />
      <main className="mx-auto grid max-w-6xl gap-12 px-6 pb-24 pt-32 lg:grid-cols-2">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-mint">Contact</p>
          <h1 className="mt-3 font-serif text-5xl tracking-tight">Talk to a human.</h1>
          <p className="mt-4 max-w-md text-muted">
            Studios, cafes, clinics, D2C — if you run the floor, we can run the
            feed. Email{" "}
            <a className="text-mint" href="mailto:support@looply.app">
              support@looply.app
            </a>
            .
          </p>
        </div>
        {sent ? (
          <p className="card-surface h-fit p-8 text-sm leading-relaxed">
            Received. We’ll reply from support@looply.app — usually within one
            working day.
          </p>
        ) : (
          <form onSubmit={onSubmit} className="card-surface flex flex-col gap-4 p-6 sm:p-8">
            <label className="text-sm">
              Name
              <input required className={`${fieldClass} mt-2`} name="name" />
            </label>
            <label className="text-sm">
              Email
              <input required type="email" className={`${fieldClass} mt-2`} name="email" />
            </label>
            <label className="text-sm">
              Business
              <input className={`${fieldClass} mt-2`} name="business" />
            </label>
            <label className="text-sm">
              Message
              <textarea required rows={5} className={`${fieldClass} mt-2`} name="message" />
            </label>
            <button
              type="submit"
              className="rounded-full bg-mint px-5 py-3 text-sm font-medium text-mint-ink"
            >
              Send
            </button>
          </form>
        )}
      </main>
      <Footer />
    </div>
  );
}
