"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, ShoppingBag, Leaf } from "lucide-react";
import { formatNaira } from "@/lib/format";
import type { Listing } from "@/shared/types";

interface ProductCardProps {
  listing: Listing;
}

export function ProductCard({ listing }: ProductCardProps) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-[24px] border-2 border-border/50 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10">
      
      {/* Image Section */}
      <Link href={`/product/${listing.id}`} className="relative h-56 w-full overflow-hidden bg-surface">
        {listing.imageUrl ? (
          <Image
            src={listing.imageUrl}
            alt={listing.productName}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted opacity-20">
             <Leaf className="h-10 w-10" />
          </div>
        )}
        
        {/* Floating Badge */}
        <div className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-sm border border-border/50 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
           <ShoppingBag className="h-4 w-4" />
        </div>
      </Link>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest text-primary opacity-80">{listing.category}</span>
          <span className="text-[10px] font-bold text-muted bg-surface px-2 py-0.5 rounded-full border border-border/50">{listing.quantity} {listing.unit}</span>
        </div>
        
        <Link href={`/product/${listing.id}`}>
          <h3 className="line-clamp-1 text-lg font-black text-foreground tracking-tight transition-colors group-hover:text-primary">
            {listing.productName}
          </h3>
        </Link>
        
        <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-muted">
          <MapPin className="h-3.5 w-3.5" />
          <span className="truncate">{listing.farmerLocation || "Nigeria"} • {listing.farmerName}</span>
        </div>

        <div className="mt-4 flex items-center justify-between pt-4 border-t border-border/50">
           <div className="flex flex-col">
              <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Price / {listing.unit}</span>
              <span className="text-xl font-black text-primary">{formatNaira(listing.priceInKobo)}</span>
           </div>
           
           <Link 
             href={`/product/${listing.id}`}
             className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20 transition-all hover:scale-110 active:scale-95"
           >
              <ShoppingBag className="h-4 w-4" />
           </Link>
        </div>
      </div>
    </div>
  );
}
