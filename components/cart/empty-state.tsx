import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState({ icon: Icon, title, copy, action, href }: { icon: LucideIcon; title: string; copy: string; action: string; href: string }) {
  return <div className="grid min-h-[32rem] place-items-center text-center"><div><Icon className="mx-auto size-16 stroke-1 text-muted-foreground" /><h1 className="mt-6 text-3xl font-black uppercase tracking-[-.05em]">{title}</h1><p className="mt-3 text-sm text-muted-foreground">{copy}</p><Button asChild className="mt-6"><Link href={href}>{action}</Link></Button></div></div>;
}
