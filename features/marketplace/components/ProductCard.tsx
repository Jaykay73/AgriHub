'use client';

import Image from 'next/image';
import { Heart, ShoppingCart, Star, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  image: string;
  rating: number;
  location: string;
  farmer: string;
  category: string;
  isTopItem?: boolean;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-surface group relative overflow-hidden rounded-lg shadow-card transition-all hover:shadow-elevated"
    >
      {/* Top Badge */}
      {product.isTopItem && (
        <div className="absolute top-3 left-3 z-[2] rounded-full bg-accent px-3 py-1 text-[10px] font-bold text-accent-foreground uppercase tracking-widest">
          Top Item
        </div>
      )}

      {/* Favorite Button */}
      <button className="absolute top-3 right-3 z-[2] rounded-full bg-white/80 p-1.5 text-muted transition-colors hover:bg-white hover:text-red-500 backdrop-blur-sm">
        <Heart className="h-4 w-4" />
      </button>

      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-background">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-1 flex items-center gap-1 text-[10px] font-medium text-muted uppercase tracking-wider">
          <MapPin className="h-3 w-3" />
          {product.location}
        </div>
        
        <h3 className="mb-2 line-clamp-1 text-sm font-semibold text-foreground group-hover:text-primary">
          {product.name}
        </h3>

        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-1 font-bold text-primary">
            <span className="text-xs">₦</span>
            <span className="text-lg">{product.price.toLocaleString()}</span>
            <span className="text-[10px] font-normal text-muted">/{product.unit}</span>
          </div>
          
          <div className="flex items-center gap-0.5 rounded-full bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">
            <Star className="h-3 w-3 fill-accent" />
            {product.rating}
          </div>
        </div>

        {/* Action Button */}
        <button className="group/btn flex w-full items-center justify-center gap-2 rounded-lg border-2 border-primary/10 py-2.5 text-xs font-bold text-primary transition-all hover:bg-primary hover:text-white">
          <ShoppingCart className="h-3.5 w-3.5" />
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
}
