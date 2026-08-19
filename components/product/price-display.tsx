import { getDiscount, formatPrice } from "@/lib/utils";

export function PriceDisplay({ price, compareAtPrice, large = false }: { price: number; compareAtPrice: number | null; large?: boolean }) {
  const discount = getDiscount(price, compareAtPrice);
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
      <span className={large ? "text-3xl font-black tracking-tight text-primary" : "text-base font-black text-primary"}>{formatPrice(price)}</span>
      {compareAtPrice ? <span className={large ? "text-sm text-muted-foreground line-through" : "text-xs text-muted-foreground line-through"}>{formatPrice(compareAtPrice)}</span> : null}
      {discount ? <span className="bg-orange-50 px-1.5 py-0.5 text-[10px] font-black text-[#c64d00]">-{discount}%</span> : null}
    </div>
  );
}
