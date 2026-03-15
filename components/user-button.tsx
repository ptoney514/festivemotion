"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

export function UserButton() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        close();
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [open, close]);

  if (status === "loading") {
    return (
      <div className="size-9 animate-pulse rounded-full bg-white/10" />
    );
  }

  if (!session?.user) {
    return (
      <Link
        href="/auth/signin"
        className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white/80 transition hover:border-white/20 hover:text-white"
      >
        Sign in
      </Link>
    );
  }

  const initial = (session.user.name?.[0] ?? session.user.email?.[0] ?? "?").toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex size-9 items-center justify-center rounded-full bg-[#ff5a1f] text-sm font-bold text-white transition hover:bg-[#e04f1a]"
        aria-label="User menu"
      >
        {initial}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-2xl border border-white/10 bg-[#181818] p-2 shadow-xl">
          <div className="border-b border-white/10 px-3 py-2">
            <p className="truncate text-sm font-medium text-white">
              {session.user.name ?? "User"}
            </p>
            <p className="truncate text-xs text-white/50">
              {session.user.email}
            </p>
          </div>
          <button
            onClick={() => {
              close();
              signOut();
            }}
            className="mt-1 w-full rounded-xl px-3 py-2 text-left text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
