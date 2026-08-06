"use client";

import { apiFetch, ApiError } from "@/lib/api/client";

type Props = {
  courseId: string;
  token: string;
  status?: string;
  rejectionReason?: string;
  lessonCount: number;
  onDone?: () => void;
};

export function InstructorCourseActions({
  courseId,
  token,
  status,
  rejectionReason,
  lessonCount,
  onDone,
}: Props) {
  const submit = async () => {
    if (lessonCount < 1) {
      alert("أضف درس واحد على الأقل");
      return;
    }
    if (!confirm("إرسال للمراجعة؟")) return;
    try {
      await apiFetch(`/instructor/courses/${courseId}/submit`, {
        method: "POST",
        token,
      });
      alert("تم الإرسال");
      onDone?.();
    } catch (e) {
      alert(e instanceof ApiError ? e.message : "فشل");
    }
  };

  const exportCsv = async () => {
    try {
      const res = await apiFetch<{
        data: {
          user?: { name?: string; email?: string };
          progressPercent?: number;
          createdAt?: string;
        }[];
      }>(`/instructor/courses/${courseId}/students`, { token });
      const lines = ["name,email,progress,enrolledAt"];
      for (const r of res.data || []) {
        lines.push(
          `${(r.user?.name || "").replace(/,/g, " ")},${r.user?.email || ""},${r.progressPercent ?? 0},${r.createdAt || ""}`
        );
      }
      const blob = new Blob([lines.join("\n")], { type: "text/csv" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `students-${courseId}.csv`;
      a.click();
    } catch (e) {
      alert(e instanceof ApiError ? e.message : "فشل التصدير");
    }
  };

  const announce = async () => {
    const message = prompt("نص الإعلان:");
    if (!message?.trim()) return;
    try {
      const res = await apiFetch<{ sent: number }>(
        `/instructor/courses/${courseId}/announce`,
        { method: "POST", token, body: { message: message.trim() } }
      );
      alert(`تم الإرسال لـ ${res.sent || 0}`);
    } catch (e) {
      alert(e instanceof ApiError ? e.message : "فشل");
    }
  };

  return (
    <div className="mb-6 space-y-3">
      {status === "rejected" ? (
        <div className="rounded-xl border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
          <p className="font-semibold">مرفوض</p>
          <p className="mt-1">{rejectionReason || "بدون سبب"}</p>
        </div>
      ) : null}
      {status === "pending" ? (
        <div className="rounded-xl bg-accent/10 p-3 text-sm">قيد مراجعة الأدمن</div>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={submit}
          disabled={lessonCount < 1 || status === "pending" || status === "published"}
          className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
        >
          إرسال للمراجعة
        </button>
        <a
          href={`/courses/${courseId}`}
          target="_blank"
          rel="noreferrer"
          className="rounded-xl border border-line px-4 py-2 text-sm"
        >
          معاينة
        </a>
        <button
          type="button"
          onClick={exportCsv}
          className="rounded-xl border border-line px-4 py-2 text-sm"
        >
          CSV مسجّلين
        </button>
        <button
          type="button"
          onClick={announce}
          className="rounded-xl border border-line px-4 py-2 text-sm"
        >
          إعلان
        </button>
      </div>
    </div>
  );
}
