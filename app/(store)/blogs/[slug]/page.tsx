import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { blogData } from "@/data/blog";
import { baseURL } from "@/lib/constant";
import Button from "@/ui/button";

export async function generateMetadata(props: PageProps<"/blogs/[slug]">) {
  const { slug } = await props.params;
  const blog = blogData.find((b) => b.slug === slug);
  if (!blog) {
    return {
      title: "Blog Not Found | Your Brand",
      description: "The blog you are looking for does not exist.",
    };
  }

  return {
    metadataBase: new URL(baseURL),
    title: blog.seo?.metaTitle || blog.title,
    description: blog.seo?.metaDescription || blog.excerpt,
    openGraph: {
      siteName: "Velle Hide Blogs",
      title: blog.seo?.ogTitle || blog.title,
      description: blog.seo?.ogDescription || blog.excerpt,
      url: `${baseURL}/blogs/${blog.slug}`,
      type: "article",
      images: [
        {
          url: blog.thumbnail,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
    },
    twitter: {
      card: blog.seo?.twitterCard || "summary_large_image",
      title: blog.title,
      description: blog.excerpt,
      images: [blog.thumbnail],
    },
    alternates: {
      canonical: `${baseURL}/blogs/${blog.slug}`,
    },
  };
}

export default async function Page(props: PageProps<"/blogs/[slug]">) {
  const { slug } = await props.params;
  const blog = blogData.find((b) => b.slug === slug);

  if (!blog) notFound();

  return (
    <article className="max-w-4xl mx-auto px-4 py-8 md:py-12 lg:py-16 space-y-10">
      {/* Blog Header */}
      <header className="space-y-4 md:space-y-6">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
          {blog.title}
        </h1>
        <div className="flex flex-wrap items-center gap-2 text-sm text-foreground-tertiary">
          <span>
            Published on{" "}
            {new Date(blog.uploadDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "numeric",
            })}
          </span>
          <span>•</span>
          <span>By {blog.author.name}</span>
          <span>•</span>
          <span>{blog.readTime}</span>
        </div>
        <div className="relative w-full h-64 md:h-96 overflow-hidden">
          <Image
            src={blog.thumbnail}
            alt={blog.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 960px"
            className="object-cover"
            priority
          />
        </div>
        <p className="text-lg md:text-xl text-foreground-tertiary leading-relaxed">
          {blog.excerpt}
        </p>
      </header>

      {/* Blog Content */}
      <div className="space-y-8 md:space-y-10">
        {blog.content?.map((section) => {
          if (section.type === "faq") {
            return (
              <section key={section.heading} className="w-full space-y-4 border-t pt-6">
                {section.heading && (
                  <h2 className="text-2xl md:text-3xl font-semibold">
                    {section.heading}
                  </h2>
                )}
                <dl className="space-y-4">
                  {section.para.map((faq) => (
                    <div key={faq.Q} className="space-y-2">
                      <dt className="font-medium text-lg">{faq.Q}</dt>
                      <dd className="leading-relaxed text-foreground-tertiary">
                        {faq.A}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            );
          }

          if (section.type === "text") {
            return (
              <section
                key={section.heading}
                className={`flex flex-col md:flex-row gap-6 md:gap-8 items-center`}
              >
                <div className={`w-full space-y-4`}>
                  {section.heading && (
                    <h2 className="text-2xl md:text-3xl font-semibold">
                      {section.heading}
                    </h2>
                  )}
                  {section.para.map((paragraph) => (
                    <p key={paragraph} className="leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            );
          }

          if (section.type === "image-text") {
            return (
              <section
                key={section.heading}
                className={`flex flex-col ${section.imageLeft ? "md:flex-row-reverse" : "md:flex-row"} gap-6 md:gap-8 items-center`}
              >
                <div className="w-full md:w-1/2 relative h-64 shadow-md">
                  <Image
                    src={section.thumbnail}
                    alt={section.heading || "Blog image"}
                    fill
                    sizes="(max-width: 768px) 70vw, 30vw"
                    className="object-cover"
                  />
                </div>
                <div className={`w-full md:w-1/2 space-y-4`}>
                  {section.heading && (
                    <h2 className="text-2xl md:text-3xl font-semibold">
                      {section.heading}
                    </h2>
                  )}
                  {section.para.map((paragraph) => (
                    <p key={paragraph} className="leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            );
          }

          return null
        })}
      </div>

      {/* Footer / Related or Back */}
      <footer className="pt-8 border-t border-border">
        <Button href="/blogs" variant="outline">
          <ChevronLeft className="w-5 h-5 mr-2" />
          Back to All Blogs
        </Button>
      </footer>
    </article>
  );
}

export async function generateStaticParams() {
  return blogData.map((p) => ({ slug: p.slug }));
}
