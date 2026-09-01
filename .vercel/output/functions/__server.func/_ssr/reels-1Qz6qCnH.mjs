import { i as __toESM } from "../_runtime.mjs";
import { B as require_jsx_runtime, z as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as ToolForm, r as fieldClass, t as Field } from "./ToolForm-BM2EiW9G.mjs";
import { n as api } from "./client-5lUfA4AH.mjs";
import { n as useStudio } from "./StudioShell-VKYqG4Qk.mjs";
import { t as BrandKit } from "./BrandKit-DkV2Zx3_.mjs";
import { n as ResultImage, t as CopyBlock } from "./CopyBlock-BNeN8jYD.mjs";
import { t as PublishPanel } from "./PublishPanel-Emk-rP9a.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reels-1Qz6qCnH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function parseBody(item) {
	try {
		return JSON.parse(item.body || "{}");
	} catch {
		return {};
	}
}
function ReelsPage() {
	const { setCredits, brand } = useStudio();
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [item, setItem] = (0, import_react.useState)(null);
	const [topic, setTopic] = (0, import_react.useState)(brand?.offer ?? "");
	const meta = item ? parseBody(item) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ToolForm, {
			title: "Reels",
			hint: "Storyboard, voiceover and four 9:16 stills from the brand kit — not a full AI-actor MP4. Cover still can be published to Instagram.",
			busy,
			error,
			submitLabel: "Storyboard Reel · 4 credits",
			onSubmit: async () => {
				setBusy(true);
				setError(null);
				try {
					const res = await api("/api/generate/reel", {
						method: "POST",
						body: JSON.stringify({ topic })
					});
					setItem(res.item);
					setCredits(res.credits);
				} catch (err) {
					setError(err instanceof Error ? err.message : "Failed");
				} finally {
					setBusy(false);
				}
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandKit, { brand }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Topic",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: fieldClass,
					value: topic,
					onChange: (e) => setTopic(e.target.value)
				})
			})]
		}), item && meta ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto w-full max-w-3xl space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-serif text-2xl",
					children: meta.hook || item.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-3 sm:grid-cols-4",
					children: (item.images ?? []).map((src, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultImage, {
						src,
						alt: `Beat ${i + 1}`
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-muted",
						children: meta.beats?.[i]
					})] }, src))
				}),
				meta.voiceover ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyBlock, {
					text: meta.voiceover,
					label: "Copy voiceover"
				}) : null,
				item.caption ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyBlock, { text: item.caption }) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublishPanel, {
					item,
					onUpdated: setItem
				})
			]
		}) : null]
	});
}
//#endregion
export { ReelsPage as component };
