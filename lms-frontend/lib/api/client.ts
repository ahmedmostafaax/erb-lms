const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string | null;
};

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, token } = options;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    // رد بدون body (نادر لكن ممكن يحصل)
  }

  if (!res.ok) {
    const message = extractErrorMessage(data) || "حدث خطأ غير متوقع";
    throw new ApiError(message, res.status);
  }

  return data as T;
}

export async function apiUpload<T>(
  path: string,
  formData: FormData,
  token: string,
  method: "POST" | "PATCH" | "PUT" = "PATCH"
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}` }, // من غير Content-Type، المتصفح بيحطها لوحده مع الـ boundary
    body: formData,
  });

  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    // تجاهل
  }

  if (!res.ok) {
    throw new ApiError(extractErrorMessage(data) || "فشل رفع الملف", res.status);
  }

  return data as T;
}

function extractErrorMessage(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const obj = data as Record<string, unknown>;
  if (typeof obj.message === "string") return obj.message;
  if (Array.isArray(obj.message)) return obj.message.join(" — ");
  return null;
}
