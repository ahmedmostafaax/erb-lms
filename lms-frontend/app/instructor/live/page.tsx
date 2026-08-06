"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { apiFetch } from "@/lib/api/client";
import { getMyCourses } from "@/lib/api/instructorCourses";
import type { Course } from "@/lib/api/courses";
import { Alert } from "@/components/Alert";

type LiveItem = {
  _id: string;
  title: string;
  startsAt: string;
  status: string;
  meetingUrl: string;
};

export default function InstructorLivePage() {
  const { token } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [items, setItems] = useState<LiveItem[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [meetingUrl, setMeetingUrl] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [courseId, setCourseId] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    if (!token) return;
    getMyCourses(token).then((res) => setCourses(res.data));
    apiFetch<{ data: LiveItem[] }>("/live", { token })
      .then((res) => setItems(res.data))
      .catch(() => setItems([]));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    setMsg(null);
    try {
      await apiFetch("/live", {
        method: "POST",
        token,
        body: {
          title,
          description,
          meetingUrl,
          startsAt: new Date(startsAt).toISOString(),
          courseId: courseId || undefined,
        },
      });
      setTitle("");
      setDescription("");
      setMeetingUrl("");
      setStartsAt("");
      setCourseId("");
      setMsg("تم إنشاء الجلسة");
      load();
    } catch {
      setMsg("فشل الإنشاء — تأكد من البيانات");
    } finally {
      setSaving(false);
    }
  };

  const setStatus = async (id: string, status: string) => {
    if (!token) return;
    await apiFetch(`/live/${id}/status`, { method: "PATCH", token, body: { status } });
    load();
  };

  return (
    <main className="mx-auto max-w-3xl flex-1 px-6 py-10">
      <h1 className="font-display text-2xl font-bold text-ink">الجلسات المباشرة</h1>
      <p className="mt-1 text-sm text-ink/60">أنشئ جلسة وضع لينك Zoom أو Google Meet</p>

      <form onSubmit={create} className="mt-6 space-y-3 rounded-2xl border border-line p-5">
        {msg && <Alert type="success" message={msg} />}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="عنوان الجلسة"
          className="w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-primary"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="وصف (اختياري)"
          rows={2}
          className="w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-primary"
        />
        <input
          value={meetingUrl}
          onChange={(e) => setMeetingUrl(e.target.value)}
          required
          placeholder="https://meet.google.com/... أو Zoom"
          dir="ltr"
          className="w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-primary"
        />
        <input
          type="datetime-local"
          value={startsAt}
          onChange={(e) => setStartsAt(e.target.value)}
          required
          className="w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-primary"
        />
        <select
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          className="w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-primary"
        >
          <option value="">بدون كورس محدد</option>
          {courses.map((c) => (
            <option key={c._id} value={c._id}>
              {c.title}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {saving ? "..." : "إنشاء جلسة"}
        </button>
      </form>

      <h2 className="mt-10 font-display text-lg font-semibold">جلساتك</h2>
      <div className="mt-4 space-y-3">
        {items.map((s) => (
          <div key={s._id} className="rounded-xl border border-line p-4">
            <p className="font-medium">{s.title}</p>
            <p className="text-xs text-ink/50">
              {new Date(s.startsAt).toLocaleString("ar-EG")} · {s.status}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setStatus(s._id, "live")}
                className="rounded-lg border border-line px-2 py-1 text-xs"
              >
                ابدأ (live)
              </button>
              <button
                type="button"
                onClick={() => setStatus(s._id, "ended")}
                className="rounded-lg border border-line px-2 py-1 text-xs"
              >
                إنهاء
              </button>
              <a href={s.meetingUrl} target="_blank" rel="noreferrer" className="text-xs text-primary">
                فتح اللينك
              </a>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-ink/50">لا توجد جلسات</p>}
      </div>
    </main>
  );
}
