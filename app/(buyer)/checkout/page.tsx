"use client";

import { useSearchParams } from "next/navigation";
import { useListing } from "@/features/marketplace/hooks/useListing";
import { CheckoutForm } from "@/features/orders/components/CheckoutForm";
import { useCart } from "@/features/cart/hooks/useCart";
import { Spinner } from "@/shared/components/Spinner";
import { Package, Leaf, Lock, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";

function CheckoutContent() {
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();
  const { cart } = useCart();
  const source = searchParams?.get("source");
  const listingId = searchParams?.get("listingId") || "";
  const qty = Number(searchParams?.get("qty") || "1");
  const isCartCheckout = source === "cart";
  const { data: listing, isLoading, isError } = useListing(isCartCheckout ? "" : listingId);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (isCartCheckout) {
    if (!mounted) {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
          <Spinner className="h-10 w-10 text-primary" />
          <p className="animate-pulse font-black text-primary uppercase tracking-widest text-[10px]">
            Loading cart checkout...
          </p>
        </div>
      );
    }

    if (!cart.items.length) {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center bg-white rounded-[40px] border-2 border-border/50 max-w-xl mx-auto shadow-sm">
          <h1 className="text-2xl font-black text-foreground tracking-tight mb-2 uppercase">Cart Is Empty</h1>
          <p className="text-muted font-medium max-w-sm mb-8 text-sm">
            Add at least one product to continue checkout.
          </p>
          <Link
            href="/marketplace"
            className="rounded-2xl bg-primary px-8 py-4 text-xs font-black text-white shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all uppercase tracking-widest"
          >
            Return to Marketplace
          </Link>
        </div>
      );
    }

    return <CheckoutForm cartItems={cart.items} />;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <Spinner className="h-10 w-10 text-primary" />
        <p className="animate-pulse font-black text-primary uppercase tracking-widest text-[10px]">Authenticating Order Details...</p>
      </div>
    );
  }

  if (isError || !listing) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center bg-white rounded-[40px] border-2 border-border/50 max-w-xl mx-auto shadow-sm">
        <div className="h-20 w-20 rounded-full bg-red-50 flex items-center justify-center text-red-600 mb-6 border border-red-100">
           <Package className="h-10 w-10 opacity-20" />
        </div>
        <h1 className="text-2xl font-black text-foreground tracking-tight mb-2 uppercase">Checkout Error</h1>
        <p className="text-muted font-medium max-w-sm mb-8 text-sm">Unable to find the produce you're trying to order. The listing may have expired or been removed.</p>
        <Link 
          href="/marketplace"
          className="rounded-2xl bg-primary px-8 py-4 text-xs font-black text-white shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all uppercase tracking-widest"
        >
          Return to Marketplace
        </Link>
      </div>
    );
  }

  return <CheckoutForm listing={listing} qty={qty} />;
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <header className="border-b border-border bg-white py-5 sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/marketplace" className="flex items-center gap-2 group">
             <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
                <Leaf className="h-5 w-5" />
             </div>
             <span className="text-xl font-black text-primary tracking-tight">Agri<span className="text-foreground">Hub</span></span>
          </Link>
          
          <div className="flex items-center gap-4">
             <div className="hidden sm:flex items-center gap-2 text-[9px] font-black text-muted uppercase tracking-widest">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                Bank-grade Security
             </div>
             <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 shadow-sm shadow-emerald-500/5">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest">Secured Checkout</span>
             </div>
          </div>
        </div>
      </header>

      <main className="flex-1 py-12 px-4 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [background-position:center]">
        <div className="mx-auto max-w-7xl relative">
           <div className="mb-12 text-center max-w-xl mx-auto space-y-3">
              <h1 className="text-3xl font-black text-foreground tracking-tight uppercase leading-none">Finalizing your Harvest</h1>
              <p className="text-[10px] font-bold text-muted uppercase tracking-[0.3em]">Direct from farmer &bull; Escrow Protected &bull; 2026</p>
           </div>
           
           <Suspense fallback={<div className="flex justify-center py-20"><Spinner className="h-10 w-10 text-primary" /></div>}>
              <CheckoutContent />
           </Suspense>
        </div>
      </main>

      <footer className="py-10 border-t border-border bg-white">
         <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-6 opacity-30">
               <Lock className="h-4 w-4" />
               <ShieldCheck className="h-4 w-4" />
            </div>
            <p className="text-[9px] font-bold text-muted uppercase tracking-[0.4em] text-center">
               AgriHub Secure Payments &bull; Phase 3 Technology &bull; Nigeria
            </p>
         </div>
      </footer>
    </div>
  );
}
