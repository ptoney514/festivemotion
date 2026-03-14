import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import { CartProvider } from "@/lib/cart-context";
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
    "Modern storefront for FestiveMotion and SkullTronix products with Apple-style configuration flow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${oswald.variable} antialiased`}>
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
