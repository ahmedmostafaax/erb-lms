"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { apiFetch } from "@/lib/api/client";

type PathItem = {
  _id: string;
  title: string;
  description: string;
  courses: { _id: string; title: string }[];
};

export default function PathsPage() {
  const [paths, setPaths] = useState<PathItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<{ data: PathItem[] }>("/paths")
      .then((res) => setPaths(res.data))
      .catch(() => setPaths([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl flex-1 px-6 py-10">
        <h1 className="font-display text-2xl font-bold text-ink">مسارات التعلم</h1>
        <p className="mt-1 text-sm text-ink/60">كورسات مرتّبة خطوة بخطوة</p>

        {loading ? (
          <p className="mt-8 text-sm text-ink/50">...</p>
        ) : paths.length === 0 ? (
          <p className="mt-8 text-sm text-ink/50">لا توجد مسارات بعد</p>
        ) : (
          <div className="mt-6 space-y-4">
            {paths.map((p) => (
              <Link
                key={p._id}
                href={`/paths/${p._id}`}
                className="block rounded-2xl border border-line bg-paper-raised p-5 transition-shadow hover:shadow-md"
              >
                <h2 className="font-display text-lg font-semibold text-ink">{p.title}</h2>
                {p.description && <p className="mt-1 text-sm text-ink/60">{p.description}</p>}
                <p className="mt-2 text-xs text-ink/50">{p.courses?.length || 0} كورسات</p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
