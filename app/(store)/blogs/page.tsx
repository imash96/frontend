import { Suspense } from "react";
import type { Metadata } from "next";
import { blogData } from "@/data/blog";
import BlogCard from "@/module/home/components/blog-card";
import SectionHeader from "@/module/home/components/section-header";
import Pagination from "@/module/categories/components/pagination";
import { baseURL } from "@/lib/constant";

export const metadata: Metadata = {
  title: "Our Blogs",
  description:
    "Discover the latest trends, care tips, and style inspiration from the world of leather fashion at Velle Hide.",
  alternates: {
    canonical: `${baseURL}/blog`,
  },
};

const BLOGS_PER_PAGE = 12;

export default async function Page(props: PageProps<"/blogs">) {
  const query = await props.searchParams;
  const currentPage = Number(query.page) || 1;
  const totalBlogs = blogData.length;
  const totalPages = Math.ceil(totalBlogs / BLOGS_PER_PAGE);

  const sortedBlogs = [...blogData].sort(
    (a, b) =>
      new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime(),
  );
  const start = (currentPage - 1) * BLOGS_PER_PAGE;
  const blogsToShow = sortedBlogs.slice(start, start + BLOGS_PER_PAGE);

  return (
    <SectionHeader
      title="Our Blog"
      desc="Discover the latest trends, care tips, and style inspiration from the world of leather fashion at Velle Hide."
      sectionName="Blog posts"
    >
      {/* Blog Grid */}
      {blogsToShow.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {blogsToShow.map((item) => (
            <BlogCard key={item.id} post={item} />
          ))}
        </div>
      ) : (
        <p className="text-center text-foreground-tertiary text-lg">
          No blogs available at the moment.
        </p>
      )}
      {totalPages > 1 && (
        <Suspense fallback={null}>
          <Pagination currentPage={currentPage} totalPages={totalPages} href="/blog" />
        </Suspense>
      )}
    </SectionHeader>
  );
}

export async function generateStaticParams() {
  return [];
}