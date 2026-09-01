import { i as __toESM } from "../_runtime.mjs";
import { B as require_jsx_runtime, z as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as ToolForm, r as fieldClass, t as Field } from "./ToolForm-BM2EiW9G.mjs";
import { n as api } from "./client-5lUfA4AH.mjs";
import { n as useStudio } from "./StudioShell-VKYqG4Qk.mjs";
import { t as BrandKit } from "./BrandKit-DkV2Zx3_.mjs";
import { n as ResultImage, t as CopyBlock } from "./CopyBlock-BNeN8jYD.mjs";
import { t as PublishPanel } from "./PublishPanel-Emk-rP9a.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/posts-Ck1YodPv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PostsPage() {
	const { setCredits, brand } = useStudio();
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [item, setItem] = (0, import_react.useState)(null);
	const [topic, setTopic] = (0, import_react.useState)(brand?.offer ?? "");
	const [platform, setPlatform] = (0, import_react.useState)("instagram");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ToolForm, {
			title: "Posts",
			hint: "Written from the brand kit — name, city, products, offer, tone, language. Approve, then publish to Instagram, Facebook, Google or WhatsApp.",
			busy,
			error,
			submitLabel: "Write post · 1 credit",
			onSubmit: async () => {
				setBusy(true);
				setError(null);
				try {
					const res = await api("/api/generate/post", {
						method: "POST",
						body: JSON.stringify({
							topic,
							platform
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
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandKit, { brand }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Topic",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: fieldClass,
						value: topic,
						onChange: (e) => setTopic(e.target.value),
						placeholder: "New linen drop"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Platform",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: fieldClass,
						value: platform,
						onChange: (e) => setPlatform(e.target.value),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "instagram",
								children: "Instagram"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "facebook",
								children: "Facebook"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "google",
								children: "Google"
							})
						]
					})
				})
			]
		}), item ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid w-full max-w-3xl gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-2",
				children: [item.imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultImage, {
					src: item.imageUrl,
					alt: item.title
				}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyBlock, { text: item.caption || "" }), item.used ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-cream/45",
						children: [
							"Used ",
							Object.values(item.used).join(" · "),
							item.source ? ` · ${item.source}` : ""
						]
					}) : null]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublishPanel, {
				item,
				onUpdated: setItem
			})]
		}) : null]
	});
}
//#endregion
export { PostsPage as component };
