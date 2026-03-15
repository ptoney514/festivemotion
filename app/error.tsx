"use client";

import * as Sentry from "@sentry/nextjs";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <main className="mx-auto max-w-[960px] px-4 py-20 sm:px-6 lg:px-8">
      <section className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ffb089]">
          Something went wrong
        </p>
        <h1 className="mt-3 font-display text-5xl font-semibold tracking-[-0.06em] text-white">
          Unexpected error
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-sm leading-8 text-white/65">
          We hit a problem loading this page. You can try again or head back to
          the catalog.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={reset}
            className="button-light inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition"
          >
            Try again
          </button>
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/20"
          >
            Browse products
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/20"
          >
            Contact support
          </Link>
        </div>
      </section>
    </main>
  );
}
