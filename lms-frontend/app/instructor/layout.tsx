"use client";

import { InstructorSidebar } from "@/components/InstructorSidebar";
import { ProtectedRoute } from "@/lib/auth/ProtectedRoute";
import { useAuth } from "@/lib/auth/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function InstructorShell({ children }: { children: React.ReactNode }) {
  const { user, isHydrated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isHydrated && user && user.role !== "instructor" && user.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [user, isHydrated, router]);

  if (!isHydrated || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-ink/50">
        ...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-paper md:flex-row">
      <InstructorSidebar />
      <div className="min-w-0 flex-1 overflow-auto">{children}</div>
    </div>
  );
}

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <InstructorShell>{children}</InstructorShell>
    </ProtectedRoute>
  );
}
