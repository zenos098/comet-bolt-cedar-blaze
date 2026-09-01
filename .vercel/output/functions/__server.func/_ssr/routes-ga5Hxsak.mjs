import { B as require_jsx_runtime, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as PenLine, c as Megaphone, f as Image, g as Clapperboard, o as MessageCircle, v as CalendarRange } from "../_libs/lucide-react.mjs";
import { a as PLANS, o as formatInr, s as formatUsd } from "./router-s0Jy-Dzk.mjs";
import { n as MarketingNav, t as Footer } from "./MarketingNav-D-IGdnuV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-ga5Hxsak.js
var import_jsx_runtime = require_jsx_runtime();
var TICKER = [
	"Nimrah Atelier",
	"Farmer's India Market",
	"Turning Heads Studio",
	"Root & Reign",
	"Jo's Space",
	"Harbour Cafe",
	"Elrose Clinic",
	"Drip Drop Towing"
];
var FEATURES = [
	{
		title: "It posts",
		body: "Captions and stills for Instagram, Facebook and Google, written in your city's voice.",
		icon: PenLine
	},
	{
		title: "It makes Reels",
		body: "A four-beat storyboard and 9:16 stills. Not an AI actor. You shoot or stitch.",
		icon: Clapperboard
	},
	{
		title: "It shoots",
		body: "Product and shop stills from the brand kit — linen, lighting, and the actual offer.",
		icon: Image
	},
	{
		title: "It advertises",
		body: "Export square creatives and copy. Looply does not spend your ad budget.",
		icon: Megaphone
	},
	{
		title: "It answers",
		body: "Drafts WhatsApp, Instagram and Google replies. You paste. Nothing is live-connected.",
		icon: MessageCircle
	},
	{
		title: "It gets you found",
		body: "A one-page site: hero, offer, proof, visit, CTA — so search has somewhere to land.",
		icon: CalendarRange
	}
];
var HERO = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2400&q=80";
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-ink text-cream",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarketingNav, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "relative min-h-[100svh] overflow-hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: HERO,
						alt: "A busy independent cafe at dusk",
						className: "absolute inset-0 size-full object-cover"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/70 to-ink" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-6 pb-24 pt-36",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "rise text-sm uppercase tracking-[0.22em] text-mint",
								children: "AI marketing partner"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "rise rise-2 mt-4 font-serif text-[14vw] leading-[0.9] tracking-[-0.04em] sm:text-7xl md:text-8xl lg:text-9xl",
								children: [
									"Run marketing",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-mint",
										children: "/"
									}),
									" 24/7."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "rise rise-3 mt-6 max-w-xl text-base leading-relaxed text-cream/80 sm:text-lg",
								children: "Looply keeps a business growing online — creating, posting, answering and advertising while the owner runs the shop."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rise rise-4 mt-8 flex flex-wrap gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/signup",
									className: "rounded-full bg-mint px-6 py-3 text-sm font-medium text-mint-ink transition-transform duration-150 active:scale-[0.96]",
									children: "Get the app"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/login",
									className: "rounded-full border border-white/15 px-6 py-3 text-sm text-cream transition-transform duration-150 active:scale-[0.96]",
									children: "Open studio"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-6 text-sm text-cream/55",
								children: "Demo studio · demo@looply.app / demo1234"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-y border-white/10 bg-ink py-4 overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex w-max marquee-track",
					children: [0, 1].map((copy) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-10 pr-10",
						children: TICKER.map((name) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "whitespace-nowrap font-serif text-lg text-cream/70",
							children: [name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-10 text-mint",
								children: "/"
							})]
						}, `${copy}-${name}`))
					}, copy))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "features",
				className: "mx-auto max-w-6xl px-6 py-24",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "max-w-3xl font-serif text-4xl leading-tight tracking-tight sm:text-5xl",
					children: "The internet never stops. Now your marketing doesn’t either."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
					children: FEATURES.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "card-surface p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(f.icon, { className: "size-5 text-mint" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-4 font-serif text-2xl",
								children: f.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm leading-relaxed text-muted",
								children: f.body
							})
						]
					}, f.title))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "px-6 pb-24",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] lg:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col justify-center p-8 sm:p-12",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm uppercase tracking-[0.18em] text-mint",
								children: "Brand kit"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-3 font-serif text-4xl tracking-tight sm:text-5xl",
								children: "Learn the brand once. Approve the rest."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 max-w-md text-sm leading-relaxed text-muted",
								children: "No blank prompt box after setup. Looply writes from the shop you already run — city, offer, products, tone. You approve. Credits meter every generation."
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "border-t border-white/10 p-8 lg:border-l lg:border-t-0 sm:p-12",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-3xl border border-white/10 bg-ink p-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs uppercase tracking-[0.18em] text-cream/40",
									children: "On file"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-2 font-serif text-3xl",
									children: "Nimrah Atelier"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
									className: "mt-6 space-y-3 text-sm",
									children: [
										["City", "Delhi"],
										["Tone", "Warm, confident"],
										["Offer", "New linen drop + free hemming this week"],
										["Products", "Linen sets, kurtas, silk shirts"],
										["Colors", "Ivory · forest green · warm gold"]
									].map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between gap-4 border-b border-white/8 pb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "text-cream/45",
											children: k
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
											className: "text-right text-cream/90",
											children: v
										})]
									}, k))
								})
							]
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto max-w-6xl px-6 pb-24",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-4xl tracking-tight",
					children: "Pick a pace."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-10 grid gap-4 lg:grid-cols-3",
					children: Object.values(PLANS).map((plan) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "card-surface flex flex-col p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-mint",
								children: plan.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 font-serif text-4xl",
								children: plan.usd === 0 ? "Free" : formatUsd(plan.usd)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted",
								children: [
									formatInr(plan.inr),
									" · ",
									plan.credits,
									" credits"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-sm leading-relaxed text-muted",
								children: plan.blurb
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/pricing",
								className: "mt-8 rounded-full border border-white/10 px-4 py-2 text-center text-sm hover:bg-white/5",
								children: "See plan"
							})
						]
					}, plan.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "px-6 pb-24",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-mint px-8 py-16 text-mint-ink sm:px-16",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "font-serif text-4xl tracking-tight sm:text-6xl",
						children: [
							"Go run the shop.",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							"We’ll keep the internet busy."
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-wrap gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/signup",
							className: "rounded-full bg-mint-ink px-6 py-3 text-sm font-medium text-mint",
							children: "Start free"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							className: "rounded-full border border-mint-ink/20 px-6 py-3 text-sm",
							children: "Demo studio"
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { Home as component };
