"use client";

import { useState } from "react";
import { performances } from "@/lib/performances";
import type { PerformanceVideo } from "@/lib/performances";
import { VideoCard } from "@/components/video-card";
import { VideoModal } from "@/components/video-modal";

export function PerformancesShowcase() {
  const [selectedVideo, setSelectedVideo] = useState<PerformanceVideo | null>(null);

  return (
    <section className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 lg:px-8">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ffb089]">
          See It Live
        </p>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-[-0.05em] text-white">
          Watch them perform.
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-7 text-white/58">
          Choreographed routines with synchronized jaw movement, head tracking, and LED
          sequences — see what these skulls can really do.
        </p>
      </div>

      {/* Card grid: horizontal scroll on mobile, grid on desktop */}
      <div className="scrollbar-hide -mx-1 mt-8 flex gap-3 overflow-x-auto px-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3">
        {performances.map((video) => (
          <VideoCard
            key={video.slug}
            video={video}
            onPlay={() => setSelectedVideo(video)}
          />
        ))}
      </div>

      {selectedVideo && (
        <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}
    </section>
  );
}
