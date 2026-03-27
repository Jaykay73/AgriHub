"use client";

import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { LoanApplicationStatus, LoanApplicationSummary } from "@/shared/types";

const toMillis = (value: unknown): number => {
  if (!value) return 0;
  if (typeof value === "object" && value !== null && "seconds" in value) {
    const s = (value as { seconds?: unknown }).seconds;
    return typeof s === "number" ? s * 1000 : 0;
  }
  if (typeof value === "string") {
    const t = Date.parse(value);
    return Number.isNaN(t) ? 0 : t;
  }
  return 0;
};

const asStatus = (raw: unknown): LoanApplicationStatus => {
  const s = String(raw ?? "pending");
  if (s === "under_review" || s === "approved" || s === "rejected") return s;
  return "pending";
};

export function isAwaitingLenderResponse(status: LoanApplicationStatus): boolean {
  return status === "pending" || status === "under_review";
}

export function useLoanApplications() {
  const { user } = useAuth();
  const uid = user?.uid;

  return useQuery({
    queryKey: ["loanApplications", uid],
    enabled: Boolean(uid && db),
    queryFn: async (): Promise<{
      applications: LoanApplicationSummary[];
      awaitingReview: LoanApplicationSummary | null;
    }> => {
      if (!uid || !db) {
        return { applications: [], awaitingReview: null };
      }

      const snapshot = await getDocs(
        query(collection(db, "loanApplications"), where("farmerId", "==", uid)),
      );

      const applications: LoanApplicationSummary[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data() as Record<string, unknown>;
        return {
          id: docSnap.id,
          farmerId: String(data.farmerId ?? ""),
          requestedAmountNaira: Number(data.requestedAmountNaira ?? 0),
          status: asStatus(data.status),
          createdAtMs: toMillis(data.createdAt),
        };
      });

      applications.sort((a, b) => b.createdAtMs - a.createdAtMs);

      const awaitingReview =
        applications.find((a) => isAwaitingLenderResponse(a.status)) ?? null;

      return { applications, awaitingReview };
    },
  });
}
