"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

const links = [
  { href: "/admin/orders", labelAr: "الطلبات", labelEn: "Orders", exact: true },
  { href: "/admin/courses", labelAr: "مراجعة الكورسات", labelEn: "Course review", exact: false },
  { href: "/admin/users", labelAr: "المستخدمين", labelEn: "Users", exact: true },
  { href: "/admin/stats", labelAr: "الإحصائيات", labelEn: "Stats", exact: true },
  { href: "/admin/coupons", labelAr: "الكوبونات", labelEn: "Coupons", exact: true },
  { href: "/admin/paths", labelAr: "المسارات", labelEn: "Paths", exact: true },
  { href: "/courses", labelAr: "تصفح المنصة", labelEn: "Browse", exact: true },
  { href: "/admin/settings", labelAr: "إعدادات المنصة", labelEn: "Platform", exact: true },
  { href: "/admin/review-log", labelAr: "سجل المراجعة", labelEn: "Review log", exact: true },
  { href: "/settings", labelAr: "الإعدادات", labelEn: "Settings", exact: true },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { locale } = useLanguage();
  const [open, setOpen] = useState(false);

  const nav = (
    <>
      <Link
        href="/admin/courses"
        onClick={() => setOpen(false)}
        className="font-display text-lg font-bold text-ink"
      >
        منصة<span className="text-primary">.</span>
      </Link>
      <p className="mt-1 truncate text-xs text-ink/50">{user?.name}</p>
      <p className="text-[10px] uppercase tracking-wide text-accent">
        {locale === "ar" ? "أدمن" : "Admin"}
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
      <div className="flex items-center justify-between border-b border-line bg-paper-raised px-4 py-3 md:hidden">
        <Link href="/admin/courses" className="font-display font-bold text-ink">
          منصة<span className="text-primary">.</span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg border border-line px-3 py-1.5 text-sm"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>
      {open && <div className="border-b border-line bg-paper-raised p-5 md:hidden">{nav}</div>}

      <aside className="hidden min-h-screen w-64 shrink-0 flex-col border-e border-line bg-paper-raised p-5 md:flex">
        {nav}
      </aside>
    </>
  );
}
