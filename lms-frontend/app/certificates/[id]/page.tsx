"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useAuth } from "@/lib/auth/AuthContext";
import { getCertificate, type Certificate } from "@/lib/api/certificates";

export default function CertificatePage() {
  const { id } = useParams<{ id: string }>();
  const { dict, locale } = useLanguage();
  const { token } = useAuth();
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    getCertificate(id)
      .then((res) => setCertificate(res.data))
      .catch(() => setNotFound(true));
  }, [id]);

  const handlePrint = () => {
    if (certificate) {
      document.title = `certificate-${certificate.user.name}-${certificate.course.title}`;
    }
    window.print();
  };

  const handleDownloadPdf = async () => {
    setDownloading(true);
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || "/api";
      const res = await fetch(`${base}/certificates/${id}/pdf`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `certificate-${id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert(locale === "ar" ? "تعذر تحميل PDF" : "PDF download failed");
    } finally {
      setDownloading(false);
    }
  };

  if (notFound) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <p className="text-ink/60">{dict.certificate.notFound}</p>
      </main>
    );
  }

  if (!certificate) return null;

  const issuedDate = new Date(certificate.issuedAt).toLocaleDateString(
    locale === "ar" ? "ar-EG" : "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-4 py-10 print:bg-white">
      <div
        className="w-full max-w-2xl rounded-3xl border-4 p-10 text-center print:border-2"
        style={{ borderColor: "var(--accent)" }}
      >
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
          {dict.certificate.eyebrow}
        </span>
        <h1 className="mt-6 font-display text-3xl font-bold text-ink">
          {dict.certificate.certifyThat}
        </h1>
        <p className="mt-4 font-display text-2xl font-semibold text-primary">
          {certificate.user.name}
        </p>
        <p className="mt-4 text-ink/70">{dict.certificate.completed}</p>
        <p className="mt-2 font-display text-xl font-semibold text-ink">
          {certificate.course.title}
        </p>
        {certificate.course.instructor && (
          <p className="mt-2 text-sm text-ink/50">
            {dict.course.by} {certificate.course.instructor.name}
          </p>
        )}
        <div className="mt-10 flex items-center justify-between border-t border-line pt-6 text-xs text-ink/50">
          <span className="font-mono">{issuedDate}</span>
          <span className="font-mono">#{certificate._id.slice(-8).toUpperCase()}</span>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 print:hidden">
          <button
            type="button"
            onClick={handlePrint}
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            {dict.certificate.print}
          </button>
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="rounded-full border border-line px-6 py-2.5 text-sm font-semibold hover:border-primary disabled:opacity-50"
          >
            {downloading ? "..." : "تحميل PDF"}
          </button>
        </div>
        <p className="mt-2 text-xs text-ink/40 print:hidden">
          من الطباعة يمكن أيضًا «حفظ كـ PDF»
        </p>
      </div>
    </main>
  );
}
