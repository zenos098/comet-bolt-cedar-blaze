import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { LoopMark } from "@/components/LoopMark";
import { fieldClass } from "@/components/ToolForm";
import { api } from "@/lib/client";
import { cn } from "@/lib/cn";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({ meta: [{ title: "AI Creative Studio — Looply" }] }),
});

function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    try {
      await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: String(form.get("email") || ""),
          password: String(form.get("password") || ""),
        }),
      });
      navigate({ to: "/studio" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-wash to-white text-mint-ink scheme-light">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-16">
        <Link to="/" className="mb-8 flex items-center gap-2 text-mint-ink">
          <LoopMark className="size-6 text-mint" />
          <span className="font-serif text-xl">looply</span>
        </Link>
        <div className="rounded-3xl bg-white p-8 shadow-[0_0_0_1px_rgba(8,33,20,0.06),0_20px_50px_rgba(8,33,20,0.08)]">
          <h1 className="font-serif text-4xl tracking-tight">AI Creative Studio</h1>
          <p className="mt-2 text-sm text-mint-ink/60">
            Demo · demo@looply.app / demo1234
          </p>
          <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
            <label className="text-sm">
              Email
              <input
                name="email"
                type="email"
                required
                defaultValue="demo@looply.app"
                className={cn(fieldClass, "mt-2 border-mint-ink/10 bg-wash text-mint-ink placeholder:text-mint-ink/30")}
              />
            </label>
            <label className="text-sm">
              Password
              <input
                name="password"
                type="password"
                required
                defaultValue="demo1234"
                className={cn(fieldClass, "mt-2 border-mint-ink/10 bg-wash text-mint-ink")}
              />
            </label>
            {error ? <p className="text-sm text-red-700">{error}</p> : null}
            <button
              type="submit"
              disabled={busy}
              className="rounded-full bg-mint-ink px-5 py-3 text-sm font-medium text-wash disabled:opacity-60"
            >
              {busy ? "Opening…" : "Enter studio"}
            </button>
          </form>
          <p className="mt-6 text-sm text-mint-ink/60">
            New shop?{" "}
            <Link to="/signup" className="text-mint-ink underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
