import { i as __toESM } from "../_runtime.mjs";
import { B as require_jsx_runtime, v as Link, z as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as cn } from "./LoopMark-BBkp5RpJ.mjs";
import { n as api } from "./client-5lUfA4AH.mjs";
import { _ as Check, i as Radio, u as LoaderCircle } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/PublishPanel-Emk-rP9a.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var LABELS = {
	instagram: "Instagram",
	facebook: "Facebook",
	google: "Google Business",
	whatsapp: "WhatsApp"
};
function PublishPanel({ item, onUpdated }) {
	const [accounts, setAccounts] = (0, import_react.useState)([]);
	const [selected, setSelected] = (0, import_react.useState)([]);
	const [when, setWhen] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [steps, setSteps] = (0, import_react.useState)([]);
	const [done, setDone] = (0, import_react.useState)(item.status === "posted" ? item : null);
	(0, import_react.useEffect)(() => {
		api("/api/social").then((d) => {
			const connected = d.items.filter((a) => a.connected);
			setAccounts(connected);
			setSelected(connected.map((a) => a.platform));
		}).catch(() => setAccounts([]));
	}, []);
	const preview = (0, import_react.useMemo)(() => selected.map((platform) => {
		const acc = accounts.find((a) => a.platform === platform);
		return `${LABELS[platform]} ${acc?.handle || ""}`.trim();
	}), [selected, accounts]);
	async function publish(schedule) {
		if (!selected.length) {
			setError("Pick at least one network.");
			return;
		}
		setBusy(true);
		setError(null);
		const planned = [
			{
				label: "Using the brand kit",
				state: "run"
			},
			{
				label: "Uploading the still",
				state: "wait"
			},
			...selected.map((p) => ({
				label: `Posting to ${LABELS[p]}`,
				state: "wait"
			})),
			{
				label: "Live on the shop board",
				state: "wait"
			}
		];
		setSteps(planned);
		const advance = async () => {
			for (let i = 0; i < planned.length - 1; i += 1) {
				await new Promise((r) => setTimeout(r, 280));
				setSteps((prev) => prev.map((s, idx) => idx < i ? {
					...s,
					state: "done"
				} : idx === i ? {
					...s,
					state: "run"
				} : s));
			}
		};
		const anim = advance();
		try {
			const res = await api("/api/publish", {
				method: "POST",
				body: JSON.stringify({
					generationId: item.id,
					platforms: selected,
					scheduledFor: schedule && when ? new Date(when).toISOString() : void 0
				})
			});
			await anim;
			setSteps((prev) => prev.map((s) => ({
				...s,
				state: "done"
			})));
			setDone(res.item);
			onUpdated?.(res.item);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not publish");
			setSteps((prev) => prev.map((s) => s.state === "run" ? {
				...s,
				state: "fail"
			} : s));
		} finally {
			setBusy(false);
		}
	}
	if (!accounts.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "card-surface p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "Connect Instagram, Facebook, Google or WhatsApp in Publish to send this live."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/studio/publish",
			className: "mt-3 inline-block text-sm text-mint",
			children: "Open publisher"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "card-surface space-y-5 p-5 sm:p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-[0.18em] text-mint",
					children: "Publish"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-1 font-serif text-2xl",
					children: "Send it out"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "Posts go live on the shop board immediately. If a Meta Page token is saved, Looply also pushes to the real network."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: accounts.map((account) => {
					const on = selected.includes(account.platform);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setSelected((prev) => on ? prev.filter((p) => p !== account.platform) : [...prev, account.platform]),
						className: cn("rounded-full border px-3 py-2 text-sm transition-colors", on ? "border-mint/40 bg-mint/15 text-cream" : "border-white/10 text-cream/55"),
						children: [
							LABELS[account.platform],
							" · ",
							account.handle
						]
					}, account.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block text-sm text-cream/70",
				children: ["Schedule (optional)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "datetime-local",
					value: when,
					onChange: (e) => setWhen(e.target.value),
					className: "mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-cream outline-none focus:ring-2 focus:ring-mint/40"
				})]
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-red-300",
				children: error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: busy,
					onClick: () => publish(false),
					className: "rounded-full bg-mint px-5 py-3 text-sm font-medium text-mint-ink disabled:opacity-60",
					children: busy && !when ? "Publishing…" : "Post now"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: busy || !when,
					onClick: () => publish(true),
					className: "rounded-full border border-white/15 px-5 py-3 text-sm text-cream disabled:opacity-60",
					children: "Schedule auto-post"
				})]
			}),
			steps.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "space-y-2",
				children: steps.map((step) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center gap-2 text-sm text-cream/80",
					children: [step.state === "run" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin text-mint" }) : step.state === "done" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 text-mint" }) : step.state === "fail" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "size-4 text-red-300" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-4 rounded-full border border-white/15" }), step.label]
				}, step.label))
			}) : null,
			done?.status === "posted" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-mint",
				children: [
					"Live",
					preview.length ? ` · ${preview.join(" · ")}` : "",
					".",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/p/$id",
						params: { id: done.id },
						className: "underline decoration-mint/40 underline-offset-4",
						children: "Open the post"
					})
				]
			}) : done?.status === "scheduled" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-mint",
				children: [
					"Queued for ",
					done.scheduledFor,
					". Studio will post it when due."
				]
			}) : null
		]
	});
}
//#endregion
export { PublishPanel as t };
