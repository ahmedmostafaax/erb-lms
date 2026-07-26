"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { resetPassword } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { AuthCard } from "@/components/auth/AuthCard";
import { OtpInput } from "@/components/auth/OtpInput";
import { PasswordField } from "@/components/auth/PasswordField";
import { Alert } from "@/components/Alert";

function ResetPasswordForm() {
  const { dict } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await resetPassword({ email, otp, newPassword });
      setSuccess(true);
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "حدث خطأ، حاول تاني");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard eyebrow="Auth" title={dict.auth.reset.title} subtitle={dict.auth.reset.subtitle}>
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {error && <Alert type="error" message={error} />}
        {success && <Alert type="success" message={dict.auth.reset.success} />}

        <OtpInput value={otp} onChange={setOtp} />

        <PasswordField
          id="newPassword"
          label={dict.auth.reset.newPassword}
          value={newPassword}
          onChange={setNewPassword}
          autoComplete="new-password"
        />

        <button
          type="submit"
          disabled={loading || otp.length !== 6}
          className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
        >
          {loading ? dict.auth.reset.submitting : dict.auth.reset.submit}
        </button>
      </form>
    </AuthCard>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
