import { Prisma } from "@prisma/client";
import { cache } from "react";
import { catalogCategories, catalogProducts } from "@/lib/catalog";
import { isDatabaseConfigured, prisma } from "@/lib/db";
import type { CheckoutInput, ProductInput } from "@/lib/validations";
import type { Category, Order, Product } from "@/types";

const productInclude = {
  category: true,
  images: { orderBy: { sortOrder: "asc" as const } },
  variants: true,
  reviews: { orderBy: { createdAt: "desc" as const } },
};

type DbProduct = Prisma.ProductGetPayload<{ include: typeof productInclude }>;
type DbOrder = Prisma.OrderGetPayload<{ include: { items: true } }>;

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

const runtime = globalThis as unknown as {
  joshopProducts?: Product[];
  joshopOrders?: Order[];
};

function runtimeProducts() {
  if (!runtime.joshopProducts) runtime.joshopProducts = structuredClone(catalogProducts);
  return runtime.joshopProducts;
}

function runtimeOrders() {
  if (!runtime.joshopOrders) runtime.joshopOrders = [];
  return runtime.joshopOrders;
}

function serializeProduct(product: DbProduct): Product {
  return {
    ...product,
    price: Number(product.price),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
    costPrice: product.costPrice ? Number(product.costPrice) : null,
    rating: Number(product.rating),
    specifications: (product.specifications as Record<string, string> | null) ?? {},
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    reviews: product.reviews.map((review) => ({ ...review, createdAt: review.createdAt.toISOString() })),
  };
}

function serializeOrder(order: DbOrder): Order {
  return {
    ...order,
    subtotal: Number(order.subtotal),
    shipping: Number(order.shipping),
    discount: Number(order.discount),
    total: Number(order.total),
    createdAt: order.createdAt.toISOString(),
    items: order.items.map((item) => ({
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

function filterFallback(products: Product[], filters: ProductFilters) {
  const query = filters.query?.trim().toLowerCase();
  let result = products.filter((product) => {
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

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  if (!isDatabaseConfigured) return filterFallback(runtimeProducts(), filters);

  try {
    const where: Prisma.ProductWhereInput = {
      ...(filters.category ? { category: { slug: filters.category } } : {}),
      ...(filters.brand ? { brand: filters.brand } : {}),
      ...(filters.color ? { variants: { some: { color: { equals: filters.color, mode: "insensitive" } } } } : {}),
      ...(filters.option ? { variants: { some: { optionValue: { equals: filters.option, mode: "insensitive" } } } } : {}),
      ...(filters.minPrice !== undefined || filters.maxPrice !== undefined ? { price: { gte: filters.minPrice, lte: filters.maxPrice } } : {}),
      ...(filters.rating !== undefined ? { rating: { gte: filters.rating } } : {}),
      ...(filters.availability ? { stock: { gt: 0 } } : {}),
      ...(filters.discount ? { compareAtPrice: { not: null } } : {}),
      ...(filters.query ? {
        OR: [
          { name: { contains: filters.query, mode: "insensitive" } },
          { description: { contains: filters.query, mode: "insensitive" } },
          { brand: { contains: filters.query, mode: "insensitive" } },
          { category: { name: { contains: filters.query, mode: "insensitive" } } },
          { tags: { has: filters.query.toLowerCase() } },
        ],
      } : {}),
    };
    const orderBy: Prisma.ProductOrderByWithRelationInput = filters.sort === "newest" ? { createdAt: "desc" }
      : filters.sort === "price-asc" ? { price: "asc" }
        : filters.sort === "price-desc" ? { price: "desc" }
          : filters.sort === "best-selling" ? { soldCount: "desc" }
            : filters.sort === "rating" ? { rating: "desc" }
              : { featured: "desc" };
    const rows = await prisma.product.findMany({ where, include: productInclude, orderBy, take: filters.limit });
    return rows.map(serializeProduct);
  } catch (error) {
    console.error("Product query failed; using development catalogue.", error);
    return filterFallback(runtimeProducts(), filters);
  }
}

export const getProductBySlug = cache(async (slug: string): Promise<Product | null> => {
  if (!isDatabaseConfigured) return runtimeProducts().find((product) => product.slug === slug) ?? null;
  try {
    const row = await prisma.product.findUnique({ where: { slug }, include: productInclude });
    return row ? serializeProduct(row) : null;
  } catch (error) {
    console.error("Product detail query failed.", error);
    return runtimeProducts().find((product) => product.slug === slug) ?? null;
  }
});

export async function getProductById(id: string): Promise<Product | null> {
  if (!isDatabaseConfigured) return runtimeProducts().find((product) => product.id === id) ?? null;
  try {
    const row = await prisma.product.findUnique({ where: { id }, include: productInclude });
    return row ? serializeProduct(row) : null;
  } catch {
    return runtimeProducts().find((product) => product.id === id) ?? null;
  }
}

export async function getCategories(): Promise<Category[]> {
  if (!isDatabaseConfigured) return catalogCategories;
  try {
    const categories = await prisma.category.findMany({ include: { _count: { select: { products: true } } }, orderBy: { name: "asc" } });
    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image,
      productCount: category._count.products,
    }));
  } catch {
    return catalogCategories;
  }
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

  if (isDatabaseConfigured) {
    const row = await prisma.order.create({
      data: {
        orderNumber,
        userId,
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
        deliveryNote: input.deliveryNote,
        items: {
          create: input.items.map((item, index) => ({
            productId: item.productId,
            productName: availableProducts[index]!.name,
            productSlug: availableProducts[index]!.slug,
            image: availableProducts[index]!.images[0]?.url ?? item.image,
            quantity: item.quantity,
            unitPrice: availableProducts[index]!.price,
            variant: item.variant,
          })),
        },
      },
      include: { items: true },
    });
    return serializeOrder(row);
  }

  const order: Order = {
    id: `order-${Date.now()}`,
    orderNumber,
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
    items: input.items.map((item, index) => ({ ...item, price: availableProducts[index]!.price })),
    createdAt: new Date().toISOString(),
  };
  runtimeOrders().unshift(order);
  return order;
}

export async function getOrder(orderNumber: string): Promise<Order | null> {
  if (!isDatabaseConfigured) return runtimeOrders().find((order) => order.orderNumber === orderNumber) ?? null;
  try {
    const row = await prisma.order.findUnique({ where: { orderNumber }, include: { items: true } });
    return row ? serializeOrder(row) : null;
  } catch {
    return runtimeOrders().find((order) => order.orderNumber === orderNumber) ?? null;
  }
}

export async function getOrders(): Promise<Order[]> {
  if (!isDatabaseConfigured) return runtimeOrders();
  try {
    const rows = await prisma.order.findMany({ include: { items: true }, orderBy: { createdAt: "desc" } });
    return rows.map(serializeOrder);
  } catch {
    return runtimeOrders();
  }
}

export async function getOrdersForUser(userId: string): Promise<Order[]> {
  if (!isDatabaseConfigured) return [];
  try {
    const rows = await prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
    return rows.map(serializeOrder);
  } catch {
    return [];
  }
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const category = (await getCategories()).find((item) => item.slug === input.categorySlug);
  if (!category) throw new Error("Category not found.");
  if (isDatabaseConfigured) {
    const row = await prisma.product.create({
      data: {
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
        images: { create: [{ url: input.image, alt: input.name, sortOrder: 0 }] },
      },
      include: productInclude,
    });
    return serializeProduct(row);
  }

  const now = new Date().toISOString();
  const product: Product = {
    id: `product-dev-${Date.now()}`,
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
    category: { id: category.id, name: category.name, slug: category.slug },
    featured: input.featured,
    isNew: input.isNew,
    isFlashDeal: input.isFlashDeal,
    rating: 0,
    reviewCount: 0,
    soldCount: 0,
    tags: input.tags,
    specifications: input.specifications,
    images: [{ id: `image-${Date.now()}`, url: input.image, alt: input.name, sortOrder: 0 }],
    variants: [],
    reviews: [],
    createdAt: now,
    updatedAt: now,
  };
  runtimeProducts().unshift(product);
  return product;
}

export async function updateProduct(id: string, input: ProductInput): Promise<Product> {
  const category = (await getCategories()).find((item) => item.slug === input.categorySlug);
  if (!category) throw new Error("Category not found.");
  if (isDatabaseConfigured) {
    const row = await prisma.product.update({
      where: { id },
      data: {
        name: input.name, slug: input.slug, description: input.description, shortDescription: input.shortDescription,
        sku: input.sku, price: input.price, compareAtPrice: input.compareAtPrice || null, costPrice: input.costPrice || null,
        stock: input.stock, brand: input.brand, categoryId: category.id, featured: input.featured, isNew: input.isNew,
        isFlashDeal: input.isFlashDeal, tags: input.tags, specifications: input.specifications,
        images: { deleteMany: {}, create: [{ url: input.image, alt: input.name, sortOrder: 0 }] },
      },
      include: productInclude,
    });
    return serializeProduct(row);
  }
  const index = runtimeProducts().findIndex((product) => product.id === id);
  if (index < 0) throw new Error("Product not found.");
  const current = runtimeProducts()[index];
  const updated: Product = {
    ...current, ...input, compareAtPrice: input.compareAtPrice || null, costPrice: input.costPrice || null,
    categoryId: category.id, category: { id: category.id, name: category.name, slug: category.slug },
    images: [{ id: current.images[0]?.id ?? `image-${Date.now()}`, url: input.image, alt: input.name, sortOrder: 0 }],
    updatedAt: new Date().toISOString(),
  };
  runtimeProducts()[index] = updated;
  return updated;
}

export async function deleteProduct(id: string) {
  if (isDatabaseConfigured) {
    await prisma.product.delete({ where: { id } });
    return;
  }
  const index = runtimeProducts().findIndex((product) => product.id === id);
  if (index < 0) throw new Error("Product not found.");
  runtimeProducts().splice(index, 1);
}

export async function updateOrderStatus(orderNumber: string, status: Order["status"]) {
  if (isDatabaseConfigured) {
    const row = await prisma.order.update({ where: { orderNumber }, data: { status }, include: { items: true } });
    return serializeOrder(row);
  }
  const order = runtimeOrders().find((item) => item.orderNumber === orderNumber);
  if (!order) throw new Error("Order not found.");
  order.status = status;
  return order;
}
