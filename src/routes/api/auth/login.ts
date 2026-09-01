import { createFileRoute } from "@tanstack/react-router";
import { authenticate, sessionCookie, signSession, toPublicUser } from "@/lib/looply-auth";
import { getBrand } from "@/lib/store";
import { json, readJson } from "@/lib/http";

export const Route = createFileRoute("/api/auth/login")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await readJson<{ email?: string; password?: string }>(request);
        const email = (body.email ?? "").trim();
        const password = body.password ?? "";
        if (!email || !password) return json({ error: "Email and password required" }, 400);
        const user = await authenticate(email, password);
        if (!user) return json({ error: "Wrong email or password" }, 401);
        const brand = await getBrand(user.id);
        const token = signSession(user.id);
        return json(
          { user: toPublicUser(user), brand },
          200,
          { "Set-Cookie": sessionCookie(token, request) },
        );
      },
    },
  },
});
