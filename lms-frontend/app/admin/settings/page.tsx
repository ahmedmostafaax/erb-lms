"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { apiFetch, ApiError } from "@/lib/api/client";

export default function AdminSettingsPage() {
  const { token } = useAuth();
  const [platformName, setPlatformName] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    apiFetch<{ data: { platformName?: string; supportEmail?: string } }>("/admin/settings", {
      token,
    }).then((r) => {
      setPlatformName(r.data.platformName || "");
      setSupportEmail(r.data.supportEmail || "");
    });
  }, [token]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      await apiFetch("/admin/settings", {
        method: "PATCH",
        token,
        body: { platformName, supportEmail },
      });
      setMsg("تم الحفظ");
    } catch (err) {
      setMsg(err instanceof ApiError ? err.message : "فشل");
    }
  };

  return (
    <main className="px-6 py-8 max-w-lg">
      <h1 className="font-display text-2xl font-bold">إعدادات المنصة</h1>
      <form onSubmit={save} className="mt-6 space-y-4">
        <label className="block text-sm">
          اسم المنصة
          <input
            className="mt-1 w-full rounded-xl border border-line px-3 py-2"
            value={platformName}
            onChange={(e) => setPlatformName(e.target.value)}
          />
        </label>
        <label className="block text-sm">
          إيميل الدعم
          <input
            type="email"
            className="mt-1 w-full rounded-xl border border-line px-3 py-2"
            value={supportEmail}
            onChange={(e) => setSupportEmail(e.target.value)}
          />
        </label>
        <button type="submit" className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white">
          حفظ
        </button>
        {msg && <p className="text-sm text-primary">{msg}</p>}
      </form>
    </main>
  );
}
