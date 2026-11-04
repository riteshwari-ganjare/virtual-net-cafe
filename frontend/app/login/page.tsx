"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const u = await login(email, password);
      if (u.role === "admin") router.push("/admin");
      else router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-zinc-50 via-white to-zinc-100 px-4 py-10 text-zinc-900">
      {/* Decorative background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-zinc-200/40 blur-3xl" />
        <div className="absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-zinc-300/30 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-zinc-200/40 blur-3xl" />
      </div>

      {/* Brand */}
      <Link
        href="/"
        className="absolute left-5 top-5 z-10 flex items-center gap-2 transition hover:opacity-80"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-sm font-bold text-white">
          V
        </div>
        <span className="text-sm font-bold tracking-tight">Virtual Net Cafe</span>
      </Link>

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm">
        <div className="rounded-2xl border border-zinc-200/70 bg-white/80 p-7 shadow-xl shadow-zinc-200/50 backdrop-blur-xl">
          <div className="mb-6 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white/80 px-3 py-1 text-[11px] font-medium text-zinc-500 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Welcome back
            </span>
            <h1 className="mt-3 text-2xl font-extrabold tracking-tight">
              Sign in to continue
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Access your dashboard and services.
            </p>
          </div>

          <form onSubmit={submit} className="space-y-3.5">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
                {error}
              </div>
            )}

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Email
              </span>
              <input
                className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/5"
                placeholder="you@example.com"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Password
              </span>
              <div className="relative">
                <input
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 pr-11 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/5"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            <div className="flex justify-end">
              <button
                type="button"
                className="text-[11px] font-medium text-zinc-500 transition hover:text-zinc-900"
              >
                Forgot password?
              </button>
            </div>

            <button
              disabled={loading}
              className="w-full rounded-xl bg-black py-2.5 text-sm font-semibold text-white shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Signing in...
                </span>
              ) : (
                "Sign In →"
              )}
            </button>
          </form>

          <div className="mt-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-zinc-200" />
            <span className="text-[11px] uppercase tracking-wider text-zinc-400">
              or
            </span>
            <div className="h-px flex-1 bg-zinc-200" />
          </div>

          <p className="mt-4 text-center text-sm text-zinc-500">
            New here?{" "}
            <Link
              href="/register"
              className="font-semibold text-zinc-900 hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>

        <p className="mt-5 text-center text-[11px] text-zinc-400">
          Need help?{" "}
          <a
            href="tel:7499294308"
            className="font-medium text-zinc-500 underline decoration-zinc-300 underline-offset-2 hover:text-zinc-900"
          >
            Call 7499294308
          </a>
        </p>
      </div>
    </div>
  );
}