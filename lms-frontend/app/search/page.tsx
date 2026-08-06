"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { CourseCard } from "@/components/CourseCard";
import { getCourses, type Course } from "@/lib/api/courses";
import { apiFetch } from "@/lib/api/client";

type InstructorHit = {
  _id: string;
  name: string;
  profile?: { bio?: string };
};

function SearchInner() {
  const searchParams = useSearchParams();
  const initial = searchParams.get("q") || "";
  const [q, setQ] = useState(initial);
  const [query, setQuery] = useState(initial);
  const [level, setLevel] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [instructors, setInstructors] = useState<InstructorHit[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setCourses([]);
      setInstructors([]);
      return;
    }
    setLoading(true);
    Promise.all([
      getCourses({ keyword: query, level: level || undefined, limit: 12 }),
      apiFetch<{ data: InstructorHit[] }>(
        `/profile/search-instructors?q=${encodeURIComponent(query)}`
      ).catch(() => ({ data: [] as InstructorHit[] })),
    ])
      .then(([cRes, iRes]) => {
        setCourses(cRes.data);
        setInstructors(iRes.data || []);
      })
      .finally(() => setLoading(false));
  }, [query, level]);

  return (
    <main className="mx-auto max-w-6xl flex-1 px-6 py-10">
      <h1 className="font-display text-2xl font-bold text-ink">بحث</h1>
      <form
        className="mt-4 flex flex-col gap-2 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          setQuery(q.trim());
        }}
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ابحث عن كورس أو مدرّس..."
          className="flex-1 rounded-xl border border-line bg-paper-raised px-4 py-2.5 text-sm outline-none focus:border-primary"
        />
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="rounded-xl border border-line bg-paper-raised px-4 py-2.5 text-sm outline-none focus:border-primary"
        >
          <option value="">كل المستويات</option>
          <option value="beginner">مبتدئ</option>
          <option value="intermediate">متوسط</option>
          <option value="advanced">متقدم</option>
        </select>
        <button type="submit" className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white">
          بحث
        </button>
      </form>

      {loading && <p className="mt-8 text-sm text-ink/50">...</p>}

      {!loading && query && (
        <>
          <section className="mt-10">
            <h2 className="font-display text-lg font-semibold">المدرّسين ({instructors.length})</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {instructors.map((ins) => (
                <Link
                  key={ins._id}
                  href={`/instructors/${ins._id}`}
                  className="rounded-xl border border-line bg-paper-raised p-4 hover:shadow-md"
                >
                  <p className="font-medium">{ins.name}</p>
                </Link>
              ))}
            </div>
          </section>
          <section className="mt-10">
            <h2 className="font-display text-lg font-semibold">الكورسات ({courses.length})</h2>
            <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((c, i) => (
                <CourseCard key={c._id} course={c} index={i} />
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}

export default function SearchPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<main className="px-6 py-10 text-sm text-ink/50">...</main>}>
        <SearchInner />
      </Suspense>
    </>
  );
}
