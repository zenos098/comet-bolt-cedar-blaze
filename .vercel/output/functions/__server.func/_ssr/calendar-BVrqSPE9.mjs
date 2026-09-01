import { i as __toESM } from "../_runtime.mjs";
import { B as require_jsx_runtime, z as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as ToolForm, r as fieldClass, t as Field } from "./ToolForm-BM2EiW9G.mjs";
import { n as api } from "./client-5lUfA4AH.mjs";
import { n as useStudio } from "./StudioShell-VKYqG4Qk.mjs";
import { t as BrandKit } from "./BrandKit-DkV2Zx3_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/calendar-BVrqSPE9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CalendarPage() {
	const { setCredits, brand } = useStudio();
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [days, setDays] = (0, import_react.useState)(7);
	const [items, setItems] = (0, import_react.useState)([]);
	const [notice, setNotice] = (0, import_react.useState)(null);
	async function load() {
		const res = await api("/api/generations");
		setItems(res.items.filter((i) => i.kind === "calendar" || i.status === "scheduled"));
	}
	(0, import_react.useEffect)(() => {
		load().catch(() => setItems([]));
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ToolForm, {
				title: "Calendar",
				hint: "Plans 5–14 posts from the brand kit. Day-one items auto-post when due if networks are connected in Publish.",
				busy,
				error,
				submitLabel: "Plan week · 3 credits",
				onSubmit: async () => {
					setBusy(true);
					setError(null);
					try {
						const res = await api("/api/generate/calendar", {
							method: "POST",
							body: JSON.stringify({ days })
						});
						setItems(res.items);
						setCredits(res.credits);
						setNotice("Queued. Studio posts each day automatically when it is due.");
					} catch (err) {
						setError(err instanceof Error ? err.message : "Failed");
					} finally {
						setBusy(false);
					}
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandKit, { brand }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Days (5–14)",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						min: 5,
						max: 14,
						className: fieldClass,
						value: days,
						onChange: (e) => setDays(Number(e.target.value))
					})
				})]
			}),
			notice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mx-auto max-w-3xl text-sm text-mint",
				children: notice
			}) : null,
			items.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto grid w-full max-w-3xl gap-3",
				children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "card-surface p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs uppercase tracking-widest text-mint",
							children: [
								item.scheduledFor || "unscheduled",
								" · ",
								item.platform,
								" · ",
								item.status
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-1 font-serif text-2xl",
							children: item.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-relaxed text-muted",
							children: item.caption
						})
					]
				}, item.id))
			}) : null
		]
	});
}
//#endregion
export { CalendarPage as component };
