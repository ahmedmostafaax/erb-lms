"use client";

import { AdminSidebar } from "@/components/AdminSidebar";
import { ProtectedRoute } from "@/lib/auth/ProtectedRoute";
import { useAuth } from "@/lib/auth/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isHydrated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isHydrated && user && user.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [user, isHydrated, router]);

  if (!isHydrated) return null;
  if (!user || user.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-ink/50">
        جاري التحقق...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-paper md:flex-row">
      <AdminSidebar />
      <div className="min-w-0 flex-1 overflow-auto">{children}</div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <AdminGuard>{children}</AdminGuard>
    </ProtectedRoute>
  );
}
