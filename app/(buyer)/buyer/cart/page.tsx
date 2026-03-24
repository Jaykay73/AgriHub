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
      <main className="mx-auto max-w-4xl space-y-5 px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-black tracking-tight text-foreground uppercase tracking-widest">Your Harvest Basket</h1>
          <div className="flex items-center gap-2">
            {cart.items.length ? (
              <Link
                href="/checkout?source=cart"
                className="inline-flex items-center rounded-lg bg-primary px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-primary/10 transition-all hover:bg-primary/90"
              >
                Checkout All
              </Link>
            ) : null}
            {cart.items.length ? (
              <button 
                onClick={() => clear()}
                className="text-[10px] font-black uppercase tracking-widest text-muted hover:text-red-500 transition-colors"
              >
                Clear
              </button>
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
          <div className="space-y-2">
            {cart.items.map((item) => (
              <div
                key={item.listingId}
                className="flex items-center gap-4 rounded-xl border border-border/50 bg-white p-3 shadow-sm hover:border-primary/30 transition-all"
              >
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-surface">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.productName}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-black text-foreground truncate">{item.productName}</p>
                  <p className="text-[10px] font-bold text-muted">
                    {item.quantity} {item.unit}
                  </p>
                  <p className="text-[11px] font-black text-primary">
                    {formatNaira(item.priceInKobo * item.quantity)}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <Link
                    href="/checkout?source=cart"
                    className="inline-flex h-8 items-center px-3 rounded-lg bg-primary/5 text-primary text-[9px] font-black uppercase tracking-widest border border-primary/20 hover:bg-primary hover:text-white transition-all"
                  >
                    Checkout
                  </Link>
                  <button 
                    onClick={() => removeItem(item.listingId)}
                    className="h-8 w-8 flex items-center justify-center rounded-lg border border-border/50 text-muted hover:text-red-500 hover:border-red-200 transition-all"
                  >
                    <span className="text-[10px] font-black">&times;</span>
                  </button>
                </div>
              </div>
            ))}

            <div className="rounded-xl border border-border/50 bg-white p-4 flex items-center justify-between shadow-sm">
               <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted">Basket Total</p>
                  <p className="text-xl font-black text-primary leading-none">{formatNaira(totalInKobo)}</p>
               </div>
               <Link
                href="/checkout?source=cart"
                className="inline-flex h-10 items-center rounded-lg bg-primary px-6 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
              >
                Proceed to Pay
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
