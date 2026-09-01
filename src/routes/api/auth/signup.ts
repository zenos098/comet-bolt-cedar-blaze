import { createFileRoute } from "@tanstack/react-router";
import { hashPassword, sessionCookie, signSession, toPublicUser } from "@/lib/looply-auth";
import { findUserByEmail, insertUser, newId } from "@/lib/store";
import { json, readJson } from "@/lib/http";

export const Route = createFileRoute("/api/auth/signup")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await readJson<{ name?: string; email?: string; password?: string }>(
          request,
        );
        const name = (body.name ?? "").trim();
        const email = (body.email ?? "").trim().toLowerCase();
        const password = body.password ?? "";
        if (!name || !email || password.length < 6) {
          return json({ error: "Name, email and a 6+ character password are required" }, 400);
        }
        const existing = await findUserByEmail(email);
        if (existing) return json({ error: "An account with that email already exists" }, 409);
        const user = await insertUser({
          id: newId("user"),
          name,
          email,
          passwordHash: await hashPassword(password),
          plan: "start",
          credits: 20,
          createdAt: new Date().toISOString(),
        });
        const token = signSession(user.id);
        return json(
          { user: toPublicUser(user), brand: null },
          200,
          { "Set-Cookie": sessionCookie(token, request) },
        );
      },
    },
  },
});
