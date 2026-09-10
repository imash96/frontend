import { ChevronLeft, ChevronRight } from "lucide-react";

// ─── Pagination ──────────────────────────────────────────────────────────────
function Pagination({ currentPage, totalPages, onChange }: { currentPage: number; totalPages: number; onChange: (p: number) => void }) {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages: (number | "...")[] = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > 3) pages.push("...");
            for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                pages.push(i);
            }
            if (currentPage < totalPages - 2) pages.push("...");
            pages.push(totalPages);
        }
        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-1.5 pt-10">
            <button
                onClick={() => onChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="size-9 rounded-md border border-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-border-strong disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
                <ChevronLeft className="size-4" />
            </button>

            {getPageNumbers().map((page, i) =>
                page === "..." ? (
                    <span key={`dots-${i}`} className="size-9 flex items-center justify-center text-xs text-text-disabled">
                        …
                    </span>
                ) : (
                    <button
                        key={page}
                        onClick={() => onChange(page as number)}
                        className={`size-9 rounded-md text-xs font-medium transition-all duration-200 ${currentPage === page ? "bg-primary text-primary-foreground shadow-sm" : "border border-border text-text-secondary hover:text-text-primary hover:border-border-strong"}`}
                    >
                        {page}
                    </button>
                )
            )}

            <button
                onClick={() => onChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="size-9 rounded-md border border-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-border-strong disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
                <ChevronRight className="size-4" />
            </button>
        </div>
    );
}