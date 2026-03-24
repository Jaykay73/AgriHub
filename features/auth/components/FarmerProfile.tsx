"use client";

import Image from "next/image";
import Link from "next/link";
import { 
  MapPin, 
  Leaf, 
  ShieldCheck, 
  Calendar, 
  Package, 
  ArrowLeft,
  Tractor,
  Star,
  CheckCircle2,
  Clock
} from "lucide-react";
import { useUser } from "@/features/auth/hooks/useUser";
import { useFarmerListings } from "@/features/listings/hooks/useFarmerListings";
import { ProductCard } from "@/features/marketplace/components/ProductCard";
import { Spinner } from "@/shared/components/Spinner";
import { formatNaira } from "@/lib/format";
import type { User, Listing } from "@/shared/types";

interface FarmerProfileProps {
  farmer: User;
  listings: Listing[];
}

export function FarmerProfile({ farmer, listings }: FarmerProfileProps) {
  const activeListings = listings.filter(l => l.status === "active");

  return (
    <div className="min-h-screen bg-surface">
      {/* Profile Header Block */}
      <div className="bg-white border-b border-border/50 pt-8 pb-32 relative overflow-hidden">
         <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
         
         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <Link 
              href="/farmers"
              className="inline-flex items-center gap-2 text-sm font-black text-muted hover:text-primary transition-all mb-8 bg-surface px-4 py-2 rounded-xl border border-border/50"
            >
              <ArrowLeft className="h-4 w-4" />
              All Farmers
            </Link>

            <div className="flex flex-col md:flex-row items-start md:items-end gap-8">
               <div className="relative group">
                  <div className="h-32 w-32 md:h-40 md:w-40 rounded-[32px] bg-primary/10 border-4 border-white shadow-xl flex items-center justify-center overflow-hidden">
                     {farmer.photoURL ? (
                       <Image src={farmer.photoURL} alt={farmer.name} fill className="object-cover" />
                     ) : (
                       <Tractor className="h-16 w-16 text-primary" />
                     )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center text-white shadow-lg">
                     <ShieldCheck className="h-5 w-5" />
                  </div>
               </div>

               <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                     <h1 className="text-4xl font-black text-foreground tracking-tight">{farmer.name}</h1>
                     <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">
                        Verified Farmer
                     </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-muted">
                     <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        {farmer.location || "Nigeria"}
                     </div>
                     <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        Partner since 2026
                     </div>
                     <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        4.9 Rating
                     </div>
                  </div>
               </div>

               <div className="flex gap-4 pb-2">
                  <div className="bg-white p-4 rounded-2xl border-2 border-border shadow-sm text-center min-w-[100px]">
                     <p className="text-2xl font-black text-primary">{activeListings.length}</p>
                     <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Listings</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border-2 border-border shadow-sm text-center min-w-[100px]">
                     <p className="text-2xl font-black text-primary">150+</p>
                     <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Sales</p>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 -mt-16 pb-20 sm:px-6 lg:px-8 relative z-20">
         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Stats */}
            <div className="lg:col-span-1 space-y-6">
               <div className="bg-white p-6 rounded-[24px] border-2 border-border/50 shadow-sm space-y-6">
                  <h3 className="text-lg font-black text-foreground border-b border-border/50 pb-4">Farm Details</h3>
                  
                  <div className="space-y-4">
                     <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-lg bg-surface flex items-center justify-center shrink-0"><Leaf className="h-4 w-4 text-emerald-600" /></div>
                        <div>
                           <p className="text-xs font-bold text-muted uppercase tracking-widest">Specialty</p>
                           <p className="text-sm font-black text-foreground">Organic Root Vegetables</p>
                        </div>
                     </div>
                     <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-lg bg-surface flex items-center justify-center shrink-0"><Clock className="h-4 w-4 text-emerald-600" /></div>
                        <div>
                           <p className="text-xs font-bold text-muted uppercase tracking-widest">Avg. Delivery</p>
                           <p className="text-sm font-black text-foreground">24 - 48 Hours</p>
                        </div>
                     </div>
                     <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-lg bg-surface flex items-center justify-center shrink-0"><CheckCircle2 className="h-4 w-4 text-emerald-600" /></div>
                        <div>
                           <p className="text-xs font-bold text-muted uppercase tracking-widest">Quality Score</p>
                           <p className="text-sm font-black text-foreground text-emerald-600">Legendary (A+)</p>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="bg-primary p-8 rounded-[24px] shadow-xl shadow-primary/20 text-white text-center">
                   <ShieldCheck className="h-10 w-10 mx-auto mb-4 opacity-50" />
                   <h4 className="text-lg font-black mb-2 tracking-tight">Escrow Protected</h4>
                   <p className="text-xs font-bold opacity-80 leading-relaxed uppercase tracking-widest">Your payments to this farmer are held in escrow until delivery.</p>
               </div>
            </div>

            {/* Farmer Listings Feed */}
            <div className="lg:col-span-3 space-y-8">
               <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black text-foreground tracking-tight flex items-center gap-3">
                     <Package className="h-6 w-6 text-primary" />
                     {farmer.name}&apos;s Storefront
                  </h2>
                  <div className="text-sm font-bold text-muted">
                    Showing {activeListings.length} products
                  </div>
               </div>

               {activeListings.length > 0 ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-in slide-in-from-bottom-5 duration-500">
                    {activeListings.map(listing => (
                      <ProductCard key={listing.id} listing={listing} />
                    ))}
                 </div>
               ) : (
                 <div className="bg-white border-2 border-dashed border-border p-20 rounded-[32px] text-center flex flex-col items-center">
                    <div className="h-16 w-16 bg-surface rounded-full flex items-center justify-center mb-4"><Package className="h-8 w-8 text-muted opacity-20" /></div>
                    <p className="text-lg font-black text-foreground">No active listings</p>
                    <p className="text-sm font-medium text-muted max-w-xs mx-auto mt-1">This farmer is currently between harvests. Check back later for new produce.</p>
                 </div>
               )}
            </div>
         </div>
      </main>
    </div>
  );
}
