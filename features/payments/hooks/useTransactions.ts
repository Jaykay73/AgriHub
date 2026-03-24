"use client";

import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Transaction, UserRole } from "@/shared/types";

const mapTransaction = (
  id: string,
  raw: Record<string, unknown>,
): Transaction => ({
  id,
  orderId: String(raw.orderId ?? ""),
  buyerId: String(raw.buyerId ?? ""),
  farmerId: String(raw.farmerId ?? ""),
  amountInKobo: Number(raw.amountInKobo ?? 0),
  currency: "NGN",
  paymentReference: String(raw.paymentReference ?? ""),
  paymentStatus: (raw.paymentStatus as Transaction["paymentStatus"]) ?? "pending",
  blockchainHash: raw.blockchainHash ? String(raw.blockchainHash) : "",
  polygonTxHash: raw.polygonTxHash ? String(raw.polygonTxHash) : "",
  createdAt: String(raw.createdAt ?? ""),
});

export const useTransactions = (userId?: string, role?: UserRole) => {
  return useQuery({
    queryKey: ["transactions", userId, role],
    enabled: Boolean(userId && role && db),
    queryFn: async () => {
      if (!userId || !role || !db) return [];
      const field = role === "farmer" ? "farmerId" : "buyerId";
      const snapshot = await getDocs(
        query(collection(db, "transactions"), where(field, "==", userId)),
      );
      return snapshot.docs.map((entry) =>
        mapTransaction(entry.id, entry.data() as Record<string, unknown>),
      );
    },
  });
};
