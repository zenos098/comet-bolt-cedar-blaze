import { i as __toESM } from "../_runtime.mjs";
import { B as require_jsx_runtime, z as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as ToolForm } from "./ToolForm-BM2EiW9G.mjs";
import { n as api } from "./client-5lUfA4AH.mjs";
import { n as useStudio } from "./StudioShell-VKYqG4Qk.mjs";
import { n as ResultImage, t as CopyBlock } from "./CopyBlock-BNeN8jYD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/website-B2MWxFPk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function WebsitePage() {
	const { setCredits, brand } = useStudio();
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [item, setItem] = (0, import_react.useState)(null);
	let site = {};
	try {
		site = JSON.parse(item?.body || "{}");
	} catch {
		site = {};
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToolForm, {
			title: "Website",
			hint: "One page of copy plus a hero still. You still host it — Looply does not publish a domain.",
			busy,
			error,
			submitLabel: "Write the page · 5 credits",
			onSubmit: async () => {
				setBusy(true);
				setError(null);
				try {
					const res = await api("/api/generate/website", { method: "POST" });
					setItem(res.item);
					setCredits(res.credits);
				} catch (err) {
					setError(err instanceof Error ? err.message : "Failed");
				} finally {
					setBusy(false);
				}
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted",
				children: [
					"Uses the brand kit for ",
					brand?.businessName || "your shop",
					" in",
					" ",
					brand?.city || "your city",
					". Sections: HERO, ABOUT, OFFER, PROOF, VISIT, CTA."
				]
			})
		}), item ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto w-full max-w-3xl space-y-6",
			children: [item.imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultImage, {
				src: item.imageUrl,
				alt: "Hero"
			}) : null, [
				["HERO", site.hero],
				["ABOUT", site.about],
				["OFFER", site.offer],
				["PROOF", site.proof],
				["VISIT", site.visit],
				["CTA", site.cta]
			].map(([label, value]) => value ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-2 text-xs uppercase tracking-[0.18em] text-mint",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyBlock, { text: value })] }, label) : null)]
		}) : null]
	});
}
//#endregion
export { WebsitePage as component };
