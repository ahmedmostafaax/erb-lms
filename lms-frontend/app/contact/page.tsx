"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-lg px-6 py-16">
        <h1 className="font-display text-3xl font-bold text-ink">تواصل معنا</h1>
        <p className="mt-2 text-sm text-ink/60">راسلنا لأي استفسار أو دعم</p>
        {sent ? (
          <p className="mt-8 text-sm text-primary">تم استلام رسالتك — هنرد قريبًا</p>
        ) : (
          <form
            className="mt-8 space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <input required placeholder="الاسم" className="w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-primary" />
            <input required type="email" placeholder="البريد" className="w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-primary" />
            <textarea required rows={5} placeholder="رسالتك" className="w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-primary" />
            <button type="submit" className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white">
              إرسال
            </button>
          </form>
        )}
        <p className="mt-6 text-xs text-ink/50">أو راسل: goodzz0x@gmail.com</p>
      </main>
    </>
  );
}
