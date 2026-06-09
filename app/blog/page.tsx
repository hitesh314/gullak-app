import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

const APP_URL = "https://gullak.online";

export const metadata: Metadata = {
  title: "Blog — Savings Tips, Personal Finance & Money Guides for India",
  description:
    "Practical guides on saving money in India, building an emergency fund, goal-based savings, and more — from Gullak.Online, the free personal savings tracker made for India.",
  keywords: [
    "savings blog India",
    "personal finance blog India",
    "how to save money India",
    "savings tips India",
    "emergency fund India",
    "goal based savings",
    "gullak blog",
  ],
  alternates: { canonical: `${APP_URL}/blog` },
  openGraph: {
    type: "website",
    url: `${APP_URL}/blog`,
    title: "Blog — Savings Tips & Personal Finance for India | Gullak.Online",
    description:
      "Practical savings guides for Indians — emergency funds, goal-based savings, monthly contribution planning, and more.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Gullak.Online Blog" }],
  },
};

export default function BlogListPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F5EDD8" }}>
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[#C2955A]/20 bg-[#F5EDD8]/90 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 text-slate-800 font-extrabold text-lg tracking-tight hover:opacity-80 transition-opacity">
            Gullak<span className="text-[#C2955A]">.Online</span>
          </Link>
          <Link
            href="/"
            className="text-sm font-semibold text-[#C2955A] hover:text-[#A67840] transition-colors"
          >
            Open App →
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-2xl mx-auto px-6 pt-12 pb-8 w-full">
        <p className="text-xs font-semibold text-[#C2955A] uppercase tracking-widest mb-2">Blog</p>
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight leading-snug">
          Savings tips &amp; personal finance guides for India
        </h1>
        <p className="text-sm text-slate-500 mt-3 leading-relaxed">
          Practical, jargon-free articles on saving money, building an emergency fund, planning monthly
          contributions, and reaching your financial goals — written for everyday Indians.
        </p>
      </section>

      {/* Post list */}
      <main className="max-w-2xl mx-auto px-6 pb-16 w-full flex-1">
        <div className="flex flex-col gap-5">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block bg-white/70 hover:bg-white rounded-2xl px-6 py-5 border border-white/80 hover:border-[#C2955A]/30 transition-all shadow-sm hover:shadow-md"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs text-slate-400">{post.date}</span>
                <span className="text-slate-200">·</span>
                <span className="text-xs text-slate-400">{post.readTime}</span>
              </div>
              <h2 className="text-base font-bold text-slate-800 group-hover:text-[#C2955A] transition-colors leading-snug mb-2">
                {post.title}
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">{post.description}</p>
              <span className="inline-block mt-3 text-xs font-semibold text-[#C2955A] group-hover:translate-x-1 transition-transform">
                Read article →
              </span>
            </Link>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#C2955A]/15 py-6 px-6 text-center">
        <p className="text-xs text-slate-400">
          © {new Date().getFullYear()} Gullak.Online · Free personal savings tracker for India ·{" "}
          <Link href="/" className="underline hover:text-[#C2955A] transition-colors">
            Open App
          </Link>
        </p>
      </footer>
    </div>
  );
}
