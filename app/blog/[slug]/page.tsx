import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/blog";

const APP_URL = "https://gullak.online";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: `${APP_URL}/blog/${post.slug}` },
    openGraph: {
      type: "article",
      url: `${APP_URL}/blog/${post.slug}`,
      title: post.title,
      description: post.description,
      publishedTime: post.dateISO,
      authors: ["Gullak.Online"],
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: ["/og-image.png"],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.dateISO,
    dateModified: post.dateISO,
    author: {
      "@type": "Organization",
      name: "Gullak.Online",
      url: APP_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Gullak.Online",
      url: APP_URL,
      logo: { "@type": "ImageObject", url: `${APP_URL}/icon-512.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${APP_URL}/blog/${post.slug}` },
    image: `${APP_URL}/og-image.png`,
    url: `${APP_URL}/blog/${post.slug}`,
    inLanguage: "en-IN",
    keywords: post.keywords.join(", "),
  };

  const allPosts = getAllPosts().filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F5EDD8" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[#C2955A]/20 bg-[#F5EDD8]/90 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 text-slate-800 font-extrabold text-lg tracking-tight hover:opacity-80 transition-opacity">
            Gullak<span className="text-[#C2955A]">.Online</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/blog" className="text-sm text-slate-500 hover:text-slate-800 transition-colors">
              ← Blog
            </Link>
            <Link
              href="/"
              className="text-sm font-semibold text-[#C2955A] hover:text-[#A67840] transition-colors"
            >
              Open App →
            </Link>
          </div>
        </div>
      </header>

      {/* Article */}
      <main className="max-w-2xl mx-auto px-6 pt-10 pb-16 w-full flex-1">
        {/* Breadcrumb */}
        <nav className="text-xs text-slate-400 mb-6 flex items-center gap-1.5" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#C2955A] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-[#C2955A] transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-slate-500 truncate max-w-[200px]">{post.title}</span>
        </nav>

        {/* Post header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs text-slate-400">{post.date}</span>
            <span className="text-slate-200">·</span>
            <span className="text-xs text-slate-400">{post.readTime}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-800 leading-snug tracking-tight">
            {post.title}
          </h1>
          <p className="text-sm text-slate-500 mt-3 leading-relaxed">{post.description}</p>
          <div className="mt-4 h-px bg-[#C2955A]/20" />
        </header>

        {/* Post content */}
        <article>
          <post.Content />
        </article>

        {/* Author / attribution */}
        <div className="mt-10 pt-6 border-t border-[#C2955A]/20 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#C2955A]/20 flex items-center justify-center text-lg flex-shrink-0">
            🐷
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">Gullak.Online</p>
            <p className="text-xs text-slate-400">Free personal savings tracker for India</p>
          </div>
        </div>
      </main>

      {/* Related posts */}
      {allPosts.length > 0 && (
        <section className="max-w-2xl mx-auto px-6 pb-16 w-full">
          <h2 className="text-base font-extrabold text-slate-800 mb-4">More from the blog</h2>
          <div className="flex flex-col gap-4">
            {allPosts.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group bg-white/70 hover:bg-white rounded-2xl px-5 py-4 border border-white/80 hover:border-[#C2955A]/30 transition-all"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-slate-400">{p.date}</span>
                  <span className="text-slate-200">·</span>
                  <span className="text-xs text-slate-400">{p.readTime}</span>
                </div>
                <p className="text-sm font-bold text-slate-800 group-hover:text-[#C2955A] transition-colors leading-snug">
                  {p.title}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

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
