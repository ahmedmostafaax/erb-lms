"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { getCertificate, type Certificate } from "@/lib/api/certificates";

export default function CertificatePage() {
  const { id } = useParams<{ id: string }>();
  const { dict, locale } = useLanguage();
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getCertificate(id)
      .then((res) => setCertificate(res.data))
      .catch(() => setNotFound(true));
  }, [id]);

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
        className="w-full max-w-2xl rounded-3xl border-4 p-10 text-center print:border-0"
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

        <button
          onClick={() => window.print()}
          className="mt-8 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark print:hidden"
        >
          {dict.certificate.print}
        </button>
      </div>
    </main>
  );
}
