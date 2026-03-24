"use client";

import Image from "next/image";
import Link from "next/link";
import { 
  Tractor, 
  MapPin, 
  ShieldCheck, 
  ArrowRight, 
  Search,
  Star,
  ChevronRight,
  TrendingUp,
  Leaf
} from "lucide-react";
import { useFarmers } from "@/features/auth/hooks/useUser";
import { Spinner } from "@/shared/components/Spinner";
import { Navbar } from "@/features/marketplace/components/Navbar";

export default function FarmersListPage() {
  const { data: farmers = [], isLoading, isError } = useFarmers();

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      
      {/* Header / Hero */}
      <div className="bg-white border-b border-border/50 pt-16 pb-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-40 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 opacity-70" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
             <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary">
                  The Backbone of AgriHub <ChevronRight className="h-3 w-3" />
                </div>
                <h1 className="text-5xl font-black text-foreground tracking-tight sm:text-6xl">
                  Meet our <span className="text-primary underline flex-shrink-0 decoration-primary/20 decoration-8 underline-offset-8">Verified</span> Farmers
                </h1>
                <p className="mt-6 max-w-2xl font-medium text-muted leading-relaxed">
                  AgriHub connects you with over 500+ small-scale farmers across Nigeria. 
                  Every farmer is vetter for quality, fair pricing, and sustainable practices.
                </p>
             </div>
             
             {/* Stats Preview */}
             <div className="flex flex-wrap gap-4">
                <div className="bg-white border-2 border-border/50 p-6 rounded-3xl shadow-sm text-center min-w-[120px]">
                   <p className="text-3xl font-black text-primary">50k+</p>
                   <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Active Farmers</p>
                </div>
                <div className="bg-emerald-500 p-6 rounded-3xl shadow-xl shadow-emerald-500/20 text-center min-w-[120px] text-white">
                   <p className="text-3xl font-black">100%</p>
                   <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Vetted Source</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        
        {/* Search Bar for Farmers */}
        <div className="mb-12 relative max-w-xl group">
           <Search className="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-muted transition-colors group-focus-within:text-primary" />
           <input 
             type="text"
             placeholder="Search by name, location or crop specialty..."
             className="w-full rounded-[24px] border-2 border-border bg-white pl-16 pr-6 py-5 text-sm font-bold shadow-sm transition-all focus:border-primary focus:ring-8 focus:ring-primary/5 outline-none"
           />
        </div>

        {isLoading ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 bg-white rounded-[40px] border-2 border-dashed border-border/50">
             <Spinner className="h-10 w-10 text-primary" />
             <p className="font-bold text-primary animate-pulse uppercase text-xs tracking-[0.2em]">Contacting Farmer Networks...</p>
          </div>
        ) : null}

        {!isLoading && farmers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {farmers.map(farmer => (
              <div key={farmer.uid} className="group relative bg-white p-8 rounded-[40px] border-2 border-border/50 shadow-sm transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/50 hover:-translate-y-1">
                 <div className="flex items-start justify-between gap-6 mb-6">
                    <div className="h-24 w-24 rounded-3xl bg-primary/10 border-4 border-white shadow-lg flex items-center justify-center shrink-0 overflow-hidden relative">
                       {farmer.photoURL ? (
                         <Image src={farmer.photoURL} alt={farmer.name} fill className="object-cover transition-transform group-hover:scale-110" />
                       ) : (
                         <Tractor className="h-10 w-10 text-primary" />
                       )}
                    </div>
                    <div className="flex-1 space-y-2">
                       <h3 className="text-xl font-black text-foreground tracking-tight leading-tight group-hover:text-primary transition-colors">{farmer.name}</h3>
                       <div className="flex items-center gap-1.5 text-xs font-bold text-muted">
                          <MapPin className="h-3.5 w-3.5" />
                          {farmer.location || "Nigeria"}
                       </div>
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-6 mb-8 py-4 border-y border-border/50">
                    <div>
                       <p className="text-[10px] font-black uppercase text-muted tracking-widest mb-0.5">Rating</p>
                       <div className="flex items-center gap-1 font-black text-foreground leading-none">
                          <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                          4.9
                       </div>
                    </div>
                    <div className="h-6 w-px bg-border/50" />
                    <div>
                       <p className="text-[10px] font-black uppercase text-muted tracking-widest mb-0.5">Specialty</p>
                       <p className="font-black text-emerald-600 leading-none">Organic Tubers</p>
                    </div>
                 </div>

                 <Link 
                   href={`/farmer/${farmer.uid}`}
                   className="w-full h-14 rounded-2xl bg-surface flex items-center justify-between px-6 text-sm font-black text-foreground transition-all group-hover:bg-primary group-hover:text-white"
                 >
                    VIEW STOREFRONT
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                 </Link>
              </div>
            ))}
          </div>
        ) : null}

        {!isLoading && farmers.length === 0 ? (
           <div className="flex min-h-[400px] flex-col items-center justify-center p-12 bg-white rounded-[40px] border-2 border-dashed border-border/50 text-center">
              <div className="h-20 w-20 rounded-full bg-surface border border-border/50 flex items-center justify-center mb-6"><Leaf className="h-10 w-10 opacity-20" /></div>
              <h3 className="text-2xl font-black text-foreground tracking-tight mb-2 uppercase">Our Fields are Empty!</h3>
              <p className="text-muted font-medium max-w-sm mb-8 mx-auto">We're currently expanding our farmer network. No verified farmers found in this region yet. Check back soon for new harvests.</p>
           </div>
        ) : null}
      </main>
      
      <footer className="bg-foreground text-surface py-20 overflow-hidden relative">
         <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/leaf.png')] opacity-10" />
         <div className="mx-auto max-w-7xl px-4 text-center relative z-10">
            <Tractor className="h-12 w-12 mx-auto mb-6 opacity-30" />
            <h2 className="text-3xl font-black tracking-tight mb-4">Direct from farm to table.</h2>
            <p className="text-xs font-bold uppercase tracking-[0.4em] opacity-40">Connecting Agriculture &bull; Blockchain Verified &bull; 2026</p>
         </div>
      </footer>
    </div>
  );
}
