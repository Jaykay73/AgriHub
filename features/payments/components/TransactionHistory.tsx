"use client";

import { formatNaira } from "@/lib/format";
import type { Transaction } from "@/shared/types";

export const TransactionHistory = ({
  transactions,
}: {
  transactions: Transaction[];
}) => {
  if (!transactions.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-6 text-sm text-slate-600">
        No transactions yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="rounded-xl border border-slate-200 bg-white p-4 text-sm"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-semibold text-slate-900">
              {formatNaira(transaction.amountInKobo)}
            </p>
            <p className="text-xs uppercase text-slate-500">
              {transaction.paymentStatus}
            </p>
          </div>
          <p className="mt-1 text-xs text-slate-600">
            Ref: {transaction.paymentReference}
          </p>
          {transaction.blockchainHash ? (
            <a
              href={`https://amoy.polygonscan.com/tx/${transaction.blockchainHash}`}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block text-xs text-green-700 underline"
            >
              View blockchain record
            </a>
          ) : null}
        </div>
      ))}
    </div>
  );
};
