"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type AudioPlayerProps = {
  src: string;
  title: string;
};

const PLAY_EVENT = "festivemotion:audio-play";

export function AudioPlayer({ src, title }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const instanceId = useRef(crypto.randomUUID());

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasError, setHasError] = useState(false);

  // Pause this player when another starts
  useEffect(() => {
    function onGlobalPlay(e: Event) {
      const detail = (e as CustomEvent<string>).detail;
      if (detail !== instanceId.current) {
        audioRef.current?.pause();
        setIsPlaying(false);
      }
    }
    window.addEventListener(PLAY_EVENT, onGlobalPlay);
    return () => window.removeEventListener(PLAY_EVENT, onGlobalPlay);
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || hasError) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      window.dispatchEvent(
        new CustomEvent(PLAY_EVENT, { detail: instanceId.current })
      );
      audio.play().catch(() => setHasError(true));
      setIsPlaying(true);
    }
  }, [isPlaying, hasError]);

  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const audio = audioRef.current;
      const bar = progressRef.current;
      if (!audio || !bar || !duration) return;

      const rect = bar.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      audio.currentTime = ratio * duration;
    },
    [duration]
  );

  function formatTime(s: number) {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

  const pct = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/30 px-3 py-2">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onEnded={() => setIsPlaying(false)}
        onError={() => setHasError(true)}
      />

      {/* Play / Pause button */}
      <button
        type="button"
        onClick={togglePlay}
        disabled={hasError}
        aria-label={hasError ? "Audio unavailable" : isPlaying ? `Pause ${title}` : `Play ${title}`}
        className={`flex size-9 shrink-0 items-center justify-center rounded-full border transition ${
          hasError
            ? "cursor-not-allowed border-white/10 bg-white/5 text-white/20"
            : isPlaying
              ? "border-[#ff5a1f] bg-[#ff5a1f] text-white hover:bg-[#ff6d39]"
              : "border-[#ff5a1f]/30 bg-[#ff5a1f]/10 text-[#ff5a1f] hover:bg-[#ff5a1f]/20"
        }`}
      >
        {hasError ? (
          <svg viewBox="0 0 20 20" fill="currentColor" className="size-4">
            <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
          </svg>
        ) : isPlaying ? (
          <svg viewBox="0 0 20 20" fill="currentColor" className="size-4">
            <path d="M5.75 3a.75.75 0 0 0-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 0 0 .75-.75V3.75A.75.75 0 0 0 7.25 3h-1.5ZM12.75 3a.75.75 0 0 0-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 0 0 .75-.75V3.75a.75.75 0 0 0-.75-.75h-1.5Z" />
          </svg>
        ) : (
          <svg viewBox="0 0 20 20" fill="currentColor" className="size-4">
            <path d="M6.3 2.841A1.5 1.5 0 0 0 4 4.11v11.78a1.5 1.5 0 0 0 2.3 1.269l9.344-5.89a1.5 1.5 0 0 0 0-2.538L6.3 2.84Z" />
          </svg>
        )}
      </button>

      {/* Progress bar */}
      <div
        ref={progressRef}
        onClick={handleSeek}
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${title} progress`}
        className="group relative flex h-6 flex-1 cursor-pointer items-center"
      >
        <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-[#ff5a1f] transition-[width] duration-150"
            style={{ width: `${pct}%` }}
          />
        </div>
        {/* Thumb */}
        <div
          className="absolute top-1/2 size-2.5 -translate-y-1/2 rounded-full bg-white opacity-0 shadow transition-opacity group-hover:opacity-100"
          style={{ left: `calc(${pct}% - 5px)` }}
        />
      </div>

      {/* Time */}
      <span className="min-w-[70px] text-right text-[11px] tabular-nums text-white/40">
        {hasError ? "—:——" : `${formatTime(currentTime)} / ${formatTime(duration)}`}
      </span>
    </div>
  );
}
