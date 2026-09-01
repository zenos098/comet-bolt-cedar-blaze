import { i as __toESM } from "../_runtime.mjs";
import { B as require_jsx_runtime, v as Link, z as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as api } from "./client-5lUfA4AH.mjs";
import { a as PenLine, f as Image, i as Radio, y as CalendarDays } from "../_libs/lucide-react.mjs";
import { l as brandSlug } from "./router-s0Jy-Dzk.mjs";
import { n as useStudio } from "./StudioShell-VKYqG4Qk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/studio-CBjyMgOL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SHORTCUTS = [
	{
		to: "/studio/posts",
		title: "Write a post",
		hint: "From your brand kit · 1 credit",
		icon: PenLine
	},
	{
		to: "/studio/publish",
		title: "Publish",
		hint: "Instagram, Facebook, Google, WhatsApp",
		icon: Radio
	},
	{
		to: "/studio/shoot",
		title: "Shoot stills",
		hint: "Product photo · 1 credit",
		icon: Image
	},
	{
		to: "/studio/calendar",
		title: "Plan the week",
		hint: "Auto-posts when due · 3 credits",
		icon: CalendarDays
	}
];
function StudioHome() {
	const { user, brand } = useStudio();
	const [items, setItems] = (0, import_react.useState)([]);
	const slug = brand ? brandSlug(brand.businessName) : "";
	(0, import_react.useEffect)(() => {
		api("/api/generations").then((d) => setItems(d.items.slice(0, 8))).catch(() => setItems([]));
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-mint",
				children: brand?.city || "Studio"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-serif text-4xl tracking-tight sm:text-5xl",
				children: brand?.businessName || "Set the brand first"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 max-w-xl text-sm text-muted",
				children: [
					brand?.offer || "Save a brand kit so every generation already knows the shop.",
					" ",
					"You have ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular-nums text-cream",
						children: user.credits
					}),
					" credits on the ",
					user.plan,
					" plan."
				]
			}),
			slug ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/live/$slug",
				params: { slug },
				className: "mt-4 inline-flex text-sm text-mint",
				children: "Open live board"
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 grid gap-4 sm:grid-cols-2",
				children: SHORTCUTS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: s.to,
					className: "card-surface flex items-start gap-4 p-5 transition-[box-shadow] hover:shadow-[var(--shadow-border-hover)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(s.icon, { className: "mt-0.5 size-5 text-mint" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block font-medium",
						children: s.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-1 block text-sm text-muted",
						children: s.hint
					})] })]
				}, s.to))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-12 font-serif text-2xl",
				children: "Recent work"
			}),
			items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-muted",
				children: "Nothing yet. Generate a post — then publish it to the live board."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "card-surface overflow-hidden",
					children: [item.imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: item.imageUrl,
						alt: "",
						className: "h-36 w-full object-cover"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-36 place-items-center text-xs uppercase tracking-widest text-cream/30",
						children: item.kind
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-sm",
							children: item.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs capitalize text-muted",
							children: [
								item.kind,
								" · ",
								item.status
							]
						})]
					})]
				}, item.id))
			})
		]
	});
}
//#endregion
export { StudioHome as component };
