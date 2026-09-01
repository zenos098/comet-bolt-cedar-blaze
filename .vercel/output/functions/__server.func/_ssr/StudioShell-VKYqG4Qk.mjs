import { i as __toESM } from "../_runtime.mjs";
import { B as require_jsx_runtime, d as useRouterState, v as Link, y as useNavigate, z as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as cn, t as LoopMark } from "./LoopMark-BBkp5RpJ.mjs";
import { n as api } from "./client-5lUfA4AH.mjs";
import { a as PenLine, c as Megaphone, d as Inbox, f as Image, g as Clapperboard, i as Radio, l as LogOut, m as Globe, p as House, r as Sparkles, s as Menu, t as X, y as CalendarDays } from "../_libs/lucide-react.mjs";
import { l as brandSlug } from "./router-s0Jy-Dzk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/StudioShell-VKYqG4Qk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var StudioCtx = (0, import_react.createContext)(null);
function useStudio() {
	const ctx = (0, import_react.useContext)(StudioCtx);
	if (!ctx) throw new Error("useStudio outside shell");
	return ctx;
}
var NAV = [
	{
		to: "/studio",
		label: "Home",
		icon: House
	},
	{
		to: "/studio/onboarding",
		label: "Brand",
		icon: Sparkles
	},
	{
		to: "/studio/calendar",
		label: "Calendar",
		icon: CalendarDays
	},
	{
		to: "/studio/posts",
		label: "Posts",
		icon: PenLine
	},
	{
		to: "/studio/shoot",
		label: "Shoot",
		icon: Image
	},
	{
		to: "/studio/reels",
		label: "Reels",
		icon: Clapperboard
	},
	{
		to: "/studio/ads",
		label: "Ads",
		icon: Megaphone
	},
	{
		to: "/studio/inbox",
		label: "Inbox",
		icon: Inbox
	},
	{
		to: "/studio/website",
		label: "Website",
		icon: Globe
	},
	{
		to: "/studio/publish",
		label: "Publish",
		icon: Radio
	}
];
function StudioShell({ children }) {
	const navigate = useNavigate();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const [session, setSession] = (0, import_react.useState)(null);
	const [ready, setReady] = (0, import_react.useState)(false);
	const [open, setOpen] = (0, import_react.useState)(false);
	const refresh = (0, import_react.useCallback)(async () => {
		try {
			const data = await api("/api/me");
			setSession(data);
		} catch {
			navigate({ to: "/login" });
		}
	}, [navigate]);
	(0, import_react.useEffect)(() => {
		let alive = true;
		api("/api/me").then((data) => {
			if (alive) setSession(data);
		}).catch(() => {
			if (alive) navigate({ to: "/login" });
		}).finally(() => {
			if (alive) setReady(true);
		});
		return () => {
			alive = false;
		};
	}, [navigate]);
	(0, import_react.useEffect)(() => {
		const tick = () => {
			api("/api/publish", {
				method: "POST",
				body: JSON.stringify({ action: "tick" })
			}).catch(() => void 0);
		};
		tick();
		const id = setInterval(tick, 2e4);
		return () => clearInterval(id);
	}, []);
	const value = (0, import_react.useMemo)(() => {
		if (!session) return null;
		return {
			user: session.user,
			brand: session.brand,
			setCredits: (n) => setSession((prev) => prev ? {
				...prev,
				user: {
					...prev.user,
					credits: n
				}
			} : prev),
			setBrand: (b) => setSession((prev) => prev ? {
				...prev,
				brand: b
			} : prev),
			refresh
		};
	}, [session, refresh]);
	async function signOut() {
		await fetch("/api/auth/logout", { method: "POST" });
		navigate({ to: "/" });
	}
	if (!ready || !value) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center bg-ink text-muted",
		children: "Opening studio…"
	});
	const slug = value.brand ? brandSlug(value.brand.businessName) : "";
	const nav = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/studio",
				className: "mb-6 flex items-center gap-2 px-2 text-cream",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoopMark, { className: "size-6 text-mint" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-serif text-xl",
					children: "looply"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-2 text-xs uppercase tracking-[0.18em] text-cream/35",
				children: "Studio"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-4 truncate px-2 pt-1 text-sm text-cream/70",
				children: value.brand?.businessName || "Set up your brand"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "flex flex-1 flex-col gap-1 overflow-y-auto",
				children: NAV.map((item) => {
					const active = item.to === "/studio" ? pathname === "/studio" : pathname.startsWith(item.to);
					const Icon = item.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: item.to,
						onClick: () => setOpen(false),
						className: cn("flex min-h-11 items-center gap-3 rounded-full px-3 text-sm transition-colors", active ? "bg-white/8 text-cream" : "text-cream/60 hover:bg-white/4 hover:text-cream"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), item.label]
					}, item.to);
				})
			}),
			slug ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/live/$slug",
				params: { slug },
				className: "mt-2 px-3 text-xs text-mint",
				children: "Live board"
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: signOut,
				className: "mt-2 flex min-h-11 items-center gap-3 rounded-full px-3 text-sm text-cream/55 hover:text-cream",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" }), "Sign out"]
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudioCtx.Provider, {
		value,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-screen bg-ink text-cream",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
					className: "fixed inset-y-0 left-0 hidden w-60 border-r border-white/10 p-4 lg:block",
					children: nav
				}),
				open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "fixed inset-0 z-40 lg:hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "absolute inset-0 bg-black/50",
						"aria-label": "Close menu",
						onClick: () => setOpen(false)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-y-0 left-0 w-64 border-r border-white/10 bg-ink p-4",
						children: nav
					})]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:pl-60",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-white/10 bg-ink/80 px-4 py-3 backdrop-blur-xl sm:px-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "grid size-11 place-items-center rounded-full lg:hidden",
								"aria-label": "Open menu",
								onClick: () => setOpen(true),
								children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "hidden text-sm text-cream/50 sm:block",
								children: "AI Creative Studio"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "ml-auto flex items-center gap-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "rounded-full bg-mint px-3 py-1.5 text-xs font-medium tabular-nums text-mint-ink",
									children: [value.user.credits, " credits"]
								})
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
						className: "px-4 py-8 sm:px-8",
						children
					})]
				})
			]
		})
	});
}
//#endregion
export { useStudio as n, StudioShell as t };
