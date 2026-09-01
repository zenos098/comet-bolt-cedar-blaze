//#region node_modules/.nitro/vite/services/ssr/assets/client-5lUfA4AH.js
var ApiError = class extends Error {
	status;
	credits;
	constructor(message, status, credits) {
		super(message);
		this.status = status;
		this.credits = credits;
	}
};
async function api(path, init) {
	const res = await fetch(path, {
		...init,
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			...init?.headers ?? {}
		}
	});
	const data = await res.json().catch(() => ({}));
	if (res.status === 402) throw new ApiError(data.error || "Not enough credits", 402, data.credits);
	if (!res.ok) throw new ApiError(data.error || "Request failed", res.status, data.credits);
	return data;
}
//#endregion
export { api as n, ApiError as t };
