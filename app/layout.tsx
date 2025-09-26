import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Providers } from "./Providers";
import { siteConfig } from "@/config/site";
import NextTopLoader from "nextjs-toploader";
import { Inter } from "next/font/google";
import { Noto_Naskh_Arabic } from "next/font/google"; // ✅ Google Arabic font

// Inter (Latin / English default font)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Arabic font
const notoArabic = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  variable: "--font-noto-arabic",
  display: "swap",
});

// Prefer env, fall back to siteConfig.url, then to localhost
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  siteConfig.url?.trim() ||
  "http://localhost:3000";

const metadataBase = /^https?:\/\//i.test(siteUrl)
  ? new URL(siteUrl)
  : undefined;

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  keywords: ["ihsan"],
  description: siteConfig.description,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    creator: "@ihsan",
  },
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: any;
}>) {
  const dir = params.language === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={params.language}
      dir={dir}
      suppressHydrationWarning
      className={
        params.language === "ar" ? notoArabic.className : inter.className
      }
    >
      <head />
      <body>
        <Providers>
          <NextTopLoader color="black" />
          <Toaster />
          {children}
        </Providers>
      </body>
    </html>
  );
}
