import { PrismaClient, OrderStatus, PaymentMethod } from "@prisma/client";
import { catalogCategories, catalogProducts } from "../lib/catalog";

const prisma = new PrismaClient();

async function main() {
  const categoryIds = new Map<string, string>();

  for (const category of catalogCategories) {
    const row = await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name, description: category.description, image: category.image },
      create: { name: category.name, slug: category.slug, description: category.description, image: category.image },
    });
    categoryIds.set(category.slug, row.id);
  }

  const productIds = new Map<string, string>();
  for (const product of catalogProducts) {
    const data = {
      name: product.name,
      description: product.description,
      shortDescription: product.shortDescription,
      sku: product.sku,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      costPrice: product.costPrice,
      stock: product.stock,
      brand: product.brand,
      categoryId: categoryIds.get(product.category.slug)!,
      featured: product.featured,
      isNew: product.isNew,
      isFlashDeal: product.isFlashDeal,
      rating: product.rating,
      reviewCount: product.reviewCount,
      soldCount: product.soldCount,
      tags: product.tags,
      specifications: product.specifications,
    };

    const row = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        ...data,
        images: { deleteMany: {}, create: product.images.map(({ url, alt, sortOrder }) => ({ url, alt, sortOrder })) },
        variants: { deleteMany: {}, create: product.variants.map(({ sku, optionName, optionValue, color, stock }) => ({ sku, optionName, optionValue, color, stock })) },
        reviews: { deleteMany: {}, create: product.reviews.map(({ userName, rating, title, comment, verified, createdAt }) => ({ userName, rating, title, comment, verified, createdAt })) },
      },
      create: {
        slug: product.slug,
        ...data,
        images: { create: product.images.map(({ url, alt, sortOrder }) => ({ url, alt, sortOrder })) },
        variants: { create: product.variants.map(({ sku, optionName, optionValue, color, stock }) => ({ sku, optionName, optionValue, color, stock })) },
        reviews: { create: product.reviews.map(({ userName, rating, title, comment, verified, createdAt }) => ({ userName, rating, title, comment, verified, createdAt })) },
      },
    });
    productIds.set(product.slug, row.id);
  }

  const demoUser = await prisma.user.upsert({
    where: { email: "amira.benali@example.com" },
    update: { name: "Amira Ben Ali", phone: "+216 22 145 870" },
    create: {
      name: "Amira Ben Ali",
      email: "amira.benali@example.com",
      phone: "+216 22 145 870",
      addresses: {
        create: {
          label: "Domicile",
          address: "18 Avenue Habib Bourguiba",
          city: "La Marsa",
          governorate: "Tunis",
          postalCode: "2070",
          isDefault: true,
        },
      },
    },
  });

  const demoOrders = [
    { number: "ORD-2026-001284", status: OrderStatus.SHIPPED, createdAt: new Date("2026-08-15T10:30:00Z"), slugs: ["trottinette-electrique-urbanride-s8", "casque-urbain-led-signal"] },
    { number: "ORD-2026-001109", status: OrderStatus.DELIVERED, createdAt: new Date("2026-08-04T14:20:00Z"), slugs: ["ecouteurs-bluetooth-anc-pro"] },
    { number: "ORD-2026-000986", status: OrderStatus.CONFIRMED, createdAt: new Date("2026-07-28T09:10:00Z"), slugs: ["montre-connectee-amoled-active"] },
    { number: "ORD-2026-000742", status: OrderStatus.CANCELLED, createdAt: new Date("2026-07-11T16:45:00Z"), slugs: ["air-fryer-duo-8-l", "balance-de-cuisine-connectee"] },
  ];

  for (const demo of demoOrders) {
    const exists = await prisma.order.findUnique({ where: { orderNumber: demo.number } });
    if (exists) continue;
    const selected = demo.slugs.map((slug) => catalogProducts.find((product) => product.slug === slug)!);
    const subtotal = selected.reduce((sum, product) => sum + product.price, 0);
    const shipping = 7;
    await prisma.order.create({
      data: {
        orderNumber: demo.number,
        userId: demoUser.id,
        customerName: demoUser.name,
        email: demoUser.email,
        phone: demoUser.phone!,
        address: "18 Avenue Habib Bourguiba",
        city: "La Marsa",
        governorate: "Tunis",
        postalCode: "2070",
        country: "Tunisie",
        subtotal,
        shipping,
        discount: 0,
        total: subtotal + shipping,
        paymentMethod: PaymentMethod.CASH_ON_DELIVERY,
        status: demo.status,
        createdAt: demo.createdAt,
        items: {
          create: selected.map((product) => ({
            productId: productIds.get(product.slug)!,
            productName: product.name,
            productSlug: product.slug,
            image: product.images[0].url,
            quantity: 1,
            unitPrice: product.price,
            variant: product.variants[0] ? [product.variants[0].optionValue, product.variants[0].color].filter(Boolean).join(" / ") : null,
          })),
        },
      },
    });
  }

  console.log(`Seeded ${catalogCategories.length} categories, ${catalogProducts.length} products, and ${demoOrders.length} orders.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
