import { i as __toESM } from "../_runtime.mjs";
import { B as require_jsx_runtime, v as Link, y as useNavigate, z as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as api, t as ApiError } from "./client-5lUfA4AH.mjs";
import { a as PLANS, i as CREDIT_COSTS, o as formatInr, s as formatUsd } from "./router-s0Jy-Dzk.mjs";
import { n as MarketingNav, t as Footer } from "./MarketingNav-D-IGdnuV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pricing-rP0hvrnn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PricingPage() {
	const navigate = useNavigate();
	const [notice, setNotice] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(null);
	async function choose(plan) {
		setNotice(null);
		setBusy(plan);
		try {
			await api("/api/me");
			const res = await api("/api/plan", {
				method: "POST",
				body: JSON.stringify({ plan })
			});
			setNotice(`Added ${res.added} credits. No payment taken.`);
		} catch (err) {
			if (err instanceof ApiError && err.status === 401) {
				setNotice("Sign in to add a plan’s credits.");
				setTimeout(() => navigate({ to: "/login" }), 900);
			} else setNotice(err instanceof Error ? err.message : "Could not add plan");
		} finally {
			setBusy(null);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-ink text-cream",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarketingNav, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-6xl px-6 pb-24 pt-32",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm uppercase tracking-[0.18em] text-mint",
						children: "Pricing"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 font-serif text-5xl tracking-tight sm:text-6xl",
						children: "Credits, not a blank cheque."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 max-w-xl text-muted",
						children: "Choosing a plan adds that plan’s credits. There is no Stripe, no ad spend, no surprise invoice."
					}),
					notice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 rounded-2xl border border-mint/30 bg-mint/10 px-4 py-3 text-sm text-mint",
						children: notice
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-12 grid gap-4 lg:grid-cols-3",
						children: Object.values(PLANS).map((plan) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "card-surface flex flex-col p-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-mint",
									children: plan.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 font-serif text-4xl",
									children: plan.usd === 0 ? "₹0" : formatInr(plan.inr)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm text-muted",
									children: [
										plan.usd === 0 ? "Free" : formatUsd(plan.usd),
										" · ",
										plan.credits,
										" credits"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-6 space-y-2 text-sm text-cream/75",
									children: plan.points.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: p }, p))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									disabled: busy === plan.id,
									onClick: () => choose(plan.id),
									className: "mt-8 rounded-full bg-mint px-4 py-3 text-sm font-medium text-mint-ink disabled:opacity-60",
									children: busy === plan.id ? "Adding…" : "Choose plan"
								})
							]
						}, plan.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-20 font-serif text-3xl",
						children: "What a credit buys"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 overflow-hidden rounded-3xl border border-white/10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
							className: "w-full text-left text-sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: Object.entries(CREDIT_COSTS).map(([kind, cost]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t border-white/10 first:border-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-3 capitalize",
									children: kind
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-3 text-right tabular-nums text-muted",
									children: cost
								})]
							}, kind)) })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-6 text-sm text-muted",
						children: [
							"Already have an account?",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/login",
								className: "text-mint",
								children: "Open studio"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { PricingPage as component };
