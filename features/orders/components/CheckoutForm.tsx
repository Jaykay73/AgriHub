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
    <div className="mx-auto max-w-4xl">
       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Form */}
          <div className="lg:col-span-7 space-y-4">
             <div className="bg-white rounded-2xl border-2 border-border/50 p-6 shadow-sm">
                <div className="flex items-center gap-2.5 mb-6">
                   <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <Truck className="h-4 w-4" />
                   </div>
                   <div>
                      <h2 className="text-lg font-black text-foreground uppercase tracking-tight">Delivery Details</h2>
                      <p className="text-[9px] font-bold text-muted uppercase tracking-widest">Where should we harvest for you?</p>
                   </div>
                </div>

                <form id="checkout-form" onSubmit={onSubmit} className="space-y-4">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-1">Receiver</label>
                        <div className="relative">
                           <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted" />
                           <input
                             value={buyerName}
                             onChange={(e) => setBuyerName(e.target.value)}
                             required
                             placeholder="Full Name"
                             className="w-full h-11 rounded-xl border-2 border-border bg-surface pl-11 pr-4 text-xs font-bold focus:border-primary focus:shadow-md transition-all outline-none"
                           />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-1">Phone</label>
                        <div className="relative">
                           <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted" />
                           <input
                             value={buyerPhone}
                             onChange={(e) => setBuyerPhone(e.target.value)}
                             required
                             placeholder="+234"
                             className="w-full h-11 rounded-xl border-2 border-border bg-surface pl-11 pr-4 text-xs font-bold focus:border-primary focus:shadow-md transition-all outline-none"
                           />
                        </div>
                      </div>
                   </div>

                   <div className="space-y-1">
                      <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-1">Shipping Address</label>
                      <div className="relative">
                         <MapPin className="absolute left-3.5 top-3.5 h-3.5 w-3.5 text-muted" />
                         <textarea
                           value={deliveryAddress}
                           onChange={(e) => setDeliveryAddress(e.target.value)}
                           required
                           rows={2}
                           placeholder="Drop location details..."
                           className="w-full rounded-xl border-2 border-border bg-surface pl-11 pr-4 py-3 text-xs font-bold focus:border-primary focus:shadow-md transition-all outline-none resize-none"
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
          <div className="lg:col-span-5 space-y-4">
             <div className="bg-foreground text-white rounded-2xl p-6 shadow-xl shadow-foreground/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-20 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                
                <h3 className="text-base font-black uppercase tracking-tight mb-6 relative z-10">
                  {isCartCheckout ? "Summary" : "Details"}
                </h3>
                
                <div className="space-y-4 relative z-10">
                   <div className="space-y-2">
                     {lines.map((line) => (
                       <div key={`${line.listingId}-${line.farmerId}`} className="flex gap-3 items-center">
                         <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                           <Leaf className="h-5 w-5 text-primary opacity-60" />
                         </div>
                         <div className="min-w-0">
                           <p className="text-[10px] font-black uppercase tracking-tight truncate">{line.productName}</p>
                           <p className="text-[9px] font-bold text-white/40">
                             {line.qty} {line.unit} &bull; {formatNaira(line.priceInKobo)}
                           </p>
                         </div>
                       </div>
                     ))}
                   </div>

                    <div className="pt-4 border-t border-white/5 space-y-2">
                       <div className="flex justify-between items-center">
                          <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Subtotal</span>
                          <span className="text-xs font-black">{formatNaira(subtotal)}</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-1.5">
                             <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Logistics</span>
                          </div>
                          <span className="text-xs font-black">{formatNaira(deliveryFee)}</span>
                       </div>
                    </div>

                    <div className="pt-4 border-t border-white/5">
                       <div className="flex justify-between items-end">
                          <div>
                             <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary leading-none mb-1">Total</p>
                             <p className="text-xl font-black">{formatNaira(totalInKobo)}</p>
                          </div>
                          <div className="bg-primary/20 px-2 py-0.5 rounded-md border border-primary/20">
                             <span className="text-[8px] font-black text-primary uppercase tracking-widest leading-none">Secured</span>
                          </div>
                       </div>
                    </div>

                    <button
                      form="checkout-form"
                      type="submit"
                      disabled={createOrder.isPending || initiatePayment.isPending}
                      className="w-full h-11 bg-primary hover:bg-primary/95 text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/10 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                       {createOrder.isPending || initiatePayment.isPending ? (
                         <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                       ) : (
                         <>
                           <CreditCard className="h-4 w-4" />
                           Pay Now
                           <ChevronRight className="h-3 w-3 opacity-50" />
                         </>
                       )}
                    </button>

                   {error && (
                     <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[9px] font-black uppercase text-center tracking-widest">
                        {error}
                     </div>
                   )}
                </div>
             </div>

             <div className="bg-white rounded-xl border-2 border-border/50 p-4 child:text-center">
                <div className="flex gap-3 items-center">
                   <div className="h-8 w-8 bg-surface rounded-full flex items-center justify-center shrink-0">
                      <Info className="h-4 w-4 text-muted" />
                   </div>
                   <p className="text-[9px] font-bold text-muted leading-relaxed uppercase tracking-widest">
                      Held in escrow until you confirm receipt.
                   </p>
                </div>
             </div>
          </div>

       </div>
    </div>
  );
};
