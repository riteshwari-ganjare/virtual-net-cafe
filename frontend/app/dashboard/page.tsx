"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth, API } from "@/components/AuthProvider";

interface Doc { url: string; fileId: string; name: string; }
interface App {
  _id: string;
  serviceType: string;
  status: string;
  basicInfo?: any;
  uploadedDocs?: Doc[];
  finalResultUrl?: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { token, user, loading } = useAuth();
  const [apps, setApps] = useState<App[]>([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (loading) return;
    if (!token) { window.location.href = "/login"; return; }
    fetch(`${API}/api/applications/my`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setApps(d); else setErr(d.message || "Failed"); })
      .catch((e) => setErr(e.message));
  }, [token, loading]);

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold">My Dashboard</h1>
          <div className="flex gap-4 items-center">
            <span className="text-sm">{user?.name}</span>
            <Link href="/dashboard/new" className="rounded bg-black px-3 py-1.5 text-sm text-white">New Application</Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">
        {err && <p className="text-red-600">{err}</p>}
        {apps.length === 0 ? <p>No applications yet.</p> : (
          <div className="space-y-4">
            {apps.map((a) => (
              <div key={a._id} className="rounded-lg border bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{a.serviceType}</h3>
                    <p className="text-sm text-zinc-600">Status: {a.status}</p>
                    <p className="text-xs text-zinc-400">{new Date(a.createdAt).toLocaleString()}</p>
                  </div>
                  {a.status === "Completed" && a.finalResultUrl && (
                    <a href={a.finalResultUrl} target="_blank" rel="noopener noreferrer" className="rounded bg-green-600 px-3 py-1.5 text-sm text-white">Download Final</a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}