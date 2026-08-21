import { randomUUID } from "node:crypto";
import { loadEnvConfig } from "@next/env";
import { createClient } from "@supabase/supabase-js";
import { catalogCategories, catalogProducts } from "../lib/catalog";

loadEnvConfig(process.cwd());

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseSecretKey) {
  throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY before seeding.");
}

const parsedSupabaseUrl = new URL(supabaseUrl);
const isLoopback = parsedSupabaseUrl.hostname === "localhost" || parsedSupabaseUrl.hostname === "127.0.0.1" || parsedSupabaseUrl.hostname === "[::1]";
if (parsedSupabaseUrl.protocol !== "https:" && !(parsedSupabaseUrl.protocol === "http:" && isLoopback)) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL must use HTTPS unless it points to a loopback development server.");
}

const supabase = createClient(supabaseUrl, supabaseSecretKey, {
  auth: { autoRefreshToken: false, detectSessionInUrl: false, persistSession: false },
});

function assertQuery(error: { message: string } | null, operation: string) {
  if (error) throw new Error(`${operation}: ${error.message}`);
}

async function main() {
  const now = new Date().toISOString();
  const categorySlugs = catalogCategories.map((category) => category.slug);
  const { data: existingCategories, error: categoryReadError } = await supabase
    .from("Category")
    .select("id,slug")
    .in("slug", categorySlugs);
  assertQuery(categoryReadError, "Could not read categories");

  const existingCategoryIds = new Map((existingCategories ?? []).map((category) => [category.slug as string, category.id as string]));
  const { data: categoryRows, error: categoryError } = await supabase.from("Category").upsert(
    catalogCategories.map((category) => ({
      id: existingCategoryIds.get(category.slug) ?? category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image,
      parentId: null,
      createdAt: now,
      updatedAt: now,
    })),
    { onConflict: "slug" },
  ).select("id,slug");
  assertQuery(categoryError, "Could not seed categories");
  const categoryIds = new Map((categoryRows ?? []).map((category) => [category.slug as string, category.id as string]));

  const productSlugs = catalogProducts.map((product) => product.slug);
  const { data: existingProducts, error: productReadError } = await supabase
    .from("Product")
    .select("id,slug")
    .in("slug", productSlugs);
  assertQuery(productReadError, "Could not read products");
  const existingProductIds = new Map((existingProducts ?? []).map((product) => [product.slug as string, product.id as string]));

  const { data: productRows, error: productError } = await supabase.from("Product").upsert(
    catalogProducts.map((product) => ({
      id: existingProductIds.get(product.slug) ?? product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      shortDescription: product.shortDescription,
      sku: product.sku,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      costPrice: product.costPrice,
      stock: product.stock,
      brand: product.brand,
      categoryId: categoryIds.get(product.category.slug),
      featured: product.featured,
      isNew: product.isNew,
      isFlashDeal: product.isFlashDeal,
      rating: product.rating,
      reviewCount: product.reviewCount,
      soldCount: product.soldCount,
      tags: product.tags,
      specifications: product.specifications,
      createdAt: product.createdAt,
      updatedAt: now,
    })),
    { onConflict: "slug" },
  ).select("id,slug");
  assertQuery(productError, "Could not seed products");
  const productIds = new Map((productRows ?? []).map((product) => [product.slug as string, product.id as string]));
  const seededProductIds = [...productIds.values()];

  for (const table of ["ProductImage", "ProductVariant", "Review"] as const) {
    const { error } = await supabase.from(table).delete().in("productId", seededProductIds);
    assertQuery(error, `Could not clear ${table}`);
  }

  const { error: imageError } = await supabase.from("ProductImage").insert(
    catalogProducts.flatMap((product) => product.images.map((image) => ({
      ...image,
      productId: productIds.get(product.slug),
    }))),
  );
  assertQuery(imageError, "Could not seed product images");

  const { error: variantError } = await supabase.from("ProductVariant").insert(
    catalogProducts.flatMap((product) => product.variants.map((variant) => ({
      ...variant,
      productId: productIds.get(product.slug),
    }))),
  );
  assertQuery(variantError, "Could not seed product variants");

  const { error: reviewError } = await supabase.from("Review").insert(
    catalogProducts.flatMap((product) => product.reviews.map((review) => ({
      ...review,
      productId: productIds.get(product.slug),
    }))),
  );
  assertQuery(reviewError, "Could not seed product reviews");

  const demoEmail = "amira.benali@example.com";
  const { data: existingUser, error: userReadError } = await supabase
    .from("User")
    .select("id")
    .eq("email", demoEmail)
    .limit(1)
    .maybeSingle();
  assertQuery(userReadError, "Could not read demo user");

  const demoUserId = (existingUser?.id as string | undefined) ?? randomUUID();
  const { error: userError } = await supabase.from("User").upsert({
    id: demoUserId,
    name: "Amira Ben Ali",
    email: demoEmail,
    phone: "+216 22 145 870",
    createdAt: now,
    updatedAt: now,
  }, { onConflict: "email" });
  assertQuery(userError, "Could not seed demo user");

  const { data: existingAddress, error: addressReadError } = await supabase
    .from("Address")
    .select("id")
    .eq("userId", demoUserId)
    .eq("label", "Domicile")
    .limit(1)
    .maybeSingle();
  assertQuery(addressReadError, "Could not read demo address");
  if (!existingAddress) {
    const { error } = await supabase.from("Address").insert({
      id: randomUUID(),
      userId: demoUserId,
      label: "Domicile",
      address: "18 Avenue Habib Bourguiba",
      city: "La Marsa",
      governorate: "Tunis",
      postalCode: "2070",
      country: "Tunisie",
      isDefault: true,
      createdAt: now,
    });
    assertQuery(error, "Could not seed demo address");
  }

  const demoOrders: Array<{ number: string; status: string; createdAt: string; slugs: string[] }> = [
    { number: "ORD-2026-001284", status: "SHIPPED", createdAt: "2026-08-15T10:30:00Z", slugs: ["trottinette-electrique-urbanride-s8", "casque-urbain-led-signal"] },
    { number: "ORD-2026-001109", status: "DELIVERED", createdAt: "2026-08-04T14:20:00Z", slugs: ["ecouteurs-bluetooth-anc-pro"] },
    { number: "ORD-2026-000986", status: "CONFIRMED", createdAt: "2026-07-28T09:10:00Z", slugs: ["montre-connectee-amoled-active"] },
    { number: "ORD-2026-000742", status: "CANCELLED", createdAt: "2026-07-11T16:45:00Z", slugs: ["air-fryer-duo-8-l", "balance-de-cuisine-connectee"] },
  ];

  for (const demo of demoOrders) {
    const { data: existingOrder, error: orderReadError } = await supabase
      .from("Order")
      .select("id")
      .eq("orderNumber", demo.number)
      .limit(1)
      .maybeSingle();
    assertQuery(orderReadError, `Could not read ${demo.number}`);
    if (existingOrder) continue;

    const selected = demo.slugs.map((slug) => catalogProducts.find((product) => product.slug === slug)!);
    const subtotal = selected.reduce((sum, product) => sum + product.price, 0);
    const orderId = randomUUID();
    const { error: orderError } = await supabase.from("Order").insert({
      id: orderId,
      orderNumber: demo.number,
      userId: demoUserId,
      customerName: "Amira Ben Ali",
      email: demoEmail,
      phone: "+216 22 145 870",
      address: "18 Avenue Habib Bourguiba",
      city: "La Marsa",
      governorate: "Tunis",
      postalCode: "2070",
      country: "Tunisie",
      subtotal,
      shipping: 7,
      discount: 0,
      total: subtotal + 7,
      paymentMethod: "CASH_ON_DELIVERY",
      status: demo.status,
      deliveryNote: null,
      createdAt: demo.createdAt,
      updatedAt: demo.createdAt,
    });
    assertQuery(orderError, `Could not seed ${demo.number}`);

    const { error: itemError } = await supabase.from("OrderItem").insert(
      selected.map((product) => ({
        id: randomUUID(),
        orderId,
        productId: productIds.get(product.slug),
        productName: product.name,
        productSlug: product.slug,
        image: product.images[0].url,
        quantity: 1,
        unitPrice: product.price,
        variant: product.variants[0] ? [product.variants[0].optionValue, product.variants[0].color].filter(Boolean).join(" / ") : null,
      })),
    );
    assertQuery(itemError, `Could not seed items for ${demo.number}`);
  }

  console.log(`Seeded ${catalogCategories.length} categories, ${catalogProducts.length} products, and ${demoOrders.length} demo orders.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
