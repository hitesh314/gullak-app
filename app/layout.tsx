import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

const APP_URL = "https://gullak.online";

const jsonLdWebApplication = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": `${APP_URL}/#webapp`,
  name: "Gullak.Online",
  alternateName: ["Gullak", "Gullak Online", "Digital Piggy Bank"],
  url: APP_URL,
  description:
    "Gullak.Online is a free personal savings tracker for India. Set savings goals, plan monthly contributions, and watch your piggy bank fill up — one rupee at a time.",
  applicationCategory: "FinanceApplication",
  applicationSubCategory: "Personal Finance",
  operatingSystem: "All",
  browserRequirements: "Requires JavaScript. Requires HTML5.",
  inLanguage: "en-IN",
  isAccessibleForFree: true,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "INR",
    availability: "https://schema.org/InStock",
    description: "Free forever — no subscription, no hidden charges.",
  },
  author: {
    "@type": "Organization",
    "@id": `${APP_URL}/#organization`,
    name: "Gullak.Online",
    url: APP_URL,
  },
  potentialAction: [
    {
      "@type": "UseAction",
      target: APP_URL,
    },
    {
      "@type": "ViewAction",
      target: APP_URL,
      name: "Open Gullak.Online",
    },
  ],
  featureList: [
    "Create unlimited savings goals",
    "Visual piggy bank with fill animation",
    "Monthly savings planner",
    "Deposit and withdraw tracking",
    "Monthly contribution history chart",
    "Google Sign-In",
    "Private and secure — your data is only visible to you",
    "Free to use, no subscription required",
  ],
  screenshot: `${APP_URL}/og-image.png`,
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5",
    bestRating: "5",
    worstRating: "1",
    ratingCount: "1",
  },
};

const jsonLdOrganization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${APP_URL}/#organization`,
  name: "Gullak.Online",
  url: APP_URL,
  logo: {
    "@type": "ImageObject",
    url: `${APP_URL}/icon-512.png`,
    width: 512,
    height: 512,
  },
  description:
    "Gullak.Online builds simple, private, and beautiful personal finance tools for India.",
  sameAs: [],
};

const jsonLdWebSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${APP_URL}/#website`,
  name: "Gullak.Online",
  url: APP_URL,
  description:
    "Free personal savings tracker for India. Set savings goals, track contributions, and watch your gullak fill up.",
  inLanguage: "en-IN",
  publisher: {
    "@id": `${APP_URL}/#organization`,
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${APP_URL}/?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const jsonLdFAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is Gullak.Online?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Gullak.Online is a free personal savings tracker made for India. You can create savings goals (called gullaks), set a target amount and date, plan monthly contributions, deposit money towards your goal, and visualise your progress with a beautiful animated piggy bank.",
      },
    },
    {
      "@type": "Question",
      name: "Is Gullak.Online free to use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Gullak.Online is completely free. There are no subscriptions, no hidden fees, and no premium tiers. You can create and track unlimited savings goals at no cost.",
      },
    },
    {
      "@type": "Question",
      name: "Is my savings data private?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. Your savings goals and data are private and only visible to you. Gullak.Online uses Google Sign-In for secure authentication and stores your data securely with Supabase. No one else can see your goals.",
      },
    },
    {
      "@type": "Question",
      name: "How does the monthly savings planner work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "When you create a savings goal, you set a target amount and a target date. Gullak.Online automatically calculates how much you need to save each month to reach your goal on time. You can choose to divide equally across months or set a custom monthly amount.",
      },
    },
    {
      "@type": "Question",
      name: "What is a gullak?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A gullak (गुल्लक) is the Hindi word for piggy bank — a small container used to save coins and money. Gullak.Online digitises this concept: each savings goal is a digital gullak that fills up as you deposit money towards your target.",
      },
    },
    {
      "@type": "Question",
      name: "Can I track multiple savings goals at once?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! You can create and manage multiple gullaks simultaneously — one for an emergency fund, one for a vacation, one for a new gadget, and so on. Each goal has its own piggy bank, progress tracker, and monthly plan.",
      },
    },
    {
      "@type": "Question",
      name: "Does Gullak.Online work on mobile?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Gullak.Online is a fully responsive web app that works beautifully on all devices — mobile, tablet, and desktop. It can also be installed as a Progressive Web App (PWA) on your phone for a native app-like experience.",
      },
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  applicationName: "Gullak.Online",
  title: {
    default: "Gullak.Online — Free Personal Savings Tracker for India",
    template: "%s | Gullak.Online",
  },
  description:
    "Gullak.Online is a free personal savings tracker made for India. Set savings goals, plan monthly contributions, and watch your digital piggy bank fill up — one rupee at a time. Private, beautiful, and completely free.",
  keywords: [
    "gullak",
    "gullak online",
    "savings tracker",
    "savings tracker India",
    "savings goals app",
    "personal finance India",
    "money savings app India",
    "piggy bank app",
    "digital piggy bank",
    "online piggy bank India",
    "budget planner India",
    "monthly savings planner",
    "rupee savings tracker",
    "free savings app India",
    "savings goal tracker",
    "financial planning India",
    "emergency fund tracker",
    "money goal tracker",
    "personal savings manager",
    "savings contribution tracker",
    "save money app India",
    "goal based savings",
    "savings progress tracker",
    "गुल्लक",
    "पिगी बैंक ऐप",
    "बचत लक्ष्य",
    "monthly contribution planner",
    "target savings tracker",
    "financial goal app",
    "free finance app India",
  ],
  authors: [{ name: "Gullak.Online", url: APP_URL }],
  creator: "Gullak.Online",
  publisher: "Gullak.Online",
  category: "Finance",
  classification: "Personal Finance, Savings Tracker, Budgeting",
  alternates: {
    canonical: APP_URL,
    languages: {
      "en-IN": APP_URL,
      "en": APP_URL,
    },
  },
  openGraph: {
    type: "website",
    url: APP_URL,
    siteName: "Gullak.Online",
    title: "Gullak.Online — Free Personal Savings Tracker for India",
    description:
      "Set savings goals, plan monthly contributions, and watch your digital gullak fill up. Simple, beautiful, private, and completely free — made for India.",
    locale: "en_IN",
    alternateLocale: ["en_US", "hi_IN"],
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Gullak.Online — Free Personal Savings Tracker for India",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gullak.Online — Free Personal Savings Tracker for India",
    description:
      "Set savings goals, plan monthly contributions, and watch your gullak fill up. Free digital piggy bank made for India.",
    images: [{ url: "/og-image.png", alt: "Gullak.Online savings tracker" }],
    creator: "@gullak_online",
    site: "@gullak_online",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
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
  other: {
    "geo.region": "IN",
    "geo.placename": "India",
    "DC.language": "en-IN",
    "DC.title": "Gullak.Online — Free Personal Savings Tracker for India",
    "DC.description":
      "Free personal savings tracker for India. Set goals, plan monthly contributions, and watch your digital piggy bank fill up.",
    "DC.creator": "Gullak.Online",
    "DC.subject": "Personal Finance, Savings, Budgeting, India",
    "DC.type": "InteractiveResource",
    "DC.format": "text/html",
    "DC.identifier": APP_URL,
    "rating": "general",
    "revisit-after": "7 days",
    "language": "English",
    "target": "all",
    "HandheldFriendly": "True",
    "MobileOptimized": "320",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebApplication) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFAQ) }}
        />
      </head>
      <body className={hanken.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
