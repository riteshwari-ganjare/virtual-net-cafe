"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, API } from "@/components/AuthProvider";

export default function NewApplicationPage() {
  const { token, loading } = useAuth();
  const router = useRouter();
  const [services, setServices] = useState<string[]>([]);
  const [serviceType, setServiceType] = useState("");
  const [otherService, setOtherService] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/services`)
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d)) {
          const names = d.map((s: any) => s.name);
          setServices(names);
          if (names.length) setServiceType(names[0]);
        }
      })
      .catch(() => {});
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) { router.push("/login"); return; }
    setSubmitting(true);
    setError("");
    try {
      const finalService = serviceType === "Other" ? otherService.trim() : serviceType;
      if (!finalService) throw new Error("Service required");
      const fd = new FormData();
      fd.append("serviceType", finalService);
      fd.append("name", name);
      fd.append("phone", phone);
      fd.append("email", email);
      fd.append("address", address);
      if (files) Array.from(files).forEach((f) => fd.append("docs", f));
      const res = await fetch(`${API}/api/applications`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-zinc-50">
      <main className="mx-auto max-w-2xl px-6 py-8">
        <h1 className="text-2xl font-bold">New Application</h1>
        <form onSubmit={submit} className="mt-6 space-y-4 rounded-lg border bg-white p-6 shadow">
          {error && <p className="text-sm text-red-600">{error}</p>}
          <select className="w-full rounded border p-2" value={serviceType} onChange={(e) => setServiceType(e.target.value)}>
            {services.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
            <option value="Other">Other (not listed)</option>
          </select>
          {serviceType === "Other" && (
            <input className="w-full rounded border p-2" placeholder="Enter service name" value={otherService} onChange={(e) => setOtherService(e.target.value)} required />
          )}
          <input className="w-full rounded border p-2" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input className="w-full rounded border p-2" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <input className="w-full rounded border p-2" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <textarea className="w-full rounded border p-2" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
          <div>
            <label className="block text-sm font-medium mb-1">Upload Documents (select multiple)</label>
            <input type="file" multiple onChange={(e) => setFiles(e.target.files)} />
          </div>
          <button disabled={submitting} className="w-full rounded bg-black py-2 text-white disabled:opacity-50">{submitting ? "Submitting..." : "Submit"}</button>
        </form>
      </main>
    </div>
  );
}
