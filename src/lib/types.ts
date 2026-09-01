export type PlanId = "start" | "growth" | "pro";

export type GenerationKind =
  | "post"
  | "image"
  | "reel"
  | "ad"
  | "calendar"
  | "reply"
  | "review"
  | "website";

export type GenerationStatus = "draft" | "ready" | "scheduled" | "posted";

export type Channel = "instagram" | "whatsapp" | "google" | "facebook";

export type SocialPlatform = "instagram" | "facebook" | "google" | "whatsapp";

export type AiSource = "grok" | "pollinations" | "fallback";

export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  plan: PlanId;
  credits: number;
  createdAt: string;
};

export type PublicUser = Omit<User, "passwordHash">;

export type Brand = {
  userId: string;
  businessName: string;
  website: string;
  industry: string;
  city: string;
  language: string;
  tone: string;
  audience: string;
  offer: string;
  products: string;
  colors: string;
  onboarded: boolean;
  updatedAt: string;
};

export type PublishResult = {
  platform: SocialPlatform;
  ok: boolean;
  url?: string;
  remote?: boolean;
  error?: string;
  postedAt?: string;
};

export type Generation = {
  id: string;
  userId: string;
  kind: GenerationKind;
  title: string;
  prompt: string;
  caption?: string;
  body?: string;
  imageUrl?: string;
  images?: string[];
  platform?: string;
  status: GenerationStatus;
  scheduledFor?: string;
  createdAt: string;
  source?: AiSource;
  used?: Record<string, string>;
  permalink?: string;
  postedTo?: SocialPlatform[];
  publishResults?: PublishResult[];
};

export type InboxMessage = {
  id: string;
  userId: string;
  channel: Channel;
  from: string;
  text: string;
  reply?: string;
  createdAt: string;
};

export type SocialAccount = {
  id: string;
  userId: string;
  platform: SocialPlatform;
  handle: string;
  displayName: string;
  connected: boolean;
  accessToken?: string;
  pageId?: string;
  igUserId?: string;
  connectedAt?: string;
};

export type PublicSocialAccount = Omit<SocialAccount, "accessToken"> & {
  hasToken: boolean;
};

export type PublishJob = {
  id: string;
  userId: string;
  generationId: string;
  platforms: SocialPlatform[];
  status: "queued" | "publishing" | "posted" | "failed" | "scheduled";
  scheduledFor?: string;
  results: PublishResult[];
  createdAt: string;
  updatedAt: string;
};

export type Store = {
  users: User[];
  brands: Brand[];
  generations: Generation[];
  messages: InboxMessage[];
  accounts: SocialAccount[];
  jobs: PublishJob[];
};

export type SessionPayload = {
  user: PublicUser;
  brand: Brand | null;
};

export type GenText = {
  text: string;
  source: AiSource;
};
