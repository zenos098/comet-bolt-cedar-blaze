import { i as __toESM } from "../_runtime.mjs";
import { B as require_jsx_runtime, v as Link, z as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as LoopMark } from "./LoopMark-BBkp5RpJ.mjs";
import { r as Route$21 } from "./router-s0Jy-Dzk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/live._slug-Cv4ev8Aq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LiveBoard() {
	const { slug } = Route$21.useParams();
	const [tab, setTab] = (0, import_react.useState)("grid");
	const [data, setData] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		fetch(`/api/live?slug=${encodeURIComponent(slug)}`).then(async (res) => {
			const body = await res.json();
			if (!res.ok) throw new Error(body.error || "Not found");
			setData(body);
		}).catch((err) => setError(err instanceof Error ? err.message : "Not found"));
	}, [slug]);
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center bg-ink text-muted",
		children: error
	});
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center bg-ink text-muted",
		children: "Opening live board…"
	});
	const { brand, items, accounts } = data;
	const posted = items.filter((i) => i.imageUrl);
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
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-[0.18em] text-mint",
					children: "Live"
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-3xl px-4 py-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid size-20 place-items-center rounded-full bg-mint text-2xl font-serif text-mint-ink",
						children: brand.businessName.slice(0, 1)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-serif text-3xl",
							children: brand.businessName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm text-muted",
							children: [
								brand.industry,
								" · ",
								brand.city
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-cream/80",
							children: brand.offer
						})
					] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-5 max-w-xl text-sm leading-relaxed text-cream/70",
					children: [
						brand.audience,
						". ",
						brand.products,
						"."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 flex flex-wrap gap-2 text-xs text-cream/55",
					children: accounts.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "rounded-full border border-white/10 px-3 py-1",
						children: [
							a.platform,
							" · ",
							a.handle
						]
					}, a.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setTab("grid"),
						className: `rounded-full px-4 py-2 text-sm ${tab === "grid" ? "bg-mint text-mint-ink" : "text-cream/60"}`,
						children: "Instagram grid"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setTab("feed"),
						className: `rounded-full px-4 py-2 text-sm ${tab === "feed" ? "bg-mint text-mint-ink" : "text-cream/60"}`,
						children: "Facebook feed"
					})]
				}),
				posted.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-10 text-sm text-muted",
					children: "Nothing live yet. Publish a post from the studio."
				}) : tab === "grid" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 grid grid-cols-3 gap-1",
					children: posted.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/p/$id",
						params: { id: item.id },
						className: "aspect-square overflow-hidden bg-white/5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: item.imageUrl,
							alt: item.title,
							className: "size-full object-cover"
						})
					}, item.id))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 space-y-4",
					children: posted.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "card-surface overflow-hidden",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid size-9 place-items-center rounded-full bg-mint text-sm text-mint-ink",
									children: brand.businessName.slice(0, 1)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium",
									children: brand.businessName
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted",
									children: [
										item.postedTo?.join(" · ") || item.platform,
										" · ",
										item.createdAt.slice(0, 10)
									]
								})] })]
							}),
							item.imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: item.imageUrl,
								alt: "",
								className: "aspect-square w-full object-cover"
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "whitespace-pre-wrap p-4 text-sm leading-relaxed text-cream/85",
								children: item.caption
							})
						]
					}, item.id))
				})
			]
		})]
	});
}
//#endregion
export { LiveBoard as component };
