"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useAuth } from "@/lib/auth/AuthContext";
import { ProtectedRoute } from "@/lib/auth/ProtectedRoute";
import { Navbar } from "@/components/Navbar";
import { FormField } from "@/components/auth/FormField";
import { PasswordField } from "@/components/auth/PasswordField";
import { Alert } from "@/components/Alert";
import { updatePersonalData, changePassword, uploadAvatar, uploadCv } from "@/lib/api/settings";
import { updateMyProfile, getMyProfile } from "@/lib/api/profile";
import { getCategories, type Category } from "@/lib/api/categories";
import { ApiError } from "@/lib/api/client";

function SettingsContent() {
  const { dict } = useLanguage();
  const { user, token, updateUser } = useAuth();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState("");
  const [personalMsg, setPersonalMsg] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [savingPersonal, setSavingPersonal] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [savingPassword, setSavingPassword] = useState(false);

  const [avatarMsg, setAvatarMsg] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCv, setUploadingCv] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [specialtiesMsg, setSpecialtiesMsg] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [savingSpecialties, setSavingSpecialties] = useState(false);

  const [bio, setBio] = useState("");
  const [experienceYears, setExperienceYears] = useState("0");
  const [education, setEducation] = useState("");
  const [certifications, setCertifications] = useState("");
  const [instructorMsg, setInstructorMsg] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [savingInstructor, setSavingInstructor] = useState(false);

  useEffect(() => {
    getCategories().then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    if (!token) return;
    getMyProfile(token)
      .then((res) => {
        const d = res.data;
        setName(d.name || "");
        setPhone(d.phone || "");
        setBio(d.profile?.bio || "");
        setExperienceYears(String(d.profile?.experienceYears ?? 0));
        setEducation(d.profile?.education || "");
        setCertifications(d.profile?.certifications || "");
        const specs = d.profile?.specialties || [];
        setSelectedSpecialties(
          specs.map((s) => (typeof s === "string" ? s : s._id)).filter(Boolean)
        );
      })
      .catch(() => {});
  }, [token]);

  const toggleSpecialty = (id: string) => {
    setSelectedSpecialties((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSaveSpecialties = async () => {
    if (!token) return;
    setSpecialtiesMsg(null);
    setSavingSpecialties(true);
    try {
      await updateMyProfile({ specialties: selectedSpecialties }, token);
      setSpecialtiesMsg({ type: "success", text: dict.settings.saved });
    } catch (err) {
      setSpecialtiesMsg({ type: "error", text: err instanceof ApiError ? err.message : "حدث خطأ" });
    } finally {
      setSavingSpecialties(false);
    }
  };

  const handleSaveInstructorProfile = async () => {
    if (!token) return;
    setInstructorMsg(null);
    setSavingInstructor(true);
    try {
      await updateMyProfile(
        {
          bio,
          experienceYears: Number(experienceYears) || 0,
          education,
          certifications,
        },
        token
      );
      setInstructorMsg({ type: "success", text: dict.settings.saved });
    } catch (err) {
      setInstructorMsg({ type: "error", text: err instanceof ApiError ? err.message : "حدث خطأ" });
    } finally {
      setSavingInstructor(false);
    }
  };

  const handlePersonalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setPersonalMsg(null);
    setSavingPersonal(true);
    try {
      const res = await updatePersonalData({ name, phone: phone || undefined }, token);
      updateUser({ name: res.data.name });
      setPersonalMsg({ type: "success", text: dict.settings.saved });
    } catch (err) {
      setPersonalMsg({ type: "error", text: err instanceof ApiError ? err.message : "حدث خطأ" });
    } finally {
      setSavingPersonal(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setPasswordMsg(null);
    setSavingPassword(true);
    try {
      await changePassword({ currentPassword, newPassword }, token);
      setCurrentPassword("");
      setNewPassword("");
      setPasswordMsg({ type: "success", text: dict.settings.passwordChanged });
    } catch (err) {
      setPasswordMsg({ type: "error", text: err instanceof ApiError ? err.message : "حدث خطأ" });
    } finally {
      setSavingPassword(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;
    setAvatarMsg(null);
    setUploadingAvatar(true);
    try {
      const res = await uploadAvatar(file, token);
      updateUser({ avatarUrl: res.data.avatarUrl });
      setAvatarMsg({ type: "success", text: dict.settings.avatarUpdated });
    } catch (err) {
      setAvatarMsg({ type: "error", text: err instanceof ApiError ? err.message : "فشل رفع الصورة" });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleCvChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;
    setAvatarMsg(null);
    setUploadingCv(true);
    try {
      await uploadCv(file, token);
      setAvatarMsg({ type: "success", text: dict.settings.cvUpdated });
    } catch (err) {
      setAvatarMsg({ type: "error", text: err instanceof ApiError ? err.message : "فشل رفع الملف" });
    } finally {
      setUploadingCv(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-2xl flex-1 px-6 py-10">
        <h1 className="font-display text-2xl font-bold text-ink">{dict.settings.title}</h1>

        <section className="mt-8 rounded-2xl border border-line bg-paper-raised p-6">
          <h2 className="font-display text-lg font-semibold text-ink">{dict.settings.photoTitle}</h2>
          <div className="mt-4 flex items-center gap-4">
            {user?.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatarUrl} alt={user.name} className="h-16 w-16 rounded-full object-cover" />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 font-display text-xl font-semibold text-primary">
                {user?.name?.charAt(0)}
              </div>
            )}
            <div className="flex gap-2">
              <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              <button type="button" onClick={() => avatarInputRef.current?.click()} disabled={uploadingAvatar} className="rounded-xl border border-line px-4 py-2 text-sm font-medium text-ink/70 hover:border-primary disabled:opacity-50">
                {uploadingAvatar ? "..." : dict.settings.changePhoto}
              </button>
              <input ref={cvInputRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleCvChange} />
              <button type="button" onClick={() => cvInputRef.current?.click()} disabled={uploadingCv} className="rounded-xl border border-line px-4 py-2 text-sm font-medium text-ink/70 hover:border-primary disabled:opacity-50">
                {uploadingCv ? "..." : dict.settings.uploadCv}
              </button>
            </div>
          </div>
          {avatarMsg && (
            <div className="mt-4">
              <Alert type={avatarMsg.type} message={avatarMsg.text} />
            </div>
          )}
        </section>

        {user?.role === "instructor" && (
          <section className="mt-6 rounded-2xl border border-line bg-paper-raised p-6">
            <h2 className="font-display text-lg font-semibold text-ink">{dict.settings.specialtiesTitle}</h2>
            <p className="mt-1 text-xs text-ink/50">{dict.settings.specialtiesSubtitle}</p>
            {specialtiesMsg && (
              <div className="mt-3">
                <Alert type={specialtiesMsg.type} message={specialtiesMsg.text} />
              </div>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c._id}
                  type="button"
                  onClick={() => toggleSpecialty(c._id)}
                  className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                    selectedSpecialties.includes(c._id)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-line text-ink/60 hover:border-primary/40"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
            <button onClick={handleSaveSpecialties} disabled={savingSpecialties} className="mt-5 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60">
              {savingSpecialties ? dict.checkout.processing : dict.settings.save}
            </button>
          </section>
        )}

        {user?.role === "instructor" && (
          <section className="mt-6 rounded-2xl border border-line bg-paper-raised p-6">
            <h2 className="font-display text-lg font-semibold text-ink">المؤهلات والخبرة</h2>
            <p className="mt-1 text-xs text-ink/50">تظهر في صفحة بروفايلك العام</p>
            {instructorMsg && (
              <div className="mt-3">
                <Alert type={instructorMsg.type} message={instructorMsg.text} />
              </div>
            )}
            <div className="mt-4 space-y-3">
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="نبذة عنك" rows={3} className="w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-primary" />
              <input type="number" min={0} value={experienceYears} onChange={(e) => setExperienceYears(e.target.value)} placeholder="سنوات الخبرة" className="w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-primary" />
              <input value={education} onChange={(e) => setEducation(e.target.value)} placeholder="المؤهل الدراسي" className="w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-primary" />
              <input value={certifications} onChange={(e) => setCertifications(e.target.value)} placeholder="الشهادات" className="w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-primary" />
              <button type="button" onClick={handleSaveInstructorProfile} disabled={savingInstructor} className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60">
                {savingInstructor ? dict.checkout.processing : dict.settings.save}
              </button>
            </div>
          </section>
        )}

        <section className="mt-6 rounded-2xl border border-line bg-paper-raised p-6">
          <h2 className="font-display text-lg font-semibold text-ink">{dict.settings.personalTitle}</h2>
          <form onSubmit={handlePersonalSubmit} className="mt-4 space-y-4">
            {personalMsg && <Alert type={personalMsg.type} message={personalMsg.text} />}
            <FormField id="name" label={dict.auth.signup.name} value={name} onChange={setName} />
            <FormField id="phone" label={dict.settings.phone} value={phone} onChange={setPhone} type="tel" />
            <button type="submit" disabled={savingPersonal} className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60">
              {savingPersonal ? dict.checkout.processing : dict.settings.save}
            </button>
          </form>
        </section>

        <section className="mt-6 rounded-2xl border border-line bg-paper-raised p-6">
          <h2 className="font-display text-lg font-semibold text-ink">{dict.settings.passwordTitle}</h2>
          <form onSubmit={handlePasswordSubmit} className="mt-4 space-y-4">
            {passwordMsg && <Alert type={passwordMsg.type} message={passwordMsg.text} />}
            <PasswordField id="currentPassword" label={dict.settings.currentPassword} value={currentPassword} onChange={setCurrentPassword} autoComplete="current-password" />
            <PasswordField id="newPassword" label={dict.settings.newPassword} value={newPassword} onChange={setNewPassword} autoComplete="new-password" />
            <button type="submit" disabled={savingPassword} className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60">
              {savingPassword ? dict.checkout.processing : dict.settings.save}
            </button>
          </form>
        </section>
      </main>
    </>
  );
}

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  );
}
