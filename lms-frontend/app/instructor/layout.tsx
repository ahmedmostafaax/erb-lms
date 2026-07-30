"use client";

import { InstructorSidebar } from "@/components/InstructorSidebar";
import { ProtectedRoute } from "@/lib/auth/ProtectedRoute";

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-paper">
        <InstructorSidebar />
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </ProtectedRoute>
  );
}