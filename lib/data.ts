import { randomUUID } from "node:crypto";
import { cache } from "react";
import { isExcludedCategorySlug } from "@/lib/catalog";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { CheckoutInput, ProductInput } from "@/lib/validations";
import type { Category, Order, Product } from "@/types";

const PRODUCT_SELECT = `
  *,
  category:Category!Product_categoryId_fkey(id,name,slug),
  images:ProductImage!ProductImage_productId_fkey(*),
  variants:ProductVariant!ProductVariant_productId_fkey(*),
  reviews:Review!Review_productId_fkey(*)
`;

const ORDER_SELECT = `
  *,
  items:OrderItem!OrderItem_orderId_fkey(*)
`;

type DbProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  sku: string;
  price: number | string;
  compareAtPrice: number | string | null;
  costPrice: number | string | null;
  stock: number;
  brand: string;
  categoryId: string;
  category: Product["category"] | Product["category"][] | null;
  featured: boolean;
  isNew: boolean;
  isFlashDeal: boolean;
  rating: number | string;
  reviewCount: number;
  soldCount: number;
  tags: string[] | null;
  specifications: Record<string, string> | null;
  images: Product["images"] | null;
  variants: Product["variants"] | null;
  reviews: Array<Omit<Product["reviews"][number], "createdAt"> & { createdAt: string | Date }> | null;
  createdAt: string | Date;
  updatedAt: string | Date;
};

type DbOrderItem = {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  image: string;
  quantity: number;
  unitPrice: number | string;
  variant: string | null;
};

type DbOrder = {
  id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  governorate: string;
  postalCode: string;
  country: string;
  subtotal: number | string;
  shipping: number | string;
  discount: number | string;
  total: number | string;
  paymentMethod: Order["paymentMethod"];
  status: Order["status"];
  items: DbOrderItem[] | null;
  createdAt: string | Date;
};

type ProductFilters = {
  query?: string;
  category?: string;
  brand?: string;
  color?: string;
  option?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  availability?: boolean;
  discount?: boolean;
  sort?: string;
  limit?: number;
};

function oneRelation<T>(value: T | T[] | null): T | null {
  return Array.isArray(value) ? value[0] ?? null : value;
}

function isoString(value: string | Date) {
  return value instanceof Date ? value.toISOString() : value;
}

function throwIfQueryFailed(error: { message: string } | null, operation: string) {
  if (error) throw new Error(`${operation}: ${error.message}`);
}

function serializeProduct(product: DbProduct): Product {
  const category = oneRelation(product.category);
  if (!category) throw new Error(`Product ${product.id} has no category relation.`);

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    shortDescription: product.shortDescription,
    sku: product.sku,
    price: Number(product.price),
    compareAtPrice: product.compareAtPrice === null ? null : Number(product.compareAtPrice),
    costPrice: product.costPrice === null ? null : Number(product.costPrice),
    stock: product.stock,
    brand: product.brand,
    categoryId: product.categoryId,
    category,
    featured: product.featured,
    isNew: product.isNew,
    isFlashDeal: product.isFlashDeal,
    rating: Number(product.rating),
    reviewCount: product.reviewCount,
    soldCount: product.soldCount,
    tags: product.tags ?? [],
    specifications: product.specifications ?? {},
    images: [...(product.images ?? [])].sort((a, b) => a.sortOrder - b.sortOrder),
    variants: product.variants ?? [],
    reviews: [...(product.reviews ?? [])]
      .sort((a, b) => isoString(b.createdAt).localeCompare(isoString(a.createdAt)))
      .map((review) => ({ ...review, createdAt: isoString(review.createdAt) })),
    createdAt: isoString(product.createdAt),
    updatedAt: isoString(product.updatedAt),
  };
}

function serializeOrder(order: DbOrder): Order {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    email: order.email,
    phone: order.phone,
    address: order.address,
    city: order.city,
    governorate: order.governorate,
    postalCode: order.postalCode,
    country: order.country,
    subtotal: Number(order.subtotal),
    shipping: Number(order.shipping),
    discount: Number(order.discount),
    total: Number(order.total),
    paymentMethod: order.paymentMethod,
    status: order.status,
    createdAt: isoString(order.createdAt),
    items: (order.items ?? []).map((item) => ({
      id: item.id,
      productId: item.productId,
      slug: item.productSlug,
      productSlug: item.productSlug,
      name: item.productName,
      productName: item.productName,
      image: item.image,
      price: Number(item.unitPrice),
      unitPrice: Number(item.unitPrice),
      quantity: item.quantity,
      variant: item.variant ?? undefined,
    })),
  };
}

function filterProducts(products: Product[], filters: ProductFilters) {
  const query = filters.query?.trim().toLowerCase();
  let result = products.filter((product) => {
    if (isExcludedCategorySlug(product.category.slug)) return false;
    const matchesQuery = !query || [product.name, product.description, product.category.name, product.brand, ...product.tags]
      .some((value) => value.toLowerCase().includes(query));
    const matchesCategory = !filters.category || product.category.slug === filters.category;
    const matchesBrand = !filters.brand || product.brand === filters.brand;
    const matchesColor = !filters.color || product.variants.some((variant) => variant.color?.toLowerCase() === filters.color?.toLowerCase());
    const matchesOption = !filters.option || product.variants.some((variant) => variant.optionValue?.toLowerCase() === filters.option?.toLowerCase());
    const matchesMin = filters.minPrice === undefined || product.price >= filters.minPrice;
    const matchesMax = filters.maxPrice === undefined || product.price <= filters.maxPrice;
    const matchesRating = filters.rating === undefined || product.rating >= filters.rating;
    const matchesStock = !filters.availability || product.stock > 0;
    const matchesDiscount = !filters.discount || Boolean(product.compareAtPrice && product.compareAtPrice > product.price);
    return matchesQuery && matchesCategory && matchesBrand && matchesColor && matchesOption && matchesMin && matchesMax && matchesRating && matchesStock && matchesDiscount;
  });

  result = [...result].sort((a, b) => {
    switch (filters.sort) {
      case "newest": return b.createdAt.localeCompare(a.createdAt);
      case "price-asc": return a.price - b.price;
      case "price-desc": return b.price - a.price;
      case "best-selling": return b.soldCount - a.soldCount;
      case "rating": return b.rating - a.rating;
      default: return Number(b.featured) - Number(a.featured) || b.rating - a.rating;
    }
  });

  return filters.limit ? result.slice(0, filters.limit) : result;
}

async function readProduct(column: "id" | "slug", value: string) {
  const { data, error } = await getSupabaseAdmin()
    .from("Product")
    .select(PRODUCT_SELECT)
    .eq(column, value)
    .limit(1)
    .maybeSingle();
  throwIfQueryFailed(error, "Could not read product");
  return data ? serializeProduct(data as unknown as DbProduct) : null;
}

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  if (isExcludedCategorySlug(filters.category)) return [];
  const { data, error } = await getSupabaseAdmin().from("Product").select(PRODUCT_SELECT);
  throwIfQueryFailed(error, "Could not read products");
  return filterProducts((data as unknown as DbProduct[]).map(serializeProduct), filters);
}

export const getProductBySlug = cache(async (slug: string): Promise<Product | null> => {
  const product = await readProduct("slug", slug);
  return product && !isExcludedCategorySlug(product.category.slug) ? product : null;
});

export async function getProductById(id: string): Promise<Product | null> {
  const product = await readProduct("id", id);
  return product && !isExcludedCategorySlug(product.category.slug) ? product : null;
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("Category")
    .select("id,name,slug,description,image,products:Product!Product_categoryId_fkey(id)")
    .order("name", { ascending: true });
  throwIfQueryFailed(error, "Could not read categories");

  return (data as unknown as Array<Category & { products: Array<{ id: string }> | null }>)
    .filter((category) => !isExcludedCategorySlug(category.slug))
    .map(({ products, ...category }) => ({ ...category, productCount: products?.length ?? 0 }));
}

export async function getBrands(category?: string) {
  const products = await getProducts(category ? { category } : {});
  return [...new Set(products.map((product) => product.brand))].sort();
}

function generateOrderNumber() {
  const stamp = Date.now().toString().slice(-7);
  return `ORD-2026-${stamp}`;
}

export async function createOrder(input: CheckoutInput, userId?: string): Promise<Order> {
  const availableProducts = await Promise.all(input.items.map((item) => getProductById(item.productId)));
  if (availableProducts.some((product) => !product)) throw new Error("One or more products are no longer available.");

  const subtotal = input.items.reduce((sum, item, index) => sum + availableProducts[index]!.price * item.quantity, 0);
  const shipping = input.deliveryMethod === "express" ? 15 : 7;
  const discount = subtotal >= 300 ? 20 : 0;
  const total = subtotal + shipping - discount;
  const orderNumber = generateOrderNumber();

  const supabase = getSupabaseAdmin();
  const orderId = randomUUID();
  const now = new Date().toISOString();
  const { data: orderRow, error: orderError } = await supabase.from("Order").insert({
    id: orderId,
    orderNumber,
    userId: userId ?? null,
    customerName: input.customerName,
    email: input.email,
    phone: input.phone,
    address: input.address,
    city: input.city,
    governorate: input.governorate,
    postalCode: input.postalCode,
    country: input.country,
    subtotal,
    shipping,
    discount,
    total,
    paymentMethod: input.paymentMethod,
    status: "PENDING",
    deliveryNote: input.deliveryNote ?? null,
    createdAt: now,
    updatedAt: now,
  }).select("*").single();
  throwIfQueryFailed(orderError, "Could not create order");

  const { data: itemRows, error: itemError } = await supabase.from("OrderItem").insert(
    input.items.map((item, index) => ({
      id: randomUUID(),
      orderId,
      productId: item.productId,
      productName: availableProducts[index]!.name,
      productSlug: availableProducts[index]!.slug,
      image: availableProducts[index]!.images[0]?.url ?? item.image,
      quantity: item.quantity,
      unitPrice: availableProducts[index]!.price,
      variant: item.variant ?? null,
    })),
  ).select("*");

  if (itemError) {
    const { error: cleanupError } = await supabase.from("Order").delete().eq("id", orderId);
    if (cleanupError) console.error("Could not roll back an incomplete order", cleanupError);
    throw new Error(`Could not create order items: ${itemError.message}`);
  }

  return serializeOrder({ ...(orderRow as unknown as Omit<DbOrder, "items">), items: itemRows as unknown as DbOrderItem[] });
}

export async function getOrder(orderNumber: string): Promise<Order | null> {
  const { data, error } = await getSupabaseAdmin()
    .from("Order")
    .select(ORDER_SELECT)
    .eq("orderNumber", orderNumber)
    .limit(1)
    .maybeSingle();
  throwIfQueryFailed(error, "Could not read order");
  return data ? serializeOrder(data as unknown as DbOrder) : null;
}

export async function getOrders(): Promise<Order[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("Order")
    .select(ORDER_SELECT)
    .order("createdAt", { ascending: false });
  throwIfQueryFailed(error, "Could not read orders");
  return (data as unknown as DbOrder[]).map(serializeOrder);
}

export async function getOrdersForUser(userId: string): Promise<Order[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("Order")
    .select(ORDER_SELECT)
    .eq("userId", userId)
    .order("createdAt", { ascending: false });
  throwIfQueryFailed(error, "Could not read customer orders");
  return (data as unknown as DbOrder[]).map(serializeOrder);
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const category = (await getCategories()).find((item) => item.slug === input.categorySlug);
  if (!category) throw new Error("Category not found.");
  const supabase = getSupabaseAdmin();
  const productId = randomUUID();
  const now = new Date().toISOString();
  const { error: productError } = await supabase.from("Product").insert({
    id: productId,
    name: input.name,
    slug: input.slug,
    description: input.description,
    shortDescription: input.shortDescription,
    sku: input.sku,
    price: input.price,
    compareAtPrice: input.compareAtPrice || null,
    costPrice: input.costPrice || null,
    stock: input.stock,
    brand: input.brand,
    categoryId: category.id,
    featured: input.featured,
    isNew: input.isNew,
    isFlashDeal: input.isFlashDeal,
    rating: 0,
    reviewCount: 0,
    soldCount: 0,
    tags: input.tags,
    specifications: input.specifications,
    createdAt: now,
    updatedAt: now,
  });
  throwIfQueryFailed(productError, "Could not create product");

  const { error: imageError } = await supabase.from("ProductImage").insert({
    id: randomUUID(),
    productId,
    url: input.image,
    alt: input.name,
    sortOrder: 0,
  });
  if (imageError) {
    const { error: cleanupError } = await supabase.from("Product").delete().eq("id", productId);
    if (cleanupError) console.error("Could not roll back an incomplete product", cleanupError);
    throw new Error(`Could not create product image: ${imageError.message}`);
  }

  const product = await readProduct("id", productId);
  if (!product) throw new Error("Created product could not be read.");
  return product;
}

export async function updateProduct(id: string, input: ProductInput): Promise<Product> {
  const category = (await getCategories()).find((item) => item.slug === input.categorySlug);
  if (!category) throw new Error("Category not found.");
  const supabase = getSupabaseAdmin();
  const { data: updatedRows, error: productError } = await supabase.from("Product").update({
    name: input.name,
    slug: input.slug,
    description: input.description,
    shortDescription: input.shortDescription,
    sku: input.sku,
    price: input.price,
    compareAtPrice: input.compareAtPrice || null,
    costPrice: input.costPrice || null,
    stock: input.stock,
    brand: input.brand,
    categoryId: category.id,
    featured: input.featured,
    isNew: input.isNew,
    isFlashDeal: input.isFlashDeal,
    tags: input.tags,
    specifications: input.specifications,
    updatedAt: new Date().toISOString(),
  }).eq("id", id).select("id");
  throwIfQueryFailed(productError, "Could not update product");
  if (!updatedRows?.length) throw new Error("Product not found.");

  const { data: images, error: imageReadError } = await supabase
    .from("ProductImage")
    .select("id")
    .eq("productId", id)
    .order("sortOrder", { ascending: true });
  throwIfQueryFailed(imageReadError, "Could not read product images");

  const primaryImageId = images?.[0]?.id as string | undefined;
  if (primaryImageId) {
    const { error } = await supabase.from("ProductImage").update({ url: input.image, alt: input.name, sortOrder: 0 }).eq("id", primaryImageId);
    throwIfQueryFailed(error, "Could not update product image");
  } else {
    const { error } = await supabase.from("ProductImage").insert({ id: randomUUID(), productId: id, url: input.image, alt: input.name, sortOrder: 0 });
    throwIfQueryFailed(error, "Could not create product image");
  }

  const extraImageIds = (images ?? []).slice(1).map((image) => image.id as string);
  if (extraImageIds.length) {
    const { error } = await supabase.from("ProductImage").delete().in("id", extraImageIds);
    throwIfQueryFailed(error, "Could not remove old product images");
  }

  const product = await readProduct("id", id);
  if (!product) throw new Error("Updated product could not be read.");
  return product;
}

export async function deleteProduct(id: string) {
  const { data, error } = await getSupabaseAdmin().from("Product").delete().eq("id", id).select("id");
  throwIfQueryFailed(error, "Could not delete product");
  if (!data?.length) throw new Error("Product not found.");
}

export async function updateOrderStatus(orderNumber: string, status: Order["status"]) {
  const { data, error } = await getSupabaseAdmin()
    .from("Order")
    .update({ status, updatedAt: new Date().toISOString() })
    .eq("orderNumber", orderNumber)
    .select(ORDER_SELECT)
    .limit(1)
    .maybeSingle();
  throwIfQueryFailed(error, "Could not update order status");
  if (!data) throw new Error("Order not found.");
  return serializeOrder(data as unknown as DbOrder);
}
