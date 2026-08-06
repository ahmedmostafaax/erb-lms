"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/lib/auth/ProtectedRoute";
import { useAuth } from "@/lib/auth/AuthContext";
import { apiFetch } from "@/lib/api/client";

type Msg = {
  _id: string;
  body: string;
  from: { _id: string; name: string };
  to: { _id: string; name: string };
  createdAt: string;
};

function Content() {
  const { token, user } = useAuth();
  const [items, setItems] = useState<Msg[]>([]);
  const [to, setTo] = useState("");
  const [body, setBody] = useState("");

  const load = () => {
    if (!token) return;
    apiFetch<{ data: Msg[] }>("/messages", { token }).then((r) => setItems(r.data));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    await apiFetch("/messages", { method: "POST", token, body: { to, body } });
    setBody("");
    load();
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="font-display text-2xl font-bold">الرسائل</h1>
        <form onSubmit={send} className="mt-6 space-y-2 rounded-xl border border-line p-4">
          <input
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="ID المستلم"
            required
            className="w-full rounded-xl border border-line px-3 py-2 text-sm"
            dir="ltr"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            rows={3}
            className="w-full rounded-xl border border-line px-3 py-2 text-sm"
            placeholder="اكتب رسالتك"
          />
          <button type="submit" className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white">
            إرسال
          </button>
        </form>
        <div className="mt-6 space-y-2">
          {items.map((m) => (
            <div key={m._id} className="rounded-xl border border-line p-3 text-sm">
              <p className="text-xs text-ink/50">
                {m.from?.name} → {m.to?.name} · {new Date(m.createdAt).toLocaleString("ar-EG")}
              </p>
              <p className="mt-1">{m.body}</p>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

export default function MessagesPage() {
  return (
    <ProtectedRoute>
      <Content />
    </ProtectedRoute>
  );
}
