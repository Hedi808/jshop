export type ProductImage = {
  id: string;
  url: string;
  alt: string;
  sortOrder: number;
};

export type ProductVariant = {
  id: string;
  sku: string;
  optionName: string | null;
  optionValue: string | null;
  color: string | null;
  stock: number;
};

export type ProductReview = {
  id: string;
  userName: string;
  rating: number;
  title?: string | null;
  comment: string;
  verified: boolean;
  createdAt: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  productCount?: number;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  sku: string;
  price: number;
  compareAtPrice: number | null;
  costPrice?: number | null;
  stock: number;
  brand: string;
  categoryId: string;
  category: { id: string; name: string; slug: string };
  featured: boolean;
  isNew: boolean;
  isFlashDeal: boolean;
  rating: number;
  reviewCount: number;
  soldCount: number;
  tags: string[];
  specifications: Record<string, string>;
  images: ProductImage[];
  variants: ProductVariant[];
  reviews: ProductReview[];
  createdAt: string;
  updatedAt: string;
};

export type CartItem = {
  key: string;
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  compareAtPrice: number | null;
  quantity: number;
  stock: number;
  optionName?: string;
  optionValue?: string;
  color?: string;
};

export type OrderItemInput = Pick<CartItem, "productId" | "slug" | "name" | "image" | "price" | "quantity"> & {
  variant?: string;
};

export type Order = {
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
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: "CASH_ON_DELIVERY" | "CARD";
  status: "PENDING" | "CONFIRMED" | "PREPARING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  items: Array<OrderItemInput & { id?: string; unitPrice?: number; productName?: string; productSlug?: string }>;
  createdAt: string;
};
