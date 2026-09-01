import { createFileRoute } from "@tanstack/react-router";
import { brandSlug } from "@/lib/brand";
import { json } from "@/lib/http";
import {
  findBrandBySlug,
  listAccounts,
  listGenerations,
  readStore,
  toPublicAccount,
} from "@/lib/store";

export const Route = createFileRoute("/api/live")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const slug = (url.searchParams.get("slug") || "").toLowerCase();
        const id = url.searchParams.get("id") || "";
        if (id) {
          const store = await readStore();
          const item = store.generations.find((g) => g.id === id && g.status === "posted");
          if (!item) return json({ error: "Not found" }, 404);
          const brand = store.brands.find((b) => b.userId === item.userId) ?? null;
          const accounts = (await listAccounts(item.userId))
            .filter((a) => a.connected)
            .map(toPublicAccount);
          return json({ item, brand, accounts, slug: brand ? brandSlug(brand.businessName) : "" });
        }
        if (!slug) return json({ error: "slug required" }, 400);
        const brand = await findBrandBySlug(slug);
        if (!brand) return json({ error: "Shop not found" }, 404);
        const items = (await listGenerations(brand.userId)).filter((g) => g.status === "posted");
        const accounts = (await listAccounts(brand.userId))
          .filter((a) => a.connected)
          .map(toPublicAccount);
        return json({ brand, items, accounts, slug });
      },
    },
  },
});
