"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useAuth } from "@/lib/auth/AuthContext";
import { ProtectedRoute } from "@/lib/auth/ProtectedRoute";
import { Navbar } from "@/components/Navbar";
import { FormField } from "@/components/auth/FormField";
import { Alert } from "@/components/Alert";
import { getCategories, type Category } from "@/lib/api/categories";
import { createCourse } from "@/lib/api/instructorCourses";
import { ApiError } from "@/lib/api/client";

function NewCourseContent() {
  const { dict } = useLanguage();
  const { token } = useAuth();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("0");
  const [level, setLevel] = useState("beginner");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCategories().then((res) => setCategories(res.data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setError(null);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", categoryId);
      formData.append("price", price);
      formData.append("level", level);
      if (fileRef.current?.files?.[0]) {
        formData.append("thumbnail", fileRef.current.files[0]);
      }

      const res = await createCourse(formData, token);
      router.push(`/instructor/courses/${res.data._id}/manage`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "حدث خطأ، حاول تاني");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-xl flex-1 px-6 py-10">
        <h1 className="font-display text-2xl font-bold text-ink">{dict.instructor.newCourseTitle}</h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && <Alert type="error" message={error} />}

          <FormField id="title" label={dict.instructor.courseTitle} value={title} onChange={setTitle} required />

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">
              {dict.instructor.courseDescription}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
              className="w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-sm text-ink outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">
                {dict.instructor.category}
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-sm text-ink outline-none focus:border-primary"
              >
                <option value="">—</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">{dict.instructor.level}</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-sm text-ink outline-none focus:border-primary"
              >
                <option value="beginner">{dict.instructor.beginner}</option>
                <option value="intermediate">{dict.instructor.intermediate}</option>
                <option value="advanced">{dict.instructor.advanced}</option>
              </select>
            </div>
          </div>

          <FormField
            id="price"
            label={dict.instructor.price}
            type="number"
            value={price}
            onChange={setPrice}
            required
          />

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">
              {dict.instructor.thumbnail}
            </label>
            <input ref={fileRef} type="file" accept="image/*" className="text-sm" />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
          >
            {loading ? dict.checkout.processing : dict.instructor.createCourse}
          </button>
        </form>
      </main>
    </>
  );
}

export default function NewCoursePage() {
  return (
    <ProtectedRoute>
      <NewCourseContent />
    </ProtectedRoute>
  );
}
