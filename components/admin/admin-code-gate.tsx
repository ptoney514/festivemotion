"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminCodeGate() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Invalid code");
        setLoading(false);
        return;
      }

      router.refresh();
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
      <div className="text-center">
        <h1 className="text-lg font-bold tracking-tight text-[#ff5a1f]">
          FM Admin
        </h1>
        <p className="mt-2 text-sm text-white/50">
          Enter your access code to continue
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <input
            type="password"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError("");
            }}
            placeholder="Access code"
            autoFocus
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[#ff5a1f] focus:outline-none focus:ring-1 focus:ring-[#ff5a1f] transition"
          />
          {error && (
            <p className="mt-1.5 text-xs text-red-400">{error}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={loading || !code.trim()}
          className="w-full rounded-full bg-[#ff5a1f] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_40px_rgba(255,90,31,0.35)] transition hover:bg-[#e04f1a] disabled:opacity-60"
        >
          {loading ? "Verifying..." : "Enter"}
        </button>
      </form>
    </div>
  );
}
