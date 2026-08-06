"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useAuth } from "@/lib/auth/AuthContext";
import { signIn, googleAuth } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { AuthCard } from "@/components/auth/AuthCard";
import { FormField } from "@/components/auth/FormField";
import { PasswordField } from "@/components/auth/PasswordField";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { Alert } from "@/components/Alert";

function redirectByRole(role?: string) {
  if (role === "instructor") return "/instructor/courses";
  if (role === "admin") return "/admin/courses";
  return "/dashboard";
}

export default function LoginPage() {
  const { dict } = useLanguage();
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await signIn({ email, password });
      login(res.token, res.data);
      router.push(redirectByRole(res.data?.role));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "حدث خطأ، حاول تاني");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async (idToken: string) => {
    setError(null);
    try {
      const res = await googleAuth({ idToken });
      login(res.token, res.data);
      router.push(redirectByRole(res.data?.role));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "فشل الدخول بجوجل");
    }
  };

  return (
    <AuthCard
      eyebrow="Auth"
      title={dict.auth.login.title}
      subtitle={dict.auth.login.subtitle}
      footer={
        <>
          {dict.auth.login.noAccount}{" "}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            {dict.auth.login.signupLink}
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {error && <Alert type="error" message={error} />}

        <FormField
          id="email"
          label={dict.auth.login.email}
          type="email"
          value={email}
          onChange={setEmail}
          autoComplete="email"
          required
        />
        <PasswordField
          id="password"
          label={dict.auth.login.password}
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
        />

        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-sm text-primary hover:underline">
            {dict.auth.login.forgot}
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
        >
          {loading ? dict.auth.login.submitting : dict.auth.login.submit}
        </button>

        <div className="flex items-center gap-3 py-1">
          <div className="h-px flex-1 bg-line" />
          <span className="text-xs text-ink/40">{dict.auth.or}</span>
          <div className="h-px flex-1 bg-line" />
        </div>

        <GoogleButton onCredential={handleGoogle} />
      </form>
    </AuthCard>
  );
}
