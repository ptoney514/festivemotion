"use client";

import { useEffect, useCallback } from "react";
import type { PerformanceVideo } from "@/lib/performances";

export function VideoModal({
  video,
  onClose,
}: {
  video: PerformanceVideo;
  onClose: () => void;
}) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Video player"
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex size-10 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white/70 backdrop-blur-sm transition hover:border-white/20 hover:text-white"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Modal content */}
      <div className="mx-4 w-full max-w-5xl animate-[modalIn_0.2s_ease-out] overflow-hidden rounded-[24px] border border-white/10 bg-[#0a0a0a]">
        <video
          controls
          autoPlay
          playsInline
          preload="none"
          poster={video.posterUrl}
          className="aspect-video w-full bg-black"
        >
          <source src={video.videoUrl} type="video/mp4" />
        </video>

        <div className="px-5 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ffb089]">
            {video.eyebrow}
          </p>
          <h3 className="mt-1 font-display text-2xl font-semibold tracking-[-0.04em] text-white">
            {video.title}
          </h3>
          <p className="mt-2 text-sm leading-7 text-white/60">{video.description}</p>
        </div>
      </div>
    </div>
  );
}
