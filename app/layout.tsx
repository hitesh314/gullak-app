import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

export const metadata: Metadata = {
  title: "gullak.online — Savings Tracker",
  description: "Track your savings goals with gullak.online",
  viewport: {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={hanken.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
