import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function SectionHeader({ eyebrow, title, href, action = "View all", light = false }: { eyebrow?: string; title: string; href?: string; action?: string; light?: boolean }) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4 md:mb-10">
      <div>
        {eyebrow ? <p className={`eyebrow mb-3 ${light ? "text-neutral-300" : "text-muted-foreground"}`}>{eyebrow}</p> : null}
        <h2 className={`text-3xl font-black uppercase tracking-[-.055em] sm:text-4xl md:text-5xl ${light ? "text-white" : "text-foreground"}`}>{title}</h2>
      </div>
      {href ? <Link href={href} className={`hidden items-center gap-2 border-b pb-1 text-xs font-black uppercase tracking-[.08em] hover:text-primary sm:flex ${light ? "border-white text-white" : "border-foreground"}`}>{action}<ArrowUpRight className="size-4" /></Link> : null}
    </div>
  );
}
