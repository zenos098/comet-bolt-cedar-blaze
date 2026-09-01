import { i as __toESM } from "../_runtime.mjs";
import { B as require_jsx_runtime, v as Link, z as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as cn, t as LoopMark } from "./LoopMark-BBkp5RpJ.mjs";
import { s as Menu, t as X } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/MarketingNav-D-IGdnuV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Footer() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "border-t border-white/10 px-6 py-12 text-sm text-cream/55",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-start md:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 text-cream",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoopMark, { className: "size-5 text-mint" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-serif text-lg",
					children: "looply"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-sm leading-relaxed",
				children: "Run marketing 24/7. Looply is an independent product and is not affiliated with Scalio."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-x-12 gap-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/pricing",
						className: "hover:text-cream",
						children: "Pricing"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/examples",
						className: "hover:text-cream",
						children: "Examples"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/contact",
						className: "hover:text-cream",
						children: "Contact"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						className: "hover:text-cream",
						children: "Studio"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "mailto:support@looply.app",
						className: "hover:text-cream",
						children: "support@looply.app"
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mx-auto mt-10 max-w-6xl text-xs text-cream/35",
			children: [
				"© ",
				(/* @__PURE__ */ new Date()).getFullYear(),
				" Looply. Reels are storyboards. Inbox drafts replies. Ads export creatives. The owner approves."
			]
		})]
	});
}
var links = [
	{
		to: "/pricing",
		label: "Pricing"
	},
	{
		to: "/examples",
		label: "Examples"
	},
	{
		to: "/contact",
		label: "Contact"
	}
];
function MarketingNav() {
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-3 sm:px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
			className: cn("pointer-events-auto flex w-full max-w-[1440px] items-center justify-between gap-3", "rounded-full border border-white/10 bg-ink/55 px-3 py-2 pl-5 shadow-[var(--shadow-border)]", "backdrop-blur-xl"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex items-center gap-2 text-cream",
					onClick: () => setOpen(false),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoopMark, { className: "size-6 text-mint" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-serif text-lg tracking-tight",
						children: "looply"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hidden items-center gap-7 text-sm text-cream/75 md:flex",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						hash: "features",
						className: "transition-colors hover:text-cream",
						children: "Features"
					}), links.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: l.to,
						className: "transition-colors hover:text-cream",
						children: l.label
					}, l.to))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hidden items-center gap-2 md:flex",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						className: "rounded-full px-4 py-2 text-sm text-cream/80 transition-colors hover:text-cream",
						children: "Use on web"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/signup",
						className: "rounded-full bg-mint px-4 py-2 text-sm font-medium text-mint-ink transition-transform duration-150 ease-out active:scale-[0.96]",
						children: "Get the app"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "grid size-11 place-items-center rounded-full text-cream md:hidden",
					"aria-label": open ? "Close menu" : "Open menu",
					onClick: () => setOpen((v) => !v),
					children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
				})
			]
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pointer-events-auto absolute inset-x-3 top-16 rounded-3xl border border-white/10 bg-ink/95 p-4 backdrop-blur-xl md:hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-1 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						hash: "features",
						className: "rounded-2xl px-4 py-3",
						onClick: () => setOpen(false),
						children: "Features"
					}),
					links.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: l.to,
						className: "rounded-2xl px-4 py-3",
						onClick: () => setOpen(false),
						children: l.label
					}, l.to)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						className: "rounded-2xl px-4 py-3",
						onClick: () => setOpen(false),
						children: "Use on web"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/signup",
						className: "mt-2 rounded-full bg-mint px-4 py-3 text-center font-medium text-mint-ink",
						onClick: () => setOpen(false),
						children: "Get the app"
					})
				]
			})
		}) : null]
	});
}
//#endregion
export { MarketingNav as n, Footer as t };
