"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useAuth } from "@/lib/auth/AuthContext";
import { LanguageToggle } from "./LanguageToggle";
import { NotificationsBell } from "./NotificationsBell";

export function Navbar() {
  const { dict } = useLanguage();
  const { user, isHydrated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-lg font-bold text-ink">
          منصة<span className="text-primary">.</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-ink/80 md:flex">
          <Link href="/courses" className="transition-colors hover:text-primary">
            {dict.nav.courses}
          </Link>
          {user && (
            <Link href="/dashboard" className="transition-colors hover:text-primary">
              {dict.nav.dashboard}
            </Link>
          )}
          {user?.role === "instructor" && (
            <Link href="/instructor/courses" className="transition-colors hover:text-primary">
              {dict.nav.newCourse}
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageToggle />
          {isHydrated && user && <NotificationsBell />}

          {isHydrated && user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/settings"
                className="hidden text-sm font-medium text-ink/80 transition-colors hover:text-primary sm:inline"
              >
                {user.name}
              </Link>
              <button
                onClick={logout}
                className="rounded-full border border-line px-4 py-2 text-sm font-medium text-ink/80 transition-colors hover:border-primary hover:text-primary"
              >
                {dict.nav.logout}
              </button>
            </div>
          ) : isHydrated ? (
            <>
              <Link
                href="/login"
                className="hidden rounded-full px-4 py-2 text-sm font-medium text-ink/80 transition-colors hover:text-primary sm:inline-block"
              >
                {dict.nav.login}
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
              >
                {dict.nav.signup}
              </Link>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}
