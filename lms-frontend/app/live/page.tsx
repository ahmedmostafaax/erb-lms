"use client";

import { useEffect, useMemo, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { apiFetch } from "@/lib/api/client";

type LiveItem = {
  _id: string;
  title: string;
  description?: string;
  meetingUrl: string;
  startsAt: string;
  status: string;
  instructor?: { name: string };
  course?: { title: string };
};

export default function LivePage() {
  const [items, setItems] = useState<LiveItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"upcoming" | "live" | "ended" | "all">("upcoming");

  useEffect(() => {
    apiFetch<{ data: LiveItem[] }>("/live")
      .then((res) => setItems(res.data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const now = Date.now();
    return items.filter((s) => {
      if (filter === "all") return true;
      if (filter === "live") return s.status === "live";
      if (filter === "ended") return s.status === "ended" || s.status === "cancelled";
      // upcoming
      return (s.status === "scheduled" || s.status === "live") && new Date(s.startsAt).getTime() >= now - 3600000;
    });
  }, [items, filter]);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl flex-1 px-6 py-10">
        <h1 className="font-display text-2xl font-bold text-ink">جلسات مباشرة</h1>
        <div className="mt-4 flex flex-wrap gap-2">
          {(
            [
              ["upcoming", "قادمة"],
              ["live", "مباشر الآن"],
              ["ended", "منتهية"],
              ["all", "الكل"],
            ] as const
          ).map(([k, label]) => (
            <button
              key={k}
              type="button"
              onClick={() => setFilter(k)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                filter === k ? "bg-primary text-white" : "border border-line text-ink/60"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="mt-8 text-sm text-ink/50">...</p>
        ) : filtered.length === 0 ? (
          <p className="mt-8 text-sm text-ink/50">لا توجد جلسات</p>
        ) : (
          <div className="mt-6 space-y-3">
            {filtered.map((s) => (
              <div key={s._id} className="rounded-2xl border border-line bg-paper-raised p-5">
                <div className="flex flex-wrap justify-between gap-2">
                  <div>
                    <p className="font-semibold text-ink">{s.title}</p>
                    <p className="mt-1 text-xs text-ink/50">
                      {s.instructor?.name}
                      {s.course ? ` · ${s.course.title}` : ""}
                    </p>
                    <p className="mt-2 text-sm text-ink/70">
                      {new Date(s.startsAt).toLocaleString("ar-EG")}
                    </p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                    {s.status}
                  </span>
                </div>
                {(s.status === "scheduled" || s.status === "live") && (
                  <a
                    href={s.meetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white"
                  >
                    انضم للجلسة
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
