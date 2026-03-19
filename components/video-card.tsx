import Image from "next/image";

import type { PerformanceVideo } from "@/lib/performances";

export function VideoCard({
  video,
  onPlay,
}: {
  video: PerformanceVideo;
  onPlay?: () => void;
}) {
  if (video.comingSoon) {
    return (
      <div className="group relative aspect-[3/4] min-w-[220px] flex-shrink-0 overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] sm:min-w-0">
        {/* Subtle gradient placeholder */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,90,31,0.06),_transparent_70%)]" />

        {/* Top: eyebrow + duration */}
        <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between p-4">
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ffb089]/50">
            {video.eyebrow}
          </span>
          <span className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] font-medium text-white/30">
            {video.duration}
          </span>
        </div>

        {/* Center: Coming Soon badge */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <span className="rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/40 backdrop-blur-sm">
            Coming Soon
          </span>
        </div>

        {/* Bottom: title + description */}
        <div className="absolute inset-x-0 bottom-0 z-10 p-4">
          <h3 className="font-display text-xl font-semibold tracking-[-0.03em] text-white/30">
            {video.title}
          </h3>
          <p className="mt-1 line-clamp-1 text-sm text-white/20">{video.shortDescription}</p>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onPlay}
      className="group relative aspect-[3/4] min-w-[220px] flex-shrink-0 cursor-pointer overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] text-left transition hover:border-white/20 sm:min-w-0"
    >
      {/* Poster image */}
      <Image
        src={video.posterUrl}
        alt={`${video.title} performance preview`}
        fill
        className="object-cover transition duration-500 group-hover:scale-[1.03]"
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 220px"
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50" />

      {/* Top: eyebrow + duration */}
      <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between p-4">
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ffb089]">
          {video.eyebrow}
        </span>
        <span className="rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-medium text-white/70 backdrop-blur-sm">
          {video.duration}
        </span>
      </div>

      {/* Center: play button */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="flex size-16 items-center justify-center rounded-full border border-white/20 bg-black/40 backdrop-blur-sm transition group-hover:scale-110 group-hover:border-white/30 group-hover:bg-black/50">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white" aria-hidden="true">
            <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11.04-6.86a1 1 0 0 0 0-1.72L9.5 4.28a1 1 0 0 0-1.5.86Z" />
          </svg>
        </div>
      </div>

      {/* Bottom: title + description */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-4">
        <h3 className="font-display text-xl font-semibold tracking-[-0.03em] text-white">
          {video.title}
        </h3>
        <p className="mt-1 line-clamp-1 text-sm text-white/60">{video.shortDescription}</p>
      </div>
    </button>
  );
}
