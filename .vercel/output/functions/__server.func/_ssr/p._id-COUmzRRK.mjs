import { i as __toESM } from "../_runtime.mjs";
import { B as require_jsx_runtime, v as Link, z as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as LoopMark } from "./LoopMark-BBkp5RpJ.mjs";
import { n as Route$20 } from "./router-s0Jy-Dzk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/p._id-COUmzRRK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PublicPost() {
	const { id } = Route$20.useParams();
	const [data, setData] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		fetch(`/api/live?id=${encodeURIComponent(id)}`).then(async (res) => {
			const body = await res.json();
			if (!res.ok) throw new Error(body.error || "Not found");
			setData(body);
		}).catch((err) => setError(err instanceof Error ? err.message : "Not found"));
	}, [id]);
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center bg-ink text-muted",
		children: error
	});
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center bg-ink text-muted",
		children: "Opening post…"
	});
	const { item, brand, slug } = data;
	const networks = item.postedTo?.length ? item.postedTo.join(" · ") : item.platform;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-ink text-cream",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "sticky top-0 z-20 border-b border-white/10 bg-ink/80 px-4 py-3 backdrop-blur-xl",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-3xl items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoopMark, { className: "size-5 text-mint" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-serif",
						children: "looply"
					})]
				}), slug ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/live/$slug",
					params: { slug },
					className: "text-sm text-mint",
					children: brand?.businessName
				}) : null]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto grid max-w-4xl gap-0 md:grid-cols-2 md:pt-10",
			children: [item.imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: item.imageUrl,
				alt: item.title,
				className: "w-full object-cover md:rounded-l-3xl"
			}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "flex flex-col p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs uppercase tracking-[0.18em] text-mint",
						children: ["Posted · ", networks]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 font-serif text-3xl",
						children: brand?.businessName
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted",
						children: [
							brand?.city,
							" · ",
							item.createdAt.slice(0, 16).replace("T", " ")
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 whitespace-pre-wrap text-sm leading-relaxed text-cream/90",
						children: item.caption
					}),
					item.used ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-6 text-xs text-cream/40",
						children: ["Written from the brand kit", item.source ? ` · ${item.source}` : ""]
					}) : null
				]
			})]
		})]
	});
}
//#endregion
export { PublicPost as component };
