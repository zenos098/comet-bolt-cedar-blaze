import { createFileRoute } from "@tanstack/react-router";
import { json, readJson, requireSession } from "@/lib/http";
import { listAccounts, newId, toPublicAccount, upsertAccount } from "@/lib/store";
import type { SocialAccount, SocialPlatform } from "@/lib/types";

const PLATFORMS: SocialPlatform[] = ["instagram", "facebook", "google", "whatsapp"];

export const Route = createFileRoute("/api/social")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const session = await requireSession(request);
        if (!session) return json({ error: "Unauthorized" }, 401);
        const items = await listAccounts(session.user.id);
        return json({ items: items.map(toPublicAccount) });
      },
      POST: async ({ request }) => {
        const session = await requireSession(request);
        if (!session) return json({ error: "Unauthorized" }, 401);
        const body = await readJson<Partial<SocialAccount> & { token?: string }>(request);
        const platform = body.platform;
        if (!platform || !PLATFORMS.includes(platform)) {
          return json({ error: "Unknown network" }, 400);
        }
        const existing = (await listAccounts(session.user.id)).find((a) => a.platform === platform);
        const token = (body.accessToken || body.token || "").trim();
        const saved = await upsertAccount({
          id: existing?.id || newId("acc"),
          userId: session.user.id,
          platform,
          handle: (body.handle ?? existing?.handle ?? session.brand?.businessName ?? platform).trim(),
          displayName: (
            body.displayName ??
            existing?.displayName ??
            session.brand?.businessName ??
            platform
          ).trim(),
          connected: body.connected ?? true,
          accessToken: token && token !== "saved" ? token : existing?.accessToken,
          pageId: body.pageId ?? existing?.pageId,
          igUserId: body.igUserId ?? existing?.igUserId,
          connectedAt: new Date().toISOString(),
        });
        return json({ item: toPublicAccount(saved) });
      },
    },
  },
});
