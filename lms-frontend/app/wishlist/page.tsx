"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { CourseCard } from "@/components/CourseCard";
import { ProtectedRoute } from "@/lib/auth/ProtectedRoute";
import { useAuth } from "@/lib/auth/AuthContext";
import { apiFetch } from "@/lib/api/client";
import type { Course } from "@/lib/api/courses";

type WishItem = { _id: string; course: Course };

function WishlistContent() {
  const { token } = useAuth();
  const [items, setItems] = useState<WishItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    if (!token) return;
    apiFetch<{ data: WishItem[] }>("/wishlist", { token })
      .then((res) => setItems(res.data.filter((i) => i.course)))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const remove = async (courseId: string) => {
    if (!token) return;
    await apiFetch(`/wishlist/${courseId}`, { method: "DELETE", token }).catch(() => {});
    setItems((prev) => prev.filter((i) => i.course._id !== courseId));
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl flex-1 px-6 py-10">
        <h1 className="font-display text-2xl font-bold text-ink">المفضلة</h1>
        {loading ? (
          <p className="mt-6 text-sm text-ink/50">...</p>
        ) : items.length === 0 ? (
          <p className="mt-6 text-sm text-ink/50">لا توجد كورسات في المفضلة</p>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, i) => (
              <div key={item._id} className="relative">
                <CourseCard course={item.course} index={i} initiallyWished />
                <button
                  type="button"
                  onClick={() => remove(item.course._id)}
                  className="mt-2 w-full rounded-xl border border-line py-2 text-xs text-ink/60 hover:border-primary hover:text-primary"
                >
                  إزالة من المفضلة
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

export default function WishlistPage() {
  return (
    <ProtectedRoute>
      <WishlistContent />
    </ProtectedRoute>
  );
}
