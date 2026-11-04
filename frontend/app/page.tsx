// "use client";
// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { API } from "@/components/AuthProvider";

// const FALLBACK = [
//   "PAN Card", "Voter ID Related Service", "Passport Application", "Ayushman Bharat Card",
//   "E-Shram Card", "PM Kisan Scheme", "Various Government Scheme Applications", "Online Exam Form",
//   "Government Job Form", "Scholarship Form", "Online Admission Process", "Electricity Bill Payment",
//   "Mobile Recharge", "Online Payment", "Digital Service", "Document Scanning",
//   "Black and White Print", "Color Print", "Xerox",
// ];

// export default function Home() {
//   const [services, setServices] = useState<string[]>(FALLBACK);

//   useEffect(() => {
//     fetch(`${API}/api/services`)
//       .then((r) => r.json())
//       .then((d) => { if (Array.isArray(d) && d.length) setServices(d.map((s: any) => s.name)); })
//       .catch(() => {});
//   }, []);

//   return (
//     <div className="min-h-screen bg-zinc-50 text-zinc-900">
//       <header className="border-b bg-white">
//         <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
//           <h1 className="text-xl font-bold">Virtual Net Cafe</h1>
//           <div className="flex gap-4">
//             <Link href="/login" className="text-sm font-medium hover:underline">Login</Link>
//             <Link href="/register" className="rounded bg-black px-3 py-1.5 text-sm text-white">Register</Link>
//           </div>
//         </div>
//       </header>
//       <main className="mx-auto max-w-5xl px-6 py-12">
//         <h2 className="text-3xl font-bold">Our Services</h2>
//         <p className="mt-2 text-zinc-600">Contact: 7499294308</p>
//         <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
//           {services.map((s) => (
//             <div key={s} className="rounded-lg border bg-white p-4 shadow-sm">
//               <h3 className="font-semibold text-sm">{s}</h3>
//             </div>
//           ))}
//         </div>
//         <div className="mt-10">
//           <Link href="/register" className="rounded bg-black px-5 py-2.5 text-white">Get Started</Link>
//         </div>
//       </main>
//     </div>
//   );
// ```jsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { API } from "@/components/AuthProvider";

const FALLBACK = [
  "PAN Card", "Voter ID Related Service", "Passport Application", "Ayushman Bharat Card",
  "E-Shram Card", "PM Kisan Scheme", "Various Government Scheme Applications", "Online Exam Form",
  "Government Job Form", "Scholarship Form", "Online Admission Process", "Electricity Bill Payment",
  "Mobile Recharge", "Online Payment", "Digital Service", "Document Scanning",
  "Black and White Print", "Color Print", "Xerox",
];

export default function Home() {
  const [services, setServices] = useState<string[]>(FALLBACK);

  useEffect(() => {
    fetch(`${API}/api/services`)
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d) && d.length) setServices(d.map((s: any) => s.name)); })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 text-zinc-900">
      {/* Decorative background blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-zinc-200/40 blur-3xl" />
        <div className="absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-zinc-300/30 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-zinc-200/40 blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-zinc-200/60 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-sm font-bold text-white">
              V
            </div>
            <h1 className="text-base font-bold tracking-tight">Virtual Net Cafe</h1>
          </div>
          <nav className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-full px-4 py-1.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-black px-4 py-1.5 text-sm font-medium text-white shadow-lg shadow-black/10 transition hover:bg-zinc-800"
            >
              Register
            </Link>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="relative mx-auto max-w-5xl px-5 py-10">
        {/* Hero */}
        <section className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white/80 px-3 py-1 text-xs font-medium text-zinc-500 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Trusted digital service partner
          </span>
          <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            All your digital services,
            <br />
            <span className="bg-gradient-to-r from-zinc-500 via-zinc-800 to-black bg-clip-text text-transparent">
              in one cozy place.
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-zinc-500">
            From government forms to bill payments and printing — get everything done
            quickly, affordably, and with a smile.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/register"
              className="rounded-full bg-black px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-zinc-800"
            >
              Get Started Free
            </Link>
            <a
              href="tel:7499294308"
              className="rounded-full border border-zinc-200 bg-white px-6 py-2.5 text-sm font-semibold text-zinc-700 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300"
            >
              📞 7499294308
            </a>
          </div>
        </section>

        {/* Stats strip */}
        <section className="mx-auto mt-8 flex max-w-2xl items-center justify-around rounded-2xl border border-zinc-200/70 bg-white/60 px-4 py-3 shadow-sm backdrop-blur">
          {[
            { label: "Services", value: "19+" },
            { label: "Happy Users", value: "1k+" },
            { label: "Avg. Time", value: "5 min" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-lg font-bold tracking-tight">{stat.value}</p>
              <p className="text-[11px] uppercase tracking-wider text-zinc-400">
                {stat.label}
              </p>
            </div>
          ))}
        </section>

        {/* Services */}
        <section className="mt-12">
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-xl font-bold tracking-tight">Our Services</h3>
              <p className="mt-0.5 text-sm text-zinc-500">
                Everything you need, neatly organized.
              </p>
            </div>
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-500">
              {services.length} available
            </span>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {services.map((s, i) => (
              <div
                key={s}
                className="group relative overflow-hidden rounded-xl border border-zinc-200/70 bg-white/80 p-4 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md"
                style={{ animationDelay: `${i * 20}ms` }}
              >
                <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-zinc-300 to-transparent opacity-0 transition group-hover:opacity-100" />
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-zinc-100 text-[11px] font-bold text-zinc-500">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h4 className="text-sm font-semibold leading-snug">{s}</h4>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-12 overflow-hidden rounded-2xl border border-zinc-200/70 bg-gradient-to-br from-zinc-900 to-zinc-700 p-8 text-center shadow-xl">
          <h3 className="text-2xl font-bold text-white">Ready to get started?</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-zinc-300">
            Create your free account today and access all services instantly.
          </p>
          <Link
            href="/register"
            className="mt-5 inline-block rounded-full bg-white px-7 py-2.5 text-sm font-semibold text-zinc-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-zinc-100"
          >
            Create Free Account →
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-zinc-200/60 bg-white/50 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-5 py-5 text-xs text-zinc-400 sm:flex-row">
          <p>© {new Date().getFullYear()} Virtual Net Cafe. All rights reserved.</p>
          <p>
            Made with <span className="text-rose-400">♥</span> for your convenience
          </p>
        </div>
      </footer>
    </div>
  );
}
