import { formatNaira } from "@/lib/format";
import { OrderStatusBadge } from "@/features/orders/components/OrderStatusBadge";
import type { Order } from "@/shared/types";

export const OrderCard = ({ order }: { order: Order }) => {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold text-slate-500">Order #{order.id}</p>
        <OrderStatusBadge status={order.status} />
      </div>
      <h3 className="mt-2 text-base font-semibold text-slate-900">{order.productName}</h3>
      <p className="mt-1 text-sm text-slate-600">
        Qty: {order.quantity} • Total: {formatNaira(order.amountInKobo)}
      </p>
      <p className="mt-1 text-xs text-slate-500">Payment: {order.paymentStatus}</p>
    </article>
  );
};
