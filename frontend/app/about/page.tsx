"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const HIGHLIGHTS = [
  "Government Services",
  "Online Forms",
  "Digital Payments",
  "Printing & Scanning",
];

const KEYWORDS = [
  "Sakshi Ganjare",
  "Rashmi Ganjare",
  "Khamli",
  "Siyaram Netcafe",
  "Virtual Netcafe",
  "Natthuji Ganjare",
  "Manda Ganjare",
];

const LOCAL_BUSINESS_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Virtual Netcafe",
  alternateName: "Siyaram Netcafe",
  description:
    "Virtual Netcafe and Siyaram Netcafe in Khamli providing government services, online forms, digital payments, printing, and document support.",
  image: "/owner.jpeg",
  telephone: "+91-7499294308",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Khamli",
    addressCountry: "IN",
  },
  founder: { "@type": "Person", name: "Sakshi Ganjare" },
  keywords: KEYWORDS.join(", "),
};

const VALUES = [
  {
    title: "Trusted Support",
    text: "Clear guidance for government and everyday digital service workflows, handled with patience and accuracy.",
  },
  {
    title: "Secure Handling",
    text: "Customer documents are used only for service delivery and sensitive application data is cleared after completion.",
  },
  {
    title: "Transparent Updates",
    text: "Application status keeps customers informed from submission and payment to the final submitted form print.",
  },
];

export default function AboutPage() {
  const [year, setYear] = useState("");
  useEffect(() => setYear(String(new Date().getFullYear())), []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 text-zinc-900">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-24 top-[-6rem] h-72 w-72 rounded-full bg-zinc-200/40 blur-3xl" />
        <div className="absolute right-[-8rem] top-1/3 h-80 w-80 rounded-full bg-zinc-300/25 blur-3xl" />
      </div>

      <header className="sticky top-0 z-20 border-b border-zinc-200/60 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link href="/" className="flex min-w-0 items-center gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black text-sm font-bold text-white shadow-sm">
              V
            </div>
            <span className="truncate text-sm font-bold tracking-tight sm:text-base">
              Virtual Net Cafe
            </span>
          </Link>
          <nav className="flex items-center gap-1.5 sm:gap-2">
            <Link
              href="/"
              className="rounded-full px-3 py-1.5 text-xs font-semibold text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 sm:text-sm"
            >
              Home
            </Link>
            <Link
              href="/login"
              className="rounded-full bg-black px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-zinc-800 sm:px-4 sm:text-sm"
            >
              Login
            </Link>
          </nav>
        </div>
      </header>

      <main className="relative mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS_JSON_LD) }}
        />
        {/* Profile — HORIZONTAL at every screen size */}
        <section className="overflow-hidden rounded-3xl border border-zinc-200/70 bg-white/80 shadow-xl shadow-zinc-200/40 backdrop-blur">
          <div className="grid grid-cols-[128px_1fr] sm:grid-cols-[200px_1fr] lg:grid-cols-[300px_1fr]">
            {/* Left: profile panel (narrow on mobile, wider on desktop) */}
            <div className="relative overflow-hidden bg-gradient-to-br from-rose-100 via-pink-50 to-indigo-100 p-3 sm:p-6 lg:p-8">
              <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/40 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-indigo-200/40 blur-2xl" />

              <div className="relative flex h-full flex-col items-center text-center">
                <span className="hidden rounded-full border border-white/70 bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-500 shadow-sm sm:inline-flex">
                  About Us
                </span>

                <div className="relative mt-0 sm:mt-5">
                  <div className="absolute inset-0 -m-1.5 rounded-full bg-gradient-to-br from-rose-300/60 via-pink-300/50 to-indigo-300/60 blur-md sm:-m-2" />
                  <div className="relative h-20 w-20 overflow-hidden rounded-full ring-2 ring-white shadow-lg shadow-rose-200/60 sm:h-28 sm:w-28 sm:ring-4 lg:h-36 lg:w-36">
                    <Image
                      src="/owner.jpeg"
                      alt="Sakshi Ganjare, owner of Virtual Net Cafe"
                      fill
                      sizes="(max-width: 640px) 80px, (max-width: 1024px) 112px, 144px"
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>

                <h1 className="mt-3 text-sm font-extrabold leading-tight tracking-tight text-zinc-900 sm:mt-4 sm:text-xl lg:mt-5 lg:text-2xl">
                  Sakshi Ganjare
                </h1>
                <p className="mt-0.5 text-[10px] font-medium leading-tight text-rose-500 sm:mt-1 sm:text-xs lg:text-sm">
                  Founder &amp; Owner
                </p>
                <p className="hidden text-xs leading-relaxed text-zinc-600 sm:mt-2 sm:block lg:mt-3 lg:text-sm">
                  Helping customers with digital and government services — with care
                  and a personal touch.
                </p>

                <a
                  href="tel:7499294308"
                  aria-label="Call 7499294308"
                  className="mt-2 inline-flex items-center justify-center rounded-full bg-zinc-900 p-2 text-white shadow-lg shadow-zinc-900/20 transition hover:bg-zinc-800 sm:mt-4 sm:gap-2 sm:px-4 sm:py-2"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 5a2 2 0 012-2h2.28a1 1 0 01.95.68l1.1 3.3a1 1 0 01-.27 1.05L7.6 9.6a12 12 0 006.8 6.8l1.57-1.46a1 1 0 011.05-.27l3.3 1.1a1 1 0 01.68.95V19a2 2 0 01-2 2A16 16 0 013 5z"
                    />
                  </svg>
                  <span className="hidden text-xs font-semibold sm:inline">
                    7499294308
                  </span>
                </a>
              </div>
            </div>

            {/* Right: story */}
            <div className="p-4 sm:p-6 lg:p-8">
              <h2 className="text-lg font-bold tracking-tight text-zinc-900 sm:text-2xl lg:text-3xl">
                A reliable place for everyday digital work
              </h2>
              <p className="mt-2 text-xs leading-6 text-zinc-600 sm:mt-3 sm:text-sm sm:leading-7 lg:text-[15px]">
                Virtual Net Cafe supports customers with government applications,
                online forms, bill payments, document services, scanning, and
                printing. The focus is simple: make each request easy to understand,
                complete it accurately, and keep the customer informed at every step.
              </p>

              <div className="mt-3 space-y-2 text-xs leading-6 text-zinc-700 sm:mt-5 sm:space-y-4 sm:text-sm sm:leading-7 lg:text-[15px]">
                <p>
                  Sakshi manages the centre with a hands-on approach, helping people
                  who need dependable support with essential digital tasks — from
                  identity and scheme-related services to exam forms, admissions, and
                  routine online payments.
                </p>
                <p className="hidden sm:block">
                  Every application is handled with attention to detail, with clear
                  status updates from submission through payment confirmation to
                  delivery of the final submitted form print.
                </p>
              </div>

              <div className="mt-4 sm:mt-7">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400 sm:text-[11px]">
                  Services &amp; Support
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5 sm:mt-3 sm:gap-2">
                  {HIGHLIGHTS.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-rose-100 bg-gradient-to-br from-rose-50 to-pink-50 px-2 py-1 text-[10px] font-medium text-rose-600 shadow-sm sm:px-3 sm:py-1.5 sm:text-xs"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Sweet closing line */}
              <div className="mt-4 rounded-xl border border-rose-100/80 bg-gradient-to-r from-rose-50 via-pink-50 to-indigo-50 px-3 py-2 sm:mt-7 sm:rounded-2xl sm:px-4 sm:py-3">
                <p className="text-xs italic leading-relaxed text-zinc-700 sm:text-sm">
                  &ldquo;Every customer deserves service that feels personal — not
                  just processed.&rdquo;
                </p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-rose-400 sm:text-[11px]">
                  — Sakshi
                </p>
              </div>

              <p className="mt-4 text-[11px] leading-relaxed text-zinc-500 sm:text-xs">
                Virtual Netcafe (Siyaram Netcafe), Khamli — trusted support from Sakshi Ganjare, with family values inspired by Rashmi Ganjare, Natthuji Ganjare, and Manda Ganjare.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {VALUES.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-zinc-200/70 bg-white/75 p-5 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md"
            >
              <h3 className="text-base font-bold tracking-tight">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600">{item.text}</p>
            </article>
          ))}
        </section>

        {/* CTA */}
        <section className="mt-6 flex flex-col gap-3 rounded-2xl border border-zinc-200/70 bg-gradient-to-r from-white to-zinc-50 p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h3 className="text-base font-bold tracking-tight">
              Need help with a service?
            </h3>
            <p className="mt-1 text-sm text-zinc-600">
              Create an account or contact Virtual Net Cafe directly.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              Get Started
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50"
            >
              View Services
            </Link>
          </div>
        </section>
      </main>

      <footer className="relative mx-auto max-w-5xl px-4 pb-10 pt-2 text-center sm:px-6">
        <p className="text-[11px] text-zinc-400">
          © {year} Virtual Net Cafe. All rights reserved.
        </p>
      </footer>
    </div>
  );
}