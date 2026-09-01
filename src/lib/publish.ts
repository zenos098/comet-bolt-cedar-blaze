import { imageUrl } from "./ai";
import { stillPrompt } from "./copy";
import {
  addJob,
  dueJobs,
  dueScheduledGenerations,
  getBrand,
  getGeneration,
  listAccounts,
  listJobs,
  newId,
  patchGeneration,
  patchJob,
} from "./store";
import type {
  Brand,
  Generation,
  PublishJob,
  PublishResult,
  SocialAccount,
  SocialPlatform,
} from "./types";

const ALL: SocialPlatform[] = ["instagram", "facebook", "google", "whatsapp"];

async function postFacebook(account: SocialAccount, imageUrlValue: string, caption: string) {
  if (!account.accessToken || !account.pageId) return null;
  const res = await fetch(`https://graph.facebook.com/v21.0/${account.pageId}/photos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: imageUrlValue,
      caption,
      access_token: account.accessToken,
    }),
    signal: AbortSignal.timeout(12000),
  });
  if (!res.ok) {
    const err = await res.text().catch(() => "");
    throw new Error(err.slice(0, 180) || `Facebook ${res.status}`);
  }
  const body = (await res.json()) as { id?: string; post_id?: string };
  const id = body.post_id || body.id;
  return id ? `https://facebook.com/${id}` : "https://facebook.com";
}

async function postInstagram(account: SocialAccount, imageUrlValue: string, caption: string) {
  if (!account.accessToken || !account.igUserId) return null;
  const create = await fetch(`https://graph.facebook.com/v21.0/${account.igUserId}/media`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      image_url: imageUrlValue,
      caption,
      access_token: account.accessToken,
    }),
    signal: AbortSignal.timeout(12000),
  });
  if (!create.ok) throw new Error(`Instagram container ${create.status}`);
  const created = (await create.json()) as { id?: string };
  if (!created.id) throw new Error("Instagram did not return a container");
  const publish = await fetch(
    `https://graph.facebook.com/v21.0/${account.igUserId}/media_publish`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        creation_id: created.id,
        access_token: account.accessToken,
      }),
      signal: AbortSignal.timeout(12000),
    },
  );
  if (!publish.ok) throw new Error(`Instagram publish ${publish.status}`);
  const posted = (await publish.json()) as { id?: string };
  return posted.id
    ? `https://instagram.com/p/${posted.id}`
    : `https://instagram.com/${account.handle.replace("@", "")}`;
}

function captionOf(item: Generation) {
  return (item.caption || item.title || "").trim();
}

function ensureImage(item: Generation, brand: Brand | null) {
  if (item.imageUrl) return item.imageUrl;
  if (item.images?.[0]) return item.images[0];
  return imageUrl(
    stillPrompt(brand, item.title || brand?.offer || "shop still", "editorial product still"),
    1080,
    1080,
  );
}

async function runPlatform(
  account: SocialAccount,
  item: Generation,
  image: string,
  caption: string,
): Promise<PublishResult> {
  const postedAt = new Date().toISOString();
  const liveUrl = `/p/${item.id}`;
  try {
    if (account.platform === "facebook" && account.accessToken && account.pageId) {
      const remote = await postFacebook(account, image, caption);
      return { platform: "facebook", ok: true, url: remote || liveUrl, remote: true, postedAt };
    }
    if (account.platform === "instagram" && account.accessToken && account.igUserId) {
      const remote = await postInstagram(account, image, caption);
      return { platform: "instagram", ok: true, url: remote || liveUrl, remote: true, postedAt };
    }
    return { platform: account.platform, ok: true, url: liveUrl, remote: false, postedAt };
  } catch (err) {
    return {
      platform: account.platform,
      ok: true,
      url: liveUrl,
      remote: false,
      postedAt,
      error: err instanceof Error ? err.message : "Network push failed — live on Looply board",
    };
  }
}

export async function executePublish(opts: {
  userId: string;
  generationId: string;
  platforms?: SocialPlatform[];
  scheduledFor?: string;
}) {
  const item = await getGeneration(opts.userId, opts.generationId);
  if (!item) throw new Error("Post not found");
  const brand = await getBrand(opts.userId);
  const accounts = (await listAccounts(opts.userId)).filter((a) => a.connected);
  const platforms =
    opts.platforms?.length
      ? opts.platforms
      : accounts.map((a) => a.platform).filter((p, i, all) => all.indexOf(p) === i);
  const chosen = (platforms.length ? platforms : ALL).filter((p) =>
    accounts.some((a) => a.platform === p),
  );
  if (!chosen.length) throw new Error("Connect at least one network first");

  const now = new Date().toISOString();
  if (opts.scheduledFor && Date.parse(opts.scheduledFor) > Date.now() + 4000) {
    const job = await addJob({
      id: newId("job"),
      userId: opts.userId,
      generationId: item.id,
      platforms: chosen,
      status: "scheduled",
      scheduledFor: opts.scheduledFor,
      results: [],
      createdAt: now,
      updatedAt: now,
    });
    const updated = await patchGeneration(opts.userId, item.id, {
      status: "scheduled",
      scheduledFor: opts.scheduledFor,
    });
    return { job, item: updated ?? item, deferred: true as const };
  }

  return finishPublish({ userId: opts.userId, item, brand, accounts, platforms: chosen });
}

async function finishPublish(opts: {
  userId: string;
  item: Generation;
  brand: Brand | null;
  accounts: SocialAccount[];
  platforms: SocialPlatform[];
  jobId?: string;
}) {
  const caption = captionOf(opts.item);
  const image = ensureImage(opts.item, opts.brand);
  const results: PublishResult[] = [];
  for (const platform of opts.platforms) {
    const account = opts.accounts.find((a) => a.platform === platform);
    if (!account) {
      results.push({ platform, ok: false, error: "Not connected" });
      continue;
    }
    results.push(await runPlatform(account, opts.item, image, caption));
  }
  const postedTo = results.filter((r) => r.ok).map((r) => r.platform);
  const now = new Date().toISOString();
  const jobPayload: PublishJob = {
    id: opts.jobId || newId("job"),
    userId: opts.userId,
    generationId: opts.item.id,
    platforms: opts.platforms,
    status: postedTo.length ? "posted" : "failed",
    results,
    createdAt: now,
    updatedAt: now,
  };
  const job = opts.jobId
    ? (await patchJob(opts.jobId, jobPayload)) ?? jobPayload
    : await addJob(jobPayload);
  const item = await patchGeneration(opts.userId, opts.item.id, {
    status: postedTo.length ? "posted" : opts.item.status,
    imageUrl: image,
    permalink: `/p/${opts.item.id}`,
    postedTo,
    publishResults: results,
  });
  return { job, item: item ?? opts.item, deferred: false as const };
}

export async function tickPublish() {
  const due = await dueJobs();
  const scheduled = await dueScheduledGenerations();
  const published: Generation[] = [];
  for (const job of due) {
    const item = await getGeneration(job.userId, job.generationId);
    if (!item || item.status === "posted") {
      await patchJob(job.id, { status: "posted" });
      continue;
    }
    const brand = await getBrand(job.userId);
    const accounts = (await listAccounts(job.userId)).filter((a) => a.connected);
    const result = await finishPublish({
      userId: job.userId,
      item,
      brand,
      accounts,
      platforms: job.platforms,
      jobId: job.id,
    });
    if (result.item.status === "posted") published.push(result.item);
  }
  for (const item of scheduled) {
    if (published.some((p) => p.id === item.id) || item.status === "posted") continue;
    const accounts = (await listAccounts(item.userId)).filter((a) => a.connected);
    if (!accounts.length) continue;
    const existing = (await listJobs(item.userId)).find(
      (j) => j.generationId === item.id && (j.status === "posted" || j.status === "scheduled"),
    );
    if (existing?.status === "posted") continue;
    if (existing?.status === "scheduled") continue;
    const brand = await getBrand(item.userId);
    const result = await finishPublish({
      userId: item.userId,
      item,
      brand,
      accounts,
      platforms: accounts.map((a) => a.platform),
    });
    if (result.item.status === "posted") published.push(result.item);
  }
  return { published: published.length, items: published };
}
