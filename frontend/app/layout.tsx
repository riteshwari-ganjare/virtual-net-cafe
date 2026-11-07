import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: {
    default: "Virtual Netcafe | Siyaram Netcafe Khamli",
    template: "%s | Virtual Netcafe",
  },
  description:
    "Virtual Netcafe (Siyaram Netcafe) in Khamli for PAN, government forms, online applications, bill payments, printing, scanning, and digital services.",
  keywords: [
    "Sakshi Ganjare",
    "Rashmi Ganjare",
    "Khamli",
    "Siyaram Netcafe",
    "Virtual Netcafe",
    "Natthuji Ganjare",
    "Manda Ganjare",
    "Virtual Net Cafe",
    "net cafe Khamli",
    "government online services",
    "PAN card services",
    "online form filling",
    "printing and scanning",
  ],
  applicationName: "Virtual Netcafe",
  authors: [{ name: "Sakshi Ganjare" }],
  creator: "Sakshi Ganjare",
  publisher: "Virtual Netcafe",
  category: "digital services",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: "Virtual Netcafe",
    title: "Virtual Netcafe | Siyaram Netcafe Khamli",
    description:
      "Trusted digital and government services in Khamli — online forms, payments, printing, and document support.",
    images: [{ url: "/owner.jpeg", alt: "Sakshi Ganjare - Virtual Netcafe Khamli" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Virtual Netcafe | Siyaram Netcafe Khamli",
    description:
      "Trusted digital and government services in Khamli by Sakshi Ganjare.",
    images: ["/owner.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
