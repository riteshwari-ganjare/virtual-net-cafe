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
  paymentReceiptUrl?: string;
  finalResultUrl?: string;
  createdAt: string;
}

const STATUS_STYLE: Record<string, string> = {
  Submitted: "bg-amber-50 text-amber-700 border-amber-200",
  "In Progress": "bg-blue-50 text-blue-700 border-blue-200",
  "Ready for Payment": "bg-violet-50 text-violet-700 border-violet-200",
  "Payment Submitted": "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
  Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export default function DashboardPage() {
  const { token, user, loading } = useAuth();
  const [apps, setApps] = useState<App[]>([]);
  const [err, setErr] = useState("");
  const [receiptFiles, setReceiptFiles] = useState<Record<string, File | null>>({});
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = () => {
    if (!token) return;
    fetch(`${API}/api/applications/my`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setApps(d); else setErr(d.message || "Failed"); })
      .catch((e) => setErr(e.message));
  };

  useEffect(() => {
    if (loading) return;
    if (!token) { window.location.href = "/login"; return; }
    load();
  }, [token, loading]);

  const uploadReceipt = async (id: string) => {
    const file = receiptFiles[id];
    if (!file || !token) return;
    setBusyId(id);
    setErr("");
    try {
      const fd = new FormData();
      fd.append("receipt", file);
      const res = await fetch(`${API}/api/applications/${id}/payment-receipt`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      setReceiptFiles((prev) => ({ ...prev, [id]: null }));
      load();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold">My Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm">{user?.name}</span>
            <Link href="/dashboard/new" className="rounded bg-black px-3 py-1.5 text-sm text-white">New Application</Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">
        {err && <p className="mb-4 rounded border border-red-200 bg-red-50 p-2 text-sm text-red-600">{err}</p>}
        {apps.length === 0 ? <p>No applications yet.</p> : (
          <div className="space-y-4">
            {apps.map((a) => {
              const isBusy = busyId === a._id;
              return (
                <div key={a._id} className="rounded-lg border bg-white p-4 shadow-sm">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">{a.serviceType}</h3>
                        <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${STATUS_STYLE[a.status] || "bg-zinc-100 text-zinc-700 border-zinc-200"}`}>
                          {a.status}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-zinc-400">{new Date(a.createdAt).toLocaleString()}</p>
                      {a.status === "Ready for Payment" && (
                        <p className="mt-2 text-sm text-violet-700">Your application is ready. Please upload your payment receipt.</p>
                      )}
                      {a.status === "Payment Submitted" && (
                        <p className="mt-2 text-sm text-fuchsia-700">Receipt received. Admin is verifying and will send your submitted form print.</p>
                      )}
                      {a.status === "Completed" && a.finalResultUrl && (
                        <a href={a.finalResultUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block rounded bg-green-600 px-3 py-1.5 text-sm text-white">
                          Download Submitted Form Print
                        </a>
                      )}
                    </div>
                    {a.status === "Ready for Payment" && (
                      <div className="w-full space-y-2 rounded-lg border border-violet-200 bg-violet-50/40 p-3 sm:w-64">
                        <label className="block text-xs font-semibold text-violet-800">Payment receipt</label>
                        <input
                          type="file"
                          disabled={isBusy}
                          className="block w-full text-xs"
                          onChange={(e) => setReceiptFiles((prev) => ({ ...prev, [a._id]: e.target.files?.[0] || null }))}
                        />
                        <button
                          disabled={isBusy || !receiptFiles[a._id]}
                          onClick={() => uploadReceipt(a._id)}
                          className="w-full rounded bg-violet-600 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
                        >
                          {isBusy ? "Uploading..." : "Upload Receipt"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}