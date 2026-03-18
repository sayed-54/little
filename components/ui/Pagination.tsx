"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

export default function Pagination({ totalPages, currentPage }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    return `${pathname}?${params.toString()}`;
  };

  const getPageNumbers = () => {
    const pages = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first, last, and pages around current
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      {/* Previous Button */}
      {currentPage > 1 ? (
        <Link
          href={createPageUrl(currentPage - 1)}
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-card border border-border text-muted-foreground hover:text-primary hover:border-primary/50 transition-all shadow-sm"
          aria-label="Previous Page"
        >
          <ChevronLeft size={20} />
        </Link>
      ) : (
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-muted/30 border border-border text-muted-foreground/30 cursor-not-allowed shadow-sm">
          <ChevronLeft size={20} />
        </div>
      )}

      {/* Page Numbers */}
      <div className="flex items-center gap-2">
        {getPageNumbers().map((page, index) => {
          if (page === "...") {
            return (
              <div key={`ellipsis-${index}`} className="w-10 h-10 flex items-center justify-center text-muted-foreground">
                <MoreHorizontal size={20} />
              </div>
            );
          }

          const isCurrent = page === currentPage;
          return (
            <Link
              key={`page-${page}`}
              href={createPageUrl(page as number)}
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all shadow-sm",
                isCurrent 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-110" 
                  : "bg-card border border-border text-muted-foreground hover:text-primary hover:border-primary/50"
              )}
            >
              {page}
            </Link>
          );
        })}
      </div>

      {/* Next Button */}
      {currentPage < totalPages ? (
        <Link
          href={createPageUrl(currentPage + 1)}
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-card border border-border text-muted-foreground hover:text-primary hover:border-primary/50 transition-all shadow-sm"
          aria-label="Next Page"
        >
          <ChevronRight size={20} />
        </Link>
      ) : (
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-muted/30 border border-border text-muted-foreground/30 cursor-not-allowed shadow-sm">
          <ChevronRight size={20} />
        </div>
      )}
    </div>
  );
}
