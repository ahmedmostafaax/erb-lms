"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/lib/auth/ProtectedRoute";
import { useAuth } from "@/lib/auth/AuthContext";
import { apiFetch } from "@/lib/api/client";

type Row = {
  _id: string;
  instructor: { _id: string; name: string; avatarUrl?: string };
};

function Content() {
  const { token } = useAuth();
  const [list, setList] = useState<Row[]>([]);

  useEffect(() => {
    if (!token) return;
    apiFetch<{ data: Row[] }>("/instructor-favorites", { token }).then((r) => setList(r.data));
  }, [token]);

  const remove = async (id: string) => {
    if (!token) return;
    await apiFetch(`/instructor-favorites/${id}`, { method: "DELETE", token });
    setList((prev) => prev.filter((x) => x.instructor._id !== id));
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="font-display text-2xl font-bold">مدرّسين مفضّلين</h1>
        <div className="mt-6 space-y-2">
          {list.map((row) => (
            <div
              key={row._id}
              className="flex items-center justify-between rounded-xl border border-line p-3"
            >
              <Link href={`/instructors/${row.instructor._id}`} className="font-medium hover:text-primary">
                {row.instructor.name}
              </Link>
              <button
                type="button"
                onClick={() => remove(row.instructor._id)}
                className="text-xs text-danger"
              >
                إزالة
              </button>
            </div>
          ))}
          {list.length === 0 && <p className="text-sm text-ink/50">لا يوجد بعد</p>}
        </div>
      </main>
    </>
  );
}

export default function FavoriteInstructorsPage() {
  return (
    <ProtectedRoute>
      <Content />
    </ProtectedRoute>
  );
}
