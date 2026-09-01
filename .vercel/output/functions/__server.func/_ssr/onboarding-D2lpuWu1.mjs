import { i as __toESM } from "../_runtime.mjs";
import { B as require_jsx_runtime, y as useNavigate, z as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as fieldClass } from "./ToolForm-BM2EiW9G.mjs";
import { n as api } from "./client-5lUfA4AH.mjs";
import { n as useStudio } from "./StudioShell-VKYqG4Qk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/onboarding-D2lpuWu1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FIELDS = [
	{
		key: "businessName",
		label: "Business name",
		placeholder: "Nimrah Atelier"
	},
	{
		key: "website",
		label: "Website",
		placeholder: "https://"
	},
	{
		key: "industry",
		label: "Industry",
		placeholder: "boutique fashion"
	},
	{
		key: "city",
		label: "City",
		placeholder: "Delhi"
	},
	{
		key: "language",
		label: "Language",
		placeholder: "English + Hindi"
	},
	{
		key: "tone",
		label: "Tone",
		placeholder: "warm confident"
	},
	{
		key: "audience",
		label: "Audience",
		placeholder: "who you sell to"
	},
	{
		key: "offer",
		label: "Current offer",
		placeholder: "New linen drop + free hemming"
	},
	{
		key: "products",
		label: "Products",
		placeholder: "linen sets, kurtas, silk shirts"
	},
	{
		key: "colors",
		label: "Colors",
		placeholder: "ivory, forest green, warm gold"
	}
];
function OnboardingPage() {
	const { brand, setBrand } = useStudio();
	const navigate = useNavigate();
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	async function onSubmit(e) {
		e.preventDefault();
		setBusy(true);
		setError(null);
		const form = new FormData(e.currentTarget);
		const payload = {};
		for (const field of FIELDS) payload[field.key] = String(form.get(field.key) || "");
		try {
			const res = await api("/api/brand", {
				method: "POST",
				body: JSON.stringify(payload)
			});
			setBrand(res.brand);
			navigate({ to: "/studio" });
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not save brand");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit,
		className: "mx-auto max-w-2xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-serif text-4xl tracking-tight sm:text-5xl",
				children: "Brand kit"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: "Learned once. Every post, still, Reel and reply uses this — no blank prompt box after setup."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "card-surface mt-8 grid gap-4 p-5 sm:p-6",
				children: FIELDS.map((field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-sm",
					children: [field.label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						name: field.key,
						required: field.key === "businessName",
						defaultValue: String(brand?.[field.key] ?? ""),
						placeholder: field.placeholder,
						className: `${fieldClass} mt-2`
					})]
				}, field.key))
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-red-300",
				children: error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "submit",
				disabled: busy,
				className: "mt-6 rounded-full bg-mint px-6 py-3 text-sm font-medium text-mint-ink disabled:opacity-60",
				children: busy ? "Saving…" : "Save brand"
			})
		]
	});
}
//#endregion
export { OnboardingPage as component };
