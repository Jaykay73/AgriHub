"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { clearCart } from "@/lib/cart";

export default function PaymentCallbackPage() {
  const [isSyncing, setIsSyncing] = useState(false);
  const params =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams();
  const status = (params.get("status") || params.get("payment_status") || "").toLowerCase();
  const reference = params.get("reference") || params.get("txn_ref") || "";

  const successful = ["success", "paid", "completed", "00"].includes(status);

  useEffect(() => {
    if (!status || !reference) return;

    const syncPayment = async () => {
      setIsSyncing(true);
      try {
        await fetch("/api/payment/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference, status }),
        });
        if (successful) clearCart();
      } finally {
        setIsSyncing(false);
      }
    };

    void syncPayment();
  }, [reference, status, successful]);

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 py-10 text-center">
      <h1 className="text-3xl font-bold text-slate-900">
        {successful ? "Payment Successful" : "Payment Pending/Failed"}
      </h1>
      <p className="mt-3 text-sm text-slate-600">
        {reference ? `Reference: ${reference}` : "No payment reference found."}
      </p>
      {isSyncing ? <p className="mt-2 text-xs text-slate-500">Syncing payment status...</p> : null}
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/buyer/orders"
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white"
        >
          View Orders
        </Link>
        <Link
          href="/marketplace"
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800"
        >
          Back to Marketplace
        </Link>
      </div>
    </main>
  );
}
