import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { CartProvider } from "@/lib/cart-context";
import { SessionProvider } from "@/components/session-provider";
import { CartDrawer } from "@/components/cart-drawer";
import "./globals.css";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "FestiveMotion",
    template: "%s | FestiveMotion",
  },
  description:
    "Professional animatronics by FestiveMotion — configure and order commercial-grade skulls, pumpkins, and specialty props online.",
  openGraph: {
    title: "FestiveMotion — Professional Animatronics",
    description:
      "Configure and order commercial-grade animatronic performers for haunted attractions, escape rooms, and entertainment venues.",
    url: "https://skulltronix.festivemotion.com",
    siteName: "FestiveMotion",
    type: "website",
    images: [
      {
        url: "https://assets.smallhr.app/festivemotion/products/pro.webp",
        width: 600,
        height: 900,
        alt: "FestiveMotion - Premium Animatronic Props",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FestiveMotion — Professional Animatronics",
    description:
      "Configure and order commercial-grade animatronic performers for haunted attractions, escape rooms, and entertainment venues.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${oswald.variable} antialiased`}>
        <SessionProvider>
          <CartProvider>
            {children}
            <CartDrawer />
          </CartProvider>
        </SessionProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
