export const API_BASE = "https://bp24-api.152-53-60-176.nip.io";

export interface OrderPayload {
  source?: "site" | "bot" | "admin";
  tariff: "quick" | "soc" | "full" | "pro" | "try" | "other";
  name?: string;
  telegram?: string;
  email?: string;
  promo_code?: string;
  discount_pct?: number;
  base_price?: number;
  final_price?: number;
  idea?: string;
  region?: string;
  city?: string;
  address?: string;
  lat?: number;
  lon?: number;
  notes?: string;
}

export async function createOrder(p: OrderPayload): Promise<{ ok: true; id: number; created_at: string }> {
  const body: Record<string, unknown> = { source: "site", ...p };
  Object.keys(body).forEach((k) => {
    const v = body[k];
    if (v === "" || v === null || v === undefined) delete body[k];
  });
  const res = await fetch(`${API_BASE}/api/order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Сервер вернул ${res.status}: ${text}`);
  }
  return res.json();
}
