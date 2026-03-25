"use client";

import { AudioPlayer } from "@/components/audio-player";
import type { Routine } from "@/lib/routines";

type RoutineCardProps = {
  routine: Routine;
};

export function RoutineCard({ routine }: RoutineCardProps) {
  return (
    <div
      className={`rounded-[22px] border bg-white/[0.03] p-4 ${
        routine.included
          ? "border-l-2 border-l-[#ff5a1f] border-t-white/10 border-r-white/10 border-b-white/10"
          : "border-white/10"
      }`}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <h4 className="text-sm font-semibold text-white">{routine.label}</h4>
        {routine.included ? (
          <span className="shrink-0 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
            Included
          </span>
        ) : (
          <span className="shrink-0 text-[13px] font-semibold text-[#ffb089]">
            ${(routine.priceCents / 100).toFixed(0)}
          </span>
        )}
      </div>
      <AudioPlayer src={routine.audioUrl} title={routine.label} />
    </div>
  );
}
