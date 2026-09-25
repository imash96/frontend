import { ArrowRight } from "lucide-react"
import { blogData } from "@/data/blog"
import Button from "@/ui/button"
import BlogCard from "../components/blog-card-new"
import SectionHeader from "../components/section-header"

export default function Blog() {
    return (
        <SectionHeader
            title="Blogs & Articles"
            desc="Fashion insights, style tips, and the latest craft trends."
            sectionName="blog-article"
            eyebrow="Journal"
            action={
                // Desktop inline CTA - hidden on mobile
                <Button
                    href="s"
                    variant="outline"
                    icon={<ArrowRight className="size-3.5" />}
                    iconPosition="right"
                    className="hidden! sm:inline-flex!"
                >
                    View All Articles
                </Button>
            }
        >
            {/* FIX 1: smooth 1→2→3→4 progression - no jarring jump */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                {blogData.slice(0, 4).map((post) => (
                    <BlogCard key={post.id} post={post} size="tall" />
                ))}
            </div>

            {/* Mobile CTA - visible only below sm */}
            <div className="flex justify-center mt-6 sm:hidden">
                <Button
                    href="/blogs"
                    variant="outline"
                    icon={<ArrowRight className="size-4" />}
                    iconPosition="right"
                >
                    View All Articles
                </Button>
            </div>
        </SectionHeader>
    )
}