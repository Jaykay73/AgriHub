"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useCreateOrder } from "@/features/orders/hooks/useCreateOrder";
import { useInitiatePayment } from "@/features/payments/hooks/useInitiatePayment";
import { updateUser } from "@/features/auth/api/users";
import { formatNaira } from "@/lib/format";
import { 
  ShieldCheck, 
  Lock, 
  Truck, 
  Info, 
  CreditCard, 
  ChevronRight,
  MapPin,
  Phone,
  User as UserIcon,
  Leaf
} from "lucide-react";
import type { CartItem } from "@/shared/types";

type Props = {
  listing?: any;
  qty?: number;
  cartItems?: CartItem[];
};

const DELIVERY_FEE_IN_KOBO = 250000;

type CheckoutLine = {
  listingId: string;
  farmerId: string;
  productName: string;
  unit: string;
  qty: number;
  priceInKobo: number;
};

const splitDeliveryAcrossItems = (baseAmounts: number[], deliveryFee: number) => {
  if (!baseAmounts.length || deliveryFee <= 0) return baseAmounts.map(() => 0);
  const totalBase = baseAmounts.reduce((sum, value) => sum + value, 0) || 1;
  const shares = baseAmounts.map((amount) => Math.floor((deliveryFee * amount) / totalBase));
  const remainder = deliveryFee - shares.reduce((sum, value) => sum + value, 0);
  shares[shares.length - 1] += remainder;
  return shares;
};

export const CheckoutForm = ({ listing, qty = 1, cartItems = [] }: Props) => {
  const { user } = useAuth();
  const { data: currentUser } = useCurrentUser();
  const createOrder = useCreateOrder();
  const initiatePayment = useInitiatePayment();
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [error, setError] = useState("");
  const isCartCheckout = cartItems.length > 0;

  // Sync with current user profile if available
  useEffect(() => {
    if (currentUser) {
      if (!buyerName && currentUser.name) setBuyerName(currentUser.name);
      if (!buyerPhone && currentUser.phoneNumber) setBuyerPhone(currentUser.phoneNumber);
      if (!deliveryAddress && (currentUser.address || currentUser.location)) {
        setDeliveryAddress(currentUser.address || currentUser.location || "");
      }
    }
  }, [currentUser]);

  const lines: CheckoutLine[] = isCartCheckout
    ? cartItems.map((item) => ({
        listingId: item.listingId,
        farmerId: item.farmerId,
        productName: item.productName,
        unit: item.unit,
        qty: item.quantity,
        priceInKobo: item.priceInKobo,
      }))
    : listing
      ? [
          {
            listingId: listing.id,
            farmerId: listing.farmerId,
            productName: listing.productName,
            unit: listing.unit,
            qty,
            priceInKobo: listing.priceInKobo,
          },
        ]
      : [];

  const subtotal = lines.reduce((sum, line) => sum + line.priceInKobo * line.qty, 0);
  const deliveryFee = DELIVERY_FEE_IN_KOBO;
  const totalInKobo = subtotal + deliveryFee;

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (!user?.email) {
      setError("Please sign in to continue.");
      return;
    }
    const userEmail = user.email;
    if (!lines.length) {
      setError("No items selected for checkout.");
      return;
    }

    try {
      const perLineAmounts = lines.map((line) => line.priceInKobo * line.qty);
      const deliveryShares = splitDeliveryAcrossItems(perLineAmounts, deliveryFee);

      const orderIds = await Promise.all(
        lines.map((line, index) =>
          createOrder.mutateAsync({
            listingId: line.listingId,
            buyerId: user.uid,
            farmerId: line.farmerId,
            productName: line.productName,
            buyerName: buyerName || currentUser?.name || "Buyer",
            buyerEmail: userEmail,
            buyerPhone,
            deliveryAddress,
            quantity: line.qty,
            amountInKobo: perLineAmounts[index] + deliveryShares[index],
            status: "pending",
            paymentStatus: "unpaid",
            paymentReference: "",
          }),
        ),
      );

      await initiatePayment.mutateAsync({
        orderIds,
        amount: totalInKobo,
        email: userEmail,
        callbackUrl: `${
          window.location.origin
        }/api/payment/redirect?next=${encodeURIComponent(
          `/orders/callback?source=${isCartCheckout ? "cart" : "single"}`,
        )}`,
      });

      // If user profile is missing info, update it automatically for next time
      if (currentUser && (!currentUser.phoneNumber || !currentUser.address)) {
        await updateUser(user.uid, {
          phoneNumber: buyerPhone,
          address: deliveryAddress,
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to initiate payment. Please try again.";
      setError(message);
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Form */}
          <div className="lg:col-span-7 space-y-6">
             <div className="bg-white rounded-[32px] border-2 border-border/50 p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                   <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <Truck className="h-5 w-5" />
                   </div>
                   <div>
                      <h2 className="text-xl font-black text-foreground uppercase tracking-tight">Delivery Details</h2>
                      <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Where should we harvest for you?</p>
                   </div>
                </div>

                <form id="checkout-form" onSubmit={onSubmit} className="space-y-5">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Receiver Name</label>
                        <div className="relative">
                           <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                           <input
                             value={buyerName}
                             onChange={(e) => setBuyerName(e.target.value)}
                             required
                             placeholder="e.g. John Doe"
                             className="w-full h-14 rounded-2xl border-2 border-border bg-surface pl-12 pr-4 text-sm font-bold focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                           />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Phone Number</label>
                        <div className="relative">
                           <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                           <input
                             value={buyerPhone}
                             onChange={(e) => setBuyerPhone(e.target.value)}
                             required
                             placeholder="+234..."
                             className="w-full h-14 rounded-2xl border-2 border-border bg-surface pl-12 pr-4 text-sm font-bold focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                           />
                        </div>
                      </div>
                   </div>

                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Shipping Address</label>
                      <div className="relative">
                         <MapPin className="absolute left-4 top-4 h-4 w-4 text-muted" />
                         <textarea
                           value={deliveryAddress}
                           onChange={(e) => setDeliveryAddress(e.target.value)}
                           required
                           rows={3}
                           placeholder="Street address, City, State..."
                           className="w-full rounded-2xl border-2 border-border bg-surface pl-12 pr-4 py-4 text-sm font-bold focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none resize-none"
                         />
                      </div>
                   </div>
                </form>
             </div>

             {/* Trust Footer */}
             <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-2 text-emerald-600">
                   <ShieldCheck className="h-4 w-4" />
                   <span className="text-[10px] font-black uppercase tracking-widest">Escrow Protected</span>
                </div>
                <div className="flex items-center gap-2 text-muted">
                   <Lock className="h-4 w-4" />
                   <span className="text-[10px] font-black uppercase tracking-widest">SSL Encrypted Secure Payment</span>
                </div>
             </div>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-5 space-y-6">
             <div className="bg-foreground text-white rounded-[32px] p-8 shadow-xl shadow-foreground/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-24 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                
                <h3 className="text-lg font-black uppercase tracking-tight mb-8 relative z-10">
                  {isCartCheckout ? "Cart Summary" : "Order Summary"}
                </h3>
                
                <div className="space-y-6 relative z-10">
                   <div className="space-y-3">
                     {lines.map((line) => (
                       <div key={`${line.listingId}-${line.farmerId}`} className="flex gap-4 items-start">
                         <div className="h-16 w-16 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                           <Leaf className="h-8 w-8 text-primary opacity-60" />
                         </div>
                         <div>
                           <p className="font-black uppercase tracking-tight">{line.productName}</p>
                           <p className="text-xs font-bold text-white/40">
                             {line.qty} {line.unit} &bull; {formatNaira(line.priceInKobo)} / {line.unit}
                           </p>
                         </div>
                       </div>
                     ))}
                   </div>

                   <div className="pt-6 border-t border-white/10 space-y-3">
                      <div className="flex justify-between items-center">
                         <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Subtotal</span>
                         <span className="font-black">{formatNaira(subtotal)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                         <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Logistics</span>
                            <Info className="h-3 w-3 text-white/20" />
                         </div>
                         <span className="font-black">{formatNaira(deliveryFee)}</span>
                      </div>
                   </div>

                   <div className="pt-6 border-t border-white/10">
                      <div className="flex justify-between items-end">
                         <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Total Payable</p>
                            <p className="text-3xl font-black">{formatNaira(totalInKobo)}</p>
                         </div>
                         <div className="bg-primary/20 px-3 py-1.5 rounded-lg border border-primary/30">
                            <span className="text-[9px] font-black text-primary uppercase tracking-widest">Interswitch Secure</span>
                         </div>
                      </div>
                   </div>

                   <button
                     form="checkout-form"
                     type="submit"
                     disabled={createOrder.isPending || initiatePayment.isPending}
                     className="w-full h-16 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-lg shadow-primary/20 transition-all hover:-translate-y-1 disabled:opacity-50 flex items-center justify-center gap-3"
                   >
                      {createOrder.isPending || initiatePayment.isPending ? (
                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <CreditCard className="h-5 w-5" />
                          Pay for all items
                          <ChevronRight className="h-4 w-4 opacity-50" />
                        </>
                      )}
                   </button>

                   {error && (
                     <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase text-center tracking-widest">
                        {error}
                     </div>
                   )}
                </div>
             </div>

             <div className="bg-white rounded-2xl border-2 border-border/50 p-6">
                <div className="flex gap-4 items-center">
                   <div className="h-10 w-10 bg-surface rounded-full flex items-center justify-center">
                      <Info className="h-5 w-5 text-muted" />
                   </div>
                   <p className="text-[10px] font-bold text-muted leading-relaxed uppercase tracking-widest">
                      Your payment is held in escrow until you confirm receipt of the harvest. 
                      <span className="text-primary cursor-pointer hover:underline ml-1">Read Policy.</span>
                   </p>
                </div>
             </div>
          </div>

       </div>
    </div>
  );
};
