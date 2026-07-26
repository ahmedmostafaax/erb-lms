"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useAuth } from "@/lib/auth/AuthContext";
import { ProtectedRoute } from "@/lib/auth/ProtectedRoute";
import { Navbar } from "@/components/Navbar";
import { Alert } from "@/components/Alert";
import { getCourse, type Course } from "@/lib/api/courses";
import { createOrder, payOrder } from "@/lib/api/orders";
import { ApiError } from "@/lib/api/client";

type Method = "card" | "wallet" | "kiosk";

function CheckoutContent() {
  const { courseId } = useParams<{ courseId: string }>();
  const { dict, locale } = useLanguage();
  const { token } = useAuth();
  const router = useRouter();

  const [course, setCourse] = useState<Course | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [method, setMethod] = useState<Method>("card");
  const [mobileNumber, setMobileNumber] = useState("");
  const [billReference, setBillReference] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCourse(courseId).then((res) => setCourse(res.data.course));
  }, [courseId]);

  useEffect(() => {
    if (!token) return;
    createOrder(courseId, token)
      .then((res) => setOrderId(res.data._id))
      .catch((err) => setError(err instanceof ApiError ? err.message : "حدث خطأ"));
  }, [courseId, token]);

  const handlePay = async () => {
    if (!orderId || !token) return;
    setError(null);
    setLoading(true);
    try {
      const res = await payOrder(orderId, { method, mobileNumber: mobileNumber || undefined }, token);

      if (method === "card" && res.data.paymentUrl) {
        window.location.href = res.data.paymentUrl;
      } else if (method === "wallet" && res.data.redirectUrl) {
        window.location.href = res.data.redirectUrl;
      } else if (method === "kiosk" && res.data.billReference) {
        setBillReference(res.data.billReference);
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "فشلت عملية الدفع");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-lg flex-1 px-6 py-16">
        <h1 className="font-display text-2xl font-bold text-ink">{dict.checkout.title}</h1>

        {course && (
          <div className="mt-4 flex items-center justify-between rounded-xl border border-line bg-paper-raised p-4">
            <span className="text-sm font-medium text-ink">{course.title}</span>
            <span className="font-mono text-sm font-semibold text-ink">
              {course.price} {locale === "ar" ? "ج.م" : "EGP"}
            </span>
          </div>
        )}

        {error && (
          <div className="mt-4">
            <Alert type="error" message={error} />
          </div>
        )}

        {billReference ? (
          <div className="mt-6 rounded-xl border border-accent/30 bg-accent-soft p-5 text-center">
            <p className="text-sm text-ink/70">{dict.checkout.kioskInstruction}</p>
            <p className="mt-2 font-mono text-2xl font-bold text-ink">{billReference}</p>
            <button
              onClick={() => router.push("/dashboard")}
              className="mt-5 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white hover:bg-primary-dark"
            >
              {dict.checkout.goToDashboard}
            </button>
          </div>
        ) : (
          <>
            <div className="mt-6 space-y-2">
              {(["card", "wallet", "kiosk"] as Method[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  className={`w-full rounded-xl border px-4 py-3 text-start text-sm font-medium transition-colors ${
                    method === m
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-line text-ink/70 hover:border-primary/40"
                  }`}
                >
                  {dict.checkout.methods[m]}
                </button>
              ))}
            </div>

            {method === "wallet" && (
              <input
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder={dict.checkout.mobilePlaceholder}
                dir="ltr"
                className="mt-4 w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-sm text-ink outline-none focus:border-primary"
              />
            )}

            <button
              onClick={handlePay}
              disabled={loading || !orderId || (method === "wallet" && !mobileNumber)}
              className="mt-6 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
            >
              {loading ? dict.checkout.processing : dict.checkout.pay}
            </button>
          </>
        )}
      </main>
    </>
  );
}

export default function CheckoutPage() {
  return (
    <ProtectedRoute>
      <CheckoutContent />
    </ProtectedRoute>
  );
}
