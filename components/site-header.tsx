"use client";

import Image from "next/image";
import Link from "next/link";
import { CartButton } from "@/components/cart-button";
import { UserButton } from "@/components/user-button";

const navLinks = [
  { href: "/products", label: "Products" },
  { href: "/add-ons", label: "Add-ons" },
  { href: "/why-festivemotion", label: "Why FestiveMotion" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <>
      <div className="border-b border-white/10 bg-[#ff5a1f] px-4 py-2">
        <div className="mx-auto flex max-w-[1280px] items-center justify-center gap-2 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-white sm:text-xs sm:tracking-[0.24em]">
          <span className="sm:hidden">Built for haunts, escape rooms, and demos</span>
          <span className="hidden sm:inline">
            Built for haunted attractions, escape rooms, and trade show demos
          </span>
        </div>
      </div>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[rgba(8,8,8,0.86)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-3 px-4 py-4 sm:gap-6 sm:px-6 lg:px-8">
          <Link href="/" className="flex min-w-0 items-center">
            <Image
              src="/images/FestiveMotion_Logo_COLOR_TAG.avif"
              alt="FestiveMotion — Bringing Holidays to Life"
              width={250}
              height={188}
              className="shrink-0 h-[36px] w-auto sm:h-[42px]"
              priority
            />
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

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <a
              href="tel:4022531991"
              className="hidden rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white/80 transition hover:border-white/20 hover:text-white sm:inline-flex"
            >
              +1 402 253 1991
            </a>
            <CartButton />
            <UserButton />
          </div>
        </div>
      </header>
    </>
  );
}
