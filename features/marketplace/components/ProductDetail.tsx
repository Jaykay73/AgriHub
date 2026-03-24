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
  Star, 
  Minus, 
  Plus, 
  ShoppingBag,
  Leaf,
  Clock,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/shared/components/Button";
import { Badge } from "@/shared/components/Badge";
import { formatNaira } from "@/lib/format";
import type { Listing } from "@/shared/types";

interface ProductDetailProps {
  listing: Listing;
}

export function ProductDetail({ listing }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);

  const incrementQty = () => setQuantity(prev => (prev < listing.quantity ? prev + 1 : prev));
  const decrementQty = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="min-h-screen bg-surface">
      {/* Top Nav / Breadcrumbs */}
      <div className="bg-white border-b border-border/50 sticky top-0 z-30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link 
            href="/marketplace" 
            className="flex items-center gap-2 text-sm font-black text-muted hover:text-primary transition-all group"
          >
            <div className="h-8 w-8 rounded-full bg-surface group-hover:bg-primary/10 flex items-center justify-center transition-all">
              <ArrowLeft className="h-4 w-4" />
            </div>
            Back to Marketplace
          </Link>
          <div className="flex gap-4">
            <button className="h-10 w-10 rounded-full bg-surface flex items-center justify-center hover:bg-primary/10 transition-all border border-border/50">
               <Star className="h-4 w-4 text-muted" />
            </button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[32px] border-2 border-border/50 shadow-sm overflow-hidden min-h-[600px] flex flex-col md:flex-row">
          
          {/* Image Gallery */}
          <div className="w-full md:w-1/2 bg-surface p-8 flex flex-col items-center justify-center relative border-r border-border/50">
             <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-[24px] bg-white shadow-xl shadow-primary/5">
                {listing.imageUrl ? (
                  <Image 
                    src={listing.imageUrl} 
                    alt={listing.productName} 
                    fill 
                    className="object-cover hover:scale-105 transition-all duration-700" 
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
          <div className="w-full md:w-1/2 p-10 flex flex-col">
             <div className="mb-2">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-primary">{listing.category}</span>
             </div>
             <h1 className="text-4xl font-black text-foreground tracking-tight mb-4">{listing.productName}</h1>
             
             <div className="flex items-center gap-6 mb-8 py-4 border-y border-border/50">
                <div className="flex flex-col">
                   <span className="text-xs font-black text-muted uppercase tracking-widest mb-1">Price per {listing.unit}</span>
                   <span className="text-3xl font-black text-primary">{formatNaira(listing.priceInKobo)}</span>
                </div>
                <div className="h-10 w-px bg-border/50" />
                <div className="flex flex-col">
                   <span className="text-xs font-black text-muted uppercase tracking-widest mb-1">Availability</span>
                   <span className="text-lg font-black text-foreground flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-emerald-600" />
                      {listing.quantity} {listing.unit} In Stock
                   </span>
                </div>
             </div>

             <p className="text-muted font-medium leading-relaxed mb-8">
               {listing.description || "No description provided for this listing. High-quality and fresh produce sourced directly from our verified farm partners."}
             </p>

             {/* Farmer Details */}
             <div className="bg-surface rounded-2xl p-6 border border-border/50 mb-8">
                <div className="flex items-center gap-4">
                   <div className="h-12 w-12 rounded-full bg-white border-2 border-primary flex items-center justify-center shadow-sm">
                      <User className="h-6 w-6 text-primary" />
                   </div>
                   <div>
                      <h3 className="text-lg font-black text-foreground">{listing.farmerName}</h3>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-muted">
                         <MapPin className="h-3.5 w-3.5" />
                         {listing.farmerLocation || "Location Not Set"}
                      </div>
                   </div>
                   <div className="ml-auto">
                      <Link href={`/farmer/${listing.farmerId}`} className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline underline-offset-4">View Profile &rarr;</Link>
                   </div>
                </div>
             </div>

             {/* Order Controls */}
             <div className="mt-auto space-y-6">
                <div className="flex items-center gap-6">
                   <div className="flex flex-col gap-2">
                      <label className="text-xs font-black uppercase tracking-widest text-muted">Quantity</label>
                      <div className="flex items-center gap-1 rounded-xl border-2 border-border bg-white p-1">
                         <button 
                           onClick={decrementQty}
                           className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-surface text-muted transition-all"
                         >
                            <Minus className="h-4 w-4" />
                         </button>
                         <span className="w-10 text-center font-black text-foreground">{quantity}</span>
                         <button 
                           onClick={incrementQty}
                           className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-surface text-muted transition-all"
                         >
                            <Plus className="h-4 w-4" />
                         </button>
                      </div>
                   </div>
                   
                   <div className="flex flex-col gap-2 flex-1">
                      <label className="text-xs font-black uppercase tracking-widest text-muted">Estimated Total</label>
                      <div className="h-[44px] flex items-center px-4 rounded-xl bg-primary/10 border-2 border-primary/20">
                         <span className="text-xl font-black text-primary">{formatNaira(listing.priceInKobo * quantity)}</span>
                      </div>
                   </div>
                </div>

                <div className="flex gap-4">
                   <Link 
                     href={`/checkout?listingId=${listing.id}&qty=${quantity}`}
                     className="flex-1 flex h-14 items-center justify-center gap-3 rounded-2xl bg-primary px-8 text-sm font-black text-white shadow-xl shadow-primary/20 hover:-translate-y-1 active:translate-y-0 transition-all active:scale-[0.98]"
                   >
                      <ShoppingBag className="h-5 w-5" />
                      ORDER NOW
                   </Link>
                   <button className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-border bg-white text-muted hover:border-primary/50 hover:text-primary transition-all">
                      <Truck className="h-5 w-5" />
                   </button>
                </div>
                
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
