import { createFileRoute } from "@tanstack/react-router";
import { clearSessionCookie } from "@/lib/looply-auth";
import { json } from "@/lib/http";

export const Route = createFileRoute("/api/auth/logout")({
  server: {
    handlers: {
      POST: async () => {
        return json({ ok: true }, 200, { "Set-Cookie": clearSessionCookie() });
      },
    },
  },
});
