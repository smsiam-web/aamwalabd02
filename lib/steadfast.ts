// lib/steadfast.ts
export interface SteadfastCreateOrderReq {
  cod_amount: string | number;
  invoice: string;
  note?: string;
  recipient_name: string;
  recipient_phone: string;   // 01XXXXXXXXX
  recipient_address: string; // Full address line
  // প্রয়োজনে city/zone/area/weight ইত্যাদি পরে যোগ করতে পারবেন
}

export interface SteadfastCreateOrderRes {
  status?: string;
  message?: string;
  consignment?: {
    consignment_id?: string | number;
    tracking_code?: string;
  };
  [k: string]: any;
}

const BASE = process.env.STEADFAST_BASE_URL || "";
const API_KEY = process.env.STEADFAST_API_KEY || "";
const SECRET = process.env.STEADFAST_SECRET_KEY || "";

function assertEnv() {
  if (!BASE || !API_KEY || !SECRET) {
    throw new Error("Steadfast env vars missing");
  }
}

export async function sfCreateOrder(
  payload: SteadfastCreateOrderReq
): Promise<SteadfastCreateOrderRes> {
  assertEnv();

  const res = await fetch(`${BASE}/create_order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Api-Key": API_KEY,       // <- কোন টাইপ নয়, কেবল ভ্যারিয়েবল
      "Secret-Key": SECRET,
    },
    body: JSON.stringify(payload),
  });

  const data = (await res.json()) as SteadfastCreateOrderRes;

  if (!res.ok) {
    const msg = data?.message || `HTTP ${res.status}`;
    throw new Error(`Steadfast error: ${msg}`);
  }
  return data;
}
