import {
  createHmac,
  randomBytes,
  scrypt as scryptCb,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";
import { findUserByEmail, findUserById } from "./store";
import type { PublicUser, User } from "./types";

const scrypt = promisify(scryptCb);
const SESSION_SECRET = "looply-hmac-session-v1-run-marketing-24-7";
const COOKIE = "looply_session";
const MAX_AGE = 14 * 24 * 60 * 60;
const DEMO_EMAIL = "demo@looply.app";
const DEMO_PASSWORD = "demo1234";

export { COOKIE as SESSION_COOKIE, MAX_AGE as SESSION_MAX_AGE };

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const hash = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string) {
  try {
    const [saltHex, hashHex] = stored.split(":");
    if (!saltHex || !hashHex || saltHex.length < 16) return false;
    const salt = Buffer.from(saltHex, "hex");
    const hash = Buffer.from(hashHex, "hex");
    const test = (await scrypt(password, salt, 64)) as Buffer;
    if (test.length !== hash.length) return false;
    return timingSafeEqual(test, hash);
  } catch {
    return false;
  }
}

export function signSession(userId: string) {
  const exp = Date.now() + MAX_AGE * 1000;
  const payload = `${userId}.${exp}`;
  const sig = createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");
  return Buffer.from(`${payload}.${sig}`).toString("base64url");
}

export function verifySession(token: string | undefined | null): string | null {
  if (!token) return null;
  try {
    const raw = Buffer.from(token, "base64url").toString();
    const lastDot = raw.lastIndexOf(".");
    if (lastDot < 0) return null;
    const payload = raw.slice(0, lastDot);
    const sig = raw.slice(lastDot + 1);
    const expected = createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
    const [userId, expStr] = payload.split(".");
    if (!userId || Date.now() > Number(expStr)) return null;
    return userId;
  } catch {
    return null;
  }
}

export function readCookie(request: Request, name = COOKIE) {
  const header = request.headers.get("cookie") ?? "";
  for (const part of header.split(";")) {
    const trimmed = part.trim();
    const eq = trimmed.indexOf("=");
    if (eq < 0) continue;
    if (trimmed.slice(0, eq) === name) return decodeURIComponent(trimmed.slice(eq + 1));
  }
  return undefined;
}

export function sessionCookie(token: string, request?: Request) {
  const secure =
    request?.headers.get("x-forwarded-proto") === "https" ||
    request?.url.startsWith("https://");
  const parts = [
    `${COOKIE}=${token}`,
    "HttpOnly",
    "Path=/",
    `Max-Age=${MAX_AGE}`,
    "SameSite=Lax",
  ];
  if (secure) parts.push("Secure");
  return parts.join("; ");
}

export function clearSessionCookie() {
  return `${COOKIE}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`;
}

export function toPublicUser(user: User): PublicUser {
  const { passwordHash: _ignored, ...rest } = user;
  return rest;
}

export async function authenticate(email: string, password: string) {
  const user = await findUserByEmail(email);
  if (!user) return null;
  const isDemo = email.toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD;
  if (isDemo) return user;
  const ok = await verifyPassword(password, user.passwordHash);
  return ok ? user : null;
}

export async function userFromRequest(request: Request) {
  const token = readCookie(request);
  const userId = verifySession(token);
  if (!userId) return null;
  return findUserById(userId);
}
