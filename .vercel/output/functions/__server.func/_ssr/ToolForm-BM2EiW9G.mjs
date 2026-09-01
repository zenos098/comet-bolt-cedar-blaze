import { B as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as cn } from "./LoopMark-BBkp5RpJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ToolForm-BM2EiW9G.js
var import_jsx_runtime = require_jsx_runtime();
function ToolForm({ title, hint, submitLabel = "Generate", busy, error, onSubmit, children, extra }) {
	async function handle(e) {
		e.preventDefault();
		await onSubmit();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: handle,
		className: "mx-auto flex w-full max-w-3xl flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-serif text-4xl tracking-tight text-cream sm:text-5xl",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "max-w-xl text-sm leading-relaxed text-muted",
					children: hint
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "card-surface flex flex-col gap-4 p-5 sm:p-6",
				children
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200",
				children: error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					disabled: busy,
					className: cn("rounded-full bg-mint px-6 py-3 text-sm font-medium text-mint-ink", "transition-transform duration-150 ease-out active:scale-[0.96] disabled:opacity-60"),
					children: busy ? "Generating… 8–20s" : submitLabel
				}), extra]
			})
		]
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex flex-col gap-2 text-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-medium text-cream/80",
			children: label
		}), children]
	});
}
var fieldClass = "w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-cream outline-none ring-mint/0 transition-[box-shadow] placeholder:text-cream/30 focus:ring-2 focus:ring-mint/40";
//#endregion
export { ToolForm as n, fieldClass as r, Field as t };
