"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Sprout, LayoutDashboard, LayoutList, ClipboardList, Settings, LogOut, Menu, X, Tractor, Wallet } from "lucide-react";
import { signOut } from "@/features/auth/api/firebaseAuthHelpers";

export default function FarmerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      router.push("/login");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  };

  const navLinks = [
    { name: "Overview", href: "/farmer/dashboard", icon: LayoutDashboard },
    { name: "My Listings", href: "/farmer/listings", icon: LayoutList },
    { name: "Orders", href: "/farmer/orders", icon: ClipboardList },
    { name: "Loans", href: "/farmer/loans", icon: Wallet },
    { name: "Settings", href: "/farmer/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-background border-r border-border transition-transform duration-300 lg:static lg:block lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center px-6 border-b border-border">
          <Link href="/farmer/dashboard" className="flex items-center gap-2 group cursor-pointer" onClick={() => setSidebarOpen(false)}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-110">
              <Sprout className="h-5 w-5" />
            </div>
            <span className="text-xl font-black text-foreground tracking-tight">Agri<span className="text-primary">Hub</span></span>
          </Link>
          <button 
            className="ml-auto lg:hidden text-muted hover:text-foreground"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-1 p-4">
          <div className="px-3 mb-2">
            <p className="text-xs font-bold uppercase tracking-wider text-muted">Main Menu</p>
          </div>
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            const Icon = link.icon;
            
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-all ${
                  isActive
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-muted hover:bg-surface hover:text-foreground"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-muted"}`} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-border">
          <div className="flex items-center gap-3 rounded-xl bg-surface p-3 mb-3 border border-border/50">
            <div className="h-10 w-10 overflow-hidden rounded-full bg-primary/10 flex items-center justify-center">
              <Tractor className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-bold text-foreground">Farmer Account</p>
              <p className="truncate text-xs text-muted">Verified Seller</p>
            </div>
          </div>
          <button
            type="button"
            disabled={signingOut}
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60"
          >
            <LogOut className="h-5 w-5" />
            {signingOut ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center border-b border-border bg-background px-4 lg:px-8">
          <button
            className="mr-4 lg:hidden text-muted hover:text-foreground"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="ml-auto flex items-center gap-4">
            <Link href="/marketplace" className="text-sm font-bold text-primary hover:underline">
              View Marketplace
            </Link>
            <div className="h-8 w-8 rounded-full bg-primary/20 cursor-pointer border-2 border-primary border-opacity-50 hover:border-opacity-100 transition-colors" />
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-4 lg:p-8">
          <div className="mx-auto max-w-5xl">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
