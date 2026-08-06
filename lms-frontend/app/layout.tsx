import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, IBM_Plex_Sans_Arabic, IBM_Plex_Mono } from "next/font/google";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { RegisterSW } from "@/components/RegisterSW";
import "./globals.css";

const fontEn = IBM_Plex_Sans({
  variable: "--font-en",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const fontAr = IBM_Plex_Sans_Arabic({
  variable: "--font-ar",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

const fontNum = IBM_Plex_Mono({
  variable: "--font-num",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "http://ec2-63-184-39-37.eu-central-1.compute.amazonaws.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "منصة الكورسات | Learning Platform",
    template: "%s | منصة الكورسات",
  },
  description: "اتعلم مهارة جديدة خطوة بخطوة — كورسات عربية باحتراف",
  applicationName: "منصة الكورسات",
  keywords: ["كورسات", "تعليم", "LMS", "برمجة", "تعلم أونلاين"],
  authors: [{ name: "منصة الكورسات" }],
  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: siteUrl,
    siteName: "منصة الكورسات",
    title: "منصة الكورسات",
    description: "اتعلم مهارة جديدة خطوة بخطوة",
  },
  twitter: {
    card: "summary_large_image",
    title: "منصة الكورسات",
    description: "اتعلم مهارة جديدة خطوة بخطوة",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "منصة",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#1B6B5A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const noFlashScript = `
(function () {
  try {
    var locale = localStorage.getItem('locale') || 'ar';
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dataset.lang = locale;
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      data-lang="ar"
      className={`${fontEn.variable} ${fontAr.variable} ${fontNum.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-full flex flex-col bg-paper text-ink" suppressHydrationWarning>
        <LanguageProvider>
          <AuthProvider>
            <RegisterSW />
            {children}
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
