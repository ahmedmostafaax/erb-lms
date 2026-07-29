"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useAuth } from "@/lib/auth/AuthContext";
import { LanguageToggle } from "./LanguageToggle";
import { NotificationsBell } from "./NotificationsBell";

export function Navbar() {
  const { dict } = useLanguage();
  const { user, isHydrated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = (
    <>
      <Link
        href="/courses"
        onClick={() => setMenuOpen(false)}
        className="transition-colors hover:text-primary"
      >
        {dict.nav.courses}
      </Link>
      {user && (
        <Link
          href="/dashboard"
          onClick={() => setMenuOpen(false)}
          className="transition-colors hover:text-primary"
        >
          {dict.nav.dashboard}
        </Link>
      )}
      {user?.role === "instructor" && (
        <Link
          href="/instructor/courses"
          onClick={() => setMenuOpen(false)}
          className="transition-colors hover:text-primary"
        >
          {dict.nav.newCourse}
        </Link>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-lg font-bold text-ink">
          منصة<span className="text-primary">.</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-ink/80 md:flex">{links}</nav>

        <div className="flex items-center gap-3">
          <LanguageToggle />
          {isHydrated && user && <NotificationsBell />}

          {isHydrated && user ? (
            <div className="hidden items-center gap-3 md:flex">
              <Link
                href="/settings"
                className="text-sm font-medium text-ink/80 transition-colors hover:text-primary"
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
            <div className="hidden items-center gap-3 md:flex">
              <Link
                href="/login"
                className="text-sm font-medium text-ink/80 transition-colors hover:text-primary"
              >
                {dict.nav.login}
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
              >
                {dict.nav.signup}
              </Link>
            </div>
          ) : null}

          {/* زرار القائمة، بيظهر بس على الموبايل */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={dict.nav.menu}
            aria-expanded={menuOpen}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink md:hidden"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-line bg-paper px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-4 text-sm font-medium text-ink/80">
            {links}

            <div className="mt-2 border-t border-line pt-4">
              {isHydrated && user ? (
                <div className="flex flex-col gap-3">
                  <Link
                    href="/settings"
                    onClick={() => setMenuOpen(false)}
                    className="hover:text-primary"
                  >
                    {user.name}
                  </Link>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                    }}
                    className="w-fit rounded-full border border-line px-4 py-2 text-sm font-medium hover:border-primary hover:text-primary"
                  >
                    {dict.nav.logout}
                  </button>
                </div>
              ) : isHydrated ? (
                <div className="flex flex-col gap-3">
                  <Link href="/login" onClick={() => setMenuOpen(false)} className="hover:text-primary">
                    {dict.nav.login}
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="w-fit rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
                  >
                    {dict.nav.signup}
                  </Link>
                </div>
              ) : null}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
