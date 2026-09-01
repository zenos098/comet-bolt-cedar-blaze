import { i as __toESM } from "../_runtime.mjs";
import { B as require_jsx_runtime, _ as createRootRoute, b as useRouter, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent, z as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TriangleAlert } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { request } from "node:https";
import { createHmac, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { promisify } from "node:util";
//#region node_modules/.nitro/vite/services/ssr/assets/router-s0Jy-Dzk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: error.message || "An unexpected error occurred. Try reloading the page."
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	if (typeof window === "undefined") return () => {};
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	const parentOrigin = resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		if (envelope.data.type === "hello") {
			if (!HelloSchema.safeParse(event.data).success) return;
			announce();
			return;
		}
		if (envelope.data.type === "navigate") {
			const parsed = NavigateSchema.safeParse(event.data);
			if (!parsed.success) return;
			navigate(parsed.data.path);
			queueMicrotask(reportLocation);
			return;
		}
		if (envelope.data.type === "history") {
			const parsed = HistorySchema.safeParse(event.data);
			if (!parsed.success) return;
			if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
			window.history.go(parsed.data.delta);
		}
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var styles_default = "/assets/styles-4oA6F8Zg.css";
var Route$37 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Looply — Run marketing 24/7." },
			{
				name: "description",
				content: "Looply keeps a business growing online — creating, posting, answering and advertising while the owner runs the shop."
			},
			{
				name: "theme-color",
				content: "#070706"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;500;600;650&family=Outfit:wght@400;500;600;700&display=swap"
			}
		]
	}),
	component: RootDocument
});
function RootDocument() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		suppressHydrationWarning: true,
		className: "antialiased",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "min-h-screen bg-ink text-cream font-sans",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
			]
		})]
	});
}
var $$splitComponentImporter$18 = () => import("./routes-ga5Hxsak.mjs");
var Route$36 = createFileRoute("/")({
	component: lazyRouteComponent($$splitComponentImporter$18, "component"),
	head: () => ({ meta: [{ title: "Looply — Run marketing 24/7." }] })
});
var $$splitComponentImporter$17 = () => import("./contact-D4z6lDUP.mjs");
var Route$35 = createFileRoute("/contact")({
	component: lazyRouteComponent($$splitComponentImporter$17, "component"),
	head: () => ({ meta: [{ title: "Contact — Looply" }] })
});
var $$splitComponentImporter$16 = () => import("./examples-s-2gHklH.mjs");
var Route$34 = createFileRoute("/examples")({
	component: lazyRouteComponent($$splitComponentImporter$16, "component"),
	head: () => ({ meta: [{ title: "Examples — Looply" }] })
});
var $$splitComponentImporter$15 = () => import("./login-Bw4_9FOx.mjs");
var Route$33 = createFileRoute("/login")({
	component: lazyRouteComponent($$splitComponentImporter$15, "component"),
	head: () => ({ meta: [{ title: "AI Creative Studio — Looply" }] })
});
var $$splitComponentImporter$14 = () => import("./pricing-rP0hvrnn.mjs");
var Route$32 = createFileRoute("/pricing")({
	component: lazyRouteComponent($$splitComponentImporter$14, "component"),
	head: () => ({ meta: [{ title: "Pricing — Looply" }] })
});
var $$splitComponentImporter$13 = () => import("./signup-C0rpmlu9.mjs");
var Route$31 = createFileRoute("/signup")({
	component: lazyRouteComponent($$splitComponentImporter$13, "component"),
	head: () => ({ meta: [{ title: "Get the app — Looply" }] })
});
var $$splitComponentImporter$12 = () => import("./studio-CgLRXs7V.mjs");
var Route$30 = createFileRoute("/studio")({
	component: lazyRouteComponent($$splitComponentImporter$12, "component"),
	head: () => ({ meta: [{ title: "Studio — Looply" }] })
});
function brandSlug(name) {
	return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "shop";
}
function brandFacts(brand) {
	if (!brand) return [];
	return [
		{
			label: "Business",
			value: brand.businessName
		},
		{
			label: "City",
			value: brand.city
		},
		{
			label: "Industry",
			value: brand.industry
		},
		{
			label: "Audience",
			value: brand.audience
		},
		{
			label: "Offer",
			value: brand.offer
		},
		{
			label: "Products",
			value: brand.products
		},
		{
			label: "Colors",
			value: brand.colors
		},
		{
			label: "Tone",
			value: brand.tone
		},
		{
			label: "Language",
			value: brand.language
		}
	].filter((row) => row.value.trim().length > 0);
}
function usedFromBrand(brand) {
	const used = {};
	for (const row of brandFacts(brand)) used[row.label] = row.value;
	return used;
}
function nid(prefix) {
	const rand = Math.random().toString(36).slice(2, 8);
	return `${prefix}_${Date.now().toString(36)}_${rand}`;
}
var DEMO_EMAIL$1 = "demo@looply.app";
function demoAccounts(userId, now) {
	return [
		{
			id: "acc_demo_ig",
			userId,
			platform: "instagram",
			handle: "@nimrahatelier",
			displayName: "Nimrah Atelier",
			connected: true,
			connectedAt: now
		},
		{
			id: "acc_demo_fb",
			userId,
			platform: "facebook",
			handle: "Nimrah Atelier",
			displayName: "Nimrah Atelier",
			connected: true,
			connectedAt: now
		},
		{
			id: "acc_demo_g",
			userId,
			platform: "google",
			handle: "Nimrah Atelier · Delhi",
			displayName: "Google Business",
			connected: true,
			connectedAt: now
		},
		{
			id: "acc_demo_wa",
			userId,
			platform: "whatsapp",
			handle: "+91 11 4000 2211",
			displayName: "WhatsApp Business",
			connected: true,
			connectedAt: now
		}
	];
}
function seedStore() {
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const demoUser = {
		id: "user_demo",
		name: "Nimrah",
		email: DEMO_EMAIL$1,
		passwordHash: "seeded:demo",
		plan: "growth",
		credits: 86,
		createdAt: now
	};
	const demoBrand = {
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
		updatedAt: now
	};
	const messages = [{
		id: "msg_demo_1",
		userId: demoUser.id,
		channel: "instagram",
		from: "ananya.k",
		text: "Do you ship the forest green kurta set to Noida, and can you hem it to 5'2\"?",
		createdAt: now
	}, {
		id: "msg_demo_2",
		userId: demoUser.id,
		channel: "whatsapp",
		from: "+91 98111 44021",
		text: "Hi, I saw the linen drop. Do you have the ivory set in size M, and is hemming really free this week?",
		createdAt: now
	}];
	return {
		users: [demoUser],
		brands: [demoBrand],
		generations: [],
		messages,
		accounts: demoAccounts(demoUser.id, now),
		jobs: []
	};
}
function candidatePaths() {
	return [join(process.cwd(), "data", "store.json"), join("/tmp", "looply-store.json")];
}
var cache = null;
var persistPath = null;
var chain = Promise.resolve();
function tryRead(path) {
	try {
		if (!existsSync(path)) return null;
		const raw = readFileSync(path, "utf8");
		const parsed = JSON.parse(raw);
		if (!parsed || !Array.isArray(parsed.users)) return null;
		return {
			users: parsed.users ?? [],
			brands: parsed.brands ?? [],
			generations: parsed.generations ?? [],
			messages: parsed.messages ?? [],
			accounts: parsed.accounts ?? [],
			jobs: parsed.jobs ?? []
		};
	} catch {
		return null;
	}
}
function tryWrite(path, store) {
	try {
		mkdirSync(dirname(path), { recursive: true });
		writeFileSync(path, JSON.stringify(store, null, 2), "utf8");
		persistPath = path;
		return true;
	} catch {
		return false;
	}
}
function persist(store) {
	const paths = persistPath ? [persistPath, ...candidatePaths()] : candidatePaths();
	for (const path of paths) if (tryWrite(path, store)) return;
}
function ensureDemo(store) {
	if (!store.users.some((u) => u.email === DEMO_EMAIL$1)) {
		const seeded = seedStore();
		store.users.push(...seeded.users);
		store.brands.push(...seeded.brands);
		store.messages.push(...seeded.messages);
		store.accounts.push(...seeded.accounts);
	} else if (!store.accounts.some((a) => a.userId === "user_demo")) store.accounts.push(...demoAccounts("user_demo", (/* @__PURE__ */ new Date()).toISOString()));
}
function load() {
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
function mutate(fn) {
	const run = chain.then(() => {
		const store = load();
		const result = fn(store);
		persist(store);
		return result;
	});
	chain = run.then(() => void 0, () => void 0);
	return run;
}
async function readStore() {
	const run = chain.then(() => load());
	chain = run.then(() => void 0, () => void 0);
	return run;
}
async function findUserByEmail(email) {
	return (await readStore()).users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}
async function findUserById(id) {
	return (await readStore()).users.find((u) => u.id === id) ?? null;
}
async function getBrand(userId) {
	return (await readStore()).brands.find((b) => b.userId === userId) ?? null;
}
async function insertUser(user) {
	return mutate((store) => {
		store.users.push(user);
		return user;
	});
}
async function upsertBrand(brand) {
	return mutate((store) => {
		const idx = store.brands.findIndex((b) => b.userId === brand.userId);
		if (idx >= 0) store.brands[idx] = brand;
		else store.brands.push(brand);
		return brand;
	});
}
async function addGeneration(item) {
	return mutate((store) => {
		store.generations.unshift(item);
		return item;
	});
}
async function addGenerations(items) {
	return mutate((store) => {
		store.generations.unshift(...items);
		return items;
	});
}
async function listGenerations(userId) {
	return (await readStore()).generations.filter((g) => g.userId === userId).sort((a, b) => a.createdAt < b.createdAt ? 1 : -1);
}
async function getGeneration(userId, id) {
	return (await readStore()).generations.find((g) => g.id === id && g.userId === userId) ?? null;
}
async function patchGeneration(userId, id, patch) {
	return mutate((store) => {
		const item = store.generations.find((g) => g.id === id && g.userId === userId);
		if (!item) return null;
		Object.assign(item, patch);
		return item;
	});
}
async function listMessages(userId) {
	return (await readStore()).messages.filter((m) => m.userId === userId).sort((a, b) => a.createdAt < b.createdAt ? 1 : -1);
}
async function addMessage(message) {
	return mutate((store) => {
		store.messages.unshift(message);
		return message;
	});
}
async function spendCredits(userId, amount) {
	return mutate((store) => {
		const user = store.users.find((u) => u.id === userId);
		if (!user) return null;
		if (user.credits < amount) return {
			ok: false,
			credits: user.credits
		};
		user.credits -= amount;
		return {
			ok: true,
			credits: user.credits,
			user
		};
	});
}
async function addPlanCredits(userId, plan, credits) {
	return mutate((store) => {
		const user = store.users.find((u) => u.id === userId);
		if (!user) return null;
		user.plan = plan;
		user.credits += credits;
		return user;
	});
}
async function listAccounts(userId) {
	return (await readStore()).accounts.filter((a) => a.userId === userId);
}
async function upsertAccount(account) {
	return mutate((store) => {
		const idx = store.accounts.findIndex((a) => a.userId === account.userId && a.platform === account.platform);
		if (idx >= 0) {
			const prev = store.accounts[idx];
			const next = {
				...prev,
				...account,
				id: prev.id
			};
			if (!account.accessToken) next.accessToken = prev.accessToken;
			store.accounts[idx] = next;
			return next;
		}
		store.accounts.push(account);
		return account;
	});
}
async function addJob(job) {
	return mutate((store) => {
		store.jobs.unshift(job);
		return job;
	});
}
async function patchJob(id, patch) {
	return mutate((store) => {
		const job = store.jobs.find((j) => j.id === id);
		if (!job) return null;
		Object.assign(job, patch, { updatedAt: (/* @__PURE__ */ new Date()).toISOString() });
		return job;
	});
}
async function listJobs(userId) {
	return (await readStore()).jobs.filter((j) => j.userId === userId).sort((a, b) => a.createdAt < b.createdAt ? 1 : -1);
}
async function dueJobs(now = Date.now()) {
	return (await readStore()).jobs.filter((job) => {
		if (job.status !== "scheduled" || !job.scheduledFor) return false;
		return Date.parse(job.scheduledFor) <= now;
	});
}
async function dueScheduledGenerations(now = Date.now()) {
	return (await readStore()).generations.filter((item) => {
		if (item.status !== "scheduled" || !item.scheduledFor) return false;
		const raw = item.scheduledFor;
		const ts = raw.length === 10 ? Date.parse(`${raw}T09:00:00.000Z`) : Date.parse(raw);
		return Number.isFinite(ts) && ts <= now;
	});
}
async function findBrandBySlug(slug) {
	const store = await readStore();
	const needle = slug.toLowerCase();
	return store.brands.find((b) => brandSlug(b.businessName) === needle) ?? null;
}
function newId(prefix) {
	return nid(prefix);
}
function toPublicAccount(account) {
	const { accessToken: _t, ...rest } = account;
	return {
		...rest,
		hasToken: Boolean(account.accessToken)
	};
}
var scrypt$1 = promisify(scrypt);
var SESSION_SECRET = "looply-hmac-session-v1-run-marketing-24-7";
var COOKIE = "looply_session";
var MAX_AGE = 1209600;
var DEMO_EMAIL = "demo@looply.app";
var DEMO_PASSWORD = "demo1234";
async function hashPassword(password) {
	const salt = randomBytes(16);
	const hash = await scrypt$1(password, salt, 64);
	return `${salt.toString("hex")}:${hash.toString("hex")}`;
}
async function verifyPassword(password, stored) {
	try {
		const [saltHex, hashHex] = stored.split(":");
		if (!saltHex || !hashHex || saltHex.length < 16) return false;
		const salt = Buffer.from(saltHex, "hex");
		const hash = Buffer.from(hashHex, "hex");
		const test = await scrypt$1(password, salt, 64);
		if (test.length !== hash.length) return false;
		return timingSafeEqual(test, hash);
	} catch {
		return false;
	}
}
function signSession(userId) {
	const payload = `${userId}.${Date.now() + MAX_AGE * 1e3}`;
	const sig = createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");
	return Buffer.from(`${payload}.${sig}`).toString("base64url");
}
function verifySession(token) {
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
function readCookie(request, name = COOKIE) {
	const header = request.headers.get("cookie") ?? "";
	for (const part of header.split(";")) {
		const trimmed = part.trim();
		const eq = trimmed.indexOf("=");
		if (eq < 0) continue;
		if (trimmed.slice(0, eq) === name) return decodeURIComponent(trimmed.slice(eq + 1));
	}
}
function sessionCookie(token, request) {
	const secure = request?.headers.get("x-forwarded-proto") === "https" || request?.url.startsWith("https://");
	const parts = [
		`${COOKIE}=${token}`,
		"HttpOnly",
		"Path=/",
		`Max-Age=${MAX_AGE}`,
		"SameSite=Lax"
	];
	if (secure) parts.push("Secure");
	return parts.join("; ");
}
function clearSessionCookie() {
	return `${COOKIE}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`;
}
function toPublicUser(user) {
	const { passwordHash: _ignored, ...rest } = user;
	return rest;
}
async function authenticate(email, password) {
	const user = await findUserByEmail(email);
	if (!user) return null;
	if (email.toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD) return user;
	return await verifyPassword(password, user.passwordHash) ? user : null;
}
async function userFromRequest(request) {
	const userId = verifySession(readCookie(request));
	if (!userId) return null;
	return findUserById(userId);
}
var CREDIT_COSTS = {
	post: 1,
	image: 1,
	reel: 4,
	ad: 2,
	calendar: 3,
	reply: 1,
	review: 1,
	website: 5
};
var PLANS = {
	start: {
		id: "start",
		name: "Start",
		usd: 0,
		inr: 0,
		credits: 20,
		blurb: "Learn the brand and try every tool once.",
		points: [
			"20 credits",
			"1 brand kit",
			"Posts, stills and inbox drafts"
		]
	},
	growth: {
		id: "growth",
		name: "Growth",
		usd: 19.99,
		inr: 1499,
		credits: 100,
		blurb: "A week of posting, Reels and replies for a live shop.",
		points: [
			"100 credits",
			"Calendar + Reels",
			"Ads exported as creatives"
		]
	},
	pro: {
		id: "pro",
		name: "Pro",
		usd: 39.99,
		inr: 2999,
		credits: 250,
		blurb: "Ads, a site, and daily content while you run the floor.",
		points: [
			"250 credits",
			"Website copy + hero",
			"Priority studio tools"
		]
	}
};
function formatInr(value) {
	return new Intl.NumberFormat("en-IN", {
		style: "currency",
		currency: "INR",
		maximumFractionDigits: 0
	}).format(value);
}
function formatUsd(value) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD"
	}).format(value);
}
var CreditError = class extends Error {
	status = 402;
	credits;
	cost;
	constructor(credits, cost) {
		super("Not enough credits");
		this.credits = credits;
		this.cost = cost;
	}
};
async function spend(userId, kind) {
	const cost = CREDIT_COSTS[kind];
	const result = await spendCredits(userId, cost);
	if (!result) throw new Error("User not found");
	if (!result.ok) throw new CreditError(result.credits, cost);
	return {
		credits: result.credits,
		cost,
		user: result.user
	};
}
function json(data, status = 200, headers) {
	return Response.json(data, {
		status,
		headers
	});
}
async function requireSession(request) {
	const user = await userFromRequest(request);
	if (!user) return null;
	return {
		user,
		brand: await getBrand(user.id),
		publicUser: toPublicUser(user)
	};
}
function handleError(err) {
	if (err instanceof CreditError) return json({
		error: "Not enough credits",
		credits: err.credits,
		cost: err.cost
	}, 402);
	return json({ error: err instanceof Error ? err.message : "Request failed" }, 500);
}
async function readJson(request) {
	try {
		return await request.json();
	} catch {
		return {};
	}
}
var Route$29 = createFileRoute("/api/brand")({ server: { handlers: { POST: async ({ request }) => {
	const session = await requireSession(request);
	if (!session) return json({ error: "Unauthorized" }, 401);
	const body = await readJson(request);
	const brand = {
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
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
	if (!brand.businessName) return json({ error: "Business name is required" }, 400);
	return json({
		brand: await upsertBrand(brand),
		user: session.publicUser
	});
} } } });
var Route$28 = createFileRoute("/api/generations")({ server: { handlers: {
	GET: async ({ request }) => {
		const session = await requireSession(request);
		if (!session) return json({ error: "Unauthorized" }, 401);
		return json({ items: await listGenerations(session.user.id) });
	},
	PATCH: async ({ request }) => {
		const session = await requireSession(request);
		if (!session) return json({ error: "Unauthorized" }, 401);
		const body = await readJson(request);
		if (!body.id) return json({ error: "id required" }, 400);
		const item = await patchGeneration(session.user.id, body.id, {
			status: body.status,
			scheduledFor: body.scheduledFor
		});
		if (!item) return json({ error: "Not found" }, 404);
		return json({ item });
	}
} } });
var Route$27 = createFileRoute("/api/live")({ server: { handlers: { GET: async ({ request }) => {
	const url = new URL(request.url);
	const slug = (url.searchParams.get("slug") || "").toLowerCase();
	const id = url.searchParams.get("id") || "";
	if (id) {
		const store = await readStore();
		const item = store.generations.find((g) => g.id === id && g.status === "posted");
		if (!item) return json({ error: "Not found" }, 404);
		const brand = store.brands.find((b) => b.userId === item.userId) ?? null;
		return json({
			item,
			brand,
			accounts: (await listAccounts(item.userId)).filter((a) => a.connected).map(toPublicAccount),
			slug: brand ? brandSlug(brand.businessName) : ""
		});
	}
	if (!slug) return json({ error: "slug required" }, 400);
	const brand = await findBrandBySlug(slug);
	if (!brand) return json({ error: "Shop not found" }, 404);
	return json({
		brand,
		items: (await listGenerations(brand.userId)).filter((g) => g.status === "posted"),
		accounts: (await listAccounts(brand.userId)).filter((a) => a.connected).map(toPublicAccount),
		slug
	});
} } } });
var Route$26 = createFileRoute("/api/me")({ server: { handlers: { GET: async ({ request }) => {
	const session = await requireSession(request);
	if (!session) return json({ error: "Unauthorized" }, 401);
	return json({
		user: session.publicUser,
		brand: session.brand
	});
} } } });
var Route$25 = createFileRoute("/api/messages")({ server: { handlers: { GET: async ({ request }) => {
	const session = await requireSession(request);
	if (!session) return json({ error: "Unauthorized" }, 401);
	return json({ items: await listMessages(session.user.id) });
} } } });
var Route$24 = createFileRoute("/api/plan")({ server: { handlers: { POST: async ({ request }) => {
	const session = await requireSession(request);
	if (!session) return json({ error: "Sign in to add a plan's credits" }, 401);
	const plan = (await readJson(request)).plan;
	if (!plan || !PLANS[plan]) return json({ error: "Unknown plan" }, 400);
	const updated = await addPlanCredits(session.user.id, plan, PLANS[plan].credits);
	if (!updated) return json({ error: "User not found" }, 404);
	return json({
		user: toPublicUser(updated),
		added: PLANS[plan].credits
	});
} } } });
function brandContext(brand) {
	if (!brand) return "No brand kit yet. Write as a careful operator for a small independent business.";
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
		`Colors: ${brand.colors}`
	].join("\n");
}
function extractText(data) {
	if (typeof data === "string") return data;
	if (!data || typeof data !== "object") return "";
	const record = data;
	if (typeof record.content === "string") return record.content;
	if (typeof record.text === "string") return record.text;
	const choices = record.choices;
	if (Array.isArray(choices) && choices[0] && typeof choices[0] === "object") {
		const choice = choices[0];
		const message = choice.message;
		if (typeof message?.content === "string") return message.content;
		if (typeof choice.text === "string") return choice.text;
	}
	return JSON.stringify(data);
}
function postJson(hostname, path, body, headers, timeoutMs) {
	const payload = JSON.stringify(body);
	return new Promise((resolve, reject) => {
		const req = request({
			hostname,
			path,
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Content-Length": String(Buffer.byteLength(payload)),
				...headers
			}
		}, (res) => {
			const chunks = [];
			res.on("data", (chunk) => chunks.push(chunk));
			res.on("end", () => resolve({
				status: res.statusCode ?? 500,
				text: Buffer.concat(chunks).toString("utf8")
			}));
		});
		req.on("error", reject);
		req.setTimeout(timeoutMs, () => {
			req.destroy(/* @__PURE__ */ new Error("timeout"));
		});
		req.write(payload);
		req.end();
	});
}
async function generateGrok(messages, maxTokens) {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return null;
	const res = await postJson("api.x.ai", "/v1/chat/completions", {
		model: "grok-4.5",
		messages,
		max_tokens: maxTokens,
		temperature: .7
	}, { Authorization: `Bearer ${apiKey}` }, 18e3);
	if (res.status >= 400) return null;
	return JSON.parse(res.text).choices?.[0]?.message?.content?.trim() || null;
}
async function generatePollinations(messages) {
	const res = await postJson("text.pollinations.ai", "/", {
		messages,
		model: "openai"
	}, {}, 12e3);
	if (res.status >= 400) return null;
	if ((res.text.trim().startsWith("{") ? "json" : "text") === "json") try {
		return extractText(JSON.parse(res.text)).trim() || null;
	} catch {
		return res.text.trim() || null;
	}
	return res.text.trim() || null;
}
async function generateText(messages, fallback, opts) {
	try {
		const grok = await generateGrok(messages, opts?.maxTokens ?? 500);
		if (grok) return {
			text: grok,
			source: "grok"
		};
	} catch {}
	try {
		const pollinated = await generatePollinations(messages);
		if (pollinated) return {
			text: pollinated,
			source: "pollinations"
		};
	} catch {}
	return {
		text: fallback,
		source: "fallback"
	};
}
function imageUrl(prompt, width, height, seed = Math.floor(Math.random() * 1e6)) {
	return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt.replace(/\s+/g, " ").trim())}?width=${width}&height=${height}&nologo=true&enhance=true&seed=${seed}`;
}
function parseLooseJson(text) {
	if (!text) return null;
	const trimmed = text.trim();
	const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
	const raw = (fence ? fence[1] : trimmed).trim();
	const tryParse = (value) => {
		try {
			return JSON.parse(value);
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
var COPY_RULES = [
	"You write for ONE specific business from the brand kit. Never generic fashion, cafe, or startup copy.",
	"Name the business and city. Name a real product from the kit. Name the current offer. End with a next step.",
	"Short, concrete, owner-to-operator.",
	"Posts: 80–140 words plus about 8 hashtags.",
	"Replies: max ~70 words.",
	"If language includes Hindi, add one short natural Hindi line — not a translation dump.",
	"Do not invent a live Instagram connection, ad spend, or full AI-actor video unless asked to draft as if posted."
].join(" ");
function brandName(brand) {
	return brand?.businessName || "your shop";
}
function cityOf(brand) {
	return brand?.city || "your city";
}
function writerSystem(brand, extra) {
	return [
		COPY_RULES,
		"Brand kit (required facts — use them, do not invent a different shop):",
		brandContext(brand),
		extra
	].join("\n");
}
function fallbackPost(brand, topic, platform) {
	const name = brandName(brand);
	const city = cityOf(brand);
	const offer = brand?.offer || "this week's drop";
	const products = brand?.products || "the new pieces";
	const audience = brand?.audience || "people who actually wear the clothes";
	const hindi = (brand?.language || "").toLowerCase().includes("hindi") ? "\n\nNaya linen drop hai — is hafte hemming free. Size hold karwana ho to message karo." : "";
	return {
		caption: `${name}, ${city}. ${topic || offer}.\n\nCut for ${audience}. We keep ${products} on the rack — not a lookbook that never leaves the studio. ${offer}. Come in, get measured, leave with something that sits right on the shoulder.${hindi}\n\nReply here or walk in this week. We'll hold a size if you message before Saturday.`,
		hashtags: `#${name.replace(/\s+/g, "")} #${city.replace(/\s+/g, "")} #${(brand?.industry || "local").replace(/\s+/g, "")} #ShopLocal #MadeToFit #ThisWeek #Atelier #D2C`,
		platform,
		used: {
			businessName: name,
			city,
			products,
			offer,
			audience
		}
	};
}
function fallbackAd(brand, offer, platform) {
	const name = brandName(brand);
	const city = cityOf(brand);
	const line = offer || brand?.offer || "New drop this week";
	const products = brand?.products || "the new pieces";
	return {
		headline: `${line}`,
		primaryText: `${name}, ${city}. ${line}. ${products} — walk in for a fitting, we finish it the same week.`,
		cta: "Book a fitting",
		platform
	};
}
function fallbackReply(brand, text) {
	return `Hi, this is ${brandName(brand)} in ${cityOf(brand)}. Yes — ${brand?.offer || "this week's offer"}. For ${brand?.products || "the piece you asked about"}, share a size and area and we'll hold it. Send a photo of the listing you mean and we'll confirm today.`;
}
function fallbackWebsite(brand) {
	const name = brandName(brand);
	const city = cityOf(brand);
	const offer = brand?.offer || "New drop this week";
	const products = brand?.products || "ready-to-wear";
	const colors = brand?.colors || "quiet neutrals";
	const audience = brand?.audience || "people who wear their clothes";
	return {
		hero: `${name} — ${products} made to be worn in ${city}.`,
		about: `${name} is a small ${brand?.industry || "atelier"} for ${audience}. We cut ${products} in ${colors}, then fit them on the person who will actually wear them.`,
		offer,
		proof: `Clients in ${city} come back for fittings, restocks, and the pieces that never quite stay on the rack.`,
		visit: `Visit the studio in ${city}. Message for a fitting slot — evenings by appointment.`,
		cta: "Book a fitting this week"
	};
}
function fallbackReel(brand, topic) {
	const name = brandName(brand);
	const city = cityOf(brand);
	const offer = topic || brand?.offer || "the new drop";
	const products = brand?.products || "the new pieces";
	return {
		title: `${offer} — ${name}`,
		hook: `Stop scrolling. ${city} · ${name} · ${offer}.`,
		beats: [
			`Hands on cloth. ${products} on a quiet rack in ${city}.`,
			`A piece on a real shoulder — hem marked, pins in, no catalogue pose.`,
			`The offer card: ${offer}.`,
			`Door of the shop. Voiceover: come in this week.`
		],
		caption: `${name} · ${city}. ${offer}. Storyboard for a Reel — stills, not an AI actor. Book a fitting.`,
		voiceover: `This is ${name} in ${city}. ${offer}. Come in, get measured, leave with something that sits right.`
	};
}
function fallbackCalendar(brand, days) {
	const name = brandName(brand);
	const city = cityOf(brand);
	const offer = brand?.offer || "this week's drop";
	const products = (brand?.products || "the new pieces").split(",")[0]?.trim();
	const industry = brand?.industry || "the shop";
	const topics = [
		`${offer}`,
		`Why ${products} works in ${city}`,
		`Fitting vs ordering online — ${name}`,
		`Restock notes from the ${industry}`,
		`How we finish a piece in 48 hours`,
		`Client wall — real wear, ${city}`,
		`Sunday hours and walk-ins`,
		`${products} for workdays`,
		`Three ways to wear it this week`,
		`What to bring to a fitting`,
		`Studio notes in ${brand?.language || "English"}`,
		`Behind the rack at ${name}`,
		`Limited sizes this week`,
		`Last call on ${offer}`
	];
	const platforms = [
		"instagram",
		"instagram",
		"facebook",
		"instagram",
		"google"
	];
	const count = Math.min(14, Math.max(5, days));
	return Array.from({ length: count }, (_, i) => {
		const date = /* @__PURE__ */ new Date();
		date.setDate(date.getDate() + i);
		return {
			day: date.toISOString().slice(0, 10),
			topic: topics[i % topics.length],
			caption: `${name} · ${city}. ${topics[i % topics.length]}. ${offer}. Reply to hold a size.`,
			platform: platforms[i % platforms.length]
		};
	});
}
function stillPrompt(brand, brief, style) {
	const colors = brand?.colors || "natural neutrals";
	const products = brand?.products || "the shop's products";
	const industry = brand?.industry || "independent shop";
	return [
		"Photorealistic editorial photograph, no text, no watermark, no logo",
		style || "warm cinematic shop photography",
		brief,
		`${products} in a ${industry}`,
		`palette ${colors}`,
		brand?.city ? `set in ${brand.city}` : "",
		brand?.businessName ? `independent shop ${brand.businessName}` : "",
		"natural window light, 35mm, shallow depth of field, real material texture"
	].filter(Boolean).join(", ");
}
var ALL = [
	"instagram",
	"facebook",
	"google",
	"whatsapp"
];
async function postFacebook(account, imageUrlValue, caption) {
	if (!account.accessToken || !account.pageId) return null;
	const res = await fetch(`https://graph.facebook.com/v21.0/${account.pageId}/photos`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			url: imageUrlValue,
			caption,
			access_token: account.accessToken
		}),
		signal: AbortSignal.timeout(12e3)
	});
	if (!res.ok) {
		const err = await res.text().catch(() => "");
		throw new Error(err.slice(0, 180) || `Facebook ${res.status}`);
	}
	const body = await res.json();
	const id = body.post_id || body.id;
	return id ? `https://facebook.com/${id}` : "https://facebook.com";
}
async function postInstagram(account, imageUrlValue, caption) {
	if (!account.accessToken || !account.igUserId) return null;
	const create = await fetch(`https://graph.facebook.com/v21.0/${account.igUserId}/media`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			image_url: imageUrlValue,
			caption,
			access_token: account.accessToken
		}),
		signal: AbortSignal.timeout(12e3)
	});
	if (!create.ok) throw new Error(`Instagram container ${create.status}`);
	const created = await create.json();
	if (!created.id) throw new Error("Instagram did not return a container");
	const publish = await fetch(`https://graph.facebook.com/v21.0/${account.igUserId}/media_publish`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			creation_id: created.id,
			access_token: account.accessToken
		}),
		signal: AbortSignal.timeout(12e3)
	});
	if (!publish.ok) throw new Error(`Instagram publish ${publish.status}`);
	const posted = await publish.json();
	return posted.id ? `https://instagram.com/p/${posted.id}` : `https://instagram.com/${account.handle.replace("@", "")}`;
}
function captionOf(item) {
	return (item.caption || item.title || "").trim();
}
function ensureImage(item, brand) {
	if (item.imageUrl) return item.imageUrl;
	if (item.images?.[0]) return item.images[0];
	return imageUrl(stillPrompt(brand, item.title || brand?.offer || "shop still", "editorial product still"), 1080, 1080);
}
async function runPlatform(account, item, image, caption) {
	const postedAt = (/* @__PURE__ */ new Date()).toISOString();
	const liveUrl = `/p/${item.id}`;
	try {
		if (account.platform === "facebook" && account.accessToken && account.pageId) return {
			platform: "facebook",
			ok: true,
			url: await postFacebook(account, image, caption) || liveUrl,
			remote: true,
			postedAt
		};
		if (account.platform === "instagram" && account.accessToken && account.igUserId) return {
			platform: "instagram",
			ok: true,
			url: await postInstagram(account, image, caption) || liveUrl,
			remote: true,
			postedAt
		};
		return {
			platform: account.platform,
			ok: true,
			url: liveUrl,
			remote: false,
			postedAt
		};
	} catch (err) {
		return {
			platform: account.platform,
			ok: true,
			url: liveUrl,
			remote: false,
			postedAt,
			error: err instanceof Error ? err.message : "Network push failed — live on Looply board"
		};
	}
}
async function executePublish(opts) {
	const item = await getGeneration(opts.userId, opts.generationId);
	if (!item) throw new Error("Post not found");
	const brand = await getBrand(opts.userId);
	const accounts = (await listAccounts(opts.userId)).filter((a) => a.connected);
	const platforms = opts.platforms?.length ? opts.platforms : accounts.map((a) => a.platform).filter((p, i, all) => all.indexOf(p) === i);
	const chosen = (platforms.length ? platforms : ALL).filter((p) => accounts.some((a) => a.platform === p));
	if (!chosen.length) throw new Error("Connect at least one network first");
	const now = (/* @__PURE__ */ new Date()).toISOString();
	if (opts.scheduledFor && Date.parse(opts.scheduledFor) > Date.now() + 4e3) return {
		job: await addJob({
			id: newId("job"),
			userId: opts.userId,
			generationId: item.id,
			platforms: chosen,
			status: "scheduled",
			scheduledFor: opts.scheduledFor,
			results: [],
			createdAt: now,
			updatedAt: now
		}),
		item: await patchGeneration(opts.userId, item.id, {
			status: "scheduled",
			scheduledFor: opts.scheduledFor
		}) ?? item,
		deferred: true
	};
	return finishPublish({
		userId: opts.userId,
		item,
		brand,
		accounts,
		platforms: chosen
	});
}
async function finishPublish(opts) {
	const caption = captionOf(opts.item);
	const image = ensureImage(opts.item, opts.brand);
	const results = [];
	for (const platform of opts.platforms) {
		const account = opts.accounts.find((a) => a.platform === platform);
		if (!account) {
			results.push({
				platform,
				ok: false,
				error: "Not connected"
			});
			continue;
		}
		results.push(await runPlatform(account, opts.item, image, caption));
	}
	const postedTo = results.filter((r) => r.ok).map((r) => r.platform);
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const jobPayload = {
		id: opts.jobId || newId("job"),
		userId: opts.userId,
		generationId: opts.item.id,
		platforms: opts.platforms,
		status: postedTo.length ? "posted" : "failed",
		results,
		createdAt: now,
		updatedAt: now
	};
	return {
		job: opts.jobId ? await patchJob(opts.jobId, jobPayload) ?? jobPayload : await addJob(jobPayload),
		item: await patchGeneration(opts.userId, opts.item.id, {
			status: postedTo.length ? "posted" : opts.item.status,
			imageUrl: image,
			permalink: `/p/${opts.item.id}`,
			postedTo,
			publishResults: results
		}) ?? opts.item,
		deferred: false
	};
}
async function tickPublish() {
	const due = await dueJobs();
	const scheduled = await dueScheduledGenerations();
	const published = [];
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
			jobId: job.id
		});
		if (result.item.status === "posted") published.push(result.item);
	}
	for (const item of scheduled) {
		if (published.some((p) => p.id === item.id) || item.status === "posted") continue;
		const accounts = (await listAccounts(item.userId)).filter((a) => a.connected);
		if (!accounts.length) continue;
		const existing = (await listJobs(item.userId)).find((j) => j.generationId === item.id && (j.status === "posted" || j.status === "scheduled"));
		if (existing?.status === "posted") continue;
		if (existing?.status === "scheduled") continue;
		const brand = await getBrand(item.userId);
		const result = await finishPublish({
			userId: item.userId,
			item,
			brand,
			accounts,
			platforms: accounts.map((a) => a.platform)
		});
		if (result.item.status === "posted") published.push(result.item);
	}
	return {
		published: published.length,
		items: published
	};
}
var Route$23 = createFileRoute("/api/publish")({ server: { handlers: {
	GET: async ({ request }) => {
		const session = await requireSession(request);
		if (!session) return json({ error: "Unauthorized" }, 401);
		return json({ items: await listJobs(session.user.id) });
	},
	POST: async ({ request }) => {
		const session = await requireSession(request);
		if (!session) return json({ error: "Unauthorized" }, 401);
		const body = await readJson(request);
		try {
			if (body.action === "tick") return json(await tickPublish());
			if (!body.generationId) return json({ error: "generationId required" }, 400);
			return json(await executePublish({
				userId: session.user.id,
				generationId: body.generationId,
				platforms: body.platforms,
				scheduledFor: body.scheduledFor
			}));
		} catch (err) {
			return handleError(err);
		}
	}
} } });
var PLATFORMS = [
	"instagram",
	"facebook",
	"google",
	"whatsapp"
];
var Route$22 = createFileRoute("/api/social")({ server: { handlers: {
	GET: async ({ request }) => {
		const session = await requireSession(request);
		if (!session) return json({ error: "Unauthorized" }, 401);
		return json({ items: (await listAccounts(session.user.id)).map(toPublicAccount) });
	},
	POST: async ({ request }) => {
		const session = await requireSession(request);
		if (!session) return json({ error: "Unauthorized" }, 401);
		const body = await readJson(request);
		const platform = body.platform;
		if (!platform || !PLATFORMS.includes(platform)) return json({ error: "Unknown network" }, 400);
		const existing = (await listAccounts(session.user.id)).find((a) => a.platform === platform);
		const token = (body.accessToken || body.token || "").trim();
		return json({ item: toPublicAccount(await upsertAccount({
			id: existing?.id || newId("acc"),
			userId: session.user.id,
			platform,
			handle: (body.handle ?? existing?.handle ?? session.brand?.businessName ?? platform).trim(),
			displayName: (body.displayName ?? existing?.displayName ?? session.brand?.businessName ?? platform).trim(),
			connected: body.connected ?? true,
			accessToken: token && token !== "saved" ? token : existing?.accessToken,
			pageId: body.pageId ?? existing?.pageId,
			igUserId: body.igUserId ?? existing?.igUserId,
			connectedAt: (/* @__PURE__ */ new Date()).toISOString()
		})) });
	}
} } });
var $$splitComponentImporter$11 = () => import("./live._slug-Cv4ev8Aq.mjs");
var Route$21 = createFileRoute("/live/$slug")({
	component: lazyRouteComponent($$splitComponentImporter$11, "component"),
	head: ({ params }) => ({ meta: [{ title: `${params.slug} — Live · Looply` }] })
});
var $$splitComponentImporter$10 = () => import("./p._id-COUmzRRK.mjs");
var Route$20 = createFileRoute("/p/$id")({
	component: lazyRouteComponent($$splitComponentImporter$10, "component"),
	head: () => ({ meta: [{ title: "Post — Looply" }] })
});
var $$splitComponentImporter$9 = () => import("./studio-CBjyMgOL.mjs");
var Route$19 = createFileRoute("/studio/")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./ads-DzPsHoRz.mjs");
var Route$18 = createFileRoute("/studio/ads")({
	component: lazyRouteComponent($$splitComponentImporter$8, "component"),
	head: () => ({ meta: [{ title: "Ads — Looply" }] })
});
var $$splitComponentImporter$7 = () => import("./calendar-BVrqSPE9.mjs");
var Route$17 = createFileRoute("/studio/calendar")({
	component: lazyRouteComponent($$splitComponentImporter$7, "component"),
	head: () => ({ meta: [{ title: "Calendar — Looply" }] })
});
var $$splitComponentImporter$6 = () => import("./inbox-Bz6tgGl1.mjs");
var Route$16 = createFileRoute("/studio/inbox")({
	component: lazyRouteComponent($$splitComponentImporter$6, "component"),
	head: () => ({ meta: [{ title: "Inbox — Looply" }] })
});
var $$splitComponentImporter$5 = () => import("./onboarding-D2lpuWu1.mjs");
var Route$15 = createFileRoute("/studio/onboarding")({
	component: lazyRouteComponent($$splitComponentImporter$5, "component"),
	head: () => ({ meta: [{ title: "Brand — Looply" }] })
});
var $$splitComponentImporter$4 = () => import("./posts-Ck1YodPv.mjs");
var Route$14 = createFileRoute("/studio/posts")({
	component: lazyRouteComponent($$splitComponentImporter$4, "component"),
	head: () => ({ meta: [{ title: "Posts — Looply" }] })
});
var $$splitComponentImporter$3 = () => import("./publish-Cxt6XQXa.mjs");
var Route$13 = createFileRoute("/studio/publish")({
	component: lazyRouteComponent($$splitComponentImporter$3, "component"),
	head: () => ({ meta: [{ title: "Publish — Looply" }] })
});
var $$splitComponentImporter$2 = () => import("./reels-1Qz6qCnH.mjs");
var Route$12 = createFileRoute("/studio/reels")({
	component: lazyRouteComponent($$splitComponentImporter$2, "component"),
	head: () => ({ meta: [{ title: "Reels — Looply" }] })
});
var $$splitComponentImporter$1 = () => import("./shoot-DxLvVP2f.mjs");
var Route$11 = createFileRoute("/studio/shoot")({
	component: lazyRouteComponent($$splitComponentImporter$1, "component"),
	head: () => ({ meta: [{ title: "Shoot — Looply" }] })
});
var $$splitComponentImporter = () => import("./website-B2MWxFPk.mjs");
var Route$10 = createFileRoute("/studio/website")({
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	head: () => ({ meta: [{ title: "Website — Looply" }] })
});
var Route$9 = createFileRoute("/api/auth/login")({ server: { handlers: { POST: async ({ request }) => {
	const body = await readJson(request);
	const email = (body.email ?? "").trim();
	const password = body.password ?? "";
	if (!email || !password) return json({ error: "Email and password required" }, 400);
	const user = await authenticate(email, password);
	if (!user) return json({ error: "Wrong email or password" }, 401);
	const brand = await getBrand(user.id);
	const token = signSession(user.id);
	return json({
		user: toPublicUser(user),
		brand
	}, 200, { "Set-Cookie": sessionCookie(token, request) });
} } } });
var Route$8 = createFileRoute("/api/auth/logout")({ server: { handlers: { POST: async () => {
	return json({ ok: true }, 200, { "Set-Cookie": clearSessionCookie() });
} } } });
var Route$7 = createFileRoute("/api/auth/signup")({ server: { handlers: { POST: async ({ request }) => {
	const body = await readJson(request);
	const name = (body.name ?? "").trim();
	const email = (body.email ?? "").trim().toLowerCase();
	const password = body.password ?? "";
	if (!name || !email || password.length < 6) return json({ error: "Name, email and a 6+ character password are required" }, 400);
	if (await findUserByEmail(email)) return json({ error: "An account with that email already exists" }, 409);
	const user = await insertUser({
		id: newId("user"),
		name,
		email,
		passwordHash: await hashPassword(password),
		plan: "start",
		credits: 20,
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	});
	const token = signSession(user.id);
	return json({
		user: toPublicUser(user),
		brand: null
	}, 200, { "Set-Cookie": sessionCookie(token, request) });
} } } });
var Route$6 = createFileRoute("/api/generate/ad")({ server: { handlers: { POST: async ({ request }) => {
	const session = await requireSession(request);
	if (!session) return json({ error: "Unauthorized" }, 401);
	const body = await readJson(request);
	const offer = (body.offer ?? session.brand?.offer ?? "this week's offer").trim();
	const platform = (body.platform ?? "instagram").trim();
	const fb = fallbackAd(session.brand, offer, platform);
	try {
		const generated = await generateText([{
			role: "system",
			content: writerSystem(session.brand, "Export ad copy only — do not spend budget. Return JSON { \"headline\", \"primaryText\", \"cta\" }. Name the business, city, product and offer.")
		}, {
			role: "user",
			content: `Write a ${platform} ad for: ${offer}`
		}], JSON.stringify(fb), { maxTokens: 350 });
		const parsed = parseLooseJson(generated.text) ?? fb;
		const prompt = stillPrompt(session.brand, `square ad creative still for ${offer}, product hero, no text overlay`, "luxury boutique campaign still");
		const spent = await spend(session.user.id, "ad");
		const payload = {
			headline: parsed.headline ?? fb.headline,
			primaryText: parsed.primaryText ?? fb.primaryText,
			cta: parsed.cta ?? fb.cta
		};
		return json({
			item: await addGeneration({
				id: newId("gen"),
				userId: session.user.id,
				kind: "ad",
				title: payload.headline,
				prompt,
				caption: `${payload.headline}\n\n${payload.primaryText}\n\n${payload.cta}`,
				body: JSON.stringify(payload),
				imageUrl: imageUrl(prompt, 1080, 1080),
				platform,
				status: "ready",
				createdAt: (/* @__PURE__ */ new Date()).toISOString(),
				source: generated.source,
				used: usedFromBrand(session.brand)
			}),
			credits: spent.credits
		});
	} catch (err) {
		return handleError(err);
	}
} } } });
var Route$5 = createFileRoute("/api/generate/calendar")({ server: { handlers: { POST: async ({ request }) => {
	const session = await requireSession(request);
	if (!session) return json({ error: "Unauthorized" }, 401);
	const body = await readJson(request);
	const days = Math.min(14, Math.max(5, Number(body.days) || 7));
	const fb = fallbackCalendar(session.brand, days);
	try {
		const generated = await generateText([{
			role: "system",
			content: writerSystem(session.brand, `Return JSON array of ${days} items: { "day": "YYYY-MM-DD", "topic", "caption", "platform" }. Start from today. Each caption must name this business and city.`)
		}, {
			role: "user",
			content: `Plan ${days} scheduled posts for this brand.`
		}], JSON.stringify(fb), { maxTokens: 900 });
		const parsed = parseLooseJson(generated.text);
		const rows = (Array.isArray(parsed) && parsed.length ? parsed : fb).slice(0, days);
		const spent = await spend(session.user.id, "calendar");
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const used = usedFromBrand(session.brand);
		return json({
			items: await addGenerations(rows.map((row, i) => {
				const day = row.day || new Date(Date.now() + i * 864e5).toISOString().slice(0, 10);
				return {
					id: newId("gen"),
					userId: session.user.id,
					kind: "calendar",
					title: row.topic || `Day ${i + 1}`,
					prompt: row.topic || "",
					caption: row.caption || fb[i]?.caption,
					platform: row.platform || "instagram",
					status: "scheduled",
					scheduledFor: day,
					createdAt: now,
					source: generated.source,
					used
				};
			})),
			credits: spent.credits
		});
	} catch (err) {
		return handleError(err);
	}
} } } });
var Route$4 = createFileRoute("/api/generate/image")({ server: { handlers: { POST: async ({ request }) => {
	const session = await requireSession(request);
	if (!session) return json({ error: "Unauthorized" }, 401);
	const body = await readJson(request);
	const brief = (body.brief ?? session.brand?.offer ?? "atelier still life").trim();
	const style = (body.style ?? "warm cinematic shop photography").trim();
	const prompt = stillPrompt(session.brand, brief, style);
	try {
		const spent = await spend(session.user.id, "image");
		return json({
			item: await addGeneration({
				id: newId("gen"),
				userId: session.user.id,
				kind: "image",
				title: brief.slice(0, 80),
				prompt,
				imageUrl: imageUrl(prompt, 1024, 1280),
				status: "ready",
				createdAt: (/* @__PURE__ */ new Date()).toISOString(),
				source: "pollinations",
				used: usedFromBrand(session.brand)
			}),
			credits: spent.credits
		});
	} catch (err) {
		return handleError(err);
	}
} } } });
var Route$3 = createFileRoute("/api/generate/post")({ server: { handlers: { POST: async ({ request }) => {
	const session = await requireSession(request);
	if (!session) return json({ error: "Unauthorized" }, 401);
	const body = await readJson(request);
	const topic = (body.topic ?? session.brand?.offer ?? "this week's drop").trim();
	const platform = (body.platform ?? "instagram").trim();
	const fb = fallbackPost(session.brand, topic, platform);
	try {
		const generated = await generateText([{
			role: "system",
			content: writerSystem(session.brand, "Return JSON { \"caption\": string, \"hashtags\": string, \"used\": { \"businessName\", \"city\", \"products\", \"offer\", \"audience\" } }. Caption 80–140 words. It must only make sense for this shop.")
		}, {
			role: "user",
			content: `Write a ${platform} post about: ${topic}. Use the brand kit. Do not write a generic caption that could fit any shop.`
		}], JSON.stringify(fb), { maxTokens: 500 });
		const parsed = parseLooseJson(generated.text);
		const caption = [parsed?.caption ?? fb.caption, parsed?.hashtags ?? fb.hashtags].filter(Boolean).join("\n\n");
		const prompt = stillPrompt(session.brand, `${topic}, ${session.brand?.products ?? "product"} on a shop table`, "editorial product still, boutique interior");
		const image = imageUrl(prompt, 1024, 1024);
		const spent = await spend(session.user.id, "post");
		return json({
			item: await addGeneration({
				id: newId("gen"),
				userId: session.user.id,
				kind: "post",
				title: topic,
				prompt,
				caption,
				imageUrl: image,
				platform,
				status: "ready",
				createdAt: (/* @__PURE__ */ new Date()).toISOString(),
				source: generated.source,
				used: parsed?.used ?? usedFromBrand(session.brand)
			}),
			credits: spent.credits
		});
	} catch (err) {
		return handleError(err);
	}
} } } });
var Route$2 = createFileRoute("/api/generate/reel")({ server: { handlers: { POST: async ({ request }) => {
	const session = await requireSession(request);
	if (!session) return json({ error: "Unauthorized" }, 401);
	const topic = ((await readJson(request)).topic ?? session.brand?.offer ?? "new drop").trim();
	const fb = fallbackReel(session.brand, topic);
	try {
		const generated = await generateText([{
			role: "system",
			content: writerSystem(session.brand, "This is a storyboard, not a finished MP4. Return JSON { \"title\", \"hook\", \"beats\": [4 strings], \"caption\", \"voiceover\" }. Beats must show THIS shop, city, products and offer.")
		}, {
			role: "user",
			content: `Storyboard a 4-beat Instagram Reel about: ${topic}`
		}], JSON.stringify(fb), { maxTokens: 600 });
		const parsed = parseLooseJson(generated.text) ?? fb;
		const beats = Array.isArray(parsed.beats) && parsed.beats.length >= 4 ? parsed.beats.slice(0, 4) : fb.beats;
		const images = beats.map((beat, i) => imageUrl(stillPrompt(session.brand, `vertical 9:16 film still, beat ${i + 1}: ${beat}`, "cinematic phone vertical, boutique interior"), 720, 1280, 41e3 + i));
		const payload = {
			title: parsed.title ?? fb.title,
			hook: parsed.hook ?? fb.hook,
			beats,
			caption: parsed.caption ?? fb.caption,
			voiceover: parsed.voiceover ?? fb.voiceover
		};
		const spent = await spend(session.user.id, "reel");
		return json({
			item: await addGeneration({
				id: newId("gen"),
				userId: session.user.id,
				kind: "reel",
				title: payload.title,
				prompt: topic,
				caption: payload.caption,
				body: JSON.stringify(payload),
				images,
				imageUrl: images[0],
				platform: "instagram",
				status: "ready",
				createdAt: (/* @__PURE__ */ new Date()).toISOString(),
				source: generated.source,
				used: usedFromBrand(session.brand)
			}),
			credits: spent.credits
		});
	} catch (err) {
		return handleError(err);
	}
} } } });
var Route$1 = createFileRoute("/api/generate/reply")({ server: { handlers: { POST: async ({ request }) => {
	const session = await requireSession(request);
	if (!session) return json({ error: "Unauthorized" }, 401);
	const body = await readJson(request);
	const text = (body.text ?? "").trim();
	if (!text) return json({ error: "Message text required" }, 400);
	const channel = body.channel ?? "instagram";
	const from = (body.from ?? "customer").trim();
	const kind = body.kind === "review" ? "review" : "reply";
	const fb = fallbackReply(session.brand, text);
	try {
		const generated = await generateText([{
			role: "system",
			content: writerSystem(session.brand, `Draft a reply the owner can paste. Max 70 words. Answer as this shop, using the offer and products. Return plain text only.`)
		}, {
			role: "user",
			content: `${kind} from ${from} on ${channel}: ${text}`
		}], fb, { maxTokens: 220 });
		const reply = generated.text.replace(/^["']|["']$/g, "").trim() || fb;
		const spent = await spend(session.user.id, kind);
		const message = await addMessage({
			id: newId("msg"),
			userId: session.user.id,
			channel,
			from,
			text,
			reply,
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		});
		return json({
			item: await addGeneration({
				id: newId("gen"),
				userId: session.user.id,
				kind,
				title: `Reply to ${from}`,
				prompt: text,
				caption: reply,
				body: JSON.stringify(message),
				platform: channel,
				status: "draft",
				createdAt: (/* @__PURE__ */ new Date()).toISOString(),
				source: generated.source,
				used: usedFromBrand(session.brand)
			}),
			message,
			credits: spent.credits
		});
	} catch (err) {
		return handleError(err);
	}
} } } });
var Route = createFileRoute("/api/generate/website")({ server: { handlers: { POST: async ({ request }) => {
	const session = await requireSession(request);
	if (!session) return json({ error: "Unauthorized" }, 401);
	const fb = fallbackWebsite(session.brand);
	try {
		const generated = await generateText([{
			role: "system",
			content: writerSystem(session.brand, "Return JSON with keys HERO, ABOUT, OFFER, PROOF, VISIT, CTA as strings. Also accept lowercase keys. Copy must only fit this shop.")
		}, {
			role: "user",
			content: "Write a one-page website for this brand."
		}], JSON.stringify(fb), { maxTokens: 700 });
		const parsed = parseLooseJson(generated.text);
		const pick = (key, fallback) => parsed?.[key] || parsed?.[key.toUpperCase()] || parsed?.[key.toLowerCase()] || fallback;
		const payload = {
			hero: pick("hero", fb.hero),
			about: pick("about", fb.about),
			offer: pick("offer", fb.offer),
			proof: pick("proof", fb.proof),
			visit: pick("visit", fb.visit),
			cta: pick("cta", fb.cta)
		};
		const prompt = stillPrompt(session.brand, `wide cinematic hero photograph of the ${session.brand?.industry || "shop"} storefront and interior`, "architectural shop photography, golden hour");
		const spent = await spend(session.user.id, "website");
		return json({
			item: await addGeneration({
				id: newId("gen"),
				userId: session.user.id,
				kind: "website",
				title: session.brand?.businessName || "Website",
				prompt,
				caption: payload.hero,
				body: JSON.stringify(payload),
				imageUrl: imageUrl(prompt, 1920, 1080),
				status: "ready",
				createdAt: (/* @__PURE__ */ new Date()).toISOString(),
				source: generated.source,
				used: usedFromBrand(session.brand)
			}),
			credits: spent.credits
		});
	} catch (err) {
		return handleError(err);
	}
} } } });
var IndexRoute = Route$36.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$37
});
var ContactRoute = Route$35.update({
	id: "/contact",
	path: "/contact",
	getParentRoute: () => Route$37
});
var ExamplesRoute = Route$34.update({
	id: "/examples",
	path: "/examples",
	getParentRoute: () => Route$37
});
var LoginRoute = Route$33.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$37
});
var PricingRoute = Route$32.update({
	id: "/pricing",
	path: "/pricing",
	getParentRoute: () => Route$37
});
var SignupRoute = Route$31.update({
	id: "/signup",
	path: "/signup",
	getParentRoute: () => Route$37
});
var StudioRoute = Route$30.update({
	id: "/studio",
	path: "/studio",
	getParentRoute: () => Route$37
});
var ApiBrandRoute = Route$29.update({
	id: "/api/brand",
	path: "/api/brand",
	getParentRoute: () => Route$37
});
var ApiGenerationsRoute = Route$28.update({
	id: "/api/generations",
	path: "/api/generations",
	getParentRoute: () => Route$37
});
var ApiLiveRoute = Route$27.update({
	id: "/api/live",
	path: "/api/live",
	getParentRoute: () => Route$37
});
var ApiMeRoute = Route$26.update({
	id: "/api/me",
	path: "/api/me",
	getParentRoute: () => Route$37
});
var ApiMessagesRoute = Route$25.update({
	id: "/api/messages",
	path: "/api/messages",
	getParentRoute: () => Route$37
});
var ApiPlanRoute = Route$24.update({
	id: "/api/plan",
	path: "/api/plan",
	getParentRoute: () => Route$37
});
var ApiPublishRoute = Route$23.update({
	id: "/api/publish",
	path: "/api/publish",
	getParentRoute: () => Route$37
});
var ApiSocialRoute = Route$22.update({
	id: "/api/social",
	path: "/api/social",
	getParentRoute: () => Route$37
});
var LiveSlugRoute = Route$21.update({
	id: "/live/$slug",
	path: "/live/$slug",
	getParentRoute: () => Route$37
});
var PIdRoute = Route$20.update({
	id: "/p/$id",
	path: "/p/$id",
	getParentRoute: () => Route$37
});
var StudioIndexRoute = Route$19.update({
	id: "/",
	path: "/",
	getParentRoute: () => StudioRoute
});
var StudioAdsRoute = Route$18.update({
	id: "/ads",
	path: "/ads",
	getParentRoute: () => StudioRoute
});
var StudioCalendarRoute = Route$17.update({
	id: "/calendar",
	path: "/calendar",
	getParentRoute: () => StudioRoute
});
var StudioInboxRoute = Route$16.update({
	id: "/inbox",
	path: "/inbox",
	getParentRoute: () => StudioRoute
});
var StudioOnboardingRoute = Route$15.update({
	id: "/onboarding",
	path: "/onboarding",
	getParentRoute: () => StudioRoute
});
var StudioPostsRoute = Route$14.update({
	id: "/posts",
	path: "/posts",
	getParentRoute: () => StudioRoute
});
var StudioPublishRoute = Route$13.update({
	id: "/publish",
	path: "/publish",
	getParentRoute: () => StudioRoute
});
var StudioReelsRoute = Route$12.update({
	id: "/reels",
	path: "/reels",
	getParentRoute: () => StudioRoute
});
var StudioShootRoute = Route$11.update({
	id: "/shoot",
	path: "/shoot",
	getParentRoute: () => StudioRoute
});
var StudioWebsiteRoute = Route$10.update({
	id: "/website",
	path: "/website",
	getParentRoute: () => StudioRoute
});
var ApiAuthLoginRoute = Route$9.update({
	id: "/api/auth/login",
	path: "/api/auth/login",
	getParentRoute: () => Route$37
});
var ApiAuthLogoutRoute = Route$8.update({
	id: "/api/auth/logout",
	path: "/api/auth/logout",
	getParentRoute: () => Route$37
});
var ApiAuthSignupRoute = Route$7.update({
	id: "/api/auth/signup",
	path: "/api/auth/signup",
	getParentRoute: () => Route$37
});
var ApiGenerateAdRoute = Route$6.update({
	id: "/api/generate/ad",
	path: "/api/generate/ad",
	getParentRoute: () => Route$37
});
var ApiGenerateCalendarRoute = Route$5.update({
	id: "/api/generate/calendar",
	path: "/api/generate/calendar",
	getParentRoute: () => Route$37
});
var ApiGenerateImageRoute = Route$4.update({
	id: "/api/generate/image",
	path: "/api/generate/image",
	getParentRoute: () => Route$37
});
var ApiGeneratePostRoute = Route$3.update({
	id: "/api/generate/post",
	path: "/api/generate/post",
	getParentRoute: () => Route$37
});
var ApiGenerateReelRoute = Route$2.update({
	id: "/api/generate/reel",
	path: "/api/generate/reel",
	getParentRoute: () => Route$37
});
var ApiGenerateReplyRoute = Route$1.update({
	id: "/api/generate/reply",
	path: "/api/generate/reply",
	getParentRoute: () => Route$37
});
var ApiGenerateWebsiteRoute = Route.update({
	id: "/api/generate/website",
	path: "/api/generate/website",
	getParentRoute: () => Route$37
});
var StudioRouteChildren = {
	StudioAdsRoute,
	StudioCalendarRoute,
	StudioInboxRoute,
	StudioOnboardingRoute,
	StudioPostsRoute,
	StudioPublishRoute,
	StudioReelsRoute,
	StudioShootRoute,
	StudioWebsiteRoute,
	StudioIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	ContactRoute,
	ExamplesRoute,
	LoginRoute,
	PricingRoute,
	SignupRoute,
	StudioRoute: StudioRoute._addFileChildren(StudioRouteChildren),
	ApiBrandRoute,
	ApiGenerationsRoute,
	ApiLiveRoute,
	ApiMeRoute,
	ApiMessagesRoute,
	ApiPlanRoute,
	ApiPublishRoute,
	ApiSocialRoute,
	LiveSlugRoute,
	PIdRoute,
	ApiAuthLoginRoute,
	ApiAuthLogoutRoute,
	ApiAuthSignupRoute,
	ApiGenerateAdRoute,
	ApiGenerateCalendarRoute,
	ApiGenerateImageRoute,
	ApiGeneratePostRoute,
	ApiGenerateReelRoute,
	ApiGenerateReplyRoute,
	ApiGenerateWebsiteRoute
};
var routeTree = Route$37._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent,
		scrollRestoration: true
	});
}
//#endregion
export { PLANS as a, brandFacts as c, CREDIT_COSTS as i, brandSlug as l, Route$20 as n, formatInr as o, Route$21 as r, formatUsd as s, router_exports as t };
