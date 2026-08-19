import { Badge } from "@/components/ui/badge";
import { RatingStars } from "@/components/product/rating-stars";
import { getI18n } from "@/lib/i18n";
import type { Product } from "@/types";

export async function ProductInformation({ product }: { product: Product }) {
  const { locale, t } = await getI18n();
  const distribution = [82, 12, 4, 1, 1];
  const dateLocale = locale === "fr" ? "fr-TN" : locale === "ar" ? "ar-TN" : "en-TN";
  return <div className="shell border-t py-14 md:py-20"><div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
    <section><p className="eyebrow text-muted-foreground">{t("product.detailsEyebrow")}</p><h2 className="mt-4 text-3xl font-black uppercase tracking-[-.05em]">{t("product.specifications")}</h2><p className="mt-6 text-sm leading-7 text-muted-foreground">{product.description}</p>
      <dl className="mt-8 divide-y border-y">{Object.entries(product.specifications).map(([key, value]) => <div key={key} className="grid grid-cols-[minmax(120px,180px)_1fr] gap-4 py-4 text-sm"><dt className="font-black">{key.replaceAll("_", " ")}</dt><dd className="text-muted-foreground">{value}</dd></div>)}</dl>
      <div className="mt-8 grid gap-6 sm:grid-cols-2"><div><h3 className="text-xs font-black uppercase tracking-[.12em]">{t("common.shipping")}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{t("product.shippingCopy")}</p></div><div><h3 className="text-xs font-black uppercase tracking-[.12em]">{t("footer.returns")}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{t("product.returnsCopy")}</p></div></div>
    </section>
    <section id="reviews"><p className="eyebrow text-muted-foreground">{t("product.customerNotes")}</p><h2 className="mt-4 text-3xl font-black uppercase tracking-[-.05em]">{t("product.reviews")}</h2>
      <div className="mt-7 grid gap-8 rounded-xl bg-neutral-50 p-6 sm:grid-cols-[140px_1fr]"><div><p className="text-5xl font-black tracking-[-.07em]">{product.rating}</p><RatingStars rating={product.rating} className="mt-2" /><p className="mt-2 text-xs text-muted-foreground">{product.reviewCount} {t("product.reviewsCount")}</p></div><div className="space-y-2">{distribution.map((percent, index) => <div key={index} className="grid grid-cols-[22px_1fr_34px] items-center gap-2 text-xs"><span className="font-bold">{5 - index}★</span><div className="h-1.5 overflow-hidden rounded-full bg-neutral-200"><div className="h-full bg-primary" style={{ width: `${percent}%` }} /></div><span className="text-end text-muted-foreground">{percent}%</span></div>)}</div></div>
      <div className="mt-8 divide-y">{product.reviews.map((review) => <article key={review.id} className="py-6 first:pt-0"><div className="flex flex-wrap items-center gap-2"><strong className="text-sm">{review.userName}</strong>{review.verified ? <Badge variant="success">{t("product.verified")}</Badge> : null}<time className="ms-auto text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString(dateLocale, { day: "numeric", month: "short", year: "numeric" })}</time></div><RatingStars rating={review.rating} className="mt-2" /><h3 className="mt-3 text-sm font-black">{review.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{review.comment}</p></article>)}</div>
    </section>
  </div></div>;
}
