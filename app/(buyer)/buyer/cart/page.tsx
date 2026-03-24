"use client";

import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/features/marketplace/components/Navbar";
import { useCart } from "@/features/cart/hooks/useCart";
import { formatNaira } from "@/lib/format";
import { Button } from "@/shared/components/Button";

export default function BuyerCartPage() {
  const { cart, totalInKobo, removeItem, clear } = useCart();

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-black tracking-tight text-foreground">My Cart</h1>
          <div className="flex items-center gap-3">
            {cart.items.length ? (
              <Link
                href="/checkout?source=cart"
                className="inline-flex items-center rounded-xl bg-primary px-4 py-2 text-xs font-black text-white"
              >
                Checkout all items
              </Link>
            ) : null}
            {cart.items.length ? (
              <Button variant="ghost" onClick={() => clear()}>
                Clear cart
              </Button>
            ) : null}
          </div>
        </div>

        <p className="text-sm font-medium text-muted">
          Cart supports one seller at a time to keep payment settlement separate.
        </p>

        {!cart.items.length ? (
          <div className="rounded-2xl border-2 border-dashed border-border bg-white p-10 text-center text-sm font-bold text-muted">
            Cart is empty.
          </div>
        ) : (
          <div className="space-y-3">
            {cart.items.map((item) => (
              <div
                key={item.listingId}
                className="flex flex-wrap items-center gap-4 rounded-2xl border-2 border-border/50 bg-white p-4"
              >
                <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-surface">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.productName}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <div className="min-w-[180px] flex-1">
                  <p className="font-black text-foreground">{item.productName}</p>
                  <p className="text-xs font-bold text-muted">
                    Qty: {item.quantity} {item.unit}
                  </p>
                  <p className="text-sm font-black text-primary">
                    {formatNaira(item.priceInKobo * item.quantity)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href="/checkout?source=cart"
                    className="inline-flex items-center rounded-xl bg-primary px-4 py-2 text-xs font-black text-white"
                  >
                    Proceed to checkout
                  </Link>
                  <Button variant="secondary" onClick={() => removeItem(item.listingId)}>
                    Remove
                  </Button>
                </div>
              </div>
            ))}

            <div className="rounded-2xl border-2 border-border/50 bg-white p-4">
              <p className="text-sm font-bold text-muted">Cart Total</p>
              <p className="text-2xl font-black text-primary">{formatNaira(totalInKobo)}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
