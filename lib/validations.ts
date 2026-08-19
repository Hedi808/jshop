import { z } from "zod";

const emailSchema = z.string().trim().toLowerCase().email("Enter a valid email address").max(254);
const passwordSchema = z.string()
  .min(8, "Password must contain at least 8 characters")
  .max(128, "Password is too long")
  .regex(/[a-z]/, "Password must contain a lowercase letter")
  .regex(/[A-Z]/, "Password must contain an uppercase letter")
  .regex(/\d/, "Password must contain a number");

export const registerSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(100),
  email: emailSchema,
  phone: z.string().trim().max(20).refine((value) => !value || /^[+\d\s().-]{8,20}$/.test(value), "Enter a valid phone number"),
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1).max(128),
});

export const checkoutSchema = z.object({
  customerName: z.string().trim().min(2, "Enter your full name").max(100),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().min(8, "Enter a valid phone number").max(20),
  address: z.string().trim().min(5, "Enter a complete delivery address").max(200),
  city: z.string().trim().min(2, "Enter your city").max(80),
  governorate: z.string().trim().min(2, "Choose a governorate").max(80),
  postalCode: z.string().trim().regex(/^\d{4}$/, "Postal code must contain 4 digits"),
  country: z.enum(["Tunisie", "Tunisia", "تونس"]).default("Tunisie"),
  deliveryMethod: z.enum(["standard", "express"]),
  paymentMethod: z.enum(["CASH_ON_DELIVERY", "CARD"]),
  deliveryNote: z.string().trim().max(300).optional(),
  items: z.array(z.object({
    productId: z.string().min(1),
    slug: z.string().min(1),
    name: z.string().min(1),
    image: z.string().refine((value) => value.startsWith("/") || z.string().url().safeParse(value).success, "Invalid product image"),
    price: z.number().positive(),
    quantity: z.number().int().min(1).max(10),
    variant: z.string().max(100).optional(),
  })).min(1, "Your cart is empty").max(50),
});

export const productInputSchema = z.object({
  name: z.string().trim().min(3).max(120),
  slug: z.string().trim().min(3).max(140).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  shortDescription: z.string().trim().min(10).max(220),
  description: z.string().trim().min(20).max(3000),
  sku: z.string().trim().min(3).max(60),
  brand: z.string().trim().min(2).max(80),
  categorySlug: z.string().trim().min(2),
  price: z.coerce.number().positive().max(100000),
  compareAtPrice: z.union([z.coerce.number().positive(), z.literal(0), z.null()]).optional(),
  costPrice: z.union([z.coerce.number().nonnegative(), z.literal(0), z.null()]).optional(),
  stock: z.coerce.number().int().nonnegative().max(100000),
  image: z.string().refine((value) => value.startsWith("/") || z.string().url().safeParse(value).success, "Enter a valid image URL or local path"),
  featured: z.boolean().default(false),
  isNew: z.boolean().default(false),
  isFlashDeal: z.boolean().default(false),
  tags: z.array(z.string().trim().min(1).max(40)).max(12).default([]),
  specifications: z.record(z.string(), z.string()).default({}),
}).refine((data) => !data.compareAtPrice || data.compareAtPrice > data.price, {
  message: "Compare-at price must be higher than the selling price",
  path: ["compareAtPrice"],
});

export const orderStatusSchema = z.enum(["PENDING", "CONFIRMED", "PREPARING", "SHIPPED", "DELIVERED", "CANCELLED"]);

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type ProductInput = z.infer<typeof productInputSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
