import type { Transaction } from "@/shared/types";

/** Matches FastAPI `CreditInput` in Agrihub-ML `app.py`. */
export type CreditInputPayload = {
  total_sales: number;
  num_transactions: number;
  avg_transaction_value: number;
  activity_frequency: number;
  repayment_history: number;
  high_value_tx_count: number;
  blockchain_verified_ratio: number;
};

const MS_PER_DAY = 86_400_000;
const ACTIVITY_WINDOW_MS = 90 * MS_PER_DAY;
const ACTIVITY_NORMALIZER_DAYS = 30;

const parseTxTime = (createdAt: string): number => {
  const t = Date.parse(createdAt);
  return Number.isNaN(t) ? 0 : t;
};

const dayKeyUtc = (ms: number): string => {
  const d = new Date(ms);
  return `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`;
};

/**
 * Maps marketplace payment transactions into ML features.
 * Repayment loans are not modeled in Firestore; `repayment_history` uses payment success ratio.
 */
export function buildCreditPayload(transactions: Transaction[]): CreditInputPayload {
  const now = Date.now();
  const windowStart = now - ACTIVITY_WINDOW_MS;

  const paid = transactions.filter((t) => t.paymentStatus === "paid");
  const totalKobo = paid.reduce((sum, t) => sum + t.amountInKobo, 0);
  const total_sales = totalKobo / 100;
  const num_transactions = paid.length;
  const avg_transaction_value =
    num_transactions > 0 ? total_sales / num_transactions : 0;

  const paidInWindow = paid.filter((t) => parseTxTime(t.createdAt) >= windowStart);
  const uniqueDays = new Set(
    paidInWindow.map((t) => dayKeyUtc(parseTxTime(t.createdAt))),
  );
  const activity_frequency =
    uniqueDays.size === 0
      ? 0
      : Math.min(1, uniqueDays.size / ACTIVITY_NORMALIZER_DAYS);

  const settled = transactions.filter(
    (t) => t.paymentStatus === "paid" || t.paymentStatus === "failed",
  );
  const repayment_history =
    settled.length === 0
      ? 0.85
      : settled.filter((t) => t.paymentStatus === "paid").length / settled.length;

  const amountsNaira = paid.map((t) => t.amountInKobo / 100).sort((a, b) => a - b);
  let highThresholdNaira: number;
  if (amountsNaira.length >= 4) {
    const idx = Math.floor(0.75 * (amountsNaira.length - 1));
    highThresholdNaira = amountsNaira[idx]!;
  } else if (amountsNaira.length > 0) {
    highThresholdNaira = Math.max(50_000, amountsNaira[amountsNaira.length - 1]! * 0.5);
  } else {
    highThresholdNaira = 0;
  }
  const high_value_tx_count = paid.filter(
    (t) => t.amountInKobo / 100 >= highThresholdNaira,
  ).length;

  const chainVerified = paid.filter(
    (t) => Boolean(t.blockchainHash?.trim() || t.polygonTxHash?.trim()),
  ).length;
  const blockchain_verified_ratio =
    num_transactions === 0 ? 0 : chainVerified / num_transactions;

  return {
    total_sales,
    num_transactions,
    avg_transaction_value,
    activity_frequency,
    repayment_history,
    high_value_tx_count,
    blockchain_verified_ratio,
  };
}
