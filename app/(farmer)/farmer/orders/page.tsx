"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { useOrders } from "@/features/orders/hooks/useOrders";
import { OrderCard } from "@/features/orders/components/OrderCard";

export default function FarmerOrdersPage() {
  const { user } = useAuth();
  const { data: orders = [], isLoading } = useOrders(user?.uid, "farmer");

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <h1 className="text-3xl font-black text-foreground tracking-tight">Incoming Orders</h1>
      {isLoading ? <p className="text-sm text-muted">Loading farmer orders...</p> : null}
      <div className="space-y-3">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
        {!isLoading && !orders.length ? (
          <p className="rounded-xl border border-dashed border-border p-6 text-sm text-muted">
            No incoming orders yet.
          </p>
        ) : null}
      </div>
    </div>
  );
}
