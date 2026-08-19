import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { getCurrentUser } from "@/lib/auth";
import { getI18n } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> { const { t } = await getI18n(); return { title: t("checkout.title"), robots: { index: false, follow: false } }; }
export default async function CheckoutPage() {
  const user = await getCurrentUser();
  return <CheckoutForm customer={user ? { name: user.name, email: user.email, phone: user.phone } : undefined} />;
}
