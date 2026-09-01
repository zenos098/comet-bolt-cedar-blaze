import { getBrand } from "./store";
import { toPublicUser, userFromRequest } from "./looply-auth";
import { CreditError } from "./spend";

export function json(data: unknown, status = 200, headers?: HeadersInit) {
  return Response.json(data, { status, headers });
}

export async function requireSession(request: Request) {
  const user = await userFromRequest(request);
  if (!user) return null;
  const brand = await getBrand(user.id);
  return { user, brand, publicUser: toPublicUser(user) };
}

export function handleError(err: unknown) {
  if (err instanceof CreditError) {
    return json(
      { error: "Not enough credits", credits: err.credits, cost: err.cost },
      402,
    );
  }
  const message = err instanceof Error ? err.message : "Request failed";
  return json({ error: message }, 500);
}

export async function readJson<T>(request: Request): Promise<T> {
  try {
    return (await request.json()) as T;
  } catch {
    return {} as T;
  }
}
