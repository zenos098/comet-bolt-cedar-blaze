import { i as __toESM } from "../_runtime.mjs";
import { B as require_jsx_runtime, z as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as ToolForm, r as fieldClass, t as Field } from "./ToolForm-BM2EiW9G.mjs";
import { n as api } from "./client-5lUfA4AH.mjs";
import { n as useStudio } from "./StudioShell-VKYqG4Qk.mjs";
import { n as ResultImage } from "./CopyBlock-BNeN8jYD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shoot-DxLvVP2f.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ShootPage() {
	const { setCredits, brand } = useStudio();
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [item, setItem] = (0, import_react.useState)(null);
	const [brief, setBrief] = (0, import_react.useState)(brand ? `${brand.products} on a teak table, ${brand.city} light` : "");
	const [style, setStyle] = (0, import_react.useState)("warm cinematic shop photography");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ToolForm, {
			title: "Shoot",
			hint: "Stills only — a photograph from the brand kit. Not a model shoot, not a video.",
			busy,
			error,
			submitLabel: "Shoot still · 1 credit",
			onSubmit: async () => {
				setBusy(true);
				setError(null);
				try {
					const res = await api("/api/generate/image", {
						method: "POST",
						body: JSON.stringify({
							brief,
							style
						})
					});
					setItem(res.item);
					setCredits(res.credits);
				} catch (err) {
					setError(err instanceof Error ? err.message : "Failed");
				} finally {
					setBusy(false);
				}
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Brief",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					className: fieldClass,
					rows: 3,
					value: brief,
					onChange: (e) => setBrief(e.target.value)
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Style",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: fieldClass,
					value: style,
					onChange: (e) => setStyle(e.target.value)
				})
			})]
		}), item?.imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto w-full max-w-xl",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultImage, {
				src: item.imageUrl,
				alt: item.title
			})
		}) : null]
	});
}
//#endregion
export { ShootPage as component };
