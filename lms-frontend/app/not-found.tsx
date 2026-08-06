import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-6xl font-bold text-primary">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold text-ink">الصفحة غير موجودة</h1>
      <p className="mt-2 text-sm text-ink/60">الرابط غلط أو الصفحة اتشالت</p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
      >
        الصفحة الرئيسية
      </Link>
    </main>
  );
}
