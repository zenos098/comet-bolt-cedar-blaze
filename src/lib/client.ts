export class ApiError extends Error {
  status: number;
  credits?: number;
  constructor(message: string, status: number, credits?: number) {
    super(message);
    this.status = status;
    this.credits = credits;
  }
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const data = (await res.json().catch(() => ({}))) as {
    error?: string;
    credits?: number;
  };
  if (res.status === 402) {
    throw new ApiError(data.error || "Not enough credits", 402, data.credits);
  }
  if (!res.ok) {
    throw new ApiError(data.error || "Request failed", res.status, data.credits);
  }
  return data as T;
}
