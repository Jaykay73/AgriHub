"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowLeft, 
  CreditCard, 
  ShieldCheck, 
  Truck, 
  MapPin, 
  CheckCircle2, 
  Wallet,
  Building2,
  Lock,
  Loader2,
  Package
} from "lucide-react";
import { formatNaira } from "@/lib/format";
import type { Listing } from "@/shared/types";

interface CheckoutFlowProps {
  listing: Listing;
  qty: number;
}

export function CheckoutFlow({ listing, qty }: CheckoutFlowProps) {
  const [step, setStep] = useState<"details" | "payment" | "processing" | "success">("details");
  const subtotal = listing.priceInKobo * qty;
  const deliveryFee = 250000; // Mock 2500 Naira
  const total = subtotal + deliveryFee;

  useEffect(() => {
    if (step === "processing") {
      const timer = setTimeout(() => setStep("success"), 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  if (step === "success") {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 animate-in zoom-in-95 duration-500">
        <div className="h-24 w-24 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-8 shadow-xl shadow-emerald-500/20 border-4 border-white">
           <CheckCircle2 className="h-12 w-12" />
        </div>
        <h1 className="text-4xl font-black text-foreground tracking-tight mb-2 text-center">Order Confirmed!</h1>
        <p className="text-muted font-medium max-w-sm text-center mb-10">Your payment of {formatNaira(total)} was successful. The farmer has been notified and is preparing your harvest.</p>
        
        <div className="flex flex-col gap-3 w-full max-w-xs">
           <Link 
             href="/buyer/orders" 
             className="w-full h-14 rounded-2xl bg-primary flex items-center justify-center text-sm font-black text-white shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all"
           >
             View Order Status
           </Link>
           <Link 
             href="/marketplace" 
             className="w-full h-14 rounded-2xl border-2 border-border bg-white flex items-center justify-center text-sm font-black text-foreground hover:bg-surface transition-all"
           >
             Continue Shopping
           </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      {/* Left Column: Forms */}
      <div className="lg:col-span-7 space-y-8">
        
        {/* Progress Header */}
        <div className="flex items-center gap-4 mb-10">
           <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-black transition-all ${step === "details" ? "bg-primary text-white shadow-lg" : "bg-emerald-100 text-emerald-600"}`}>
              {step === "details" ? "1" : <CheckCircle2 className="h-5 w-5" />}
           </div>
           <div className="h-1 w-12 rounded-full bg-border" />
           <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-black transition-all ${step === "payment" || step === "processing" ? "bg-primary text-white shadow-lg" : "bg-surface text-muted"}`}>
              2
           </div>
           <h2 className="ml-2 text-xl font-black text-foreground tracking-tight">
              {step === "details" ? "Shipping Details" : "Secure Payment"}
           </h2>
        </div>

        {step === "details" && (
          <div className="space-y-6 animate-in slide-in-from-left-5 duration-500">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                   <label className="text-xs font-black uppercase tracking-widest text-muted">Full Name</label>
                   <input className="w-full rounded-xl border-2 border-border bg-white px-4 py-3.5 text-sm font-bold focus:border-primary outline-none transition-all" placeholder="John Doe" />
                </div>
                <div className="space-y-1.5">
                   <label className="text-xs font-black uppercase tracking-widest text-muted">Phone Number</label>
                   <input className="w-full rounded-xl border-2 border-border bg-white px-4 py-3.5 text-sm font-bold focus:border-primary outline-none transition-all" placeholder="+234..." />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                   <label className="text-xs font-black uppercase tracking-widest text-muted">Delivery Address</label>
                   <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                      <input className="w-full rounded-xl border-2 border-border bg-white pl-11 pr-4 py-3.5 text-sm font-bold focus:border-primary outline-none transition-all" placeholder="House number, street, city, state" />
                   </div>
                </div>
             </div>

             <div className="rounded-2xl border-2 border-primary/20 bg-primary/5 p-6 border-dashed">
                <div className="flex gap-4">
                   <Truck className="h-6 w-6 text-primary" />
                   <div>
                      <p className="font-black text-foreground tracking-tight">Standard Logistics</p>
                      <p className="text-sm font-medium text-muted">Estimated arrival: 3-5 business days. Real-time tracking included.</p>
                   </div>
                </div>
             </div>

             <button 
               onClick={() => setStep("payment")}
               className="w-full h-16 rounded-2xl bg-primary text-sm font-black text-white shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
             >
                PROCEED TO PAYMENT
                <ArrowLeft className="h-5 w-5 rotate-180" />
             </button>
          </div>
        )}

        {step === "payment" && (
          <div className="space-y-6 animate-in slide-in-from-right-5 duration-500">
             <div className="grid grid-cols-1 gap-4">
                <button className="flex items-center gap-4 p-5 rounded-2xl border-2 border-primary bg-primary/5 text-left transition-all ring-4 ring-primary/10">
                   <div className="h-12 w-12 rounded-xl bg-white border border-border flex items-center justify-center shadow-sm">
                      <Building2 className="h-6 w-6 text-primary" />
                   </div>
                   <div className="flex-1">
                      <p className="font-black text-foreground tracking-tight">Interswitch Pay</p>
                      <p className="text-xs font-bold text-muted">Cards, USSD, Transfer</p>
                   </div>
                   <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center"><CheckCircle2 className="h-4 w-4 text-white" /></div>
                </button>

                <button className="flex items-center gap-4 p-5 rounded-2xl border-2 border-border bg-white text-left transition-all hover:border-primary/50 opacity-50 grayscale cursor-not-allowed">
                   <div className="h-12 w-12 rounded-xl bg-surface border border-border flex items-center justify-center">
                      <Wallet className="h-6 w-6 text-muted" />
                   </div>
                   <div className="flex-1">
                      <p className="font-black text-foreground tracking-tight">Wallet Balance</p>
                      <p className="text-xs font-bold text-muted">Insufficient funds</p>
                   </div>
                </button>
             </div>

             <div className="p-6 rounded-2xl bg-surface border border-border/50 text-center">
                <p className="text-sm font-medium text-muted flex items-center justify-center gap-2">
                   <Lock className="h-4 w-4" />
                   You will be redirected to Interswitch secure payment gateway.
                </p>
             </div>

             <div className="flex gap-4">
                <button 
                  onClick={() => setStep("details")}
                  className="h-16 px-6 rounded-2xl border-2 border-border bg-white text-sm font-black text-muted hover:bg-surface transition-all"
                >
                   <ArrowLeft className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => setStep("processing")}
                  className="flex-1 h-16 rounded-2xl bg-primary text-sm font-black text-white shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                >
                   PAY {formatNaira(total)} NOW
                </button>
             </div>
          </div>
        )}

        {step === "processing" && (
          <div className="min-h-[300px] flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-500">
             <div className="relative">
                <div className="h-20 w-20 rounded-full border-4 border-primary/10 border-t-primary animate-spin" />
                <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-primary animate-pulse" />
             </div>
             <p className="text-lg font-black text-foreground tracking-tight">Encrypting Transaction...</p>
             <p className="text-sm font-medium text-muted">Redirecting to Interswitch Sandbox Gateway</p>
          </div>
        )}
      </div>

      {/* Right Column: Order Summary */}
      <div className="lg:col-span-5">
        <div className="sticky top-28 space-y-6">
           <div className="rounded-[32px] border-2 border-border/50 bg-white p-8 shadow-sm">
              <h3 className="text-xl font-black text-foreground tracking-tight mb-6">Order Summary</h3>
              
              <div className="flex gap-4 p-4 rounded-2xl bg-surface border border-border/50 mb-6">
                 <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white border border-border/50 shadow-sm">
                    {listing.imageUrl ? <Image src={listing.imageUrl} alt={listing.productName} fill className="object-cover" /> : <Package className="h-10 w-10 text-muted opacity-20" />}
                 </div>
                 <div className="flex-1 flex flex-col justify-center">
                    <h4 className="font-black text-foreground line-clamp-1">{listing.productName}</h4>
                    <p className="text-xs font-bold text-muted uppercase tracking-wider">{qty} {listing.unit} • {formatNaira(listing.priceInKobo)}/{listing.unit}</p>
                 </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-border/50">
                 <div className="flex justify-between text-sm font-bold text-muted">
                    <span>Subtotal</span>
                    <span className="text-foreground">{formatNaira(subtotal)}</span>
                 </div>
                 <div className="flex justify-between text-sm font-bold text-muted">
                    <span>Delivery Fee</span>
                    <span className="text-foreground">{formatNaira(deliveryFee)}</span>
                 </div>
                 <div className="flex justify-between pt-4 border-t-2 border-dashed border-border/50">
                    <span className="text-lg font-black text-foreground tracking-tight">Grand Total</span>
                    <span className="text-2xl font-black text-primary">{formatNaira(total)}</span>
                 </div>
              </div>
           </div>

           {/* Security / Trust */}
           <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                 <ShieldCheck className="h-5 w-5 text-emerald-600" />
                 <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Escrow Protection Active</p>
              </div>
              <p className="px-6 text-[10px] font-medium text-muted leading-relaxed">
                Your payment is held securely in escrow. Funds are only released to the farmer after you confirm receipt of quality produce.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
