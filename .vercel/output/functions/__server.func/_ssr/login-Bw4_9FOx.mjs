import { i as __toESM } from "../_runtime.mjs";
import { B as require_jsx_runtime, v as Link, y as useNavigate, z as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as cn, t as LoopMark } from "./LoopMark-BBkp5RpJ.mjs";
import { r as fieldClass } from "./ToolForm-BM2EiW9G.mjs";
import { n as api } from "./client-5lUfA4AH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-Bw4_9FOx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoginPage() {
	const navigate = useNavigate();
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function onSubmit(e) {
		e.preventDefault();
		setBusy(true);
		setError(null);
		const form = new FormData(e.currentTarget);
		try {
			await api("/api/auth/login", {
				method: "POST",
				body: JSON.stringify({
					email: String(form.get("email") || ""),
					password: String(form.get("password") || "")
				})
			});
			navigate({ to: "/studio" });
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not sign in");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-gradient-to-b from-wash to-white text-mint-ink scheme-light",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-16",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "mb-8 flex items-center gap-2 text-mint-ink",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoopMark, { className: "size-6 text-mint" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-serif text-xl",
					children: "looply"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl bg-white p-8 shadow-[0_0_0_1px_rgba(8,33,20,0.06),0_20px_50px_rgba(8,33,20,0.08)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-serif text-4xl tracking-tight",
						children: "AI Creative Studio"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-mint-ink/60",
						children: "Demo · demo@looply.app / demo1234"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit,
						className: "mt-8 flex flex-col gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-sm",
								children: ["Email", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									name: "email",
									type: "email",
									required: true,
									defaultValue: "demo@looply.app",
									className: cn(fieldClass, "mt-2 border-mint-ink/10 bg-wash text-mint-ink placeholder:text-mint-ink/30")
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-sm",
								children: ["Password", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									name: "password",
									type: "password",
									required: true,
									defaultValue: "demo1234",
									className: cn(fieldClass, "mt-2 border-mint-ink/10 bg-wash text-mint-ink")
								})]
							}),
							error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-red-700",
								children: error
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: busy,
								className: "rounded-full bg-mint-ink px-5 py-3 text-sm font-medium text-wash disabled:opacity-60",
								children: busy ? "Opening…" : "Enter studio"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-6 text-sm text-mint-ink/60",
						children: [
							"New shop?",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/signup",
								className: "text-mint-ink underline",
								children: "Create an account"
							})
						]
					})
				]
			})]
		})
	});
}
//#endregion
export { LoginPage as component };
