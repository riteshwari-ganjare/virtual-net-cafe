import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Sakshi Ganjare | Virtual Netcafe Khamli",
  description:
    "About Sakshi Ganjare, owner of Virtual Netcafe (Siyaram Netcafe) in Khamli, providing government forms, online services, digital payments, printing, and document support.",
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
    "online government services Khamli",
  ],
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Sakshi Ganjare | Virtual Netcafe Khamli",
    description:
      "Virtual Netcafe and Siyaram Netcafe in Khamli — government services, online forms, payments, printing, and document support.",
    url: "/about",
    type: "profile",
    images: [{ url: "/owner.jpeg", alt: "Sakshi Ganjare - Virtual Netcafe" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Sakshi Ganjare | Virtual Netcafe Khamli",
    description:
      "Virtual Netcafe and Siyaram Netcafe in Khamli — trusted digital and government services.",
    images: ["/owner.jpeg"],
  },
  robots: { index: true, follow: true },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
