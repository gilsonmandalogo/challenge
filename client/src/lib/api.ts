import type {
  CreateFlipRequest,
  CreateFlipResponse,
  FlipRecord,
  RecentFlipsResponse,
  StatsResponse,
} from "../types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body.error ?? `Request failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export const api = {
  health: () => request<{ status: string }>("/health"),

  createFlip: (body: CreateFlipRequest) =>
    request<CreateFlipResponse>("/api/flips", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  getFlip: (id: string) => request<FlipRecord>(`/api/flips/${id}`),

  getRecentFlips: (limit = 20) =>
    request<RecentFlipsResponse>(`/api/flips/recent?limit=${limit}`),

  getStats: () => request<StatsResponse>("/api/stats"),

  getWalletStreak: (wallet: string) =>
    request<{ current: number; type: "win" | "loss" | "none" }>(
      `/api/flips/wallet/${wallet}/streak`
    ),
};
