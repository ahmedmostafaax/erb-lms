"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { apiFetch, ApiError } from "@/lib/api/client";

type U = { _id: string; name: string; email: string; role: string; isBlocked?: boolean };

export default function AdminUsersPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState<U[]>([]);
  const [err, setErr] = useState<string | null>(null);

  const load = () => {
    if (!token) return;
    apiFetch<{ data: U[] }>("/admin/users", { token })
      .then((r) => setUsers(r.data || []))
      .catch((e) => setErr(e instanceof ApiError ? e.message : "فشل"));
  };

  useEffect(() => {
    load();
  }, [token]);

  const toggle = async (u: U) => {
    if (!token) return;
    const path = u.isBlocked ? "unblock" : "block";
    await apiFetch(`/admin/users/${u._id}/${path}`, { method: "PATCH", token });
    load();
  };

  return (
    <main className="px-6 py-8">
      <h1 className="font-display text-2xl font-bold">المستخدمين</h1>
      {err && <p className="mt-2 text-sm text-danger">{err}</p>}
      <div className="mt-6 space-y-2">
        {users.map((u) => (
          <div
            key={u._id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line p-3 text-sm"
          >
            <div>
              <p className="font-medium">{u.name}</p>
              <p className="text-xs text-ink/50">
                {u.email} · {u.role}
                {u.isBlocked ? " · موقوف" : ""}
              </p>
            </div>
            {u.role !== "admin" && (
              <button
                type="button"
                onClick={() => toggle(u)}
                className="rounded-full border border-line px-3 py-1 text-xs"
              >
                {u.isBlocked ? "إلغاء الحظر" : "حظر"}
              </button>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
