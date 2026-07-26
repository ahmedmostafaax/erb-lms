"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { forgotPassword } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { AuthCard } from "@/components/auth/AuthCard";
import { FormField } from "@/components/auth/FormField";
import { Alert } from "@/components/Alert";

export default function ForgotPasswordPage() {
  const { dict } = useLanguage();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await forgotPassword({ email });
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "حدث خطأ، حاول تاني");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      eyebrow="Auth"
      title={dict.auth.forgot.title}
      subtitle={dict.auth.forgot.subtitle}
      footer={
        <Link href="/login" className="font-medium text-primary hover:underline">
          {dict.auth.forgot.backToLogin}
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {error && <Alert type="error" message={error} />}

        <FormField
          id="email"
          label={dict.auth.forgot.email}
          type="email"
          value={email}
          onChange={setEmail}
          autoComplete="email"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
        >
          {loading ? dict.auth.forgot.submitting : dict.auth.forgot.submit}
        </button>
      </form>
    </AuthCard>
  );
}
