"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useListing } from "@/features/marketplace/hooks/useListing";
import { CheckoutFlow } from "@/features/orders/components/CheckoutFlow";
import { Spinner } from "@/shared/components/Spinner";
import { ArrowLeft, Package } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const listingId = searchParams?.get("listingId") || "";
  const qty = Number(searchParams?.get("qty") || "1");
  const { data: listing, isLoading, isError } = useListing(listingId);

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 text-center">
        <Spinner className="h-10 w-10 text-primary" />
        <p className="animate-pulse font-black text-primary uppercase tracking-widest text-xs">Authenticating Order Details...</p>
      </div>
    );
  }

  if (isError || !listing) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center p-8 text-center bg-white rounded-[32px] border-2 border-border/50">
        <div className="h-20 w-20 rounded-full bg-red-50 flex items-center justify-center text-red-600 mb-6 border border-red-100">
           <Package className="h-10 w-10 opacity-20" />
        </div>
        <h1 className="text-3xl font-black text-foreground tracking-tight mb-2">Checkout Error</h1>
        <p className="text-muted font-medium max-w-sm mb-8">Unable to find the produce you're trying to order. The listing may have expired.</p>
        <Link 
          href="/marketplace"
          className="rounded-2xl bg-primary px-8 py-4 text-sm font-black text-white shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all"
        >
          Return to Marketplace
        </Link>
      </div>
    );
  }

  return <CheckoutFlow listing={listing} qty={qty} />;
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Navbar Mockup for Checkout */}
      <header className="bg-white border-b border-border/50 sticky top-0 z-40 h-16 flex items-center shadow-sm">
        <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <Link href="/marketplace" className="text-xl font-black text-foreground tracking-tight">Agri<span className="text-primary">Hub</span></Link>
            <div className="flex items-center gap-3">
               <div className="flex items-center gap-1.5 rounded-full bg-surface px-4 py-1.5 border border-border/50">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted">Secured Mode</span>
               </div>
            </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Suspense fallback={<Spinner className="h-8 w-8 mx-auto" />}>
          <CheckoutContent />
        </Suspense>
      </main>
      
      <footer className="py-12 px-6 text-center text-[10px] font-bold text-muted uppercase tracking-[0.2em] opacity-40">
         AgriHub Secure Payments &bull; Phase 3 Preview &bull; 2026
      </footer>
    </div>
  );
}
