"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { Navbar } from "@/components/Navbar";
import { getPublicProfile, type PublicProfile } from "@/lib/api/publicProfile";

export default function PublicProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { dict } = useLanguage();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getPublicProfile(id)
      .then((res) => setProfile(res.data))
      .catch(() => setNotFound(true));
  }, [id]);

  if (notFound) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-2xl flex-1 px-6 py-16 text-center">
          <p className="text-ink/60">{dict.publicProfile.notFound}</p>
        </main>
      </>
    );
  }

  if (!profile) return null;

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-2xl flex-1 px-6 py-10">
        <div className="flex items-center gap-4">
          {profile.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 font-display text-2xl font-semibold text-primary">
              {profile.name.charAt(0)}
            </div>
          )}
          <div>
            <h1 className="font-display text-xl font-bold text-ink">{profile.name}</h1>
            <span className="mt-1 inline-block rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-ink">
              {profile.role === "instructor" ? dict.publicProfile.instructor : dict.publicProfile.student}
            </span>
          </div>
        </div>

        {profile.profile.bio && (
          <p className="mt-6 leading-relaxed text-ink/70">{profile.profile.bio}</p>
        )}

        <div className="mt-6 flex gap-4">
          {profile.profile.linkedinUrl && (
            <a
              href={profile.profile.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-primary hover:underline"
            >
              LinkedIn
            </a>
          )}
          {profile.profile.portfolioUrl && (
            <a
              href={profile.profile.portfolioUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-primary hover:underline"
            >
              {dict.publicProfile.portfolio}
            </a>
          )}
        </div>

        {profile.profile.skills?.length > 0 && (
          <div className="mt-8">
            <h2 className="font-display text-sm font-semibold text-ink">{dict.publicProfile.skills}</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {profile.profile.skills.map((s, i) => (
                <span key={i} className="rounded-full border border-line px-3 py-1 text-xs text-ink/70">
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
