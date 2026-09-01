import { request as httpsRequest } from "node:https";
import type { Brand, GenText } from "./types";

export function brandContext(brand: Brand | null) {
  if (!brand) {
    return "No brand kit yet. Write as a careful operator for a small independent business.";
  }
  return [
    `Business: ${brand.businessName}`,
    `Industry: ${brand.industry}`,
    `City: ${brand.city}`,
    `Website: ${brand.website || "none"}`,
    `Language: ${brand.language}`,
    `Tone: ${brand.tone}`,
    `Audience: ${brand.audience}`,
    `Current offer: ${brand.offer}`,
    `Products: ${brand.products}`,
    `Colors: ${brand.colors}`,
  ].join("\n");
}

function extractText(data: unknown): string {
  if (typeof data === "string") return data;
  if (!data || typeof data !== "object") return "";
  const record = data as Record<string, unknown>;
  if (typeof record.content === "string") return record.content;
  if (typeof record.text === "string") return record.text;
  const choices = record.choices;
  if (Array.isArray(choices) && choices[0] && typeof choices[0] === "object") {
    const choice = choices[0] as Record<string, unknown>;
    const message = choice.message as Record<string, unknown> | undefined;
    if (typeof message?.content === "string") return message.content;
    if (typeof choice.text === "string") return choice.text;
  }
  return JSON.stringify(data);
}

function postJson(
  hostname: string,
  path: string,
  body: unknown,
  headers: Record<string, string>,
  timeoutMs: number,
): Promise<{ status: number; text: string }> {
  const payload = JSON.stringify(body);
  return new Promise((resolve, reject) => {
    const req = httpsRequest(
      {
        hostname,
        path,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": String(Buffer.byteLength(payload)),
          ...headers,
        },
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (chunk) => chunks.push(chunk as Buffer));
        res.on("end", () =>
          resolve({
            status: res.statusCode ?? 500,
            text: Buffer.concat(chunks).toString("utf8"),
          }),
        );
      },
    );
    req.on("error", reject);
    req.setTimeout(timeoutMs, () => {
      req.destroy(new Error("timeout"));
    });
    req.write(payload);
    req.end();
  });
}

async function generateGrok(
  messages: { role: "system" | "user" | "assistant"; content: string }[],
  maxTokens: number,
): Promise<string | null> {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) return null;
  const res = await postJson(
    "api.x.ai",
    "/v1/chat/completions",
    {
      model: "grok-4.5",
      messages,
      max_tokens: maxTokens,
      temperature: 0.7,
    },
    { Authorization: `Bearer ${apiKey}` },
    18000,
  );
  if (res.status >= 400) return null;
  const body = JSON.parse(res.text) as {
    choices?: { message?: { content?: string } }[];
  };
  return body.choices?.[0]?.message?.content?.trim() || null;
}

async function generatePollinations(
  messages: { role: "system" | "user" | "assistant"; content: string }[],
): Promise<string | null> {
  const res = await postJson(
    "text.pollinations.ai",
    "/",
    { messages, model: "openai" },
    {},
    12000,
  );
  if (res.status >= 400) return null;
  const ctypeGuess = res.text.trim().startsWith("{") ? "json" : "text";
  if (ctypeGuess === "json") {
    try {
      return extractText(JSON.parse(res.text)).trim() || null;
    } catch {
      return res.text.trim() || null;
    }
  }
  return res.text.trim() || null;
}

export async function generateText(
  messages: { role: "system" | "user" | "assistant"; content: string }[],
  fallback: string,
  opts?: { maxTokens?: number },
): Promise<GenText> {
  try {
    const grok = await generateGrok(messages, opts?.maxTokens ?? 500);
    if (grok) return { text: grok, source: "grok" };
  } catch {
    // try pollinations
  }
  try {
    const pollinated = await generatePollinations(messages);
    if (pollinated) return { text: pollinated, source: "pollinations" };
  } catch {
    // local fallback
  }
  return { text: fallback, source: "fallback" };
}

export function imageUrl(
  prompt: string,
  width: number,
  height: number,
  seed = Math.floor(Math.random() * 1_000_000),
) {
  const encoded = encodeURIComponent(prompt.replace(/\s+/g, " ").trim());
  return `https://image.pollinations.ai/prompt/${encoded}?width=${width}&height=${height}&nologo=true&enhance=true&seed=${seed}`;
}

export function parseLooseJson<T = unknown>(text: string): T | null {
  if (!text) return null;
  const trimmed = text.trim();
  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = (fence ? fence[1] : trimmed).trim();
  const tryParse = (value: string) => {
    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  };
  const direct = tryParse(raw);
  if (direct) return direct;
  const objStart = raw.indexOf("{");
  const objEnd = raw.lastIndexOf("}");
  if (objStart >= 0 && objEnd > objStart) {
    const parsed = tryParse(raw.slice(objStart, objEnd + 1));
    if (parsed) return parsed;
  }
  const arrStart = raw.indexOf("[");
  const arrEnd = raw.lastIndexOf("]");
  if (arrStart >= 0 && arrEnd > arrStart) {
    const parsed = tryParse(raw.slice(arrStart, arrEnd + 1));
    if (parsed) return parsed;
  }
  return null;
}

export const COPY_RULES = [
  "You write for ONE specific business from the brand kit. Never generic fashion, cafe, or startup copy.",
  "Name the business and city. Name a real product from the kit. Name the current offer. End with a next step.",
  "Short, concrete, owner-to-operator.",
  "Posts: 80–140 words plus about 8 hashtags.",
  "Replies: max ~70 words.",
  "If language includes Hindi, add one short natural Hindi line — not a translation dump.",
  "Do not invent a live Instagram connection, ad spend, or full AI-actor video unless asked to draft as if posted.",
].join(" ");
