"use client";

import { useState } from "react";
import { Navbar } from "@/features/marketplace/components/Navbar";
import { Sidebar } from "@/features/marketplace/components/Sidebar";
import { ProductGrid } from "@/features/marketplace/components/ProductGrid";
import { useListings } from "@/features/marketplace/hooks/useListings";
import { Spinner } from "@/shared/components/Spinner";
import { Search, SlidersHorizontal, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const MarketplaceView = () => {
  const [search, setSearch] = useState("");
  const category = "All";
  const { data: listings = [], isLoading, isError } = useListings({ search, category });

  return (
    <div className="min-h-screen bg-surface selection:bg-primary/20">
      <Navbar />
      
      {/* Category Navigation */}
      <div className="bg-white border-b border-border/50 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2 lg:pb-0">
             {["All Produce", "Poultry", "Tubers", "Grains", "Vegetables", "Oils", "Fruits", "Livestock"].map((cat) => (
                <button
                  key={cat}
                  className={cn(
                    "whitespace-nowrap rounded-full px-6 py-2.5 text-xs font-black uppercase tracking-widest transition-all",
                    cat === "All Produce" 
                      ? "bg-primary text-white shadow-lg shadow-primary/20" 
                      : "bg-surface text-muted hover:bg-border/50 hover:text-foreground"
                  )}
                >
                  {cat}
                </button>
             ))}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 lg:flex-row">
          {/* Sidebar - Desktop Only */}
          <div className="hidden lg:block shrink-0">
            <div className="sticky top-28">
              <div className="mb-6 flex items-center gap-2 text-primary">
                <SlidersHorizontal className="h-5 w-5" />
                <h2 className="text-lg font-black tracking-tight">Smart Filters</h2>
              </div>
              <Sidebar className="w-[300px] border-2 border-border/50 bg-white p-6 rounded-[24px] shadow-sm sticky top-0 h-auto space-y-8" />
            </div>
          </div>

          {/* Product Feed */}
          <div className="flex-1 space-y-10">
            {/* Feature Banner */}
            <div className="group relative overflow-hidden rounded-[40px] bg-primary p-12 text-white shadow-xl shadow-primary/10 transition-all hover:shadow-2xl hover:shadow-primary/20">
               <div className="absolute top-0 right-0 p-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/15 transition-all" />
               
               <div className="relative z-10 max-w-2xl space-y-6">
                  <div className="inline-block rounded-full bg-white/20 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md">
                     New Arrival
                  </div>
                  <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
                    Premium Hill Country <span className="text-white opacity-60 italic">Yams</span> Just Harvested.
                  </h2>
                  <p className="text-sm font-bold opacity-80 max-w-lg leading-relaxed">
                    Direct from Benue state. Verified organic and blockchain-tracked for ultimate quality assurance. Sourced from our best farm collective.
                  </p>
                  <button className="flex h-14 items-center gap-3 rounded-2xl bg-[#f4a261] px-8 text-xs font-black uppercase tracking-[0.2em] text-white shadow-lg shadow-[#f4a261]/20 transition-all hover:bg-[#e76f51] hover:-translate-y-1 active:translate-y-0 active:scale-[0.98]">
                     Shop Now
                     <ChevronRight className="h-4 w-4" />
                  </button>
               </div>
            </div>

            <div className="flex flex-col gap-4 border-b border-border/50 pb-6 sm:flex-row sm:items-center sm:justify-between">
               <div>
                  <h2 className="text-2xl font-black text-foreground tracking-tight">
                    {category === "All" ? "Featured Products" : category}
                    <span className="ml-3 text-sm font-bold text-muted bg-surface px-3 py-1 rounded-full border border-border/50 inline-block align-middle">
                      {listings.length} Results
                    </span>
                  </h2>
               </div>
               
               <div className="flex items-center gap-3">
                  {/* Mobile Filter Button */}
                  <button className="flex h-10 items-center gap-2 rounded-xl border-2 border-border bg-white px-4 text-xs font-bold text-foreground transition-all hover:border-primary/50 lg:hidden">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                  </button>
                  
                  <select className="flex-1 bg-white border-2 border-border/50 rounded-xl px-4 py-2.5 text-xs font-bold text-muted focus:border-primary outline-none transition-all sm:flex-none">
                     <option>Sort by: Newest</option>
                     <option>Price: Low to High</option>
                     <option>Price: High to Low</option>
                     <option>Customer Rating</option>
                  </select>
               </div>
            </div>

            {isLoading ? (
              <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-[24px] bg-white border-2 border-dashed border-border/50">
                <Spinner className="h-10 w-10" />
                <p className="font-bold text-primary animate-pulse">Loading amazing harvests...</p>
              </div>
            ) : null}
            
            {isError ? (
              <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-[24px] bg-red-50 border-2 border-dashed border-red-200 p-8 text-center">
                <div className="h-14 w-14 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                   <SlidersHorizontal className="h-6 w-6 rotate-90" />
                </div>
                <div>
                   <h3 className="text-lg font-black text-red-900 tracking-tight">Oops! Something went wrong</h3>
                   <p className="text-sm font-medium text-red-700 mt-1 max-w-sm">
                     We had trouble connecting to our fields. Please check your internet or try again later.
                   </p>
                </div>
              </div>
            ) : null}

            {!isLoading && !isError ? (
              <div className="animate-in fade-in slide-in-from-bottom-5 duration-700">
                <ProductGrid listings={listings} />
              </div>
            ) : null}
            
            {/* Empty State */}
            {!isLoading && !isError && listings.length === 0 && (
               <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-[24px] bg-white border-2 border-dashed border-border/50 p-12 text-center">
                  <div className="h-20 w-20 rounded-full bg-surface flex items-center justify-center text-muted mb-4 border border-border/50">
                     <Search className="h-10 w-10 opacity-20" />
                  </div>
                  <h3 className="text-xl font-black text-foreground tracking-tight">No products found</h3>
                  <p className="text-sm font-medium text-muted max-w-xs mx-auto">
                    Try adjusting your filters or search terms to find what you're looking for.
                  </p>
               </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
