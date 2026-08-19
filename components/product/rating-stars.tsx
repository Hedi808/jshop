import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingStars({ rating, count, size = "sm", className }: { rating: number; count?: number; size?: "sm" | "md"; className?: string }) {
  const dimension = size === "md" ? "size-4" : "size-3";
  return (
    <div className={cn("flex items-center gap-1.5", className)} aria-label={`${rating} out of 5 stars`}>
      <div className="flex text-primary" aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => <Star key={index} className={cn(dimension, index + 0.5 <= rating ? "fill-current" : "fill-transparent text-neutral-300")} />)}
      </div>
      <span className="text-xs font-bold text-muted-foreground">{rating.toFixed(1)}{count !== undefined ? ` (${count})` : ""}</span>
    </div>
  );
}
