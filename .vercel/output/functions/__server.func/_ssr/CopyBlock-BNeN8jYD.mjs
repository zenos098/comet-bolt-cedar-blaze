import { i as __toESM } from "../_runtime.mjs";
import { B as require_jsx_runtime, z as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as Check, h as Copy } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/CopyBlock-BNeN8jYD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CopyBlock({ text, label = "Copy" }) {
	const [done, setDone] = (0, import_react.useState)(false);
	async function copy() {
		await navigator.clipboard.writeText(text);
		setDone(true);
		setTimeout(() => setDone(false), 1400);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
			className: "whitespace-pre-wrap rounded-2xl border border-white/10 bg-white/[0.03] p-4 pr-14 text-sm leading-relaxed text-cream/90",
			children: text
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: copy,
			className: "absolute right-3 top-3 grid size-10 place-items-center rounded-full text-cream/60 hover:text-cream",
			"aria-label": label,
			children: done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 text-mint" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" })
		})]
	});
}
function ResultImage({ src, alt }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src,
		alt,
		className: "w-full rounded-2xl object-cover",
		loading: "lazy"
	});
}
//#endregion
export { ResultImage as n, CopyBlock as t };
