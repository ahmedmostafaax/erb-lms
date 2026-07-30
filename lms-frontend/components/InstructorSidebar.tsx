"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

const links = [
  { href: "/instructor/courses", labelAr: "كورساتي", labelEn: "My Courses", exact: false },
  { href: "/instructor/courses/new", labelAr: "كورس جديد", labelEn: "New Course", exact: true },
  { href: "/settings", labelAr: "الإعدادات", labelEn: "Settings", exact: true },
  { href: "/courses", labelAr: "تصفح المنصة", labelEn: "Browse platform", exact: true },
];

export function InstructorSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { locale } = useLanguage();

  return (
    <aside className="flex min-h-screen w-64 shrink-0 flex-col border-e border-line bg-paper-raised p-5">
      <Link href="/instructor/courses" className="font-display text-lg font-bold text-ink">
        منصة<span className="text-primary">.</span>
      </Link>
      <p className="mt-1 truncate text-xs text-ink/50">{user?.name}</p>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {links.map((l) => {
          const active = l.exact
            ? pathname === l.href
            : pathname === l.href || pathname.startsWith(l.href + "/");
          return (
            <Link
              key={l.href}
              href={l.href}
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
        onClick={logout}
        className="mt-4 rounded-xl border border-line px-3 py-2 text-sm text-ink/70 hover:border-primary hover:text-primary"
      >
        {locale === "ar" ? "تسجيل الخروج" : "Logout"}
      </button>
    </aside>
  );
}