'use client';

import * as React from 'react';
import { LayoutGrid, ListFilter, SlidersHorizontal, ChevronRight, Sprout } from 'lucide-react';
import { Navbar } from '@/features/marketplace/components/Navbar';
import { Sidebar } from '@/features/marketplace/components/Sidebar';
import { ProductCard, type Product } from '@/features/marketplace/components/ProductCard';
import { cn } from '@/lib/utils';

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Fresh Organic Brown Eggs',
    price: 3500,
    unit: 'Crate',
    image: 'https://images.unsplash.com/photo-1598965402089-897ce52e8355?q=80&w=800&auto=format&fit=crop', // Organic Eggs
    rating: 4.8,
    location: 'Oyo State, NG',
    farmer: 'Grace Farms',
    category: 'Poultry',
    isTopItem: true,
  },
  {
    id: '2',
    name: 'Giant Yam Tubers (Puna)',
    price: 12500,
    unit: '5 Tubers',
    image: '/images/yams.png', // Replaced 404
    rating: 4.5,
    location: 'Benue State, NG',
    farmer: 'Emeka & Sons',
    category: 'Tubers',
  },
  {
    id: '3',
    name: 'Whole Broiler Chicken (Frozen)',
    price: 5500,
    unit: 'Unit',
    image: '/images/chicken.png', // Replaced 404
    rating: 4.9,
    location: 'Ogun State, NG',
    farmer: 'Poultry Paradise',
    category: 'Poultry',
    isTopItem: true,
  },
  {
    id: '4',
    name: 'Red Hot Chili Peppers (Habanero)',
    price: 2500,
    unit: 'Basket',
    image: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?q=80&w=800&auto=format&fit=crop', // Peppers
    rating: 4.2,
    location: 'Kano State, NG',
    farmer: 'Amina Veggies',
    category: 'Vegetables',
  },
  {
    id: '5',
    name: 'Refined Palm Oil',
    price: 18000,
    unit: '25L',
    image: '/images/yams.png', // Replaced 404
    rating: 4.7,
    location: 'Edo State, NG',
    farmer: 'Green Palms Ltd',
    category: 'Oils',
  },
  {
    id: '6',
    name: 'Stone-free Local Rice (Ofada)',
    price: 45000,
    unit: '50kg Bag',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=800&auto=format&fit=crop', // Rice bag
    rating: 4.6,
    location: 'Abakiliki, Ebonyi',
    farmer: 'Ebonyi Gold',
    category: 'Grains',
    isTopItem: true,
  },
];

const CATEGORIES = [
  'All Produce',
  'Poultry',
  'Tubers',
  'Grains',
  'Vegetables',
  'Oils',
  'Fruits',
  'Livestock',
];

export default function LandingPage() {
  const [activeTab, setActiveTab] = React.useState('All Produce');

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="mx-auto mt-6 max-w-[1440px] px-6 lg:px-10">
        <div className="flex gap-10">
          
          {/* Sidebar Filters */}
          <Sidebar className="hidden lg:block" />

          {/* Main Content Area */}
          <div className="flex-1">
            
            {/* Top Navigation & Status */}
            <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              
              {/* Category Tabs */}
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveTab(cat)}
                    className={cn(
                      "rounded-full px-5 py-2.5 text-xs font-bold transition-all hover:shadow-sm",
                      activeTab === cat 
                        ? "bg-primary text-white shadow-md shadow-primary/20" 
                        : "bg-surface text-muted border-2 border-border/10 hover:border-primary/50 hover:text-primary"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* View Options */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 rounded-xl bg-surface p-1 shadow-sm border border-border/20">
                  <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors">
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button className="flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-border/20 hover:text-foreground">
                    <ListFilter className="h-4 w-4" />
                  </button>
                </div>
                <button className="flex h-11 items-center gap-2 rounded-xl bg-surface px-4 text-xs font-bold text-muted border border-border/20 shadow-sm transition-all hover:border-primary/50 hover:text-primary lg:hidden">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </button>
              </div>
            </div>

            {/* Banner Segment (Optional decoration) */}
            <div className="mb-10 overflow-hidden rounded-[24px] bg-primary p-10 text-white shadow-elevated relative">
              <div className="relative z-[2] max-w-sm">
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                   New Arrival
                </div>
                <h2 className="mb-4 text-3xl font-black leading-tight tracking-tight">
                  Premium Hill Country <span className="text-accent">Yams</span> Just Harvested.
                </h2>
                <p className="mb-8 text-sm font-medium text-white/80 leading-relaxed">
                  Direct from Benue state. Verified organic and blockchain-tracked for ultimate quality assurance.
                </p>
                <button className="flex items-center gap-2 rounded-xl bg-accent px-8 py-3.5 text-xs font-black text-accent-foreground shadow-lg shadow-accent/20 transition-transform hover:scale-105">
                  Shop Now
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              
              {/* Background Shapes */}
              <div className="absolute top-0 right-0 h-full w-1/2 bg-[url('https://www.transparenttextures.com/patterns/leaf.png')] opacity-10 pointer-events-none" />
              <div className="absolute -top-10 -right-10 h-64 w-64 rounded-full bg-accent/20 blur-[80px]" />
            </div>

            {/* Product Grid */}
            <div className="mb-20 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {MOCK_PRODUCTS.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination / Load More */}
            <div className="flex items-center justify-center pb-20">
              <button className="group flex items-center gap-3 rounded-full border-2 border-primary bg-white px-10 py-4 text-sm font-black text-primary transition-all hover:bg-primary hover:text-white shadow-lg shadow-primary/10">
                Load More Produce
                <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Quick Access Footer (Minimal) */}
      <footer className="border-t border-border bg-surface py-12">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-10 flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
              <Sprout className="h-5 w-5" />
            </div>
            <span className="text-lg font-black text-primary">Agri<span className="text-accent">Hub</span></span>
          </div>
          <p className="text-xs font-medium text-muted">© 2026 AgriHub Marketplace. Bridging the gap from farm to table.</p>
          <div className="flex gap-8 text-[11px] font-bold uppercase tracking-widest text-muted">
            <a href="#" className="hover:text-primary">Contact</a>
            <a href="#" className="hover:text-primary">Privacy</a>
            <a href="#" className="hover:text-primary">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
