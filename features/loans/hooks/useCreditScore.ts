"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { useTransactions } from "@/features/payments/hooks/useTransactions";
import { buildCreditPayload } from "@/features/loans/lib/buildCreditPayload";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

const MAX_LOAN_NAIRA = 2_500_000;

export type CreditPredictResult = {
  credit_score: number;
  loan_eligible: boolean;
  probability_of_eligibility: number;
};

export function useCreditScore() {
  const { user } = useAuth();
  const uid = user?.uid;
  const { data: transactions = [], isLoading: txLoading } = useTransactions(uid, "farmer");

  const payload = useMemo(() => buildCreditPayload(transactions), [transactions]);
  const payloadKey = useMemo(() => JSON.stringify(payload), [payload]);

  const query = useQuery({
    queryKey: ["creditPredict", uid, payloadKey],
    queryFn: async (): Promise<CreditPredictResult> => {
      const res = await fetch("/api/credit/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data: unknown = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg =
          typeof data === "object" && data !== null && "error" in data && typeof (data as { error: unknown }).error === "string"
            ? (data as { error: string }).error
            : "Could not load credit score.";
        throw new Error(msg);
      }
      return data as CreditPredictResult;
    },
    enabled: Boolean(uid) && !txLoading,
    staleTime: 60_000,
  });

  const score = query.data?.credit_score ?? 0;
  const maxLoanAmountNaira = Math.floor(MAX_LOAN_NAIRA * (score / 100));

  return {
    transactions,
    txLoading,
    creditLoading: Boolean(uid) && (txLoading || query.isLoading || query.isFetching),
    creditError: query.error instanceof Error ? query.error.message : null,
    refetchCredit: query.refetch,
    result: query.data ?? null,
    creditScore: score,
    loanEligible: query.data?.loan_eligible ?? false,
    probability: query.data?.probability_of_eligibility ?? 0,
    maxLoanAmountNaira,
    hasNoPaidTransactions: !transactions.some((t) => t.paymentStatus === "paid"),
  };
}
