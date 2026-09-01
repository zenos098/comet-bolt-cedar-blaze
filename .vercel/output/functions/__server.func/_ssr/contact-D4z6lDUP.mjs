import { i as __toESM } from "../_runtime.mjs";
import { B as require_jsx_runtime, z as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as fieldClass } from "./ToolForm-BM2EiW9G.mjs";
import { n as MarketingNav, t as Footer } from "./MarketingNav-D-IGdnuV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contact-D4z6lDUP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ContactPage() {
	const [sent, setSent] = (0, import_react.useState)(false);
	function onSubmit(e) {
		e.preventDefault();
		setSent(true);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-ink text-cream",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarketingNav, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto grid max-w-6xl gap-12 px-6 pb-24 pt-32 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm uppercase tracking-[0.18em] text-mint",
						children: "Contact"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 font-serif text-5xl tracking-tight",
						children: "Talk to a human."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 max-w-md text-muted",
						children: [
							"Studios, cafes, clinics, D2C — if you run the floor, we can run the feed. Email",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								className: "text-mint",
								href: "mailto:support@looply.app",
								children: "support@looply.app"
							}),
							"."
						]
					})
				] }), sent ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "card-surface h-fit p-8 text-sm leading-relaxed",
					children: "Received. We’ll reply from support@looply.app — usually within one working day."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit,
					className: "card-surface flex flex-col gap-4 p-6 sm:p-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-sm",
							children: ["Name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								className: `${fieldClass} mt-2`,
								name: "name"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-sm",
							children: ["Email", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								type: "email",
								className: `${fieldClass} mt-2`,
								name: "email"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-sm",
							children: ["Business", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: `${fieldClass} mt-2`,
								name: "business"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-sm",
							children: ["Message", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								required: true,
								rows: 5,
								className: `${fieldClass} mt-2`,
								name: "message"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							className: "rounded-full bg-mint px-5 py-3 text-sm font-medium text-mint-ink",
							children: "Send"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { ContactPage as component };
