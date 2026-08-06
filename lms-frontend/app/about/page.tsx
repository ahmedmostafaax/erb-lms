import { Navbar } from "@/components/Navbar";
import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="font-display text-3xl font-bold text-ink">من نحن</h1>
        <p className="mt-4 leading-relaxed text-ink/70">
          منصة تعليمية عربية تهدف لتسهيل تعلم المهارات أونلاين — كورسات، مسارات، اختبارات،
          وشهادات. بنبني تجربة واضحة للطالب والمدرّس.
        </p>
        <p className="mt-4 leading-relaxed text-ink/70">
          تقدر تتصفح الكورسات، تتعلم بوتيرتك، وتتواصل مع المدرّسين.
        </p>
        <Link href="/courses" className="mt-8 inline-block rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white">
          تصفح الكورسات
        </Link>
      </main>
    </>
  );
}
