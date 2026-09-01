import { i as __toESM } from "../_runtime.mjs";
import { B as require_jsx_runtime, z as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as ToolForm, r as fieldClass, t as Field } from "./ToolForm-BM2EiW9G.mjs";
import { n as api } from "./client-5lUfA4AH.mjs";
import { n as useStudio } from "./StudioShell-VKYqG4Qk.mjs";
import { t as CopyBlock } from "./CopyBlock-BNeN8jYD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/inbox-Bz6tgGl1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function InboxPage() {
	const { setCredits } = useStudio();
	const [messages, setMessages] = (0, import_react.useState)([]);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [text, setText] = (0, import_react.useState)("");
	const [from, setFrom] = (0, import_react.useState)("");
	const [channel, setChannel] = (0, import_react.useState)("instagram");
	const [latest, setLatest] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		api("/api/messages").then((d) => setMessages(d.items)).catch(() => setMessages([]));
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ToolForm, {
				title: "Inbox",
				hint: "Drafts replies you can paste. Looply does not connect live Instagram, WhatsApp or Google.",
				busy,
				error,
				submitLabel: "Draft reply · 1 credit",
				onSubmit: async () => {
					setBusy(true);
					setError(null);
					try {
						const res = await api("/api/generate/reply", {
							method: "POST",
							body: JSON.stringify({
								text,
								from,
								channel,
								kind: "reply"
							})
						});
						setLatest(res.message.reply ?? res.item.caption ?? "");
						setCredits(res.credits);
						setMessages((prev) => [res.message, ...prev]);
					} catch (err) {
						setError(err instanceof Error ? err.message : "Failed");
					} finally {
						setBusy(false);
					}
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "From",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: fieldClass,
							value: from,
							onChange: (e) => setFrom(e.target.value),
							placeholder: "ananya.k"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Channel",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: fieldClass,
							value: channel,
							onChange: (e) => setChannel(e.target.value),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "instagram",
									children: "Instagram"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "whatsapp",
									children: "WhatsApp"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "google",
									children: "Google"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "facebook",
									children: "Facebook"
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Incoming message",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							className: fieldClass,
							rows: 4,
							value: text,
							onChange: (e) => setText(e.target.value),
							placeholder: "Do you ship to Noida?"
						})
					})
				]
			}),
			latest ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto w-full max-w-3xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyBlock, { text: latest })
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto w-full max-w-3xl space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-2xl",
					children: "On file"
				}), messages.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "card-surface p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs uppercase tracking-widest text-mint",
							children: [
								m.channel,
								" · ",
								m.from
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm",
							children: m.text
						}),
						m.reply ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 border-t border-white/10 pt-3 text-sm text-muted",
							children: ["Draft: ", m.reply]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "mt-3 min-h-11 text-sm text-mint",
							onClick: () => {
								setFrom(m.from);
								setText(m.text);
								setChannel(m.channel);
							},
							children: "Draft a reply"
						})
					]
				}, m.id))]
			})
		]
	});
}
//#endregion
export { InboxPage as component };
