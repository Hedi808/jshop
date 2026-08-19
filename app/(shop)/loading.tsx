import { Skeleton } from "@/components/ui/skeleton";

export default function ShopLoading() {
  return <div className="shell py-12"><Skeleton className="h-5 w-36" /><Skeleton className="mt-5 h-14 w-2/3 max-w-xl" /><div className="mt-10 product-grid">{Array.from({ length: 8 }, (_, index) => <div key={index}><Skeleton className="aspect-[4/5] w-full" /><Skeleton className="mt-3 h-3 w-1/3" /><Skeleton className="mt-2 h-5 w-4/5" /><Skeleton className="mt-3 h-4 w-1/2" /></div>)}</div></div>;
}
