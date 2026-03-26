"use client";

import { useCallback, useEffect, useState } from "react";

// ── Types ────────────────────────────────────────────────────────────────

interface PromoCode {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  isActive: boolean;
  validFrom: string | null;
  validTo: string | null;
  maxUses: number | null;
  currentUses: number;
  createdAt: string;
  updatedAt: string;
}

interface FormData {
  code: string;
  discountType: "fixed_amount" | "percentage";
  discountValue: string;
  isActive: boolean;
  validFrom: string;
  validTo: string;
  maxUses: string;
}

const emptyForm: FormData = {
  code: "",
  discountType: "percentage",
  discountValue: "",
  isActive: true,
  validFrom: "",
  validTo: "",
  maxUses: "",
};

// ── Helpers ──────────────────────────────────────────────────────────────

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "--";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatValue(type: string, value: number): string {
  if (type === "percentage") return `${value}%`;
  return `$${(value / 100).toFixed(2)}`;
}

function getStatusInfo(promo: PromoCode): { label: string; color: string } {
  if (!promo.isActive) {
    return { label: "Inactive", color: "bg-red-500/20 text-red-400" };
  }

  const now = new Date();
  if (promo.validFrom && new Date(promo.validFrom) > now) {
    return { label: "Scheduled", color: "bg-amber-500/20 text-amber-400" };
  }
  if (promo.validTo && new Date(promo.validTo) < now) {
    return { label: "Expired", color: "bg-amber-500/20 text-amber-400" };
  }
  if (promo.maxUses && promo.currentUses >= promo.maxUses) {
    return { label: "Maxed Out", color: "bg-amber-500/20 text-amber-400" };
  }
  return { label: "Active", color: "bg-emerald-500/20 text-emerald-400" };
}

/** Convert a UTC ISO string to a local datetime-local value for <input>. */
function toLocalDatetimeInput(isoStr: string | null): string {
  if (!isoStr) return "";
  const d = new Date(isoStr);
  // offset to local and format as YYYY-MM-DDTHH:mm
  const offset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - offset).toISOString().slice(0, 16);
}

/** Convert a datetime-local input value to an ISO string in UTC. */
function toISOFromLocal(localStr: string): string | null {
  if (!localStr) return null;
  return new Date(localStr).toISOString();
}

// ── Component ────────────────────────────────────────────────────────────

export function PromoCodeManager() {
  const [codes, setCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  // ── Fetch ────────────────────────────────────────────────────────

  const fetchCodes = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/promo-codes");
      if (!res.ok) throw new Error("Failed to fetch promo codes");
      const data = await res.json();
      setCodes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCodes();
  }, [fetchCodes]);

  // Auto-dismiss success messages
  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(null), 3000);
    return () => clearTimeout(t);
  }, [success]);

  // ── Create ───────────────────────────────────────────────────────

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const body = {
        code: form.code,
        discountType: form.discountType,
        discountValue:
          form.discountType === "fixed_amount"
            ? Math.round(parseFloat(form.discountValue) * 100)
            : parseInt(form.discountValue, 10),
        isActive: form.isActive,
        validFrom: toISOFromLocal(form.validFrom),
        validTo: toISOFromLocal(form.validTo),
        maxUses: form.maxUses ? parseInt(form.maxUses, 10) : null,
      };

      const res = await fetch("/api/admin/promo-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to create promo code");
      }

      setSuccess("Promo code created successfully");
      setShowCreate(false);
      setForm(emptyForm);
      await fetchCodes();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Update ───────────────────────────────────────────────────────

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId) return;
    setSubmitting(true);
    setError(null);

    try {
      const body = {
        code: form.code,
        discountType: form.discountType,
        discountValue:
          form.discountType === "fixed_amount"
            ? Math.round(parseFloat(form.discountValue) * 100)
            : parseInt(form.discountValue, 10),
        isActive: form.isActive,
        validFrom: toISOFromLocal(form.validFrom),
        validTo: toISOFromLocal(form.validTo),
        maxUses: form.maxUses ? parseInt(form.maxUses, 10) : null,
      };

      const res = await fetch(`/api/admin/promo-codes/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to update promo code");
      }

      setSuccess("Promo code updated successfully");
      setEditingId(null);
      setForm(emptyForm);
      await fetchCodes();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Toggle Active ────────────────────────────────────────────────

  async function handleToggleActive(promo: PromoCode) {
    setError(null);
    try {
      const res = await fetch(`/api/admin/promo-codes/${promo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !promo.isActive }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to toggle status");
      }

      setSuccess(`Promo code ${promo.isActive ? "deactivated" : "activated"}`);
      await fetchCodes();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }

  // ── Delete ───────────────────────────────────────────────────────

  async function handleDelete(promo: PromoCode) {
    if (!window.confirm(`Delete promo code "${promo.code}"? This cannot be undone.`)) {
      return;
    }

    setError(null);
    try {
      const res = await fetch(`/api/admin/promo-codes/${promo.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to delete promo code");
      }

      setSuccess("Promo code deleted");
      await fetchCodes();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }

  // ── Start editing ────────────────────────────────────────────────

  function startEdit(promo: PromoCode) {
    setShowCreate(false);
    setEditingId(promo.id);
    setForm({
      code: promo.code,
      discountType: promo.discountType as FormData["discountType"],
      discountValue:
        promo.discountType === "fixed_amount"
          ? (promo.discountValue / 100).toFixed(2)
          : String(promo.discountValue),
      isActive: promo.isActive,
      validFrom: toLocalDatetimeInput(promo.validFrom),
      validTo: toLocalDatetimeInput(promo.validTo),
      maxUses: promo.maxUses ? String(promo.maxUses) : "",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setShowCreate(false);
    setForm(emptyForm);
  }

  // ── Shared form fields ───────────────────────────────────────────

  function renderForm(onSubmit: (e: React.FormEvent) => void, submitLabel: string) {
    return (
      <form onSubmit={onSubmit} className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8 mb-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Code */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">
              Code
            </label>
            <input
              type="text"
              required
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              placeholder="e.g. SUMMER25"
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[#ff5a1f] focus:outline-none focus:ring-1 focus:ring-[#ff5a1f] transition"
            />
          </div>

          {/* Discount Type */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">
              Discount Type
            </label>
            <select
              value={form.discountType}
              onChange={(e) =>
                setForm({
                  ...form,
                  discountType: e.target.value as FormData["discountType"],
                  discountValue: "",
                })
              }
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white focus:border-[#ff5a1f] focus:outline-none focus:ring-1 focus:ring-[#ff5a1f] transition"
            >
              <option value="percentage">Percentage</option>
              <option value="fixed_amount">Fixed Amount</option>
            </select>
          </div>

          {/* Discount Value */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">
              Value
            </label>
            <div className="relative">
              {form.discountType === "fixed_amount" && (
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-white/40">
                  $
                </span>
              )}
              <input
                type="number"
                required
                min="0"
                max={form.discountType === "percentage" ? 100 : undefined}
                step={form.discountType === "fixed_amount" ? "0.01" : "1"}
                value={form.discountValue}
                onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                placeholder={form.discountType === "percentage" ? "e.g. 25" : "e.g. 10.00"}
                className={`w-full rounded-2xl border border-white/10 bg-black/20 py-3 text-sm text-white placeholder:text-white/30 focus:border-[#ff5a1f] focus:outline-none focus:ring-1 focus:ring-[#ff5a1f] transition ${
                  form.discountType === "fixed_amount" ? "pl-8 pr-4" : "px-4 pr-8"
                }`}
              />
              {form.discountType === "percentage" && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-white/40">
                  %
                </span>
              )}
            </div>
          </div>

          {/* Valid From */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">
              Valid From
            </label>
            <input
              type="datetime-local"
              value={form.validFrom}
              onChange={(e) => setForm({ ...form, validFrom: e.target.value })}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white focus:border-[#ff5a1f] focus:outline-none focus:ring-1 focus:ring-[#ff5a1f] transition [color-scheme:dark]"
            />
          </div>

          {/* Valid To */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">
              Valid To
            </label>
            <input
              type="datetime-local"
              value={form.validTo}
              onChange={(e) => setForm({ ...form, validTo: e.target.value })}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white focus:border-[#ff5a1f] focus:outline-none focus:ring-1 focus:ring-[#ff5a1f] transition [color-scheme:dark]"
            />
          </div>

          {/* Max Uses */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">
              Max Uses
            </label>
            <input
              type="number"
              min="1"
              value={form.maxUses}
              onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
              placeholder="Unlimited"
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[#ff5a1f] focus:outline-none focus:ring-1 focus:ring-[#ff5a1f] transition"
            />
          </div>
        </div>

        {/* Active toggle */}
        <div className="mt-5 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setForm({ ...form, isActive: !form.isActive })}
            className={`relative h-6 w-11 rounded-full transition ${
              form.isActive ? "bg-[#ff5a1f]" : "bg-white/20"
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                form.isActive ? "left-[22px]" : "left-0.5"
              }`}
            />
          </button>
          <span className="text-sm text-white/60">
            {form.isActive ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-2xl bg-[#ff5a1f] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#ff5a1f]/80 disabled:opacity-50"
          >
            {submitting ? "Saving..." : submitLabel}
          </button>
          <button
            type="button"
            onClick={cancelEdit}
            className="rounded-2xl bg-white/10 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-white/20"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  // ── Render ───────────────────────────────────────────────────────

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Promo Codes</h1>
        {!showCreate && !editingId && (
          <button
            onClick={() => {
              setShowCreate(true);
              setForm(emptyForm);
              setEditingId(null);
            }}
            className="rounded-2xl bg-[#ff5a1f] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#ff5a1f]/80"
          >
            + Add New Promo Code
          </button>
        )}
      </div>

      {/* Feedback */}
      {error && (
        <div className="mb-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-3 text-sm text-red-400">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-3 text-red-300 hover:text-white"
          >
            Dismiss
          </button>
        </div>
      )}
      {success && (
        <div className="mb-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-3 text-sm text-emerald-400">
          {success}
        </div>
      )}

      {/* Create form */}
      {showCreate && renderForm(handleCreate, "Create Promo Code")}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[#ff5a1f]" />
        </div>
      )}

      {/* Table */}
      {!loading && codes.length === 0 && (
        <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-12 text-center text-white/40">
          No promo codes yet. Create one to get started.
        </div>
      )}

      {!loading && codes.length > 0 && (
        <div className="rounded-[32px] border border-white/10 bg-white/[0.03] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-white/50">
                    Code
                  </th>
                  <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-white/50">
                    Type
                  </th>
                  <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-white/50">
                    Value
                  </th>
                  <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-white/50">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-white/50">
                    Uses
                  </th>
                  <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-white/50">
                    Valid Dates
                  </th>
                  <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-white/50">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {codes.map((promo) => {
                  const status = getStatusInfo(promo);

                  // Inline edit row
                  if (editingId === promo.id) {
                    return (
                      <tr key={promo.id}>
                        <td colSpan={7} className="p-4">
                          {renderForm(handleUpdate, "Save Changes")}
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr
                      key={promo.id}
                      className="border-b border-white/5 transition hover:bg-white/[0.02]"
                    >
                      <td className="px-6 py-4 font-mono font-semibold text-white">
                        {promo.code}
                      </td>
                      <td className="px-6 py-4 text-white/60">
                        {promo.discountType === "percentage"
                          ? "Percentage"
                          : "Fixed Amount"}
                      </td>
                      <td className="px-6 py-4 font-medium text-[#ffb089]">
                        {formatValue(promo.discountType, promo.discountValue)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${status.color}`}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white/60">
                        {promo.currentUses}
                        {promo.maxUses ? ` / ${promo.maxUses}` : ""}
                      </td>
                      <td className="px-6 py-4 text-white/60">
                        <div className="text-xs">
                          {promo.validFrom || promo.validTo ? (
                            <>
                              {formatDate(promo.validFrom)} &ndash;{" "}
                              {formatDate(promo.validTo)}
                            </>
                          ) : (
                            <span className="text-white/30">Always valid</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => startEdit(promo)}
                            className="rounded-xl bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-white/20"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleToggleActive(promo)}
                            className={`rounded-xl px-3 py-1.5 text-xs font-medium transition ${
                              promo.isActive
                                ? "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
                                : "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                            }`}
                          >
                            {promo.isActive ? "Deactivate" : "Activate"}
                          </button>
                          <button
                            onClick={() => handleDelete(promo)}
                            className="rounded-xl bg-red-500/20 px-3 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-500/30"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
