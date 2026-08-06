"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/lib/auth/ProtectedRoute";
import { useAuth } from "@/lib/auth/AuthContext";
import { apiFetch } from "@/lib/api/client";
import { Skeleton } from "@/components/Skeleton";

type Item = { _id: string; type: string; message: string; createdAt: string };

function Content() {
  const { token } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    apiFetch<{ data: Item[] }>("/activity/me", { token })
      .then((r) => setItems(r.data))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="font-display text-2xl font-bold">سجل النشاط</h1>
        {loading ? (
          <div className="mt-6 space-y-2">
            <Skeleton className="h-12 rounded-xl" />
            <Skeleton className="h-12 rounded-xl" />
          </div>
        ) : items.length === 0 ? (
          <p className="mt-6 text-sm text-ink/50">لا يوجد نشاط بعد</p>
        ) : (
          <ul className="mt-6 space-y-2">
            {items.map((i) => (
              <li key={i._id} className="rounded-xl border border-line p-3 text-sm">
                <p>{i.message}</p>
                <p className="mt-1 text-xs text-ink/50">
                  {i.type} · {new Date(i.createdAt).toLocaleString("ar-EG")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}

export default function ActivityPage() {
  return (
    <ProtectedRoute>
      <Content />
    </ProtectedRoute>
  );
}
