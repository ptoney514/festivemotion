import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata = {
  title: "Page Not Found | FestiveMotion",
};

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-[960px] px-4 py-20 sm:px-6 lg:px-8">
        <section className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ffb089]">
            404
          </p>
          <h1 className="mt-3 font-display text-5xl font-semibold tracking-[-0.06em] text-white">
            Page not found
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-sm leading-8 text-white/65">
            The page you're looking for doesn't exist or has been moved. Head
            back to the product catalog to browse the full FestiveMotion lineup.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/products"
              className="button-light inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition"
            >
              Browse products
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/20"
            >
              Go home
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
