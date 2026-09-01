import { createFileRoute } from "@tanstack/react-router";
import { upsertBrand } from "@/lib/store";
import { json, readJson, requireSession } from "@/lib/http";
import type { Brand } from "@/lib/types";

export const Route = createFileRoute("/api/brand")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const session = await requireSession(request);
        if (!session) return json({ error: "Unauthorized" }, 401);
        const body = await readJson<Partial<Brand>>(request);
        const brand: Brand = {
          userId: session.user.id,
          businessName: (body.businessName ?? session.brand?.businessName ?? "").trim(),
          website: (body.website ?? session.brand?.website ?? "").trim(),
          industry: (body.industry ?? session.brand?.industry ?? "").trim(),
          city: (body.city ?? session.brand?.city ?? "").trim(),
          language: (body.language ?? session.brand?.language ?? "English").trim(),
          tone: (body.tone ?? session.brand?.tone ?? "").trim(),
          audience: (body.audience ?? session.brand?.audience ?? "").trim(),
          offer: (body.offer ?? session.brand?.offer ?? "").trim(),
          products: (body.products ?? session.brand?.products ?? "").trim(),
          colors: (body.colors ?? session.brand?.colors ?? "").trim(),
          onboarded: true,
          updatedAt: new Date().toISOString(),
        };
        if (!brand.businessName) return json({ error: "Business name is required" }, 400);
        const saved = await upsertBrand(brand);
        return json({ brand: saved, user: session.publicUser });
      },
    },
  },
});
