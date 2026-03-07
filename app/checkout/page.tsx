import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CheckoutForm } from "@/components/checkout-form";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your FestiveMotion order. Review your cart, enter shipping details, and pay securely with Stripe.",
};

export default function CheckoutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#0f0f0f] text-white">
      <SiteHeader />
      <main className="flex-1">
        <CheckoutForm />
      </main>
      <SiteFooter />
    </div>
  );
}
