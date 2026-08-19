import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
  return <div className="shell py-10"><div className="grid gap-10 lg:grid-cols-[1.25fr_.75fr]"><Skeleton className="aspect-[4/5] w-full rounded-xl" /><div><Skeleton className="h-3 w-24" /><Skeleton className="mt-5 h-14 w-4/5" /><Skeleton className="mt-3 h-14 w-2/3" /><Skeleton className="mt-7 h-9 w-40" /><Skeleton className="mt-8 h-20 w-full" /><Skeleton className="mt-8 h-12 w-full" /><Skeleton className="mt-3 h-12 w-full" /></div></div></div>;
}
