"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { Navbar } from "@/components/Navbar";
import { CourseCard } from "@/components/CourseCard";
import { getCourses, type Course } from "@/lib/api/courses";
import { getCategories, type Category } from "@/lib/api/categories";

const PAGE_SIZE = 9;

export default function CoursesPage() {
  const { dict, locale } = useLanguage();

  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);

  const [keyword, setKeyword] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [level, setLevel] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      getCourses({
        keyword: keyword || undefined,
        category: categoryId || undefined,
        level: level || undefined,
        page,
        limit: PAGE_SIZE,
      })
        .then((res) => {
          setCourses(res.data);
          setTotalResults(res.results);
        })
        .catch(() => {
          setCourses([]);
          setTotalResults(0);
        })
        .finally(() => setLoading(false));
    }, 350); // debounce بسيط عشان مش نبعت request مع كل حرف وانت بتكتب

    return () => clearTimeout(timer);
  }, [keyword, categoryId, level, page]);

  const totalPages = Math.max(1, Math.ceil(totalResults / PAGE_SIZE));

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-6xl flex-1 px-6 py-10">
        <h1 className="font-display text-2xl font-bold text-ink">{dict.coursesPage.title}</h1>
        <p className="mt-1 text-sm text-ink/60">{dict.coursesPage.subtitle}</p>

        {/* الفلاتر */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={keyword}
            onChange={(e) => {
              setPage(1);
              setKeyword(e.target.value);
            }}
            placeholder={dict.coursesPage.searchPlaceholder}
            className="flex-1 rounded-xl border border-line bg-paper-raised px-4 py-2.5 text-sm text-ink outline-none focus:border-primary"
          />

          <select
            value={categoryId}
            onChange={(e) => {
              setPage(1);
              setCategoryId(e.target.value);
            }}
            className="rounded-xl border border-line bg-paper-raised px-4 py-2.5 text-sm text-ink outline-none focus:border-primary"
          >
            <option value="">{dict.coursesPage.allCategories}</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={level}
            onChange={(e) => {
              setPage(1);
              setLevel(e.target.value);
            }}
            className="rounded-xl border border-line bg-paper-raised px-4 py-2.5 text-sm text-ink outline-none focus:border-primary"
          >
            <option value="">{dict.coursesPage.allLevels}</option>
            <option value="beginner">{locale === "ar" ? "مبتدئ" : "Beginner"}</option>
            <option value="intermediate">{locale === "ar" ? "متوسط" : "Intermediate"}</option>
            <option value="advanced">{locale === "ar" ? "متقدم" : "Advanced"}</option>
          </select>
        </div>

        {/* النتائج */}
        <div className="mt-8">
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 animate-pulse rounded-2xl bg-line/40" />
              ))}
            </div>
          ) : courses.length === 0 ? (
            <p className="py-16 text-center text-sm text-ink/50">{dict.coursesPage.noResults}</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course, index) => (
                <CourseCard key={course._id} course={course} index={index} />
              ))}
            </div>
          )}
        </div>

        {/* الصفحات */}
        {!loading && totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-full border border-line px-4 py-2 text-sm font-medium text-ink/70 transition-colors hover:border-primary disabled:opacity-40"
            >
              {dict.coursesPage.prev}
            </button>
            <span className="font-mono text-sm text-ink/60">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-full border border-line px-4 py-2 text-sm font-medium text-ink/70 transition-colors hover:border-primary disabled:opacity-40"
            >
              {dict.coursesPage.next}
            </button>
          </div>
        )}
      </main>
    </>
  );
}
