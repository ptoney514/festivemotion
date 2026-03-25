import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Safety & Usage Guidelines | FestiveMotion",
  description:
    "Safety guidelines, maintenance tips, and warranty information for FestiveMotion animatronics.",
};

type GuidelineSection = {
  id: string;
  eyebrow: string;
  title: string;
  icon: React.ReactNode;
  items: string[];
  accent?: boolean;
};

const sections: GuidelineSection[] = [
  {
    id: "setup",
    eyebrow: "Before You Power On",
    title: "Setup & Operation",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-5 text-[#ff5a1f]">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>
    ),
    items: [
      "Ensure the skull is centered and in the down position before powering on.",
      "Ensure skull movement remains unobstructed.",
      "Maintain at least 10.2 cm (4 inches) of clearance on all vented sides for proper ventilation.",
      "Avoid stacking equipment or placing units too close together.",
      "Never lift or carry the unit by the neck mechanism — always use the base.",
      "Place the base on a flat, stable surface before operation.",
    ],
  },
  {
    id: "electrical",
    eyebrow: "Power & Wiring",
    title: "Electrical Safety",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-5 text-[#ff5a1f]">
        <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
      </svg>
    ),
    items: [
      "Keep all cables away from foot traffic and pinch points.",
      "Connect all cables to their correct connectors before powering on.",
      "Use only the connectors supplied or approved by FestiveMotion.",
      "Do not operate during electrical storms or power surges.",
      "Do NOT plug the PIR cable into the Audio jack.",
      "Avoid plugging or unplugging the PIR device while the unit is powered.",
      "Disconnect power before connecting or disconnecting any cables.",
      "Periodically touch unpainted metal on the unit to discharge static electricity.",
    ],
  },
  {
    id: "environment",
    eyebrow: "Operating Conditions",
    title: "Environmental Conditions",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-5 text-[#ff5a1f]">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z" />
      </svg>
    ),
    items: [
      "Operating temperature range: 32 °F to 100 °F (0 °C to 38 °C).",
      "Unsuitable for wet environments such as bathrooms, pools, or damp basements.",
      "Avoid soft surfaces like beds, sofas, and carpets.",
      "Keep away from radiators, heat sources, and direct sunlight.",
      "Store in a cool, dry location.",
      "Indoor use recommended; outdoor use requires weatherproofing accessories.",
    ],
  },
  {
    id: "cleaning",
    eyebrow: "Care Instructions",
    title: "Cleaning & Maintenance",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-5 text-[#ff5a1f]">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
      </svg>
    ),
    items: [
      "Always disconnect power before cleaning.",
      "Use a soft, dry cloth; dampen with water only if needed.",
      "Do not spray liquids or aerosol cleaners directly on the unit.",
      "Prevent food or liquid spills on or near the unit.",
      "Do not insert objects into any openings.",
      "No user-serviceable parts inside — do not attempt internal repairs.",
      "Inspect cables and connectors periodically for wear.",
    ],
  },
  {
    id: "storage",
    eyebrow: "Off-Season Care",
    title: "Storage Guidelines",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-5 text-[#ff5a1f]">
        <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
      </svg>
    ),
    items: [
      "Store on its side with bubble-wrap cushioning around the head.",
      "Place a 3″ x 5″ piece of cardboard under the jaw when storing upright.",
      "Maintain the skull in a neutral position during storage.",
      "Remove batteries from remotes if storing for 6+ months.",
      "Avoid prolonged UV exposure.",
      "Use the original packaging or a fitted road case when possible.",
    ],
  },
  {
    id: "painting",
    eyebrow: "DIY Customization",
    title: "Painting & Customization",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-5 text-[#ff5a1f]">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
      </svg>
    ),
    items: [
      "Use flat (non-glossy) acrylic paint only.",
      "Do not paint over sensor lenses, LED apertures, or speaker grilles.",
      "Protect all cable connectors with painter's tape before spraying.",
      "Allow paint to dry and cure fully before powering on.",
      "Test all functions after painting to confirm nothing was obstructed.",
    ],
  },
  {
    id: "warranty",
    eyebrow: "Your Coverage",
    title: "Warranty Coverage",
    accent: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-5 text-[#ff5a1f]">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
    items: [
      "2-year limited warranty on manufacturing defects.",
      "Covers manufacturing defects and normal wear under standard use.",
      "$60 evaluation fee for out-of-warranty service requests.",
      "$15/hr labor rate for repairs beyond warranty.",
      "10-day arrival guarantee — free replacement for shipping damage.",
      "Typical turnaround time is approximately two weeks.",
      "Customer is responsible for return shipping costs.",
      "Warranty does not cover damage from misuse, unauthorized modification, or natural disasters.",
    ],
  },
];

export default function SafetyPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8">
        {/* ─── Hero ─── */}
        <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] p-8 sm:p-12">
          <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,_rgba(255,90,31,0.14),_transparent_60%)]" />
          <div className="relative">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ffb089]">
              Product Care
            </p>
            <h1 className="mt-4 font-display text-5xl font-semibold tracking-[-0.06em] text-white sm:text-6xl">
              Safety &amp; Usage Guidelines
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-white/65">
              Keep your FestiveMotion animatronics performing at their best.
              These guidelines cover setup, electrical safety, care, storage,
              customization, and your warranty coverage.
            </p>
          </div>
        </section>

        {/* ─── Guideline Cards ─── */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className={`rounded-[28px] border p-6 sm:p-8 ${
                section.accent
                  ? "border-[#ff5a1f]/20 bg-[#ff5a1f]/[0.03] md:col-span-2"
                  : "border-white/10 bg-white/[0.03]"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#ff5a1f]/10">
                  {section.icon}
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ffb089]">
                    {section.eyebrow}
                  </p>
                  <h2 className="mt-1.5 font-display text-xl font-semibold tracking-[-0.03em] text-white">
                    {section.title}
                  </h2>
                </div>
              </div>
              <ul className="mt-5 space-y-3 pl-14">
                {section.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm leading-7 text-white/60"
                  >
                    <span className="mt-2.5 block size-1.5 shrink-0 rounded-full bg-[#ff5a1f]/50" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        {/* ─── CTA ─── */}
        <section className="mt-10 flex flex-col items-center gap-5 rounded-[32px] border border-white/10 bg-white/[0.03] p-8 text-center sm:p-12">
          <p className="text-sm leading-8 text-white/65">
            Questions about setup, care, or warranty? Our team is here to help.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-[#ff5a1f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#ff6d39]"
            >
              Contact Support
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.04]"
            >
              Explore Products
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
