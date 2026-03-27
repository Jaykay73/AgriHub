"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowLeft, 
  MapPin, 
  ShieldCheck, 
  Truck, 
  User, 
  Minus, 
  Plus, 
  ShoppingBag,
  Leaf,
  Clock,
  CheckCircle2
} from "lucide-react";
import { Badge } from "@/shared/components/Badge";
import { useCart } from "@/features/cart/hooks/useCart";
import { Navbar } from "@/features/marketplace/components/Navbar";
import { formatNaira } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Listing } from "@/shared/types";

interface ProductDetailProps {
  listing: Listing;
}

export function ProductDetail({ listing }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [cartMessage, setCartMessage] = useState("");
  const [imageFailed, setImageFailed] = useState(false);
  const { addItem, hasItem } = useCart();
  const isInCart = hasItem(listing.id);

  const incrementQty = () => setQuantity(prev => (prev < listing.quantity ? prev + 1 : prev));
  const decrementQty = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  const handleAddToCart = () => {
    const result = addItem({
      listingId: listing.id,
      farmerId: listing.farmerId,
      productName: listing.productName,
      unit: listing.unit,
      quantity,
      availableQuantity: listing.quantity,
      priceInKobo: listing.priceInKobo,
      imageUrl: listing.imageUrl,
    });
    if (result.replacedDifferentSeller) {
      setCartMessage(
        "Cart had items from another seller. Replaced with this seller only.",
      );
      return;
    }
    setCartMessage("Added to cart.");
  };

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 text-sm font-black text-muted hover:text-primary transition-all group"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Marketplace
          </Link>
        </div>
        <div className="bg-white rounded-[24px] border-2 border-border/50 shadow-sm overflow-hidden flex flex-col md:flex-row">
          
          {/* Image Gallery */}
          <div className="w-full md:w-1/2 bg-surface p-8 flex flex-col items-center justify-center relative border-r border-border/50">
             <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-[24px] bg-white shadow-xl shadow-primary/5">
                {listing.imageUrl && !imageFailed ? (
                  <Image 
                    src={listing.imageUrl} 
                    alt={listing.productName} 
                    fill 
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover hover:scale-105 transition-all duration-700" 
                    onError={() => setImageFailed(true)}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted opacity-20"><Leaf className="h-32 w-32" /></div>
                )}
             </div>
             
             {/* Product Badges on Image */}
             <div className="absolute top-12 left-12 flex flex-col gap-2">
                <Badge status="active" />
                <div className="bg-white border-2 border-primary/20 rounded-full px-3 py-1 flex items-center gap-1.5 shadow-sm">
                   <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                   <span className="text-[10px] font-black uppercase text-primary tracking-widest">Verified 100%</span>
                </div>
             </div>
          </div>

          {/* Product Info */}
          <div className="w-full md:w-1/2 p-8 flex flex-col">
             <div className="mb-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary leading-none">Market &gt; {listing.category}</span>
             </div>
             <h1 className="text-2xl font-black text-foreground tracking-tight mb-3 leading-tight">{listing.productName}</h1>
             
             <div className="flex items-center gap-5 mb-6 py-4 border-y border-border/50">
                <div className="flex flex-col">
                   <span className="text-[9px] font-black text-muted uppercase tracking-widest mb-1">Price / {listing.unit}</span>
                   <span className="text-xl font-black text-primary leading-none">{formatNaira(listing.priceInKobo)}</span>
                </div>
                <div className="h-8 w-px bg-border/50" />
                <div className="flex flex-col">
                   <span className="text-[9px] font-black text-muted uppercase tracking-widest mb-1">Inventory</span>
                   <span className="text-base font-black text-foreground flex items-center gap-1.5 leading-none">
                      <Clock className="h-3.5 w-3.5 text-emerald-600" />
                      {listing.quantity} {listing.unit}
                   </span>
                </div>
             </div>

             <p className="text-xs font-bold text-muted/80 leading-relaxed mb-6">
               {listing.description || "High-quality produce sourced directly from our verified farm partners."}
             </p>

             {/* Farmer Details */}
             <div className="bg-surface rounded-xl p-4 border border-border/50 mb-6">
                <div className="flex items-center gap-3">
                   <div className="h-9 w-9 rounded-lg bg-white border-2 border-primary flex items-center justify-center shadow-sm">
                      <User className="h-4 w-4 text-primary" />
                   </div>
                   <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-black text-foreground truncate">{listing.farmerName}</h3>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted">
                         <MapPin className="h-3 w-3" />
                         <span className="truncate">{listing.farmerLocation || "Location Not Set"}</span>
                      </div>
                   </div>
                   <div className="ml-auto">
                      <Link href={`/farmer/${listing.farmerId}`} className="text-[9px] font-black uppercase tracking-widest text-primary hover:underline underline-offset-4">Profile &rarr;</Link>
                   </div>
                </div>
             </div>

              {/* Order Controls */}
              <div className="mt-auto space-y-5">
                <div className="flex items-center gap-4">
                   <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-black uppercase tracking-widest text-muted">Stock Amount</label>
                      <div className="flex items-center gap-0.5 rounded-lg border-2 border-border bg-white p-0.5">
                         <button 
                           onClick={decrementQty}
                           className="h-7 w-7 rounded-md flex items-center justify-center hover:bg-surface text-muted transition-all"
                         >
                            <Plus className="h-3 w-3 rotate-45" />
                         </button>
                         <span className="w-8 text-center text-sm font-black text-foreground">{quantity}</span>
                         <button 
                           onClick={incrementQty}
                           className="h-7 w-7 rounded-md flex items-center justify-center hover:bg-surface text-muted transition-all"
                         >
                            <Plus className="h-3 w-3" />
                         </button>
                      </div>
                   </div>
                   
                   <div className="flex flex-col gap-1.5 flex-1">
                      <label className="text-[9px] font-black uppercase tracking-widest text-muted">Grand Total</label>
                      <div className="h-[36px] flex items-center px-4 rounded-lg bg-primary/5 border border-primary/10">
                         <span className="text-lg font-black text-primary">{formatNaira(listing.priceInKobo * quantity)}</span>
                      </div>
                   </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={isInCart}
                    className={cn(
                      "flex-1 flex h-11 items-center justify-center gap-2 rounded-xl px-6 text-[10px] font-black uppercase tracking-widest text-white transition-all shadow-md shadow-primary/10",
                      isInCart
                        ? "bg-emerald-600 cursor-default"
                        : "bg-primary hover:bg-primary/90 active:scale-[0.98]"
                    )}
                    title="Add to cart"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    {isInCart ? "Already in Cart" : "Secure Harvest"}
                  </button>
                  <Link
                    href="/buyer/cart"
                    className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-border bg-white text-muted hover:border-primary/50 hover:text-primary transition-all transition-colors"
                    title="Go to cart"
                  >
                    <Truck className="h-4 w-4" />
                  </Link>
                </div>
                {cartMessage ? (
                  <div className="flex flex-wrap items-center gap-2 text-[10px] font-black text-primary border-t border-border/50 pt-2">
                    <span>{cartMessage}</span>
                    <Link href="/buyer/cart" className="underline underline-offset-4 uppercase tracking-widest ml-auto">
                      Checkout &rarr;
                    </Link>
                  </div>
                ) : null}
                
                <div className="flex items-center gap-6 text-[10px] font-black text-muted uppercase tracking-[0.2em] pt-4 justify-center">
                   <div className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-emerald-600" /> Fast Delivery</div>
                   <div className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-emerald-600" /> Secure Payment</div>
                   <div className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-emerald-600" /> Freshness Guaranteed</div>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
