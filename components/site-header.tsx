"use client";

import { useState } from "react";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            <CartButton />
            <UserButton />
            {/* Hamburger button — visible below lg */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="inline-flex items-center justify-center rounded-md p-2 text-white/70 transition hover:text-white lg:hidden"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile nav panel */}
        {mobileMenuOpen && (
          <nav className="border-t border-white/10 px-4 pb-4 pt-2 lg:hidden">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/[0.06] hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
