import { B as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as MarketingNav, t as Footer } from "./MarketingNav-D-IGdnuV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/examples-s-2gHklH.js
var import_jsx_runtime = require_jsx_runtime();
var CASES = [
	{
		name: "Nimrah Atelier",
		city: "Delhi",
		kind: "Boutique fashion",
		image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1400&q=80",
		line: "A linen drop, free hemming, and Hindi-English captions that sound like the shop."
	},
	{
		name: "Harbour Cafe",
		city: "Goa",
		kind: "Cafe",
		image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1400&q=80",
		line: "Morning specials, Reel storyboards of pour-overs, replies to “are you open today?”"
	},
	{
		name: "Elrose Clinic",
		city: "Pune",
		kind: "Clinic",
		image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1400&q=80",
		line: "Appointment posts, Google review drafts, a one-page site that lists visiting hours."
	},
	{
		name: "Turning Heads Studio",
		city: "Bengaluru",
		kind: "Salon",
		image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1400&q=80",
		line: "Before/after stills, weekend slot ads, WhatsApp drafts for colour consultations."
	},
	{
		name: "Farmer's India Market",
		city: "Jaipur",
		kind: "D2C grocery",
		image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1400&q=80",
		line: "Weekly vegetable stills and a calendar that never asks “what should we post?”"
	},
	{
		name: "Root & Reign",
		city: "Mumbai",
		kind: "Gym",
		image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1400&q=80",
		line: "Membership offer ads and storyboard Reels for 6am classes."
	}
];
function ExamplesPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-ink text-cream",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarketingNav, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-6xl px-6 pb-24 pt-32",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm uppercase tracking-[0.18em] text-mint",
						children: "Examples"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 max-w-3xl font-serif text-5xl tracking-tight sm:text-6xl",
						children: "Independent shops, still on the internet."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 max-w-xl text-muted",
						children: "These are category sketches — not customer testimonials. Looply is not affiliated with Scalio."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-12 grid gap-4 md:grid-cols-2",
						children: CASES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "card-surface overflow-hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: c.image,
								alt: "",
								className: "h-56 w-full object-cover"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs uppercase tracking-[0.16em] text-mint",
										children: [
											c.kind,
											" · ",
											c.city
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "mt-2 font-serif text-3xl",
										children: c.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-sm leading-relaxed text-muted",
										children: c.line
									})
								]
							})]
						}, c.name))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { ExamplesPage as component };
