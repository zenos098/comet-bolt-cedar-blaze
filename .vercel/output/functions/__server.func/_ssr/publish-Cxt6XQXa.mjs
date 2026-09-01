import { i as __toESM } from "../_runtime.mjs";
import { B as require_jsx_runtime, v as Link, z as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as cn } from "./LoopMark-BBkp5RpJ.mjs";
import { r as fieldClass } from "./ToolForm-BM2EiW9G.mjs";
import { n as api } from "./client-5lUfA4AH.mjs";
import { l as brandSlug } from "./router-s0Jy-Dzk.mjs";
import { n as useStudio } from "./StudioShell-VKYqG4Qk.mjs";
import { t as PublishPanel } from "./PublishPanel-Emk-rP9a.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/publish-Cxt6XQXa.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var NETWORKS = [
	{
		platform: "instagram",
		label: "Instagram",
		hint: "Feed post with still + caption"
	},
	{
		platform: "facebook",
		label: "Facebook",
		hint: "Page photo post"
	},
	{
		platform: "google",
		label: "Google Business",
		hint: "Local update on the live board"
	},
	{
		platform: "whatsapp",
		label: "WhatsApp",
		hint: "Status card on the live board"
	}
];
function PublishPage() {
	const { brand } = useStudio();
	const [accounts, setAccounts] = (0, import_react.useState)([]);
	const [queue, setQueue] = (0, import_react.useState)([]);
	const [jobs, setJobs] = (0, import_react.useState)([]);
	const [tokenOpen, setTokenOpen] = (0, import_react.useState)(null);
	const [notice, setNotice] = (0, import_react.useState)(null);
	const slug = brand ? brandSlug(brand.businessName) : "";
	async function load() {
		const [social, gens, published] = await Promise.all([
			api("/api/social"),
			api("/api/generations"),
			api("/api/publish")
		]);
		setAccounts(social.items);
		setQueue(gens.items.filter((g) => [
			"post",
			"image",
			"ad",
			"reel",
			"calendar"
		].includes(g.kind) && (g.status === "ready" || g.status === "scheduled" || g.status === "posted")));
		setJobs(published.items.slice(0, 12));
	}
	(0, import_react.useEffect)(() => {
		load().catch(() => void 0);
	}, []);
	const byPlatform = (0, import_react.useMemo)(() => {
		return new Map(accounts.map((a) => [a.platform, a]));
	}, [accounts]);
	async function save(platform, form) {
		setNotice(null);
		await api("/api/social", {
			method: "POST",
			body: JSON.stringify({
				platform,
				handle: String(form.get("handle") || ""),
				displayName: String(form.get("displayName") || ""),
				connected: form.get("connected") === "on",
				accessToken: String(form.get("accessToken") || ""),
				pageId: String(form.get("pageId") || ""),
				igUserId: String(form.get("igUserId") || "")
			})
		});
		setNotice(`${platform} saved.`);
		await load();
	}
	const ready = queue.filter((g) => g.status === "ready");
	const live = queue.filter((g) => g.status === "posted");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl space-y-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-mint",
						children: brand?.businessName || "Publisher"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-serif text-4xl tracking-tight sm:text-5xl",
						children: "Publish"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "max-w-2xl text-sm leading-relaxed text-muted",
						children: "Approve a post, pick networks, send it now or let Looply auto-post when the clock hits. The shop board is public so you can see it go live."
					}),
					slug ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/live/$slug",
						params: { slug },
						className: "inline-flex rounded-full bg-mint px-4 py-2 text-sm font-medium text-mint-ink",
						children: "Open live board"
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "grid gap-4 md:grid-cols-2",
				children: NETWORKS.map((net) => {
					const acc = byPlatform.get(net.platform);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "card-surface p-5",
						onSubmit: async (e) => {
							e.preventDefault();
							await save(net.platform, new FormData(e.currentTarget));
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: net.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted",
									children: net.hint
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center gap-2 text-xs text-cream/70",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										name: "connected",
										defaultChecked: acc?.connected ?? false,
										className: "size-4 accent-mint"
									}), "On"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "hidden",
								name: "displayName",
								defaultValue: acc?.displayName || brand?.businessName || ""
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "mt-4 block text-sm",
								children: ["Handle", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									name: "handle",
									defaultValue: acc?.handle || "",
									className: `${fieldClass} mt-2`,
									placeholder: "@yourshop"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "mt-3 text-xs text-cream/45",
								onClick: () => setTokenOpen((p) => p === net.platform ? null : net.platform),
								children: tokenOpen === net.platform ? "Hide token" : "Paste Meta token (optional)"
							}),
							tokenOpen === net.platform ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 space-y-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										name: "accessToken",
										placeholder: acc?.hasToken ? "Token saved — paste to replace" : "Page access token",
										className: fieldClass
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										name: "pageId",
										placeholder: "Facebook Page ID",
										defaultValue: "",
										className: fieldClass
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										name: "igUserId",
										placeholder: "Instagram Business ID",
										className: fieldClass
									})
								]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								className: "mt-4 rounded-full border border-white/15 px-4 py-2 text-sm",
								children: "Save"
							})
						]
					}, net.platform);
				})
			}),
			notice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-mint",
				children: notice
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-2xl",
					children: "Ready to send"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "Generated posts waiting for approval."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-5 grid gap-6",
					children: ready.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Nothing in the queue. Write a post first."
					}) : ready.slice(0, 4).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "grid gap-4 md:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-surface overflow-hidden",
							children: [item.imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: item.imageUrl,
								alt: "",
								className: "aspect-square w-full object-cover"
							}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs uppercase tracking-widest text-mint",
									children: [
										item.kind,
										" · ",
										item.platform
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 whitespace-pre-wrap text-sm leading-relaxed text-cream/85",
									children: item.caption
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublishPanel, {
							item,
							onUpdated: () => load()
						})]
					}, item.id))
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-serif text-2xl",
				children: "Activity"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 grid gap-3",
				children: jobs.length === 0 && live.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "No sends yet."
				}) : jobs.map((job) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "card-surface flex flex-wrap items-center justify-between gap-3 p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("mr-2 rounded-full px-2 py-0.5 text-xs", job.status === "posted" ? "bg-mint/20 text-mint" : "bg-white/8 text-cream/70"),
							children: job.status
						}), job.platforms.join(" · ")]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: job.scheduledFor || job.updatedAt
					})]
				}, job.id))
			})] })
		]
	});
}
//#endregion
export { PublishPage as component };
