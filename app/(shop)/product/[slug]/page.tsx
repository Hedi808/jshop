import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductInformation } from "@/components/product/product-information";
import { PurchasePanel } from "@/components/product/purchase-panel";
import { RecentlyViewed } from "@/components/product/recently-viewed";
import { getProductBySlug, getProducts } from "@/lib/data";
import { getI18n } from "@/lib/i18n";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: { title: product.name, description: product.shortDescription, images: product.images[0] ? [{ url: product.images[0].url, alt: product.images[0].alt }] : [] },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const recommendations = (await getProducts({ category: product.category.slug })).filter((item) => item.id !== product.id).slice(0, 4);
  const { t } = await getI18n();
  const structuredData = { "@context": "https://schema.org", "@type": "Product", name: product.name, image: product.images.map((image) => image.url), description: product.shortDescription, sku: product.sku, brand: { "@type": "Brand", name: product.brand }, offers: { "@type": "Offer", priceCurrency: "TND", price: product.price, availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock" }, aggregateRating: { "@type": "AggregateRating", ratingValue: product.rating, reviewCount: product.reviewCount } };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <div className="shell py-6 md:py-10">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1 text-xs text-muted-foreground"><Link href="/">{t("common.home")}</Link><ChevronRight className="size-3 rtl:rotate-180" /><Link href={`/category/${product.category.slug}`}>{product.category.name}</Link><ChevronRight className="size-3 rtl:rotate-180" /><span className="truncate">{product.name}</span></nav>
        <div className="grid gap-10 lg:grid-cols-[1.25fr_.75fr] lg:gap-14"><ProductGallery images={product.images} productName={product.name} /><PurchasePanel product={product} /></div>
      </div>
      <ProductInformation product={product} />
      <section className="shell pb-16 md:pb-24"><h2 className="mb-8 text-3xl font-black uppercase tracking-[-.05em]">{t("product.youMayLike")}</h2><ProductGrid products={recommendations} /></section>
      <RecentlyViewed product={product} />
    </>
  );
}
