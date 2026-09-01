import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { LoopMark } from "./LoopMark";
import { cn } from "@/lib/cn";

const links = [
  { to: "/pricing" as const, label: "Pricing" },
  { to: "/examples" as const, label: "Examples" },
  { to: "/contact" as const, label: "Contact" },
];

export function MarketingNav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-3 sm:px-6">
      <nav
        className={cn(
          "pointer-events-auto flex w-full max-w-[1440px] items-center justify-between gap-3",
          "rounded-full border border-white/10 bg-ink/55 px-3 py-2 pl-5 shadow-[var(--shadow-border)]",
          "backdrop-blur-xl",
        )}
      >
        <Link to="/" className="flex items-center gap-2 text-cream" onClick={() => setOpen(false)}>
          <LoopMark className="size-6 text-mint" />
          <span className="font-serif text-lg tracking-tight">looply</span>
        </Link>
        <div className="hidden items-center gap-7 text-sm text-cream/75 md:flex">
          <Link to="/" hash="features" className="transition-colors hover:text-cream">
            Features
          </Link>
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="transition-colors hover:text-cream">
              {l.label}
            </Link>
          ))}
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <Link
            to="/login"
            className="rounded-full px-4 py-2 text-sm text-cream/80 transition-colors hover:text-cream"
          >
            Use on web
          </Link>
          <Link
            to="/signup"
            className="rounded-full bg-mint px-4 py-2 text-sm font-medium text-mint-ink transition-transform duration-150 ease-out active:scale-[0.96]"
          >
            Get the app
          </Link>
        </div>
        <button
          type="button"
          className="grid size-11 place-items-center rounded-full text-cream md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>
      {open ? (
        <div className="pointer-events-auto absolute inset-x-3 top-16 rounded-3xl border border-white/10 bg-ink/95 p-4 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-1 text-sm">
            <Link
              to="/"
              hash="features"
              className="rounded-2xl px-4 py-3"
              onClick={() => setOpen(false)}
            >
              Features
            </Link>
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="rounded-2xl px-4 py-3"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/login"
              className="rounded-2xl px-4 py-3"
              onClick={() => setOpen(false)}
            >
              Use on web
            </Link>
            <Link
              to="/signup"
              className="mt-2 rounded-full bg-mint px-4 py-3 text-center font-medium text-mint-ink"
              onClick={() => setOpen(false)}
            >
              Get the app
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
