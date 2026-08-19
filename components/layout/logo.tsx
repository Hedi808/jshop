import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ light = false, className }: { light?: boolean; className?: string }) {
  return (
    <Link href="/" aria-label="JoShop accueil" className={cn("inline-flex items-baseline leading-none", className)}>
      <span className={cn("text-[1.55rem] font-black tracking-[-.075em]", light ? "text-white" : "text-[#0a0a0a]")}>Jo</span>
      <span className="text-[1.55rem] font-black tracking-[-.075em] text-primary">Shop</span>
    </Link>
  );
}
