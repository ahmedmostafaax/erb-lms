"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

const links = [
  { href: "/instructor/courses", labelAr: "كورساتي", labelEn: "My Courses", exact: false },
  { href: "/instructor/courses/new", labelAr: "كورس جديد", labelEn: "New Course", exact: true },
  { href: "/instructor/revenue", labelAr: "الإيرادات", labelEn: "Revenue", exact: true },
  { href: "/instructor/stats", labelAr: "الإحصائيات", labelEn: "Stats", exact: true },
  { href: "/instructor/live", labelAr: "جلسات مباشرة", labelEn: "Live", exact: true },
  { href: "/messages", labelAr: "الرسائل", labelEn: "Messages", exact: true },
  { href: "/settings", labelAr: "الإعدادات", labelEn: "Settings", exact: true },
  { href: "/courses", labelAr: "تصفح المنصة", labelEn: "Browse", exact: true },
];

export function InstructorSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { locale } = useLanguage();
  const [open, setOpen] = useState(false);

  const nav = (
    <>
      <Link
        href="/instructor/courses"
        onClick={() => setOpen(false)}
        className="font-display text-lg font-bold text-ink"
      >
        منصة<span className="text-primary">.</span>
      </Link>
      <p className="mt-1 truncate text-xs text-ink/50">{user?.name}</p>
      <p className="text-[10px] uppercase tracking-wide text-primary/80">
        {locale === "ar" ? "مدرّس" : "Instructor"}
      </p>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {links.map((l) => {
          const active = l.exact
            ? pathname === l.href
            : pathname === l.href || pathname.startsWith(l.href + "/");
          return (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active ? "bg-primary text-white" : "text-ink/70 hover:bg-line/40 hover:text-ink"
              }`}
            >
              {locale === "ar" ? l.labelAr : l.labelEn}
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={logout}
        className="mt-4 rounded-xl border border-line px-3 py-2 text-sm text-ink/70 hover:border-primary hover:text-primary"
      >
        {locale === "ar" ? "تسجيل الخروج" : "Logout"}
      </button>
    </>
  );

  return (
    <>
      {/* موبايل */}
      <div className="flex items-center justify-between border-b border-line bg-paper-raised px-4 py-3 md:hidden">
        <Link href="/instructor/courses" className="font-display font-bold text-ink">
          منصة<span className="text-primary">.</span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg border border-line px-3 py-1.5 text-sm"
          aria-label="menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>
      {open && (
        <div className="border-b border-line bg-paper-raised p-5 md:hidden">{nav}</div>
      )}

      {/* ديسكتوب */}
      <aside className="hidden min-h-screen w-64 shrink-0 flex-col border-e border-line bg-paper-raised p-5 md:flex">
        {nav}
      </aside>
    </>
  );
}
