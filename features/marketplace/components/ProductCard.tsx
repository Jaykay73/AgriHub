"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { MapPin, ShoppingBag, Leaf } from "lucide-react";
import { formatNaira } from "@/lib/format";
import { useCart } from "@/features/cart/hooks/useCart";
import { cn } from "@/lib/utils";
import type { Listing } from "@/shared/types";

interface ProductCardProps {
  listing: Listing;
}

export function ProductCard({ listing }: ProductCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const { addItem, hasItem } = useCart();
  const isInCart = hasItem(listing.id);

  const handleAddToCart = () => {
    addItem({
      listingId: listing.id,
      farmerId: listing.farmerId,
      productName: listing.productName,
      unit: listing.unit,
      quantity: 1,
      availableQuantity: listing.quantity,
      priceInKobo: listing.priceInKobo,
      imageUrl: listing.imageUrl,
    });
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-[20px] border-2 border-border/50 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10">

      {/* Image Section */}
      <Link href={`/product/${listing.id}`} className="relative h-48 w-full overflow-hidden bg-surface">
        {listing.imageUrl && !imageFailed ? (
          <Image
            src={listing.imageUrl}
            alt={listing.productName}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted opacity-20">
            <Leaf className="h-8 w-8" />
          </div>
        )}

        {/* Floating Badge */}
        <div className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-sm border border-border/50 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
          <ShoppingBag className="h-3.5 w-3.5" />
        </div>
      </Link>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-0.5 flex items-center justify-between">
          <span className="text-[9px] font-black uppercase tracking-widest text-primary opacity-80">{listing.category}</span>
          <span className="text-[9px] font-bold text-muted bg-surface px-2 py-0.5 rounded-full border border-border/50">{listing.quantity} {listing.unit}</span>
        </div>

        <Link href={`/product/${listing.id}`}>
          <h3 className="line-clamp-1 text-base font-black text-foreground tracking-tight transition-colors group-hover:text-primary leading-tight">
            {listing.productName}
          </h3>
        </Link>

        <div className="mt-1.5 flex items-center gap-1.5 text-[10px] font-bold text-muted">
          <MapPin className="h-3 w-3" />
          <span className="truncate">{listing.farmerLocation || "Nigeria"} • {listing.farmerName}</span>
        </div>

        <div className="mt-4 flex items-center justify-between pt-3 border-t border-border/50">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-muted uppercase tracking-widest">Price / {listing.unit}</span>
            <span className="text-lg font-black text-primary">{formatNaira(listing.priceInKobo)}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleAddToCart}
              disabled={isInCart}
              className={cn(
                "inline-flex h-9 items-center justify-center rounded-lg border-2 px-2.5 text-[9px] font-black uppercase tracking-widest transition-all",
                isInCart
                  ? "bg-emerald-600 border-emerald-600 text-white cursor-default shadow-lg shadow-emerald-500/10"
                  : "border-border bg-white text-foreground hover:border-primary/50 hover:text-primary"
              )}
            >
              {isInCart ? "In Cart" : "Add"}
            </button>
            <Link
              href={`/product/${listing.id}`}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white shadow-lg shadow-primary/10 transition-all hover:scale-105 active:scale-95"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
