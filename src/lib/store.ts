import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { brandSlug } from "./brand";
import { nid } from "./ids";
import type {
  Brand,
  Generation,
  InboxMessage,
  PublishJob,
  SocialAccount,
  Store,
  User,
} from "./types";

const DEMO_EMAIL = "demo@looply.app";

function demoAccounts(userId: string, now: string): SocialAccount[] {
  return [
    {
      id: "acc_demo_ig",
      userId,
      platform: "instagram",
      handle: "@nimrahatelier",
      displayName: "Nimrah Atelier",
      connected: true,
      connectedAt: now,
    },
    {
      id: "acc_demo_fb",
      userId,
      platform: "facebook",
      handle: "Nimrah Atelier",
      displayName: "Nimrah Atelier",
      connected: true,
      connectedAt: now,
    },
    {
      id: "acc_demo_g",
      userId,
      platform: "google",
      handle: "Nimrah Atelier · Delhi",
      displayName: "Google Business",
      connected: true,
      connectedAt: now,
    },
    {
      id: "acc_demo_wa",
      userId,
      platform: "whatsapp",
      handle: "+91 11 4000 2211",
      displayName: "WhatsApp Business",
      connected: true,
      connectedAt: now,
    },
  ];
}

function seedStore(): Store {
  const now = new Date().toISOString();
  const demoUser: User = {
    id: "user_demo",
    name: "Nimrah",
    email: DEMO_EMAIL,
    passwordHash: "seeded:demo",
    plan: "growth",
    credits: 86,
    createdAt: now,
  };
  const demoBrand: Brand = {
    userId: demoUser.id,
    businessName: "Nimrah Atelier",
    website: "https://nimrahatelier.example",
    industry: "boutique fashion",
    city: "Delhi",
    language: "English + Hindi",
    tone: "warm confident",
    audience: "women who want linen and silk that actually fit",
    offer: "New linen drop + free hemming this week",
    products: "linen sets, kurtas, silk shirts",
    colors: "ivory, forest green, warm gold",
    onboarded: true,
    updatedAt: now,
  };
  const messages: InboxMessage[] = [
    {
      id: "msg_demo_1",
      userId: demoUser.id,
      channel: "instagram",
      from: "ananya.k",
      text: "Do you ship the forest green kurta set to Noida, and can you hem it to 5'2\"?",
      createdAt: now,
    },
    {
      id: "msg_demo_2",
      userId: demoUser.id,
      channel: "whatsapp",
      from: "+91 98111 44021",
      text: "Hi, I saw the linen drop. Do you have the ivory set in size M, and is hemming really free this week?",
      createdAt: now,
    },
  ];
  return {
    users: [demoUser],
    brands: [demoBrand],
    generations: [],
    messages,
    accounts: demoAccounts(demoUser.id, now),
    jobs: [],
  };
}

function candidatePaths() {
  return [
    join(process.cwd(), "data", "store.json"),
    join("/tmp", "looply-store.json"),
  ];
}

let cache: Store | null = null;
let persistPath: string | null = null;
let chain: Promise<unknown> = Promise.resolve();

function tryRead(path: string): Store | null {
  try {
    if (!existsSync(path)) return null;
    const raw = readFileSync(path, "utf8");
    const parsed = JSON.parse(raw) as Store;
    if (!parsed || !Array.isArray(parsed.users)) return null;
    return {
      users: parsed.users ?? [],
      brands: parsed.brands ?? [],
      generations: parsed.generations ?? [],
      messages: parsed.messages ?? [],
      accounts: parsed.accounts ?? [],
      jobs: parsed.jobs ?? [],
    };
  } catch {
    return null;
  }
}

function tryWrite(path: string, store: Store) {
  try {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, JSON.stringify(store, null, 2), "utf8");
    persistPath = path;
    return true;
  } catch {
    return false;
  }
}

function persist(store: Store) {
  const paths = persistPath ? [persistPath, ...candidatePaths()] : candidatePaths();
  for (const path of paths) {
    if (tryWrite(path, store)) return;
  }
}

function ensureDemo(store: Store) {
  if (!store.users.some((u) => u.email === DEMO_EMAIL)) {
    const seeded = seedStore();
    store.users.push(...seeded.users);
    store.brands.push(...seeded.brands);
    store.messages.push(...seeded.messages);
    store.accounts.push(...seeded.accounts);
  } else if (!store.accounts.some((a) => a.userId === "user_demo")) {
    store.accounts.push(...demoAccounts("user_demo", new Date().toISOString()));
  }
}

function load(): Store {
  if (cache) return cache;
  for (const path of candidatePaths()) {
    const store = tryRead(path);
    if (store) {
      ensureDemo(store);
      persistPath = path;
      cache = store;
      persist(store);
      return store;
    }
  }
  const seeded = seedStore();
  cache = seeded;
  persist(seeded);
  return seeded;
}

function mutate<T>(fn: (store: Store) => T): Promise<T> {
  const run = chain.then(() => {
    const store = load();
    const result = fn(store);
    persist(store);
    return result;
  });
  chain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

export async function readStore(): Promise<Store> {
  const run = chain.then(() => load());
  chain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

export async function findUserByEmail(email: string) {
  const store = await readStore();
  return store.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function findUserById(id: string) {
  const store = await readStore();
  return store.users.find((u) => u.id === id) ?? null;
}

export async function getBrand(userId: string) {
  const store = await readStore();
  return store.brands.find((b) => b.userId === userId) ?? null;
}

export async function insertUser(user: User) {
  return mutate((store) => {
    store.users.push(user);
    return user;
  });
}

export async function updateUser(id: string, patch: Partial<User>) {
  return mutate((store) => {
    const user = store.users.find((u) => u.id === id);
    if (!user) return null;
    Object.assign(user, patch);
    return user;
  });
}

export async function upsertBrand(brand: Brand) {
  return mutate((store) => {
    const idx = store.brands.findIndex((b) => b.userId === brand.userId);
    if (idx >= 0) store.brands[idx] = brand;
    else store.brands.push(brand);
    return brand;
  });
}

export async function addGeneration(item: Generation) {
  return mutate((store) => {
    store.generations.unshift(item);
    return item;
  });
}

export async function addGenerations(items: Generation[]) {
  return mutate((store) => {
    store.generations.unshift(...items);
    return items;
  });
}

export async function listGenerations(userId: string) {
  const store = await readStore();
  return store.generations
    .filter((g) => g.userId === userId)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function getGeneration(userId: string, id: string) {
  const store = await readStore();
  return store.generations.find((g) => g.id === id && g.userId === userId) ?? null;
}

export async function getGenerationById(id: string) {
  const store = await readStore();
  return store.generations.find((g) => g.id === id) ?? null;
}

export async function patchGeneration(
  userId: string,
  id: string,
  patch: Partial<Generation>,
) {
  return mutate((store) => {
    const item = store.generations.find((g) => g.id === id && g.userId === userId);
    if (!item) return null;
    Object.assign(item, patch);
    return item;
  });
}

export async function listMessages(userId: string) {
  const store = await readStore();
  return store.messages
    .filter((m) => m.userId === userId)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function addMessage(message: InboxMessage) {
  return mutate((store) => {
    store.messages.unshift(message);
    return message;
  });
}

export async function spendCredits(userId: string, amount: number) {
  return mutate((store) => {
    const user = store.users.find((u) => u.id === userId);
    if (!user) return null;
    if (user.credits < amount) return { ok: false as const, credits: user.credits };
    user.credits -= amount;
    return { ok: true as const, credits: user.credits, user };
  });
}

export async function addPlanCredits(userId: string, plan: User["plan"], credits: number) {
  return mutate((store) => {
    const user = store.users.find((u) => u.id === userId);
    if (!user) return null;
    user.plan = plan;
    user.credits += credits;
    return user;
  });
}

export async function listAccounts(userId: string) {
  const store = await readStore();
  return store.accounts.filter((a) => a.userId === userId);
}

export async function upsertAccount(account: SocialAccount) {
  return mutate((store) => {
    const idx = store.accounts.findIndex(
      (a) => a.userId === account.userId && a.platform === account.platform,
    );
    if (idx >= 0) {
      const prev = store.accounts[idx];
      const next = { ...prev, ...account, id: prev.id };
      if (!account.accessToken) next.accessToken = prev.accessToken;
      store.accounts[idx] = next;
      return next;
    }
    store.accounts.push(account);
    return account;
  });
}

export async function addJob(job: PublishJob) {
  return mutate((store) => {
    store.jobs.unshift(job);
    return job;
  });
}

export async function patchJob(id: string, patch: Partial<PublishJob>) {
  return mutate((store) => {
    const job = store.jobs.find((j) => j.id === id);
    if (!job) return null;
    Object.assign(job, patch, { updatedAt: new Date().toISOString() });
    return job;
  });
}

export async function listJobs(userId: string) {
  const store = await readStore();
  return store.jobs
    .filter((j) => j.userId === userId)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function dueJobs(now = Date.now()) {
  const store = await readStore();
  return store.jobs.filter((job) => {
    if (job.status !== "scheduled" || !job.scheduledFor) return false;
    return Date.parse(job.scheduledFor) <= now;
  });
}

export async function dueScheduledGenerations(now = Date.now()) {
  const store = await readStore();
  return store.generations.filter((item) => {
    if (item.status !== "scheduled" || !item.scheduledFor) return false;
    const raw = item.scheduledFor;
    const ts = raw.length === 10 ? Date.parse(`${raw}T09:00:00.000Z`) : Date.parse(raw);
    return Number.isFinite(ts) && ts <= now;
  });
}

export async function findBrandBySlug(slug: string) {
  const store = await readStore();
  const needle = slug.toLowerCase();
  return store.brands.find((b) => brandSlug(b.businessName) === needle) ?? null;
}

export function newId(prefix: string) {
  return nid(prefix);
}

export function toPublicAccount(account: SocialAccount) {
  const { accessToken: _t, ...rest } = account;
  return { ...rest, hasToken: Boolean(account.accessToken) };
}
