import Image from "next/image";
import Link from "next/link";

const footerColumns = [
  {
    title: "Shop",
    items: [
      { href: "/products", label: "All Products" },
      { href: "/add-ons", label: "Add-ons & Accessories" },
      { href: "/products/skulltronix-skull", label: "SkullTronix Skull" },
      { href: "/products/skulltronix-dancing-pumpkin", label: "Dancing Pumpkin" },
    ],
  },
  {
    title: "Support",
    items: [
      { href: "mailto:info@festivemotion.com", label: "Email Support" },
      { href: "tel:4022531991", label: "Call Sales" },
      { href: "/products", label: "Configure a Build" },
    ],
  },
  {
    title: "Company",
    items: [
      { href: "/", label: "About FestiveMotion" },
      { href: "https://festivemotion.com", label: "Current Site" },
      { href: "https://www.apple.com/shop/buy-mac/macbook-air", label: "UX Reference" },
    ],
  },
];

const socialLinks = [
  {
    href: "https://www.facebook.com/festivemotion/",
    label: "Facebook",
    icon: "/figma/social-facebook.svg",
  },
  {
    href: "https://www.instagram.com/skulltronixbyfestivemotion/",
    label: "Instagram",
    icon: "/figma/social-instagram.svg",
  },
  {
    href: "https://www.youtube.com/channel/UCOIq0wM_oI2X0UVn9uloRHQ",
    label: "YouTube",
    icon: "/figma/social-youtube.svg",
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#090909]">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:px-8">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-[#ff5a1f]">
              <Image src="/figma/footer-logo-mark.svg" alt="" width={18} height={18} />
            </span>
            <span className="font-display text-2xl font-bold tracking-[-0.05em] text-white">
              FESTIVE<span className="text-[#ff5a1f]">MOTION</span>
            </span>
          </div>
          <p className="max-w-xl text-sm leading-7 text-white/65">
            FestiveMotion builds commercial animatronics for haunted attractions,
            seasonal retail, immersive installations, and trade show environments.
            This rebuild replaces a WooCommerce-heavy experience with a cleaner,
            mobile-friendly configuration flow.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] transition hover:border-white/20 hover:bg-white/[0.06]"
                aria-label={link.label}
              >
                <Image src={link.icon} alt="" width={18} height={18} />
              </a>
            ))}
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-white">
                {column.title}
              </h2>
              <div className="mt-4 space-y-3">
                {column.items.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="block text-sm text-white/65 transition hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-3 px-4 py-5 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© 2026 FestiveMotion. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4">
            <a href="mailto:info@festivemotion.com" className="transition hover:text-white">
              info@festivemotion.com
            </a>
            <a href="tel:4022531991" className="transition hover:text-white">
              +1 402 253 1991
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
