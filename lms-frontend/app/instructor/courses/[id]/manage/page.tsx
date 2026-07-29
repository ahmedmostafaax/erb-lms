"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useAuth } from "@/lib/auth/AuthContext";
import { ProtectedRoute } from "@/lib/auth/ProtectedRoute";
import { Navbar } from "@/components/Navbar";
import { Alert } from "@/components/Alert";
import { getCourse, type Course } from "@/lib/api/courses";
import {
  updateCourse,
  addModule,
  addLesson,
  addGalleryItem,
  deleteGalleryItem,
  type CourseModule,
} from "@/lib/api/instructorCourses";
import { ApiError } from "@/lib/api/client";

function ManageCourseContent() {
  const { id } = useParams<{ id: string }>();
  const { dict, locale } = useLanguage();
  const { token } = useAuth();
  const videoRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [status, setStatus] = useState<"draft" | "published">("draft");

  const [moduleTitle, setModuleTitle] = useState("");
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [lessonTitle, setLessonTitle] = useState("");

  const [msg, setMsg] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [savingModule, setSavingModule] = useState(false);
  const [savingLesson, setSavingLesson] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const load = () => {
    getCourse(id).then((res) => {
      setCourse(res.data.course);
      setStatus(res.data.course.status as "draft" | "published");
    });
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleTogglePublish = async () => {
    if (!token) return;
    const newStatus = status === "published" ? "draft" : "published";
    setPublishing(true);
    try {
      await updateCourse(id, { status: newStatus }, token);
      setStatus(newStatus);
      setMsg({ type: "success", text: dict.instructor.statusUpdated });
    } catch (err) {
      setMsg({ type: "error", text: err instanceof ApiError ? err.message : "حدث خطأ" });
    } finally {
      setPublishing(false);
    }
  };

  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !moduleTitle.trim()) return;
    setSavingModule(true);
    setMsg(null);
    try {
      const res = await addModule(id, { title: moduleTitle, order: modules.length + 1 }, token);
      setModules((m) => [...m, res.data]);
      setModuleTitle("");
    } catch (err) {
      setMsg({ type: "error", text: err instanceof ApiError ? err.message : "حدث خطأ" });
    } finally {
      setSavingModule(false);
    }
  };

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !selectedModuleId || !lessonTitle.trim()) return;

    setSavingLesson(true);
    setMsg(null);
    try {
      const formData = new FormData();
      formData.append("title", lessonTitle);
      formData.append("order", "1");
      if (videoRef.current?.files?.[0]) {
        formData.append("video", videoRef.current.files[0]);
      }

      await addLesson(id, selectedModuleId, formData, token);
      setLessonTitle("");
      if (videoRef.current) videoRef.current.value = "";
      setMsg({ type: "success", text: dict.instructor.lessonAdded });

      // إعادة تحميل محتوى الكورس عشان نشوف الدرس الجديد
      const res = await getCourse(id);
      setCourse(res.data.course);
    } catch (err) {
      setMsg({ type: "error", text: err instanceof ApiError ? err.message : "حدث خطأ" });
    } finally {
      setSavingLesson(false);
    }
  };

  const handleAddGalleryItem = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    setUploadingGallery(true);
    setMsg(null);
    try {
      await addGalleryItem(id, file, token);
      const res = await getCourse(id);
      setCourse(res.data.course);
      setMsg({ type: "success", text: dict.instructor.galleryAdded });
    } catch (err) {
      setMsg({ type: "error", text: err instanceof ApiError ? err.message : "حدث خطأ" });
    } finally {
      setUploadingGallery(false);
      if (galleryRef.current) galleryRef.current.value = "";
    }
  };

  const handleDeleteGalleryItem = async (itemId: string) => {
    if (!token) return;
    try {
      await deleteGalleryItem(id, itemId, token);
      const res = await getCourse(id);
      setCourse(res.data.course);
    } catch (err) {
      setMsg({ type: "error", text: err instanceof ApiError ? err.message : "حدث خطأ" });
    }
  };

  if (!course) return null;

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl flex-1 px-6 py-10">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-ink">{course.title}</h1>
          <button
            onClick={handleTogglePublish}
            disabled={publishing}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              status === "published"
                ? "bg-success-soft text-success"
                : "bg-accent-soft text-ink"
            }`}
          >
            {status === "published" ? dict.instructor.published : dict.instructor.draft}
          </button>
        </div>

        {msg && (
          <div className="mt-4">
            <Alert type={msg.type} message={msg.text} />
          </div>
        )}

        {/* معرض الكورس */}
        <section className="mt-8 rounded-2xl border border-line bg-paper-raised p-6">
          <h2 className="font-display text-lg font-semibold text-ink">{dict.instructor.gallery}</h2>
          <p className="mt-1 text-xs text-ink/50">{dict.instructor.gallerySubtitle}</p>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {course.gallery?.map((item) => (
              <div key={item._id} className="group relative overflow-hidden rounded-xl border border-line">
                {item.type === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.url} alt="" className="h-24 w-full object-cover" />
                ) : (
                  <video src={item.url} className="h-24 w-full object-cover" muted />
                )}
                <button
                  onClick={() => handleDeleteGalleryItem(item._id)}
                  className="absolute inset-0 hidden items-center justify-center bg-ink/60 text-xs font-semibold text-white group-hover:flex"
                >
                  {dict.instructor.removeFromGallery}
                </button>
              </div>
            ))}
          </div>

          <input
            ref={galleryRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleAddGalleryItem}
            disabled={uploadingGallery}
            className="mt-4 text-sm"
          />
          {uploadingGallery && <p className="mt-2 text-xs text-ink/50">{dict.instructor.uploading}</p>}
        </section>

        {/* إضافة موديول */}
        <section className="mt-8 rounded-2xl border border-line bg-paper-raised p-6">
          <h2 className="font-display text-lg font-semibold text-ink">{dict.instructor.addModule}</h2>
          <form onSubmit={handleAddModule} className="mt-4 flex gap-2">
            <input
              value={moduleTitle}
              onChange={(e) => setModuleTitle(e.target.value)}
              placeholder={dict.instructor.moduleTitlePlaceholder}
              className="flex-1 rounded-xl border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
            <button
              type="submit"
              disabled={savingModule}
              className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
            >
              {dict.instructor.add}
            </button>
          </form>
        </section>

        {/* إضافة درس */}
        <section className="mt-6 rounded-2xl border border-line bg-paper-raised p-6">
          <h2 className="font-display text-lg font-semibold text-ink">{dict.instructor.addLesson}</h2>
          <form onSubmit={handleAddLesson} className="mt-4 space-y-3">
            <select
              value={selectedModuleId}
              onChange={(e) => setSelectedModuleId(e.target.value)}
              required
              className="w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-primary"
            >
              <option value="">{dict.instructor.selectModule}</option>
              {modules.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.title}
                </option>
              ))}
            </select>
            <input
              value={lessonTitle}
              onChange={(e) => setLessonTitle(e.target.value)}
              placeholder={dict.instructor.lessonTitlePlaceholder}
              className="w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
            <input ref={videoRef} type="file" accept="video/*" className="text-sm" />
            <button
              type="submit"
              disabled={savingLesson}
              className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
            >
              {savingLesson ? dict.instructor.uploading : dict.instructor.add}
            </button>
          </form>
        </section>

        {/* إضافة اختبار */}
        <section className="mt-6 rounded-2xl border border-line bg-paper-raised p-6">
          <h2 className="font-display text-lg font-semibold text-ink">{dict.instructor.quizzes}</h2>
          <Link
            href={`/instructor/courses/${id}/quizzes/new`}
            className="mt-3 inline-block rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-ink hover:opacity-90"
          >
            + {dict.instructorQuiz.title}
          </Link>
        </section>

        {/* المحتوى الحالي */}
        <section className="mt-6">
          <h2 className="font-display text-lg font-semibold text-ink">{dict.instructor.currentContent}</h2>
          <div className="mt-3 space-y-3">
            {course.modules?.map((m) => (
              <div key={m._id} className="rounded-xl border border-line bg-paper-raised p-4">
                <p className="text-sm font-semibold text-ink">{m.title}</p>
                <ul className="mt-2 space-y-1 ps-4 text-sm text-ink/70">
                  {m.lessons?.map((l) => (
                    <li key={l._id} className="flex items-center gap-2">
                      <span>• {l.title}</span>
                      {l.quizId && (
                        <Link
                          href={`/instructor/quizzes/${l.quizId}/submissions`}
                          className="text-xs text-primary hover:underline"
                        >
                          ({dict.instructor.quizzes})
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

export default function ManageCoursePage() {
  return (
    <ProtectedRoute>
      <ManageCourseContent />
    </ProtectedRoute>
  );
}
