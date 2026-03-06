import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Why FestiveMotion",
  description:
    "30+ years of haunted-industry experience distilled into commercial-grade animatronics. Meet the founder, explore SkullTronix technology, and see where FestiveMotion performs.",
};

const techFeatures = [
  {
    title: "Hyper-Realistic Motion",
    eyebrow: "Three-Axis System",
    description:
      "SkullTronix delivers jaw, nod, and tilt movement plus full neck rotation for lifelike head tracking that convinces audiences at close range.",
    icon: "/figma/pdp/highlight-motion.svg",
    wide: true,
  },
  {
    title: "Smart Control",
    eyebrow: "Raspberry Pi Powered",
    description:
      "On-board Raspberry Pi handles routine playback, sensor triggers, and remote control with zero external hardware required.",
    icon: "/figma/pdp/support-parts.svg",
    wide: false,
  },
  {
    title: "Ready to Perform",
    eyebrow: "Plug & Play",
    description:
      "Four pre-loaded routines ship with every unit. Unbox, plug in, and you have a show-ready animatronic in minutes.",
    icon: "/figma/pdp/support-ready.svg",
    wide: false,
  },
  {
    title: "Crystal-Clear Sound",
    eyebrow: "Integrated Audio",
    description:
      "Built-in speakers with precision lip-sync playback deliver perfectly timed dialogue and ambient audio without external equipment.",
    icon: "/figma/pdp/support-talk.svg",
    wide: false,
  },
  {
    title: "Expressive LED Lighting",
    eyebrow: "Multi-Color Glow",
    description:
      "Programmable LED eyes with adjustable color, brightness, and animation patterns bring each character to life in any lighting condition.",
    icon: "/figma/pdp/highlight-glow.svg",
    wide: false,
  },
  {
    title: "Precision Engineering",
    eyebrow: "Commercial Grade",
    description:
      "3D-printed components on a reinforced steel frame deliver the durability demanded by nightly commercial use, season after season.",
    icon: "/figma/pdp/support-warranty.svg",
    wide: true,
  },
];

const useCases = [
  {
    title: "Haunted Houses",
    description:
      "Anchor props that deliver consistent, high-impact scares every night of the season without operator fatigue.",
    icon: "/figma/industry-haunted.svg",
    wide: true,
  },
  {
    title: "Theme Parks",
    description:
      "Commercial-grade builds rated for continuous daily operation in high-traffic guest environments.",
    icon: "/figma/industry-theme.svg",
    wide: false,
  },
  {
    title: "Halloween Displays",
    description:
      "Yard and retail displays that draw crowds and create shareable moments season after season.",
    icon: "/figma/industry-haunted.svg",
    wide: false,
  },
  {
    title: "Entertainment Venues",
    description:
      "Interactive animatronics that add unforgettable atmosphere to bars, restaurants, and event spaces.",
    icon: "/figma/industry-theme.svg",
    wide: false,
  },
  {
    title: "Film & Theater",
    description:
      "Programmable motion and lip-sync that integrate seamlessly into live-action and on-camera productions.",
    icon: "/figma/industry-film.svg",
    wide: false,
  },
  {
    title: "Escape Rooms",
    description:
      "Trigger-based reveals and tightly staged moments that elevate puzzle-solving into a fully immersive experience.",
    icon: "/figma/industry-escape.svg",
    wide: true,
  },
];

const stats = [
  { value: "30+", label: "Years Experience" },
  { value: "100%", label: "Unique Designs" },
  { value: "24/7", label: "Commercial-Grade" },
  { value: "Global", label: "Worldwide Shipping" },
];

const values = [
  {
    number: "01",
    title: "Macabre-Charming Creativity",
    description:
      "Every character balances the unsettling with the inviting, creating pieces that fascinate audiences instead of simply shocking them.",
  },
  {
    number: "02",
    title: "Technical Mastery",
    description:
      "Three decades of mechanical, electronic, and software engineering converge in every SkullTronix unit we ship.",
  },
  {
    number: "03",
    title: "Show-Stopping Performance",
    description:
      "We design for the reaction. Every movement, light cue, and audio track is tuned to make people stop, stare, and come back.",
  },
  {
    number: "04",
    title: "Built to Last",
    description:
      "Commercial-grade materials and reinforced construction mean our animatronics perform reliably season after season.",
  },
];

export default function WhyFestiveMotionPage() {
  return (
    <>
      <SiteHeader />
      <main>
        {/* ─── Section 1: Hero ─── */}
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_top,_rgba(255,90,31,0.28),_transparent_58%)]" />
          <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_center,_rgba(255,120,60,0.16),_transparent_60%)] blur-3xl" />

          <div className="mx-auto grid max-w-[1280px] items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
            <div className="relative z-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ffb089]">
                About FestiveMotion
              </p>
              <h1 className="mt-5 font-display text-5xl font-semibold tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">
                Why FestiveMotion
              </h1>
              <p className="mt-4 text-2xl font-semibold tracking-[-0.05em] text-[#ffd7c5] sm:text-3xl">
                30+ years turning the haunted industry inside out.
              </p>
              <p className="mt-6 max-w-xl text-base leading-8 text-white/68">
                From a garage workshop in Omaha to stages worldwide,
                FestiveMotion builds the animatronics that anchor haunted
                attractions, escape rooms, and immersive entertainment. Every
                unit is designed, assembled, and tested by our team.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center rounded-full bg-[#ff5a1f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#ff6d39]"
                >
                  Explore Products
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.04]"
                >
                  Get in Touch
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-x-[12%] bottom-6 h-24 rounded-full bg-[#ff6d39]/30 blur-3xl" />
              <div className="relative mx-auto max-w-[540px] overflow-hidden rounded-[40px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(8,8,8,0.16))] p-4 shadow-[0_35px_100px_rgba(0,0,0,0.52)]">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] bg-[radial-gradient(circle_at_top,_rgba(255,119,54,0.14),_transparent_48%),linear-gradient(180deg,#081119,#040404)]">
                  <Image
                    src="/products/dancing-pumpkin-hero.webp"
                    alt="SkullTronix Dancing Pumpkin animatronic showcasing FestiveMotion craftsmanship."
                    fill
                    priority
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                </div>
              </div>
              <div className="pointer-events-none absolute -left-6 bottom-16 hidden lg:block">
                <div className="relative size-[140px] overflow-hidden rounded-[20px] border border-white/10 bg-black/60 shadow-2xl">
                  <Image
                    src="/figma/product-ghost.png"
                    alt="Ghost animatronic"
                    fill
                    className="object-cover"
                    sizes="140px"
                  />
                </div>
              </div>
              <div className="pointer-events-none absolute -right-4 top-20 hidden lg:block">
                <div className="relative size-[120px] overflow-hidden rounded-[20px] border border-white/10 bg-black/60 shadow-2xl">
                  <Image
                    src="/figma/product-clown.png"
                    alt="Clown animatronic"
                    fill
                    className="object-cover"
                    sizes="120px"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Section 2: Origin Story ─── */}
        <section className="border-b border-white/10 bg-white/[0.02]">
          <div className="mx-auto grid max-w-[1280px] gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.6fr_1fr] lg:gap-16 lg:px-8 lg:py-24">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ffb089]">
                The Origin
              </p>
              <p className="mt-6 font-display text-7xl font-semibold tracking-[-0.06em] text-white sm:text-8xl lg:text-9xl">
                30<span className="text-[#ff5a1f]">+</span>
              </p>
              <p className="mt-2 text-lg font-medium text-white/60">
                Years in the haunted industry
              </p>
              <div className="mt-8 rounded-[22px] border border-white/10 bg-white/[0.03] p-6">
                <p className="text-base font-semibold text-white">
                  Jerry Jewell
                </p>
                <p className="mt-1 text-sm text-white/60">
                  Founder & Lead Designer
                </p>
                <p className="mt-1 text-sm text-white/40">Omaha, NE</p>
              </div>
            </div>

            <div>
              <h2 className="font-display text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
                What started in a garage became an industry.
              </h2>
              <p className="mt-6 text-base leading-8 text-white/68">
                Jerry Jewell built his first animatronic prop more than three
                decades ago, driven by a simple obsession: make people stop in
                their tracks. What began as a passion project for local haunted
                houses evolved into a full-scale design and manufacturing
                operation serving commercial attractions across the country.
              </p>
              <p className="mt-4 text-base leading-8 text-white/68">
                Every FestiveMotion product carries that original
                garage-workshop DNA. We still prototype by hand, test under real
                show conditions, and refuse to ship anything that doesn&apos;t
                earn a genuine reaction. The tools have changed. The standard
                hasn&apos;t.
              </p>
              <p className="mt-6 border-l-2 border-[#ff5a1f]/40 pl-5 text-lg italic text-white/50">
                &ldquo;If it doesn&apos;t make someone gasp, grab a friend, or
                pull out their phone, it&apos;s not ready to ship.&rdquo;
              </p>
            </div>
          </div>
        </section>

        {/* ─── Section 3: Technology Showcase ─── */}
        <section className="border-b border-white/10">
          <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ffb089]">
                SkullTronix Technology
              </p>
              <h2 className="mt-4 font-display text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
                The tech behind the terror.
              </h2>
              <p className="mt-4 text-base leading-8 text-white/60">
                Our proprietary SkullTronix three-axis drive system combines
                mechanical precision with smart electronics to produce
                animatronics that move, speak, and react with uncanny realism.
              </p>
            </div>

            <div className="relative mx-auto mt-12 max-w-[380px]">
              <div className="absolute inset-x-[12%] bottom-4 h-16 rounded-full bg-[#ff6d39]/25 blur-3xl" />
              <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(8,8,8,0.12))] p-3">
                <div className="relative aspect-square overflow-hidden rounded-[24px] bg-[radial-gradient(circle_at_top,_rgba(255,119,54,0.12),_transparent_48%),linear-gradient(180deg,#0a0e12,#040404)]">
                  <Image
                    src="/figma/product-zombie.png"
                    alt="SkullTronix zombie animatronic showcasing three-axis movement."
                    fill
                    className="object-cover object-center"
                    sizes="380px"
                  />
                </div>
              </div>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {techFeatures.map((feature) => (
                <article
                  key={feature.title}
                  className={`rounded-[28px] border border-white/10 bg-white/[0.03] p-6${
                    feature.wide ? " lg:col-span-2" : ""
                  }`}
                >
                  <div className="flex size-10 items-center justify-center rounded-full bg-[#ff5a1f]/10">
                    <Image
                      src={feature.icon}
                      alt=""
                      width={20}
                      height={20}
                    />
                  </div>
                  <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ffb089]">
                    {feature.eyebrow}
                  </p>
                  <h3 className="mt-2 font-display text-xl font-semibold tracking-[-0.03em] text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-white/60">
                    {feature.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Section 4: Stats Bar ─── */}
        <section className="border-b border-white/10 bg-white/[0.02]">
          <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-8 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm font-medium text-white/50">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Section 5: Use Cases ─── */}
        <section className="border-b border-white/10">
          <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ffb089]">
              Built for Every Stage
            </p>
            <h2 className="mt-4 font-display text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
              Where FestiveMotion performs.
            </h2>

            <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {useCases.map((useCase) => (
                <article
                  key={useCase.title}
                  className={`rounded-[28px] border border-white/10 bg-white/[0.03] p-6 transition hover:border-white/20 hover:bg-white/[0.05]${
                    useCase.wide ? " lg:col-span-2" : ""
                  }`}
                >
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-[#ff5a1f]/10">
                    <Image
                      src={useCase.icon}
                      alt=""
                      width={24}
                      height={24}
                    />
                  </div>
                  <h3 className="mt-4 font-display text-xl font-semibold tracking-[-0.03em] text-white">
                    {useCase.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-white/60">
                    {useCase.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Section 6: Values & Mission ─── */}
        <section className="border-b border-white/10 bg-white/[0.02]">
          <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ffb089]">
                Our Mission
              </p>
              <blockquote className="mt-6 font-display text-3xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
                &ldquo;Create unforgettably haunting experiences through
                innovative animatronic technology.&rdquo;
              </blockquote>
              <p className="mt-6 text-sm font-medium text-white/40">
                &mdash; Jerry Jewell, Founder
              </p>
            </div>

            <div className="mt-16 grid gap-4 sm:grid-cols-2">
              {values.map((value, i) => (
                <article
                  key={value.title}
                  className={`rounded-[28px] border border-white/10 bg-white/[0.03] p-6${
                    i % 2 === 1 ? " md:translate-y-6" : ""
                  }`}
                >
                  <p className="font-display text-5xl font-bold text-[#ff5a1f]/20">
                    {value.number}
                  </p>
                  <h3 className="mt-3 font-display text-xl font-semibold tracking-[-0.03em] text-white">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-white/60">
                    {value.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Section 7: CTA ─── */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-x-0 bottom-0 h-56 bg-[radial-gradient(circle_at_bottom,_rgba(255,90,31,0.22),_transparent_58%)]" />
          <div className="relative mx-auto flex max-w-[1280px] flex-col gap-10 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-24">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ffb089]">
                Let&apos;s Build Something
              </p>
              <h2 className="mt-4 max-w-[16ch] font-display text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
                Ready to bring your vision to life?
              </h2>
            </div>
            <div className="max-w-lg">
              <p className="text-base leading-8 text-white/65">
                Whether you&apos;re outfitting a haunted attraction, designing
                an escape room centerpiece, or launching a seasonal display,
                we&apos;ll help you find the right animatronic for the job.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center rounded-full bg-[#ff5a1f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#ff6d39]"
                >
                  Explore Products
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.04]"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
