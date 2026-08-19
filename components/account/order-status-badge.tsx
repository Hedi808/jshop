import { Badge } from "@/components/ui/badge";
import type { Order } from "@/types";
import { getI18n } from "@/lib/i18n";

const variants: Record<Order["status"], "neutral" | "success" | "warning" | "danger" | "default"> = {
  PENDING: "warning", CONFIRMED: "default", PREPARING: "warning", SHIPPED: "default", DELIVERED: "success", CANCELLED: "danger",
};

export async function OrderStatusBadge({ status }: { status: Order["status"] }) {
  const { t } = await getI18n();
  return <Badge variant={variants[status]}>{t(`status.${status}`)}</Badge>;
}
