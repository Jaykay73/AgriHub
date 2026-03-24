"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Clock,
  Package,
  ChevronRight,
  Tractor,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Leaf,
  CreditCard,
  User as UserIcon,
  MapPin,
  Phone,
  Save,
  Loader2,
} from "lucide-react";
import { Badge } from "@/shared/components/Badge";
import { formatNaira } from "@/lib/format";
import { Navbar } from "@/features/marketplace/components/Navbar";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useOrders } from "@/features/orders/hooks/useOrders";
import { useDeleteOrder, useMarkOrderFailed } from "@/features/orders/hooks/useOrderActions";
import { useTransactions } from "@/features/payments/hooks/useTransactions";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { updateUser } from "@/features/auth/api/users";
import { cn } from "@/lib/utils";

type BuyerOrderTab = "all" | "pending" | "paid" | "failed" | "profile";

export default function BuyerOrdersPage() {
  const [activeTab, setActiveTab] = useState<BuyerOrderTab>("all");
  const { user } = useAuth();
  const { data: currentUser, refetch: refetchUser } = useCurrentUser();
  const { data: orders = [], isLoading, isError, refetch: refetchOrders } = useOrders(user?.uid, "buyer");
  const { data: transactions = [] } = useTransactions(user?.uid, "buyer");
  const deleteOrder = useDeleteOrder();
  const markOrderFailed = useMarkOrderFailed();

  const [saving, setSaving] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    phoneNumber: "",
    address: ""
  });

  // Sync profile form with currentUser data
  useEffect(() => {
    if (currentUser) {
      setProfileForm({
        name: currentUser.name || user?.displayName || "",
        phoneNumber: currentUser.phoneNumber || "",
        address: currentUser.address || ""
      });
    }
  }, [currentUser, user]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid) return;
    setSaving(true);
    try {
      await updateUser(user.uid, profileForm);
      await refetchUser();
    } finally {
      setSaving(false);
    }
  };

  const txByOrderId = new Map(transactions.map((tx) => [tx.orderId, tx]));

  const handleDeleteOrder = async (orderId: string) => {
    const confirmed = window.confirm("Delete this order from your list?");
    if (!confirmed) return;
    await deleteOrder.mutateAsync(orderId);
  };

  const handleMarkFailed = async (orderId: string) => {
    const confirmed = window.confirm("Mark this pending order as failed?");
    if (!confirmed) return;
    await markOrderFailed.mutateAsync(orderId);
  };

  const enrichedOrders = orders.map((order) => ({
    id: order.id,
    listingId: order.listingId,
    productName: order.productName,
    farmerName: "Verified Farmer",
    qty: order.quantity,
    unit: "Unit",
    totalPrice: order.amountInKobo,
    status: order.status,
    paymentStatus: order.paymentStatus,
    paymentReference: order.paymentReference,
    imageUrl: "",
    blockchainHash: txByOrderId.get(order.id)?.blockchainHash ?? "",
  }));

  const statusOrders = enrichedOrders.filter(
    (order) =>
      order.paymentStatus === "paid" ||
      order.paymentStatus === "failed" ||
      order.paymentStatus === "unpaid",
  );

  const filteredOrders = statusOrders.filter((order) => {
    if (activeTab === "all") return true;
    if (activeTab === "pending") return order.paymentStatus === "unpaid";
    if (activeTab === "paid") return order.paymentStatus === "paid";
    if (activeTab === "failed") return order.paymentStatus === "failed";
    return false;
  });

  const totalOrders = statusOrders.length;
  const totalSpent = statusOrders
    .filter((order) => order.paymentStatus === "paid")
    .reduce((sum, order) => sum + (order.totalPrice || 0), 0);

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
              Buyer Workspace <ChevronRight className="h-3 w-3" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
              My <span className="italic text-primary">Workspace.</span>
            </h1>
            <p className="max-w-xl text-sm font-medium leading-relaxed text-muted">
              Manage your profile, track active orders, and view past purchases.
            </p>
          </div>

          <div className="flex gap-3">
            <div className="min-w-[100px] rounded-2xl border-2 border-border/50 bg-white p-4 text-center shadow-sm">
              <p className="text-xl font-black text-primary">{totalOrders}</p>
              <p className="text-[9px] font-bold uppercase tracking-widest text-muted">Orders</p>
            </div>
            <div className="min-w-[100px] rounded-2xl border-2 border-primary/20 bg-primary/5 p-4 text-center">
              <p className="text-xl font-black text-primary">{totalSpent > 0 ? formatNaira(totalSpent) : "₦0"}</p>
              <p className="text-[9px] font-bold uppercase tracking-widest text-primary">Spent</p>
            </div>
          </div>
        </div>

        <div className="scrollbar-none mb-8 flex gap-2 overflow-x-auto pb-2">
          {["all", "pending", "paid", "failed", "profile"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as BuyerOrderTab)}
              className={cn(
                "rounded-xl px-5 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all",
                activeTab === tab 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "border-2 border-border/50 bg-white text-muted hover:bg-white/50"
              )}
            >
              {tab === "all" ? "All Orders" : tab === "profile" ? "Profile Settings" : tab}
            </button>
          ))}
        </div>

        {activeTab === "profile" ? (
          <div className="animate-in fade-in slide-in-from-bottom-5 max-w-2xl mx-auto">
             <div className="bg-white rounded-[32px] border-2 border-border/50 p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                   <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <UserIcon className="h-5 w-5" />
                   </div>
                   <div>
                      <h2 className="text-xl font-black text-foreground uppercase tracking-tight">Personal Details</h2>
                      <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Pre-fill for faster checkout</p>
                   </div>
                </div>

                <form onSubmit={handleProfileSave} className="space-y-6">
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Full Name</label>
                      <div className="relative">
                         <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                         <input
                           value={profileForm.name}
                           onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                           placeholder="Your full name"
                           className="w-full h-14 rounded-2xl border-2 border-border bg-surface pl-12 pr-4 text-sm font-bold focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                         />
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                         <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Phone Number</label>
                         <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                            <input
                              value={profileForm.phoneNumber}
                              onChange={(e) => setProfileForm({...profileForm, phoneNumber: e.target.value})}
                              placeholder="+234..."
                              className="w-full h-14 rounded-2xl border-2 border-border bg-surface pl-12 pr-4 text-sm font-bold focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                            />
                         </div>
                      </div>
                      <div className="space-y-1.5">
                         <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Email (ReadOnly)</label>
                         <div className="w-full h-14 rounded-2xl border-2 border-border bg-surface/50 px-6 flex items-center text-sm font-bold text-muted cursor-not-allowed">
                            {user?.email}
                         </div>
                      </div>
                   </div>

                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Default Shipping Address</label>
                      <div className="relative">
                         <MapPin className="absolute left-4 top-4 h-4 w-4 text-muted" />
                         <textarea
                           value={profileForm.address}
                           onChange={(e) => setProfileForm({...profileForm, address: e.target.value})}
                           rows={3}
                           placeholder="Your street address, city, state..."
                           className="w-full rounded-2xl border-2 border-border bg-surface pl-12 pr-4 py-4 text-sm font-bold focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none resize-none"
                         />
                      </div>
                   </div>

                   <button
                     type="submit"
                     disabled={saving}
                     className="w-full h-14 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20 transition-all hover:-translate-y-1 disabled:opacity-50 flex items-center justify-center gap-2"
                   >
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      {saving ? "Saving..." : "Save Profile Details"}
                   </button>
                </form>
             </div>
          </div>
        ) : (
          <div className="animate-in slide-in-from-bottom-5 flex flex-col gap-5 fade-in duration-700">
             {isLoading ? (
               <div className="rounded-2xl border-2 border-border/50 bg-white p-8 text-center text-xs font-bold text-muted">Loading harvests...</div>
             ) : isError ? (
               <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-xs font-bold text-red-700">Unable to load orders.</div>
             ) : (
                <>
                  {filteredOrders.map((order) => (
                  <div key={order.id} className="group overflow-hidden rounded-[24px] border-2 border-border/50 bg-white shadow-sm transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
                    <div className="divide-border/50 flex flex-col divide-y lg:flex-row lg:divide-x lg:divide-y-0">
                      <div className="flex flex-1 gap-6 p-6 lg:p-8">
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[18px] bg-surface transition-transform duration-500 group-hover:scale-105 sm:h-24 sm:w-24">
                          <div className="flex h-full w-full items-center justify-center text-muted opacity-20"><Leaf className="h-8 w-8" /></div>
                        </div>
                        <div className="flex flex-1 flex-col justify-center">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary opacity-60">ID: {order.id.slice(0, 8).toUpperCase()}</span>
                            <Badge status={order.status === "pending" ? "pending" : order.status === "paid" ? "paid" : "active"} />
                          </div>
                          <h3 className="mb-2 text-lg font-black uppercase tracking-tight text-foreground group-hover:text-primary transition-colors">{order.productName}</h3>
                          <div className="flex flex-wrap gap-4 text-[10px] font-bold text-muted">
                            <div className="flex items-center gap-1.5"><Tractor className="h-3.5 w-3.5 text-primary" /> Verified Farmer</div>
                            <div className="flex items-center gap-1.5"><Package className="h-3.5 w-3.5 text-primary" /> {order.qty} Units</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-center bg-surface/30 p-6 lg:w-[320px] lg:p-8">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted">Status</span>
                            <span
                              className={cn(
                                "flex items-center gap-1 text-[10px] font-black uppercase",
                                order.paymentStatus === "paid"
                                  ? "text-emerald-600"
                                  : order.paymentStatus === "failed"
                                    ? "text-red-600"
                                    : "text-amber-600",
                              )}
                            >
                              {order.paymentStatus === "paid" ? (
                                <CheckCircle2 className="h-3.5 w-3.5" />
                              ) : order.paymentStatus === "failed" ? (
                                <AlertCircle className="h-3.5 w-3.5" />
                              ) : (
                                <Clock className="h-3.5 w-3.5" />
                              )}
                              {order.paymentStatus === "paid"
                                ? "PAID"
                                : order.paymentStatus === "failed"
                                  ? "FAILED"
                                  : "PENDING"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted">Total</span>
                            <span className="text-lg font-black text-primary">{formatNaira(order.totalPrice)}</span>
                          </div>
                          <div className="flex gap-2 pt-2">
                            <button
                              onClick={() => refetchOrders()}
                              className="h-11 flex-1 rounded-xl bg-primary text-[10px] font-black text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
                            >
                              REFRESH STATUS
                            </button>
                            {order.paymentStatus === "unpaid" ? (
                              <button
                                onClick={() => handleMarkFailed(order.id)}
                                className="h-11 rounded-xl border-2 border-amber-200 bg-amber-50 px-3 text-[10px] font-black uppercase text-amber-700 transition-all hover:bg-amber-100"
                              >
                                FAIL
                              </button>
                            ) : null}
                            <button
                              onClick={() => handleDeleteOrder(order.id)}
                              className="h-11 rounded-xl border-2 border-red-200 bg-red-50 px-3 text-[10px] font-black uppercase text-red-700 transition-all hover:bg-red-100"
                            >
                              DELETE
                            </button>
                          </div>
                        </div>
                        {order.blockchainHash && (
                           <div className="mt-4 pt-4 border-t border-border flex justify-center">
                              <a href={`https://amoy.polygonscan.com/tx/${order.blockchainHash}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[9px] font-black text-muted hover:text-primary uppercase tracking-widest">
                                 <ShieldCheck className="h-3 w-3" /> TX: {order.blockchainHash.slice(0, 8)}...
                              </a>
                           </div>
                        )}
                      </div>
                    </div>
                  </div>
                  ))}
                  {!filteredOrders.length && <div className="rounded-2xl border-2 border-dashed border-border bg-white p-12 text-center text-xs font-bold text-muted">No active orders found.</div>}
                </>
             )}
          </div>
        )}

        <div className="mt-16 rounded-[24px] border-2 border-primary/10 border-dashed bg-primary/5 p-12 text-center">
          <AlertCircle className="mx-auto mb-4 h-8 w-8 text-primary opacity-40" />
          <h3 className="mb-2 text-xl font-black uppercase tracking-tight text-foreground">Need Coordination?</h3>
          <p className="mx-auto mb-6 max-w-sm text-xs font-medium text-muted leading-relaxed">Our support team and farm coordinators are available 24/7 to help with any logistics or quality issues.</p>
          <button className="rounded-xl border-2 border-border/50 bg-white px-6 py-3 text-[10px] font-black uppercase tracking-widest text-foreground transition-all hover:bg-surface hover:border-primary/50">Open Support Ticket &rarr;</button>
        </div>
      </main>
    </div>
  );
}
