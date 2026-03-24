'use client';

import { Search, ShoppingCart, Heart, ClipboardList, User, Sprout } from 'lucide-react';

export function Navbar() {
  return (
    <header className="sticky top-0 z-[50] w-full border-b border-border bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-6 lg:px-10">
        
        {/* Logo */}
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white transition-transform group-hover:scale-110">
            <Sprout className="h-6 w-6" />
          </div>
          <span className="text-xl font-black text-primary tracking-tight">Agri<span className="text-accent">Hub</span></span>
        </div>

        {/* Search Bar */}
        <div className="relative hidden w-full max-w-xl md:block">
          <div className="group relative flex h-12 items-center overflow-hidden rounded-full border-2 border-border/50 bg-background/50 transition-all focus-within:border-primary focus-within:bg-white focus-within:shadow-md">
            <Search className="absolute left-4 h-5 w-5 text-muted transition-colors group-focus-within:text-primary" />
            <input
              type="text"
              placeholder="Search for farm produce, location..."
              className="h-full w-full bg-transparent pl-12 pr-4 text-sm font-medium outline-none placeholder:text-muted"
            />
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center gap-1 sm:gap-4 md:gap-6">
          <NavAction icon={<ClipboardList className="h-5 w-5" />} label="Orders" />
          <NavAction icon={<Heart className="h-5 w-5" />} label="Favourites" />
          <NavAction icon={<ShoppingCart className="h-5 w-5" />} label="Cart" count={12} />
          
          <div className="h-8 w-[2px] rounded-full bg-border" />
          
          <button className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-primary/10 transition-transform hover:scale-110">
            <User className="h-5 w-5 text-primary" />
          </button>
        </div>
      </div>
    </header>
  );
}

function NavAction({ icon, label, count }: { icon: React.ReactNode; label: string; count?: number }) {
  return (
    <button className="group relative flex items-center gap-2 text-muted transition-colors hover:text-primary max-sm:p-2">
      <div className="relative">
        {icon}
        {count !== undefined && (
          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-black text-accent-foreground shadow-sm">
            {count}
          </span>
        )}
      </div>
      <span className="hidden text-xs font-bold sm:block">{label}</span>
    </button>
  );
}
