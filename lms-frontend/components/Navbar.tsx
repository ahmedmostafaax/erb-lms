"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useAuth } from "@/lib/auth/AuthContext";
import { LanguageToggle } from "./LanguageToggle";
import { ThemeToggle } from "./ThemeToggle";
import { NotificationsBell } from "./NotificationsBell";

export function Navbar() {
  const { dict, locale } = useLanguage();
  const { user, isHydrated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const AvatarLink = user ? (
    <Link
      href="/settings"
      onClick={() => setMenuOpen(false)}
      title={user.name}
      className="flex items-center gap-2"
    >
      {user.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={user.avatarUrl}
          alt={user.name}
          className="h-9 w-9 rounded-full border border-line object-cover"
        />
      ) : (
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
          {user.name?.charAt(0)?.toUpperCase() || "؟"}
        </span>
      )}
    </Link>
  ) : null;

  const links = (
    <>
      <Link href="/courses" onClick={() => setMenuOpen(false)} className="transition-colors hover:text-primary">
        {dict.nav.courses}
      </Link>
      <Link href="/paths" onClick={() => setMenuOpen(false)} className="transition-colors hover:text-primary">
        {locale === "ar" ? "مسارات" : "Paths"}
      </Link>
      <Link href="/search" onClick={() => setMenuOpen(false)} className="transition-colors hover:text-primary">
        {locale === "ar" ? "بحث" : "Search"}
      </Link>
      <Link href="/live" onClick={() => setMenuOpen(false)} className="transition-colors hover:text-primary">
        {locale === "ar" ? "مباشر" : "Live"}
      </Link>
      <Link href="/about" onClick={() => setMenuOpen(false)} className="transition-colors hover:text-primary">
        {locale === "ar" ? "من نحن" : "About"}
      </Link>
      <Link href="/contact" onClick={() => setMenuOpen(false)} className="transition-colors hover:text-primary">
        {locale === "ar" ? "تواصل" : "Contact"}
      </Link>
      {user ? (
        <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="transition-colors hover:text-primary">
          {dict.nav.dashboard}
        </Link>
      ) : null}
      {user ? (
        <Link href="/orders" onClick={() => setMenuOpen(false)} className="transition-colors hover:text-primary">
          {locale === "ar" ? "طلباتي" : "Orders"}
        </Link>
      ) : null}
      {user ? (
        <Link href="/wishlist" onClick={() => setMenuOpen(false)} className="transition-colors hover:text-primary">
          {locale === "ar" ? "المفضلة" : "Wishlist"}
        </Link>
      ) : null}
      {user ? (
        <Link href="/favorite-instructors" onClick={() => setMenuOpen(false)} className="transition-colors hover:text-primary">
          {locale === "ar" ? "مدرّسين" : "Instructors"}
        </Link>
      ) : null}
      {user ? (
        <Link href="/activity" onClick={() => setMenuOpen(false)} className="transition-colors hover:text-primary">
          {locale === "ar" ? "نشاطي" : "Activity"}
        </Link>
      ) : null}
      {user?.role === "instructor" ? (
        <Link href="/instructor/courses" onClick={() => setMenuOpen(false)} className="transition-colors hover:text-primary">
          {dict.nav.newCourse}
        </Link>
      ) : null}
      {user?.role === "admin" ? (
        <Link href="/admin/courses" onClick={() => setMenuOpen(false)} className="transition-colors hover:text-primary">
          {locale === "ar" ? "الأدمن" : "Admin"}
        </Link>
      ) : null}
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-lg font-bold text-ink">
          منصة<span className="text-primary">.</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-ink/80 lg:flex">{links}</nav>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <ThemeToggle />
          {isHydrated && user ? <NotificationsBell /> : null}
          {isHydrated && user ? (
            <div className="hidden items-center gap-3 md:flex">
              {AvatarLink}
              <button
                type="button"
                onClick={logout}
                className="rounded-full border border-line px-4 py-2 text-sm font-medium text-ink/80 hover:border-primary hover:text-primary"
              >
                {dict.nav.logout}
              </button>
            </div>
          ) : isHydrated ? (
            <div className="hidden items-center gap-3 md:flex">
              <Link href="/login" className="text-sm font-medium text-ink/80 hover:text-primary">
                {dict.nav.login}
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
              >
                {dict.nav.signup}
              </Link>
            </div>
          ) : null}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={dict.nav.menu}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line lg:hidden"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>
      {menuOpen ? (
        <div className="border-t border-line bg-paper px-6 py-4 lg:hidden">
          <nav className="flex flex-col gap-4 text-sm font-medium text-ink/80">
            {links}
            <div className="mt-2 border-t border-line pt-4">
              {isHydrated && user ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    {AvatarLink}
                    <span className="text-sm text-ink/70">{user.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                    }}
                    className="w-fit rounded-full border border-line px-4 py-2 text-sm"
                  >
                    {dict.nav.logout}
                  </button>
                </div>
              ) : isHydrated ? (
                <div className="flex flex-col gap-3">
                  <Link href="/login" onClick={() => setMenuOpen(false)}>
                    {dict.nav.login}
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="w-fit rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
                  >
                    {dict.nav.signup}
                  </Link>
                </div>
              ) : null}
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
