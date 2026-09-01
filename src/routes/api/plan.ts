import { createFileRoute } from "@tanstack/react-router";
import { PLANS } from "@/lib/credits";
import { addPlanCredits } from "@/lib/store";
import { toPublicUser } from "@/lib/looply-auth";
import { json, readJson, requireSession } from "@/lib/http";
import type { PlanId } from "@/lib/types";

export const Route = createFileRoute("/api/plan")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const session = await requireSession(request);
        if (!session) {
          return json({ error: "Sign in to add a plan's credits" }, 401);
        }
        const body = await readJson<{ plan?: PlanId }>(request);
        const plan = body.plan;
        if (!plan || !PLANS[plan]) return json({ error: "Unknown plan" }, 400);
        const updated = await addPlanCredits(session.user.id, plan, PLANS[plan].credits);
        if (!updated) return json({ error: "User not found" }, 404);
        return json({
          user: toPublicUser(updated),
          added: PLANS[plan].credits,
        });
      },
    },
  },
});
