'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, ShoppingCart, ClipboardList, User, Sprout, Tractor, LayoutDashboard } from 'lucide-react';
import { useCart } from '@/features/cart/hooks/useCart';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { cn } from '@/lib/utils';

export function Navbar() {
  const { data: userData, isLoading: loading } = useCurrentUser();
  const { count: cartCount } = useCart();
  const pathname = usePathname();
  const displayName = userData?.name ?? userData?.email ?? 'Account';
  const isFarmer = userData?.role === 'farmer';

  return (
    <header className="sticky top-0 z-[50] w-full border-b border-border bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-6 lg:px-10">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group cursor-pointer">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white transition-transform group-hover:scale-110 shadow-lg shadow-primary/20">
            <Sprout className="h-6 w-6" />
          </div>
          <span className="text-xl font-black text-primary tracking-tight">Agri<span className="text-foreground">Hub</span></span>
        </Link>

        {/* Search Bar */}
        <div className="relative hidden w-full max-w-md md:block lg:max-w-xl">
          <div className="group relative flex h-12 items-center overflow-hidden rounded-full border-2 border-border/50 bg-background/50 transition-all focus-within:border-primary focus-within:bg-white focus-within:shadow-md">
            <Search className="absolute left-4 h-5 w-5 text-muted transition-colors group-focus-within:text-primary" />
            <input
              type="text"
              placeholder="Search for farm produce, location..."
              className="h-full w-full bg-transparent pl-12 pr-4 text-sm font-bold outline-none placeholder:text-muted/60"
            />
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-4 lg:gap-6">
          <NavAction 
            href="/buyer/orders" 
            icon={<ClipboardList className="h-5 w-5" />} 
            label="Orders" 
            isActive={pathname === '/buyer/orders'}
          />
          <NavAction
            href="/buyer/cart"
            icon={<ShoppingCart className="h-5 w-5" />}
            label="Cart"
            count={cartCount}
            isActive={pathname === "/buyer/cart"}
          />
          
          <div className="hidden lg:flex items-center gap-4">
            <NavAction 
              href="/farmers" 
              icon={<Tractor className="h-5 w-5" />} 
              label="Farmers" 
              isActive={pathname === '/farmers'} 
            />
          </div>
          
          <div className="h-8 w-[2px] rounded-full bg-border mx-2" />

          {loading ? (
            <div className="hidden h-10 w-28 animate-pulse rounded-full bg-slate-200 sm:block" />
          ) : userData ? (
            <div className="flex items-center gap-3">
              {isFarmer && (
                <Link
                  href="/farmer/dashboard"
                  className="hidden lg:flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-2.5 text-xs font-black text-primary transition hover:bg-primary/20"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  DASHBOARD
                </Link>
              )}
              
              <div className="flex items-center gap-2">
                <span className="hidden max-w-32 truncate text-xs font-black text-foreground lg:block">
                  {displayName.split(' ')[0]}
                </span>
                <Link
                  href="/buyer/profile"
                  className="rounded-xl border-2 border-border bg-white p-2.5 text-xs font-bold text-muted transition hover:border-primary/50 hover:text-primary"
                  title="Profile"
                >
                  <User className="h-5 w-5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-xl border-2 border-border bg-white px-5 py-2.5 text-xs font-black text-muted transition hover:border-primary/50 hover:text-primary"
              >
                LOGIN
              </Link>
              <Link
                href="/signup"
                className="hidden sm:flex rounded-xl bg-primary px-5 py-2.5 text-xs font-black text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90"
              >
                SIGN UP
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

interface NavActionProps {
  icon: React.ReactNode;
  label: string;
  count?: number;
  href: string;
  isActive?: boolean;
}

function NavAction({ icon, label, count, href, isActive }: NavActionProps) {
  return (
    <Link 
      href={href}
      className={cn(
        "group relative flex flex-col lg:flex-row items-center gap-1 lg:gap-2.5 px-3 py-2 rounded-xl transition-all duration-300",
        isActive ? "text-primary bg-primary/5" : "text-muted hover:text-primary hover:bg-surface"
      )}
    >
      <div className="relative">
        {icon}
        {count !== undefined && (
          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-black text-white shadow-sm ring-2 ring-white">
            {count}
          </span>
        )}
      </div>
      <span className="text-[10px] lg:text-xs font-black uppercase tracking-widest">{label}</span>
      {isActive && (
        <span className="absolute -bottom-[21px] left-0 h-[3px] w-full rounded-full bg-primary animate-in fade-in zoom-in-50" />
      )}
    </Link>
  );
}
