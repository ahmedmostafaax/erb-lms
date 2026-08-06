"use client";

import { useState } from "react";

export function ShareCourse({ title, courseId }: { title: string; courseId: string }) {
  const [copied, setCopied] = useState(false);
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/courses/${courseId}`
      : `/courses/${courseId}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const wa = `https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`;

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <button
        type="button"
        onClick={copy}
        className="rounded-full border border-line px-3 py-1.5 text-xs font-medium hover:border-primary hover:text-primary"
      >
        {copied ? "✓ تم النسخ" : "نسخ الرابط"}
      </button>
      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full border border-line px-3 py-1.5 text-xs font-medium hover:border-primary hover:text-primary"
      >
        واتساب
      </a>
    </div>
  );
}
