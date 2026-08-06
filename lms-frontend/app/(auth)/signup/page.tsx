"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { signUp, googleAuth } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/AuthContext";
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

export default function SignupPage() {
  const { dict, locale } = useLanguage();
  const { login } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [role, setRole] = useState<"student" | "instructor">("student");
  const [experienceYears, setExperienceYears] = useState("");
  const [education, setEducation] = useState("");
  const [certifications, setCertifications] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const payload: Parameters<typeof signUp>[0] = {
        name,
        email,
        password,
        role,
      };
      if (age) payload.age = Number(age);
      if (role === "instructor") {
        if (experienceYears) payload.experienceYears = Number(experienceYears);
        if (education) payload.education = education;
        if (certifications) payload.certifications = certifications;
        if (bio) payload.bio = bio;
      }
      await signUp(payload);
      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
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
      title={dict.auth.signup.title}
      subtitle={dict.auth.signup.subtitle}
      footer={
        <>
          {dict.auth.signup.haveAccount}{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            {dict.auth.signup.loginLink}
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {error && <Alert type="error" message={error} />}

        <FormField id="name" label={dict.auth.signup.name} value={name} onChange={setName} autoComplete="name" required />
        <FormField id="email" label={dict.auth.signup.email} type="email" value={email} onChange={setEmail} autoComplete="email" required />
        <PasswordField id="password" label={dict.auth.signup.password} value={password} onChange={setPassword} autoComplete="new-password" />

        <FormField
          id="age"
          label={locale === "ar" ? "العمر" : "Age"}
          type="number"
          value={age}
          onChange={setAge}
          required
        />

        <div>
          <span className="mb-1.5 block text-sm font-medium text-ink">{dict.auth.signup.role}</span>
          <div className="grid grid-cols-2 gap-3">
            {(["student", "instructor"] as const).map((r) => (
              <button
                type="button"
                key={r}
                onClick={() => setRole(r)}
                className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
                  role === r
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-line text-ink/60 hover:border-primary/40"
                }`}
              >
                {r === "student" ? dict.auth.signup.roleStudent : dict.auth.signup.roleInstructor}
              </button>
            ))}
          </div>
        </div>

        {role === "instructor" && (
          <div className="space-y-4 rounded-xl border border-line bg-paper p-4">
            <p className="text-sm font-semibold text-ink">
              {locale === "ar" ? "بيانات المدرّس" : "Instructor details"}
            </p>
            <FormField
              id="experienceYears"
              label={locale === "ar" ? "سنوات الخبرة" : "Years of experience"}
              type="number"
              value={experienceYears}
              onChange={setExperienceYears}
            />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">
                {locale === "ar" ? "المؤهلات الأكاديمية" : "Education"}
              </label>
              <textarea
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                rows={2}
                placeholder={locale === "ar" ? "مثال: بكالوريوس هندسة - جامعة القاهرة" : "e.g. BSc Engineering"}
                className="w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">
                {locale === "ar" ? "الشهادات / الدورات" : "Certifications"}
              </label>
              <textarea
                value={certifications}
                onChange={(e) => setCertifications(e.target.value)}
                rows={2}
                className="w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">
                {locale === "ar" ? "نبذة مختصرة" : "Bio"}
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
        >
          {loading ? dict.auth.signup.submitting : dict.auth.signup.submit}
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
