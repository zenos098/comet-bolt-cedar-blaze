import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  CalendarDays,
  Clapperboard,
  Globe,
  Home,
  ImageIcon,
  Inbox,
  LogOut,
  Megaphone,
  Menu,
  PenLine,
  Radio,
  Sparkles,
  X,
} from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { LoopMark } from "./LoopMark";
import { api } from "@/lib/client";
import { brandSlug } from "@/lib/brand";
import { cn } from "@/lib/cn";
import type { Brand, PublicUser, SessionPayload } from "@/lib/types";

type StudioValue = {
  user: PublicUser;
  brand: Brand | null;
  setCredits: (n: number) => void;
  setBrand: (b: Brand) => void;
  refresh: () => Promise<void>;
};

const StudioCtx = createContext<StudioValue | null>(null);

export function useStudio() {
  const ctx = useContext(StudioCtx);
  if (!ctx) throw new Error("useStudio outside shell");
  return ctx;
}

const NAV = [
  { to: "/studio" as const, label: "Home", icon: Home },
  { to: "/studio/onboarding" as const, label: "Brand", icon: Sparkles },
  { to: "/studio/calendar" as const, label: "Calendar", icon: CalendarDays },
  { to: "/studio/posts" as const, label: "Posts", icon: PenLine },
  { to: "/studio/shoot" as const, label: "Shoot", icon: ImageIcon },
  { to: "/studio/reels" as const, label: "Reels", icon: Clapperboard },
  { to: "/studio/ads" as const, label: "Ads", icon: Megaphone },
  { to: "/studio/inbox" as const, label: "Inbox", icon: Inbox },
  { to: "/studio/website" as const, label: "Website", icon: Globe },
  { to: "/studio/publish" as const, label: "Publish", icon: Radio },
];

export function StudioShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [session, setSession] = useState<SessionPayload | null>(null);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const data = await api<SessionPayload>("/api/me");
      setSession(data);
    } catch {
      navigate({ to: "/login" });
    }
  }, [navigate]);

  useEffect(() => {
    let alive = true;
    api<SessionPayload>("/api/me")
      .then((data) => {
        if (alive) setSession(data);
      })
      .catch(() => {
        if (alive) navigate({ to: "/login" });
      })
      .finally(() => {
        if (alive) setReady(true);
      });
    return () => {
      alive = false;
    };
  }, [navigate]);

  useEffect(() => {
    const tick = () => {
      api("/api/publish", {
        method: "POST",
        body: JSON.stringify({ action: "tick" }),
      }).catch(() => undefined);
    };
    tick();
    const id = setInterval(tick, 20000);
    return () => clearInterval(id);
  }, []);

  const value = useMemo<StudioValue | null>(() => {
    if (!session) return null;
    return {
      user: session.user,
      brand: session.brand,
      setCredits: (n: number) =>
        setSession((prev) =>
          prev ? { ...prev, user: { ...prev.user, credits: n } } : prev,
        ),
      setBrand: (b: Brand) => setSession((prev) => (prev ? { ...prev, brand: b } : prev)),
      refresh,
    };
  }, [session, refresh]);

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    navigate({ to: "/" });
  }

  if (!ready || !value) {
    return (
      <div className="grid min-h-screen place-items-center bg-ink text-muted">
        Opening studio…
      </div>
    );
  }

  const slug = value.brand ? brandSlug(value.brand.businessName) : "";

  const nav = (
    <div className="flex h-full flex-col">
      <Link to="/studio" className="mb-6 flex items-center gap-2 px-2 text-cream">
        <LoopMark className="size-6 text-mint" />
        <span className="font-serif text-xl">looply</span>
      </Link>
      <p className="px-2 text-xs uppercase tracking-[0.18em] text-cream/35">Studio</p>
      <p className="mb-4 truncate px-2 pt-1 text-sm text-cream/70">
        {value.brand?.businessName || "Set up your brand"}
      </p>
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
        {NAV.map((item) => {
          const active =
            item.to === "/studio"
              ? pathname === "/studio"
              : pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={cn(
                "flex min-h-11 items-center gap-3 rounded-full px-3 text-sm transition-colors",
                active
                  ? "bg-white/8 text-cream"
                  : "text-cream/60 hover:bg-white/4 hover:text-cream",
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      {slug ? (
        <Link
          to="/live/$slug"
          params={{ slug }}
          className="mt-2 px-3 text-xs text-mint"
        >
          Live board
        </Link>
      ) : null}
      <button
        type="button"
        onClick={signOut}
        className="mt-2 flex min-h-11 items-center gap-3 rounded-full px-3 text-sm text-cream/55 hover:text-cream"
      >
        <LogOut className="size-4" />
        Sign out
      </button>
    </div>
  );

  return (
    <StudioCtx.Provider value={value}>
      <div className="min-h-screen bg-ink text-cream">
        <aside className="fixed inset-y-0 left-0 hidden w-60 border-r border-white/10 p-4 lg:block">
          {nav}
        </aside>
        {open ? (
          <div className="fixed inset-0 z-40 lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-black/50"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            />
            <div className="absolute inset-y-0 left-0 w-64 border-r border-white/10 bg-ink p-4">
              {nav}
            </div>
          </div>
        ) : null}
        <div className="lg:pl-60">
          <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-white/10 bg-ink/80 px-4 py-3 backdrop-blur-xl sm:px-6">
            <button
              type="button"
              className="grid size-11 place-items-center rounded-full lg:hidden"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
            <p className="hidden text-sm text-cream/50 sm:block">AI Creative Studio</p>
            <div className="ml-auto flex items-center gap-3">
              <span className="rounded-full bg-mint px-3 py-1.5 text-xs font-medium tabular-nums text-mint-ink">
                {value.user.credits} credits
              </span>
            </div>
          </header>
          <main className="px-4 py-8 sm:px-8">{children}</main>
        </div>
      </div>
    </StudioCtx.Provider>
  );
}
