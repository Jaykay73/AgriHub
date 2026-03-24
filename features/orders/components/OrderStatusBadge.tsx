import type { Order } from "@/shared/types";

const styles: Record<Order["status"], string> = {
  pending: "bg-amber-100 text-amber-700",
  paid: "bg-emerald-100 text-emerald-700",
  accepted: "bg-blue-100 text-blue-700",
  fulfilled: "bg-purple-100 text-purple-700",
  cancelled: "bg-slate-200 text-slate-700",
};

export const OrderStatusBadge = ({ status }: { status: Order["status"] }) => {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${styles[status]}`}
    >
      {status}
    </span>
  );
};
