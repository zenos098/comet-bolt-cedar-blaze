import { B as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as brandFacts } from "./router-s0Jy-Dzk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/BrandKit-DkV2Zx3_.js
var import_jsx_runtime = require_jsx_runtime();
function BrandKit({ brand }) {
	const facts = brandFacts(brand);
	if (!facts.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: "Save a brand kit first — every post is written from those facts, not a blank box."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-xs uppercase tracking-[0.18em] text-mint",
		children: "Writing as this shop"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-3 flex flex-wrap gap-2",
		children: facts.map((fact) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-cream/80",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-cream/40",
				children: [fact.label, " · "]
			}), fact.value]
		}, fact.label))
	})] });
}
//#endregion
export { BrandKit as t };
