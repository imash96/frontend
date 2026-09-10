import type { Metadata } from "next";
import { blogData } from "@/data/blog";
import usePagination from "@/lib/hook/use-pagination";
import Pagination from "@/ui/custom/custom-pagination";
import BlogCard from "@/module/home/components/blog-card";
import SectionHeader from "@/module/home/components/section-header";

export const metadata: Metadata = {
  title: "Our Blogs",
  description:
    "Discover the latest trends, care tips, and style inspiration from the world of leather fashion at Velle Hide.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/blog`,
  },
};

export default async function Page(props: PageProps<"/blog">) {
  const query = await props.searchParams;
  const currentPage = Number(query.page) || 1;
  const totalBlogs = blogData.length;
  const limit = 12;
  const { start, end, totalPages, getPageNumbers } = usePagination(
    currentPage,
    totalBlogs,
    limit,
  );
  const sortedBlogs = [...blogData].sort(
    (a, b) =>
      new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime(),
  );
  const blogsToShow = sortedBlogs.slice(start, end);
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
        <p className="text-center text-foreground-muted text-lg">
          No blogs available at the moment.
        </p>
      )}

      {/* Pagination */}
      {/* <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={() => { }}
      /> */}
    </SectionHeader>
  );
}

export async function generateStaticParams() {
  return [];
}
