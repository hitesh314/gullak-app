import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

const APP_URL = "https://gullak.online";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Gullak.Online — Personal Savings Tracker",
    template: "%s | Gullak.Online",
  },
  description:
    "Gullak.Online is a beautifully simple savings tracker. Set goals, plan monthly contributions, and watch your piggy bank fill up — one rupee at a time. Free, private, and made for India.",
  keywords: [
    "savings tracker",
    "savings goals",
    "personal finance India",
    "money savings app",
    "gullak",
    "gullak online",
    "piggy bank app",
    "budget planner India",
    "monthly savings planner",
    "rupee savings tracker",
    "free savings app",
    "savings goal tracker",
    "financial planning India",
  ],
  authors: [{ name: "Gullak.Online", url: APP_URL }],
  creator: "Gullak.Online",
  publisher: "Gullak.Online",
  category: "Finance",
  openGraph: {
    type: "website",
    url: APP_URL,
    siteName: "Gullak.Online",
    title: "Gullak.Online — Personal Savings Tracker",
    description:
      "Set savings goals, plan monthly contributions, and watch your gullak fill up. Simple, beautiful, and private. Free for everyone.",
    locale: "en_IN",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Gullak.Online — Personal Savings Tracker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gullak.Online — Personal Savings Tracker",
    description:
      "Set savings goals, plan monthly contributions, and watch your gullak fill up. Free savings tracker made for India.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon-32.png",
  },
  manifest: "/manifest.json",
  viewport: {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href={APP_URL} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Gullak.Online",
              alternateName: "Gullak",
              url: APP_URL,
              description:
                "Gullak.Online is a free personal savings tracker. Set savings goals, plan monthly contributions, and watch your piggy bank fill up — one rupee at a time.",
              applicationCategory: "FinanceApplication",
              operatingSystem: "All",
              inLanguage: "en-IN",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "INR",
              },
              author: {
                "@type": "Organization",
                name: "Gullak.Online",
                url: APP_URL,
              },
              potentialAction: {
                "@type": "UseAction",
                target: APP_URL,
              },
            }),
          }}
        />
      </head>
      <body className={hanken.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
