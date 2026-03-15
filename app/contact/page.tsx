import Image from "next/image";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ContactForm } from "@/components/contact-form";

export const metadata = {
  title: "Contact | FestiveMotion",
  description: "Get in touch with the FestiveMotion team for sales, support, or custom project inquiries.",
};

const faqs = [
  {
    question: "What are your shipping lead times?",
    answer:
      "Standard animatronic builds ship within 4-6 weeks. Rush builds (2-3 weeks) are available for an additional fee. Accessories and add-ons typically ship within 5-7 business days.",
  },
  {
    question: "Can I customize my animatronic beyond the options listed?",
    answer:
      "Absolutely. Use the 'Custom Project' subject in the form above to describe your vision. We handle everything from custom paint schemes to fully bespoke character builds for haunted attractions and themed environments.",
  },
  {
    question: "What warranty do your products carry?",
    answer:
      "All FestiveMotion animatronics include a 2-year warranty covering manufacturing defects in mechanical and electronic components. Extended warranty plans are available at checkout.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Yes. We ship to most countries worldwide. International orders may be subject to additional duties and customs fees, which are the responsibility of the buyer. Contact us for a shipping quote.",
  },
  {
    question: "How do I set up and install my animatronic?",
    answer:
      "Every order ships with a printed setup guide and QR code linking to video tutorials. Most units are plug-and-play with a standard 110V outlet. For permanent installations, we recommend consulting with a licensed electrician.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, Mastercard, American Express, Discover) through Stripe. For orders over $5,000, we also offer wire transfer and purchase order options for verified businesses.",
  },
  {
    question: "What is your return policy?",
    answer:
      "Accessories and add-ons can be returned within 30 days in unused condition. Custom-built animatronics are non-refundable once production has begun, but we'll work with you to resolve any issues with your build.",
  },
  {
    question: "Do you offer bulk or commercial pricing?",
    answer:
      "Yes. We offer volume discounts for orders of 3+ units and special pricing for theme parks, escape rooms, and haunted attraction operators. Reach out via the contact form or call us to discuss your project.",
  },
];

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-[960px] px-4 py-20 sm:px-6 lg:px-8">
        {/* Hero */}
        <section className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8 text-center">
          <div className="mx-auto mb-6">
            <Image
              src="/images/FestiveMotion_Logo_COLOR_TAG.avif"
              alt="FestiveMotion — Bringing Holidays to Life"
              width={250}
              height={188}
              className="mx-auto h-auto w-[180px] sm:w-[220px]"
              priority
            />
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ffb089]">
            Support
          </p>
          <h1 className="mt-3 font-display text-5xl font-semibold tracking-[-0.06em] text-white">
            We&apos;re here to help.
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-white/65">
            Check the FAQs below for quick answers. Need something else? Send us a message
            and we&apos;ll respond within 24 hours.
          </p>
        </section>

        {/* Contact Cards */}
        <section className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col items-center gap-3 rounded-[32px] border border-white/10 bg-white/[0.03] p-8 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-[#ff5a1f]/10">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff5a1f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-white">info@festivemotion.com</p>
            <p className="text-xs text-white/45">24-hour response</p>
            <a
              href="#contact-form"
              className="mt-1 inline-flex items-center justify-center rounded-full bg-[#ff5a1f] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_40px_rgba(255,90,31,0.35)] transition hover:bg-[#e04f1a]"
            >
              Send a Message
            </a>
          </div>

          <div className="flex flex-col items-center gap-3 rounded-[32px] border border-white/10 bg-white/[0.03] p-8 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-[#ff5a1f]/10">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff5a1f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-white">+1 402 253 1991</p>
            <p className="text-xs text-white/45">Mon–Fri 9am–5pm CT</p>
            <a
              href="tel:4022531991"
              className="mt-1 inline-flex items-center justify-center rounded-full border border-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-white/20"
            >
              Call Now
            </a>
          </div>
        </section>

        {/* Contact Form */}
        <section className="mt-8">
          <ContactForm />
        </section>

        {/* FAQ Accordion */}
        <section className="mt-8 rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ffb089]">
            FAQ
          </p>
          <h2 className="mt-3 font-display text-2xl font-semibold tracking-[-0.04em] text-white">
            Frequently asked questions
          </h2>

          <div className="mt-6 space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-white/10 bg-black/20 px-5 py-4"
              >
                <summary className="flex cursor-pointer items-center justify-between text-sm font-medium text-white marker:[content:''] [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="shrink-0 text-white/40 transition-transform group-open:rotate-180"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </summary>
                <p className="mt-3 text-sm leading-7 text-white/65">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
