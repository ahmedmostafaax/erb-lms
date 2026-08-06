"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-2xl font-bold text-ink">حصل خطأ</h1>
      <p className="mt-2 max-w-md text-sm text-ink/60">{error.message || "حاول تاني"}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white"
      >
        إعادة المحاولة
      </button>
    </main>
  );
}
