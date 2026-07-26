import type { Metadata } from "next";

// صفحات الـ Auth ماينفعش تتفهرس في جوجل: صفحات عمل مش محتوى،
// وفهرستها بتسرّب هيكل النظام وتشتت الـ crawl budget
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4 py-12">
      {children}
    </div>
  );
}
