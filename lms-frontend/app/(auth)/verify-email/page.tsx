"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useAuth } from "@/lib/auth/AuthContext";
import { verifyEmail, resendOtp } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { AuthCard } from "@/components/auth/AuthCard";
import { OtpInput } from "@/components/auth/OtpInput";
import { Alert } from "@/components/Alert";

function VerifyEmailForm() {
  const { dict } = useLanguage();
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(60);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await verifyEmail({ email, otp });
      login(res.token, res.data);
      router.push(redirectByRole(res.data?.role));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "حدث خطأ، حاول تاني");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError(null);
    try {
      await resendOtp({ email });
      setCooldown(60);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "فشل إرسال الكود");
    }
  };

  return (
    <AuthCard
      eyebrow="Auth"
      title={dict.auth.verify.title}
      subtitle={`${dict.auth.verify.subtitle} (${email})`}
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {error && <Alert type="error" message={error} />}

        <OtpInput value={otp} onChange={setOtp} />

        <button
          type="submit"
          disabled={loading || otp.length !== 6}
          className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
        >
          {loading ? dict.auth.verify.submitting : dict.auth.verify.submit}
        </button>

        <div className="text-center text-sm text-ink/60">
          {cooldown > 0 ? (
            <span>
              {dict.auth.verify.resendIn} {cooldown}s
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="font-medium text-primary hover:underline"
            >
              {dict.auth.verify.resend}
            </button>
          )}
        </div>
      </form>
    </AuthCard>
  );
}

function redirectByRole(role?: string) {
  if (role === "instructor") return "/instructor/courses";
  if (role === "admin") return "/admin/courses";
  return "/dashboard";
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailForm />
    </Suspense>
  );
}
