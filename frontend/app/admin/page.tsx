"use client";
import { useEffect, useMemo, useState } from "react";
import { useAuth, API } from "@/components/AuthProvider";

interface Doc { url: string; fileId: string; name: string; }
interface ServiceItem { _id: string; name: string; documents?: string[]; }
interface App {
  _id: string;
  userId: { name: string; email: string } | string;
  serviceType: string;
  status: string;
  basicInfo?: { name: string; phone: string; email: string; address: string };
  uploadedDocs?: Doc[];
  paymentReceiptUrl?: string;
  finalResultUrl?: string;
  createdAt: string;
}

const STATUS = {
  Submitted: { badge: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" },
  "In Progress": { badge: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-500" },
  "Ready for Payment": { badge: "bg-violet-50 text-violet-700 border-violet-200", dot: "bg-violet-500" },
  "Payment Submitted": { badge: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200", dot: "bg-fuchsia-500" },
  Completed: { badge: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
} as const;

const FILTERS = ["All", "Submitted", "In Progress", "Ready for Payment", "Payment Submitted", "Completed"] as const;
const ADMIN_STATUS_OPTIONS = ["Submitted", "In Progress", "Ready for Payment"] as const;

export default function AdminPage() {
  const { token, user, loading } = useAuth();
  const [apps, setApps] = useState<App[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceDocs, setNewServiceDocs] = useState("");
  const [serviceErr, setServiceErr] = useState("");
  const [serviceBusy, setServiceBusy] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const [err, setErr] = useState("");
  const [finalFiles, setFinalFiles] = useState<Record<string, File | null>>({});
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = () => {
    if (!token) return;
    fetch(`${API}/api/admin/applications`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setApps(d); else setErr(d.message || "Failed"); })
      .catch((e) => setErr(e.message));
  };

  const loadServices = () => {
    if (!token) return;
    fetch(`${API}/api/services`)
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setServices(d); })
      .catch(() => {});
  };

  useEffect(() => {
    if (loading) return;
    if (!token) { window.location.href = "/login"; return; }
    if (user?.role !== "admin") { window.location.href = "/dashboard"; return; }
    load();
    loadServices();
  }, [token, loading, user]);

  const addService = async () => {
    setServiceErr("");
    const name = newServiceName.trim();
    if (!name) { setServiceErr("Name required"); return; }
    const docs = newServiceDocs.split(",").map((d) => d.trim()).filter(Boolean);
    setServiceBusy(true);
    try {
      const res = await fetch(`${API}/api/services`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, documents: docs }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      setNewServiceName("");
      setNewServiceDocs("");
      loadServices();
    } catch (e: any) {
      setServiceErr(e.message);
    } finally {
      setServiceBusy(false);
    }
  };

  const deleteService = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    await fetch(`${API}/api/services/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    loadServices();
  };

  const updateStatus = async (id: string, status: string) => {
    setBusyId(id);
    await fetch(`${API}/api/admin/applications/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    await load();
    setBusyId(null);
  };

  const complete = async (id: string) => {
    setBusyId(id);
    const fd = new FormData();
    const f = finalFiles[id];
    if (f) fd.append("finalDoc", f);
    const res = await fetch(`${API}/api/admin/applications/${id}/complete`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });
    const data = await res.json();
    if (!res.ok) { alert(data.message || "Failed"); setBusyId(null); return; }
    setFinalFiles((prev) => ({ ...prev, [id]: null }));
    await load();
    setBusyId(null);
  };

  const stats = useMemo(() => ({
    total: apps.length,
    submitted: apps.filter((a) => a.status === "Submitted").length,
    inProgress: apps.filter((a) => a.status === "In Progress").length,
    awaitingPayment: apps.filter((a) => a.status === "Ready for Payment" || a.status === "Payment Submitted").length,
    completed: apps.filter((a) => a.status === "Completed").length,
  }), [apps]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return apps.filter((a) => {
      if (filter !== "All" && a.status !== filter) return false;
      if (!q) return true;
      const userName = typeof a.userId === "object" ? a.userId.name : "";
      const userEmail = typeof a.userId === "object" ? a.userId.email : "";
      return [a.serviceType, userName, userEmail, a.basicInfo?.name, a.basicInfo?.phone]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
  }, [apps, filter, query]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 via-white to-zinc-100">
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900" />
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 text-zinc-900">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-zinc-200/60 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-sm font-bold text-white">
              V
            </div>
            <div>
              <h1 className="text-sm font-bold leading-tight">Admin Panel</h1>
              <p className="text-[11px] text-zinc-400">Virtual Net Cafe</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowServices(true)}
              className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50"
            >
              Manage Services
            </button>
            <div className="hidden text-right sm:block">
              <p className="text-xs font-semibold leading-tight">{user?.name}</p>
              <p className="text-[11px] text-zinc-400">Administrator</p>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-xs font-bold text-white">
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
          </div>
        </div>
      </header>

      {/* Services modal */}
      {showServices && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowServices(false)}>
          <div
            className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold">Services & Required Documents</h2>
              <button onClick={() => setShowServices(false)} className="rounded-md px-2 py-1 text-xs text-zinc-500 hover:bg-zinc-100">Close</button>
            </div>
            <p className="mt-1 text-[11px] text-zinc-500">Add a service and its required document list (comma separated).</p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <input
                value={newServiceName}
                onChange={(e) => setNewServiceName(e.target.value)}
                placeholder="Service name"
                className="flex-1 rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
              />
              <input
                value={newServiceDocs}
                onChange={(e) => setNewServiceDocs(e.target.value)}
                placeholder="Required docs (comma separated)"
                className="flex-[2] rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
              />
              <button
                disabled={serviceBusy}
                onClick={addService}
                className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {serviceBusy ? "Adding..." : "Add"}
              </button>
            </div>
            {serviceErr && <p className="mt-2 text-xs text-red-600">{serviceErr}</p>}
            <div className="mt-3 max-h-64 space-y-2 overflow-y-auto pr-1">
              {services.map((s) => (
                <div key={s._id} className="flex items-center justify-between rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{s.name}</p>
                    <p className="truncate text-[11px] text-zinc-500">
                      {(s.documents || []).length ? (s.documents || []).join(", ") : "No required docs"}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteService(s._id)}
                    className="ml-3 shrink-0 text-xs font-medium text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              ))}
              {services.length === 0 && <p className="text-xs text-zinc-400">No services yet.</p>}
            </div>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-6xl px-5 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {[
            { label: "Total", value: stats.total, accent: "text-zinc-900" },
            { label: "Submitted", value: stats.submitted, accent: "text-amber-600" },
            { label: "In Progress", value: stats.inProgress, accent: "text-blue-600" },
            { label: "Payment", value: stats.awaitingPayment, accent: "text-violet-600" },
            { label: "Completed", value: stats.completed, accent: "text-emerald-600" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-zinc-200/70 bg-white/80 p-3.5 shadow-sm backdrop-blur"
            >
              <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                {s.label}
              </p>
              <p className={`mt-1 text-2xl font-extrabold tracking-tight ${s.accent}`}>
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  filter === f
                    ? "border-zinc-900 bg-zinc-900 text-white"
                    : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search service, name, email, phone..."
            className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/5 sm:w-80"
          />
        </div>

        {err && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
            {err}
          </div>
        )}

        {/* Applications */}
        <div className="mt-5 space-y-3">
          {filtered.length === 0 && (
            <div className="rounded-xl border border-dashed border-zinc-200 bg-white/60 p-10 text-center">
              <p className="text-sm font-medium text-zinc-500">No applications found</p>
              <p className="mt-1 text-xs text-zinc-400">
                Try changing the filter or search query.
              </p>
            </div>
          )}

          {filtered.map((a) => {
            const s = STATUS[a.status as keyof typeof STATUS] || STATUS.Submitted;
            const isBusy = busyId === a._id;
            const userName = typeof a.userId === "object" ? a.userId.name : a.userId;
            const userEmail = typeof a.userId === "object" ? a.userId.email : "";

            return (
              <div
                key={a._id}
                className="group rounded-xl border border-zinc-200/70 bg-white/80 shadow-sm backdrop-blur transition hover:border-zinc-300 hover:shadow-md"
              >
                <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:justify-between">
                  {/* Left: info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold tracking-tight">{a.serviceType}</h3>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${s.badge}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                        {a.status}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-zinc-500">
                      <span className="font-medium text-zinc-700">{userName}</span>
                      {userEmail && <> · {userEmail}</>}
                    </p>

                    {a.basicInfo && a.basicInfo.name && (
                      <div className="mt-2.5 grid grid-cols-2 gap-x-4 gap-y-1 rounded-lg bg-zinc-50 p-2.5 text-[11px] text-zinc-600 sm:grid-cols-4">
                        <p><span className="text-zinc-400">Name · </span>{a.basicInfo.name}</p>
                        <p><span className="text-zinc-400">Phone · </span>{a.basicInfo.phone}</p>
                        <p className="truncate"><span className="text-zinc-400">Email · </span>{a.basicInfo.email}</p>
                        <p className="truncate"><span className="text-zinc-400">Address · </span>{a.basicInfo.address}</p>
                      </div>
                    )}

                    {(a.uploadedDocs?.length || a.paymentReceiptUrl || a.finalResultUrl) ? (
                      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                        {a.uploadedDocs?.map((d, i) => (
                          <a
                            key={i}
                            href={d.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-md border border-zinc-200 bg-white px-2 py-1 text-[11px] font-medium text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-900"
                          >
                            📎 {d.name || "doc"}
                          </a>
                        ))}
                        {a.paymentReceiptUrl && (
                          <a
                            href={a.paymentReceiptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-md border border-violet-200 bg-violet-50 px-2 py-1 text-[11px] font-semibold text-violet-700 transition hover:bg-violet-100"
                          >
                            Receipt
                          </a>
                        )}
                        {a.finalResultUrl && (
                          <a
                            href={a.finalResultUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700 transition hover:bg-emerald-100"
                          >
                            ✓ Final result
                          </a>
                        )}
                      </div>
                    ) : null}
                  </div>

                  {/* Right: actions */}
                  <div className="flex shrink-0 flex-col gap-2 sm:w-56">
                    {a.status !== "Completed" && a.status !== "Payment Submitted" && (
                      <select
                        disabled={isBusy}
                        className="w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/5 disabled:opacity-50"
                        value={ADMIN_STATUS_OPTIONS.includes(a.status as any) ? a.status : "Submitted"}
                        onChange={(e) => updateStatus(a._id, e.target.value)}
                      >
                        {ADMIN_STATUS_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    )}

                    {a.status === "Payment Submitted" && (
                      <div className="space-y-1.5 rounded-lg border border-violet-200 bg-violet-50/50 p-2">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-700">
                          Payment received — upload submitted form print
                        </p>
                        <label className="block">
                          <input
                            type="file"
                            disabled={isBusy}
                            className="block w-full text-[11px] text-zinc-600 file:mr-2 file:rounded-md file:border-0 file:bg-zinc-900 file:px-2 file:py-1 file:text-[11px] file:font-semibold file:text-white hover:file:bg-zinc-800 disabled:opacity-50"
                            onChange={(e) =>
                              setFinalFiles((prev) => ({
                                ...prev,
                                [a._id]: e.target.files?.[0] || null,
                              }))
                            }
                          />
                        </label>
                        <button
                          disabled={isBusy || !finalFiles[a._id]}
                          onClick={() => complete(a._id)}
                          className="w-full rounded-lg bg-emerald-600 py-1.5 text-[11px] font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500"
                        >
                          {isBusy ? "Sending..." : "Send Final Document & Complete"}
                        </button>
                      </div>
                    )}

                    {a.status === "Ready for Payment" && (
                      <p className="rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-2 text-[11px] text-zinc-600">
                        Waiting for user to upload payment receipt.
                      </p>
                    )}
                    {a.status === "Completed" && (
                      <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-2 text-[11px] font-semibold text-emerald-700">
                        Completed
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}