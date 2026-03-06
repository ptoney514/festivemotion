"use client";

import { formatCurrency } from "@/lib/format";
import type { CatalogOptionGroup } from "@/lib/types";

function SelectionMarker({
  checked,
  selectionType,
}: {
  checked: boolean;
  selectionType: CatalogOptionGroup["selectionType"];
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center ${
        selectionType === "single"
          ? "size-5 rounded-full"
          : "size-5 rounded-[6px]"
      } border ${
        checked ? "border-[#ff5a1f] bg-[#ff5a1f]" : "border-white/20 bg-white/[0.04]"
      }`}
    >
      {checked ? <span className="size-2 rounded-full bg-white" /> : null}
    </span>
  );
}

export function OptionGroup({
  group,
  onToggle,
  selectedValues,
}: {
  group: CatalogOptionGroup;
  onToggle: (groupSlug: string, optionSlug: string) => void;
  selectedValues: string[];
}) {
  if (group.metadata?.display === "included-list") {
    const includedOptions = group.options.filter((option) => option.isDefault);

    return (
      <section className="rounded-[26px] border border-white/10 bg-white/[0.03] p-6">
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ffb089]">
            Included
          </p>
          <h2 className="font-display text-2xl font-semibold tracking-[-0.04em] text-white">
            {group.name}
          </h2>
          {group.description ? (
            <p className="text-sm leading-7 text-white/60">{group.description}</p>
          ) : null}
        </div>
        <div className="mt-5 space-y-3">
          {includedOptions.map((option) => (
            <div
              key={option.slug}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-4"
            >
              <div className="flex items-center gap-3">
                <SelectionMarker checked selectionType="multi" />
                <span className="text-sm font-medium text-white">{option.label}</span>
              </div>
              <span className="text-sm font-medium text-white/55">Included</span>
            </div>
          ))}
        </div>
        {group.metadata?.helperText ? (
          <p className="mt-4 text-sm text-white/45">{group.metadata.helperText}</p>
        ) : null}
      </section>
    );
  }

  return (
    <section className="rounded-[26px] border border-white/10 bg-white/[0.03] p-6">
      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ffb089]">
          {group.required ? "Required" : "Optional"}
        </p>
        <h2 className="font-display text-2xl font-semibold tracking-[-0.04em] text-white">
          {group.name}
        </h2>
        {group.description ? (
          <p className="text-sm leading-7 text-white/60">{group.description}</p>
        ) : null}
        {group.metadata?.helperText ? (
          <p className="text-sm text-white/45">{group.metadata.helperText}</p>
        ) : null}
      </div>

      <div className="mt-5 grid gap-3">
        {group.options.map((option) => {
          const checked = selectedValues.includes(option.slug);
          const hasPrice = option.priceDeltaCents !== 0;

          return (
            <button
              key={option.slug}
              type="button"
              onClick={() => onToggle(group.slug, option.slug)}
              className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
                checked
                  ? "border-[#ff5a1f] bg-[rgba(255,90,31,0.08)]"
                  : "border-white/10 bg-black/20 hover:border-white/20 hover:bg-black/30"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                  <SelectionMarker checked={checked} selectionType={group.selectionType} />
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-white">{option.label}</span>
                      {option.metadata?.badge ? (
                        <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/70">
                          {option.metadata.badge}
                        </span>
                      ) : null}
                    </div>
                    {option.description ? (
                      <p className="text-sm text-white/55">{option.description}</p>
                    ) : null}
                  </div>
                </div>
                <span className="whitespace-nowrap text-sm font-semibold text-white">
                  {hasPrice ? `+${formatCurrency(option.priceDeltaCents)}` : "Included"}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {group.metadata?.whyItMatters ? (
        <details className="mt-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
          <summary className="cursor-pointer list-none text-sm font-medium text-white">
            Why this matters
          </summary>
          <p className="mt-3 text-sm leading-7 text-white/55">{group.metadata.whyItMatters}</p>
        </details>
      ) : null}
    </section>
  );
}
