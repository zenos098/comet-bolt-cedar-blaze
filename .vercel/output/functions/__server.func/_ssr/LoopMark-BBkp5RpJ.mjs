import { B as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/LoopMark-BBkp5RpJ.js
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function LoopMark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 32 32",
		className: cn("shrink-0", className),
		"aria-hidden": "true",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: "M10.5 16c0-3.04 2.46-5.5 5.5-5.5h3.2c2.43 0 4.4 1.97 4.4 4.4s-1.97 4.4-4.4 4.4H16",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2.2",
			strokeLinecap: "round"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: "M21.5 16c0 3.04-2.46 5.5-5.5 5.5h-3.2c-2.43 0-4.4-1.97-4.4-4.4s1.97-4.4 4.4-4.4H16",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2.2",
			strokeLinecap: "round"
		})]
	});
}
//#endregion
export { cn as n, LoopMark as t };
