"use client";

import { useActionState, useRef, useState } from "react";

type FormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[#ff5a1f] focus:outline-none focus:ring-1 focus:ring-[#ff5a1f]";

async function submitContactForm(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const body = {
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  };

  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return { status: "error", message: data.error ?? "Something went wrong." };
    }

    return { status: "success" };
  } catch {
    return { status: "error", message: "Network error. Please try again." };
  }
}

export function ContactForm() {
  const [formKey, setFormKey] = useState(0);

  return <ContactFormInner key={formKey} onReset={() => setFormKey((k) => k + 1)} />;
}

function ContactFormInner({ onReset }: { onReset: () => void }) {
  const [state, action, isPending] = useActionState(submitContactForm, {
    status: "idle" as const,
  });
  const formRef = useRef<HTMLFormElement>(null);

  if (state.status === "success") {
    return (
      <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8" id="contact-form">
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-[#ff5a1f]/10">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ff5a1f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h3 className="font-display text-2xl font-semibold tracking-[-0.04em] text-white">
            Message sent!
          </h3>
          <p className="max-w-md text-sm leading-7 text-white/65">
            Thanks for reaching out. We typically respond within 24 hours. Check your inbox
            for a reply from our team.
          </p>
          <button
            type="button"
            onClick={onReset}
            className="mt-2 inline-flex items-center justify-center rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/20"
          >
            Send another message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8" id="contact-form">
      <h2 className="font-display text-2xl font-semibold tracking-[-0.04em] text-white">
        Send us a message
      </h2>
      <p className="mt-2 text-sm leading-7 text-white/65">
        Fill out the form below and we&apos;ll get back to you within 24 hours.
      </p>

      {state.status === "error" && (
        <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {state.message}
        </div>
      )}

      <form ref={formRef} action={action} className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-name" className="sr-only">Name</label>
            <input
              id="contact-name"
              type="text"
              name="name"
              placeholder="Name"
              required
              maxLength={100}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="contact-email" className="sr-only">Email</label>
            <input
              id="contact-email"
              type="email"
              name="email"
              placeholder="Email"
              required
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="contact-subject" className="sr-only">Subject</label>
          <select id="contact-subject" name="subject" defaultValue="general" className={inputClass}>
            <option value="general">General Inquiry</option>
            <option value="order-support">Order Support</option>
            <option value="custom-project">Custom Project</option>
            <option value="technical-support">Technical Support</option>
          </select>
        </div>

        <div>
          <label htmlFor="contact-message" className="sr-only">Message</label>
          <textarea
            id="contact-message"
            name="message"
            placeholder="Your message..."
            required
            minLength={10}
            maxLength={5000}
            rows={5}
            className={inputClass + " resize-none"}
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center rounded-full bg-[#ff5a1f] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_40px_rgba(255,90,31,0.35)] transition hover:bg-[#e04f1a] disabled:opacity-60"
        >
          {isPending ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}
