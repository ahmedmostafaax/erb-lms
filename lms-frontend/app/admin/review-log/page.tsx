"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { apiFetch } from "@/lib/api/client";

type LogItem = {
  action: string;
  reason?: string;
  at?: string;
  by?: { name?: string };
};
type CourseLog = {
  _id: string;
  title: string;
  status: string;
  rejectionReason?: string;
  reviewLog?: LogItem[];
};

export default function ReviewLogPage() {
  const { token } = useAuth();
  const [rows, setRows] = useState<CourseLog[]>([]);

  useEffect(() => {
    if (!token) return;
    apiFetch<{ data: CourseLog[] }>("/admin/review-log", { token }).then((r) =>
      setRows(r.data || [])
    );
  }, [token]);

  return (
    <main className="px-6 py-8">
      <h1 className="font-display text-2xl font-bold">سجل قرارات المراجعة</h1>
      <div className="mt-6 space-y-4">
        {rows.map((c) => (
          <div key={c._id} className="rounded-xl border border-line p-4">
            <p className="font-medium">
              {c.title}{" "}
              <span className="text-xs text-ink/50">({c.status})</span>
            </p>
            <ul className="mt-2 space-y-1 text-xs text-ink/70">
              {(c.reviewLog || [])
                .slice()
                .reverse()
                .map((l, i) => (
                  <li key={i}>
                    {l.action} — {l.by?.name || "—"} —{" "}
                    {l.at ? new Date(l.at).toLocaleString("ar-EG") : ""}
                    {l.reason ? ` — ${l.reason}` : ""}
                  </li>
                ))}
            </ul>
          </div>
        ))}
        {rows.length === 0 && <p className="text-sm text-ink/50">لا يوجد سجل بعد</p>}
      </div>
    </main>
  );
}
