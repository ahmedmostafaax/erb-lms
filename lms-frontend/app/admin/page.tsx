"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminHome() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/admin/courses");
  }, [router]);
  return <main className="px-6 py-16 text-sm text-ink/50">...</main>;
}
