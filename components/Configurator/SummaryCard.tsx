"use client";

import { formatCurrency } from "@/lib/format";
import type { PricedConfiguration } from "@/lib/types";

export function SummaryCard({
  actionLabel,
  busy,
  compact = false,
  disabled,
  errorMessage,
  onAction,
  price,
}: {
  actionLabel: string;
  busy?: boolean;
  compact?: boolean;
  disabled?: boolean;
  errorMessage?: string | null;
  onAction?: () => void;
  price: PricedConfiguration;
}) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(0,0,0,0.16))] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ffb089]">
          Your Build
        </p>
        <h2 className="font-display text-2xl font-semibold tracking-[-0.04em] text-white">
          Configured total
        </h2>
        <p className="text-sm leading-7 text-white/55">
          Final price confirmed at checkout.
        </p>
      </div>

      {!compact ? (
        <>
          <div className="mt-6 space-y-3 border-t border-white/10 pt-6">
            {price.selectedOptions.map((group) => (
              <div key={group.groupSlug} className="flex items-start justify-between gap-4">
                <span className="text-sm text-white/50">{group.groupName}</span>
                <span className="max-w-[65%] text-right text-sm font-medium text-white">
                  {group.labels.join(", ")}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3 border-t border-white/10 pt-6">
            {price.lineItems.map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-4 text-sm">
                <span className="text-white/60">{item.label}</span>
                <span className="font-medium text-white">{formatCurrency(item.amountCents)}</span>
              </div>
            ))}
          </div>
        </>
      ) : null}

      <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-white/55">Total</span>
          <span className="text-2xl font-semibold text-white">
            {formatCurrency(price.totalCents)}
          </span>
        </div>
      </div>

      {errorMessage ? (
        <div className="mt-4 rounded-2xl border border-[#ff5a1f]/40 bg-[#ff5a1f]/10 px-4 py-3 text-sm text-[#ffd4c4]">
          {errorMessage}
        </div>
      ) : null}

      {onAction ? (
        <button
          type="button"
          onClick={onAction}
          disabled={disabled || busy || !price.valid}
          className="button-light mt-6 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
