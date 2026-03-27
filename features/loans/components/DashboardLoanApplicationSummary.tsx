"use client";

import Link from "next/link";
import { FileText, ChevronRight, Clock, CheckCircle2, XCircle } from "lucide-react";
import { formatNaira } from "@/lib/format";
import { useLoanApplications, isAwaitingLenderResponse } from "@/features/loans/hooks/useLoanApplications";

const statusLabel = (status: string) => {
  if (status === "pending" || status === "under_review") return "Awaiting review";
  if (status === "approved") return "Approved";
  if (status === "rejected") return "Not approved";
  return status;
};

export function DashboardLoanApplicationSummary() {
  const { data, isLoading } = useLoanApplications();

  if (isLoading || !data?.applications.length) {
    return null;
  }

  const latest = data.applications[0]!;
  const awaiting = isAwaitingLenderResponse(latest.status);

  return (
    <div
      className={`rounded-2xl border-2 p-6 shadow-sm ${
        awaiting
          ? "border-amber-200 bg-amber-50/80"
          : "border-border/50 bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
              awaiting ? "border-amber-300 bg-white" : "border-border bg-surface"
            }`}
          >
            {latest.status === "approved" ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            ) : latest.status === "rejected" ? (
              <XCircle className="h-5 w-5 text-red-600" />
            ) : (
              <Clock className="h-5 w-5 text-amber-700" />
            )}
          </div>
          <div>
            <h2 className="text-lg font-black text-foreground tracking-tight">Loan application</h2>
            <p className="mt-1 text-sm font-bold text-foreground">
              {formatNaira(latest.requestedAmountNaira * 100)} requested
            </p>
            <p className="mt-1 text-xs font-bold uppercase tracking-widest text-muted">
              {statusLabel(latest.status)}
            </p>
            {awaiting ? (
              <p className="mt-2 text-sm text-amber-900/90">
                We haven’t responded yet. You’ll get an email when there’s an update.
              </p>
            ) : null}
          </div>
        </div>
        <Link
          href="/farmer/loans"
          className="inline-flex shrink-0 items-center gap-1 rounded-xl border-2 border-border bg-white px-4 py-2 text-xs font-black uppercase tracking-widest text-foreground hover:border-primary/40 transition-colors"
        >
          <FileText className="h-4 w-4" />
          Details
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
