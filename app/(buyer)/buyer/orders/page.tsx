"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ShoppingBag, 
  Clock, 
  MapPin, 
  Package, 
  ChevronRight, 
  Star, 
  Truck, 
  Tractor,
  ShieldCheck,
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  Leaf,
  CreditCard
} from "lucide-react";
import { Badge } from "@/shared/components/Badge";
import { formatNaira } from "@/lib/format";
import { Navbar } from "@/features/marketplace/components/Navbar";

// Mock Order Data for UI Preview
const MOCK_ORDERS = [
  {
    id: "ORD-92834",
    productName: "Fresh Organic Yams",
    farmerName: "Benue Valley Farms",
    qty: 5,
    unit: "Tubers",
    totalPrice: 1500000, // 15,000 Naira
    status: "paid",
    date: "March 24, 2026",
    imageUrl: "/images/yams.png",
    blockchainHash: "0x7d...f2a1"
  },
  {
    id: "ORD-92835",
    productName: "Broiler Chickens",
    farmerName: "Green Poultry Hub",
    qty: 2,
    unit: "Birds",
    totalPrice: 1200000, // 12,000 Naira
    status: "pending",
    date: "March 23, 2026",
    imageUrl: "/images/chicken.png"
  }
];

export default function BuyerOrdersPage() {
  const [activeTab, setActiveTab] = useState<"all" | "active" | "completed">("all");

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
           <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary">
                Buyer Workspace <ChevronRight className="h-3 w-3" />
              </div>
              <h1 className="text-4xl font-black text-foreground tracking-tight sm:text-5xl">
                My <span className="text-primary italic">Harvests.</span>
              </h1>
              <p className="max-w-xl font-medium text-muted leading-relaxed">
                Track your active orders, view past purchases, and manage your delivery receipts.
              </p>
           </div>
           
           {/* Order Stats */}
           <div className="flex gap-4">
              <div className="bg-white border-2 border-border/50 p-6 rounded-3xl shadow-sm text-center min-w-[120px]">
                 <p className="text-2xl font-black text-primary">2</p>
                 <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Orders</p>
              </div>
              <div className="bg-primary/5 border-2 border-primary/20 p-6 rounded-3xl text-center min-w-[120px]">
                 <p className="text-2xl font-black text-primary">₦27k</p>
                 <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Total Spent</p>
              </div>
           </div>
        </div>

        {/* Filters / Tabs */}
        <div className="flex gap-2 mb-10 overflow-x-auto pb-2 scrollbar-none">
           <button 
             onClick={() => setActiveTab("all")}
             className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === "all" ? "bg-primary text-white shadow-xl shadow-primary/20" : "bg-white text-muted hover:bg-white/50 border-2 border-border/50"}`}
           >
              All Orders
           </button>
           <button 
             onClick={() => setActiveTab("active")}
             className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === "active" ? "bg-primary text-white shadow-xl shadow-primary/20" : "bg-white text-muted hover:bg-white/50 border-2 border-border/50"}`}
           >
              Active
           </button>
           <button 
             onClick={() => setActiveTab("completed")}
             className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === "completed" ? "bg-primary text-white shadow-xl shadow-primary/20" : "bg-white text-muted hover:bg-white/50 border-2 border-border/50"}`}
           >
              Completed
           </button>
        </div>

        {/* Orders List */}
        <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
           {MOCK_ORDERS.map((order) => (
              <div key={order.id} className="bg-white border-2 border-border/50 rounded-[32px] overflow-hidden hover:border-primary/50 transition-all group shadow-sm hover:shadow-xl hover:shadow-primary/5">
                 <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-border/50">
                    
                    {/* Order Main Info */}
                    <div className="p-8 lg:p-10 flex-1 flex gap-6 sm:gap-10">
                       <div className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-[24px] overflow-hidden bg-surface group-hover:scale-105 transition-transform duration-500">
                          {order.imageUrl ? (
                             <Image src={order.imageUrl} alt={order.productName} fill className="object-cover" />
                          ) : (
                             <div className="h-full w-full flex items-center justify-center text-muted opacity-20"><Leaf className="h-10 w-10" /></div>
                          )}
                       </div>
                       
                       <div className="flex-1 flex flex-col pt-2">
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                             <span className="text-[10px] font-black uppercase tracking-widest text-primary opacity-60">ID: {order.id}</span>
                             <Badge status={order.status as any} />
                          </div>
                          <h3 className="text-xl sm:text-2xl font-black text-foreground tracking-tight mb-2 uppercase">{order.productName}</h3>
                          
                          <div className="mt-auto space-y-2">
                             <div className="flex items-center gap-2 text-sm font-bold text-muted">
                                <Tractor className="h-4 w-4 text-primary" />
                                {order.farmerName}
                             </div>
                             <div className="flex items-center gap-2 text-sm font-bold text-muted">
                                <Package className="h-4 w-4 text-primary" />
                                {order.qty} {order.unit} Ordered
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* Order Fulfillment Status */}
                    <div className="p-8 lg:p-10 bg-surface/50 lg:w-[350px] flex flex-col justify-center">
                        <div className="space-y-6">
                           <div className="flex justify-between items-center">
                              <span className="text-xs font-black uppercase tracking-widest text-muted">Payment status</span>
                              <span className="flex items-center gap-1.5 text-xs font-black text-emerald-600 uppercase">
                                 {order.status === "paid" ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                                 {order.status === "paid" ? "PAYMENT SECURED" : "PENDING GATEWAY"}
                              </span>
                           </div>
                           
                           <div className="flex justify-between items-center text-lg font-black text-foreground">
                              <span>Total Amount</span>
                              <span className="text-primary">{formatNaira(order.totalPrice)}</span>
                           </div>

                           <div className="pt-4 flex gap-3">
                              {order.status === "paid" ? (
                                <button className="flex-1 h-12 rounded-xl bg-primary text-xs font-black text-white shadow-lg shadow-primary/20 hover:-translate-y-1 transition-all">
                                   TRACK LOGISTICS
                                </button>
                              ) : (
                                <Link 
                                  href={`/checkout?listingId=demo&qty=${order.qty}`}
                                  className="flex-1 h-12 rounded-xl bg-orange-500 text-xs font-black text-white shadow-lg shadow-orange-500/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 uppercase"
                                >
                                   <CreditCard className="h-4 w-4" />
                                   PROCEED TO PAY
                                </Link>
                              )}
                              <button className="h-12 w-12 rounded-xl bg-white border-2 border-border flex items-center justify-center text-muted hover:border-primary/50 transition-all">
                                 <ChevronRight className="h-5 w-5" />
                              </button>
                           </div>
                        </div>

                        {/* Blockchain Proof (Mock) */}
                        {order.blockchainHash && (
                          <div className="mt-8 pt-6 border-t border-border/50 flex items-center justify-center">
                             <div className="flex items-center gap-2 text-[10px] font-black text-muted uppercase tracking-[0.2em] hover:text-primary cursor-pointer transition-colors group/hash">
                                <ShieldCheck className="h-3.5 w-3.5" />
                                <span>Verified on Polygon: {order.blockchainHash}</span>
                                <ExternalLink className="h-3 w-3 opacity-0 group-hover/hash:opacity-100 transition-opacity" />
                             </div>
                          </div>
                        )}
                    </div>
                 </div>
              </div>
           ))}
        </div>

        {/* Support Section */}
        <div className="mt-20 p-12 rounded-[40px] bg-primary/5 border-2 border-primary/20 border-dashed text-center">
           <AlertCircle className="h-10 w-10 text-primary mx-auto mb-4" />
           <h3 className="text-2xl font-black text-foreground tracking-tight mb-2 uppercase">Need help with an order?</h3>
           <p className="text-muted font-medium max-w-sm mx-auto mb-8">Out support team and farm coordinators are available 24/7 to resolve any logistics issues.</p>
           <button className="bg-white border-2 border-border/50 px-8 py-4 rounded-2xl text-sm font-black text-foreground hover:bg-surface transition-all">
              OPEN SUPPORT TICKET &rarr;
           </button>
        </div>
      </main>
    </div>
  );
}
