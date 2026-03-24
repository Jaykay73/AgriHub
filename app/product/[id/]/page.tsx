"use client";

import { useParams } from "next/navigation";
import { useListing } from "@/features/marketplace/hooks/useListing";
import { ProductDetail } from "@/features/marketplace/components/ProductDetail";
import { Spinner } from "@/shared/components/Spinner";
import { ArrowLeft, Leaf } from "lucide-react";
import Link from "next/link";

export default function ProductDetailPage() {
  const { id } = useParams() as { id: string };
  const { data: listing, isLoading, isError } = useListing(id);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface">
        <Spinner className="h-10 w-10 text-primary" />
        <p className="animate-pulse font-black text-primary uppercase tracking-widest text-xs">Preparing product view...</p>
      </div>
    );
  }

  if (isError || !listing) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-surface text-center">
        <div className="h-20 w-20 rounded-full bg-red-50 flex items-center justify-center text-red-600 mb-6 border border-red-100">
           <Leaf className="h-10 w-10 opacity-20" />
        </div>
        <h1 className="text-3xl font-black text-foreground tracking-tight mb-2">Product Not Found</h1>
        <p className="text-muted font-medium max-w-sm mb-8">This listing may have been removed or is no longer active. Let's find you some other fresh produce.</p>
        <Link 
          href="/marketplace"
          className="rounded-2xl bg-primary px-8 py-4 text-sm font-black text-white shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all"
        >
          Back to Marketplace
        </Link>
      </div>
    );
  }

  return <ProductDetail listing={listing} />;
}
