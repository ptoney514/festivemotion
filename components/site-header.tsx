import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { href: "/products", label: "Products" },
  { href: "/", label: "Why FestiveMotion" },
  { href: "mailto:info@festivemotion.com", label: "Contact" },
];

export function SiteHeader() {
  return (
    <>
      <div className="border-b border-white/10 bg-[#ff5a1f] px-4 py-2">
        <div className="mx-auto flex max-w-[1280px] items-center justify-center gap-2 text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-white sm:text-xs">
          <span>Built for haunted attractions, escape rooms, and trade show demos</span>
        </div>
      </div>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[rgba(8,8,8,0.86)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-[#ff5a1f] shadow-[0_12px_40px_rgba(255,90,31,0.35)]">
              <Image
                src="/figma/nav-logo-mark.svg"
                alt=""
                width={18}
                height={18}
                className="h-[18px] w-[18px]"
              />
            </span>
            <span className="font-display text-2xl font-bold tracking-[-0.05em] text-white">
              FESTIVE<span className="text-[#ff5a1f]">MOTION</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-white/70 transition hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="tel:4022531991"
              className="hidden rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white/80 transition hover:border-white/20 hover:text-white sm:inline-flex"
            >
              +1 402 253 1991
            </a>
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#0f0f0f] transition hover:bg-white/90"
            >
              Shop / Configure
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
