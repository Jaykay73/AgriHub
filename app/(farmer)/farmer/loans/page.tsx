"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { CreditScoreGauge } from "@/features/loans/components/CreditScoreGauge";
import { LoanEligibilityCard } from "@/features/loans/components/LoanEligibilityCard";
import { LoanOfferCard } from "@/features/loans/components/LoanOfferCard";
import { Badge } from "@/shared/components/Badge";
import { Button } from "@/shared/components/Button";
import { RefreshCw, History, Info, ExternalLink } from "lucide-react";
import { formatNaira } from "@/lib/format";
import { useCreditScore } from "@/features/loans/hooks/useCreditScore";
import { useLoanApplications, isAwaitingLenderResponse } from "@/features/loans/hooks/useLoanApplications";
import { seedDemoTransactions } from "@/features/loans/api/seedDemoTransactions";
import { LoanApplicationModal } from "@/features/loans/components/LoanApplicationModal";

const parseCreatedMs = (createdAt: string): number => {
  const t = Date.parse(createdAt);
  return Number.isNaN(t) ? 0 : t;
};

const formatRowDate = (createdAt: string): string => {
  const ms = parseCreatedMs(createdAt);
  if (!ms) return "—";
  return new Date(ms).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function LoansPage() {
  const { user } = useAuth();
  const { data: profile } = useCurrentUser();
  const queryClient = useQueryClient();
  const [seeding, setSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState("");
  const [applyOpen, setApplyOpen] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState("");

  const {
    transactions,
    txLoading,
    creditLoading,
    creditError,
    refetchCredit,
    creditScore,
    loanEligible,
    maxLoanAmountNaira,
    hasNoPaidTransactions,
    probability,
  } = useCreditScore();

  const { data: loanAppData } = useLoanApplications();
  const awaitingReview = loanAppData?.awaitingReview ?? null;
  const applicationAwaitingReview = Boolean(
    awaitingReview && isAwaitingLenderResponse(awaitingReview.status),
  );

  const sortedTx = [...transactions].sort(
    (a, b) => parseCreatedMs(b.createdAt) - parseCreatedMs(a.createdAt),
  );

  const handleRefresh = () => {
    void refetchCredit();
  };

  const handleSeedTransactions = async () => {
    if (!user) {
      setSeedMessage("Please sign in first.");
      return;
    }
    setSeedMessage("");
    setSeeding(true);
    try {
      await seedDemoTransactions({
        farmerId: user.uid,
        farmerName: profile?.farmName ?? profile?.name ?? user.displayName ?? undefined,
      });
      await queryClient.invalidateQueries({ queryKey: ["transactions", user.uid, "farmer"] });
      await queryClient.invalidateQueries({ queryKey: ["orders", user.uid, "farmer"] });
      await queryClient.invalidateQueries({ queryKey: ["creditPredict"] });
      await refetchCredit();
      setSeedMessage("Demo paid orders + sales history added. Check Orders and Loans.");
    } catch (err) {
      setSeedMessage(err instanceof Error ? err.message : "Seed failed. Try again.");
    } finally {
      setSeeding(false);
    }
  };

  const scrollToOffers = () => {
    document.getElementById("loan-offers")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-border/50 pb-6">
        <div>
          <h1 className="text-2xl font-black text-foreground tracking-tight mb-1">
            Financing <span className="text-primary italic">Desk.</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted flex items-center gap-2">
            <Info className="h-3 w-3" />
            Check eligibility & manage farm credit lines.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => void handleSeedTransactions()}
            disabled={seeding || !user}
          >
            {seeding ? "Seeding..." : "Debug: Seed demo sales"}
          </Button>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={creditLoading}
            className="flex items-center gap-2 rounded-xl h-10 px-5 text-xs font-black uppercase tracking-widest border-2 border-border bg-white hover:bg-surface/50 transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${creditLoading ? "animate-spin" : ""}`} />
            {creditLoading ? "Calculating..." : "Update Score"}
          </button>
        </div>
      </div>

      {seedMessage ? (
        <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-900">
          {seedMessage}
        </div>
      ) : null}

      {applicationSuccess ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-900">
          {applicationSuccess}
        </div>
      ) : null}

      {user ? (
        <LoanApplicationModal
          open={applyOpen}
          onOpenChange={setApplyOpen}
          farmerId={user.uid}
          farmerName={profile?.name ?? user.displayName ?? "Farmer"}
          farmerEmail={profile?.email ?? user.email ?? ""}
          maxAmountNaira={maxLoanAmountNaira}
          creditScore={creditScore}
          probability={probability}
          interestRate={12.5}
          tenure="12 Months"
          repaymentSchedule="Monthly instalments"
          onSubmitted={(applicationId) => {
            setApplicationSuccess(
              `Application received. Save your reference: ${applicationId}. We will email ${profile?.email ?? user.email ?? "you"} with next steps.`,
            );
            void queryClient.invalidateQueries({ queryKey: ["loanApplications", user.uid] });
          }}
        />
      ) : null}

      {creditError ? (
        <div
          className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-900"
          role="alert"
        >
          {creditError}
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <CreditScoreGauge score={creditLoading && !creditScore ? 0 : creditScore} />
          {hasNoPaidTransactions ? (
            <p className="text-center text-[10px] font-bold text-muted uppercase tracking-widest px-2">
              Complete paid sales to build a data-driven score.
            </p>
          ) : null}
          <LoanEligibilityCard
            score={creditScore}
            eligible={loanEligible}
            maxAmount={maxLoanAmountNaira}
            isChecking={creditLoading}
            applicationAwaitingReview={applicationAwaitingReview}
            onShowOffers={loanEligible && !applicationAwaitingReview ? scrollToOffers : undefined}
          />
        </div>

        <div className="lg:col-span-2 space-y-8">
          <section id="loan-offers" className="scroll-mt-24">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-foreground tracking-tight uppercase">Active Offers</h2>
              <span className="text-[9px] font-black text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-widest border border-primary/20">
                Live Status
              </span>
            </div>
            {loanEligible ? (
              <LoanOfferCard
                amount={maxLoanAmountNaira}
                interestRate={12.5}
                tenure="12 Months"
                repaymentSchedule="Monthly instalments"
                onAccept={() => setApplyOpen(true)}
                acceptDisabled={applicationAwaitingReview}
              />
            ) : (
              <div className="rounded-[24px] border-2 border-dashed border-border p-10 text-center bg-surface/30">
                <p className="text-xs font-bold text-muted">
                  Complete more successful transactions to unlock loan offers.
                </p>
              </div>
            )}
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <History className="h-4 w-4 text-primary" />
              <h2 className="text-lg font-black text-foreground tracking-tight uppercase">Credit History</h2>
            </div>
            <div className="overflow-hidden rounded-[24px] border-2 border-border/50 bg-white shadow-sm transition-all hover:border-primary/20">
              <div className="overflow-x-auto">
                {txLoading ? (
                  <p className="p-8 text-center text-sm font-bold text-muted">Loading transactions…</p>
                ) : sortedTx.length === 0 ? (
                  <p className="p-8 text-center text-sm font-bold text-muted">No transactions yet.</p>
                ) : (
                  <table className="w-full text-left">
                    <thead className="border-b border-border bg-surface/30 whitespace-nowrap">
                      <tr>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted">Type</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted">Amount</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted">Status</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted">Date</th>
                        <th className="px-6 py-4"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {sortedTx.map((tx) => (
                        <tr key={tx.id} className="hover:bg-surface/30 transition-colors">
                          <td className="px-6 py-4">
                            <span className="text-sm font-black text-foreground">Sale</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-black text-foreground">{formatNaira(tx.amountInKobo)}</span>
                          </td>
                          <td className="px-6 py-4">
                            {tx.paymentStatus === "paid" ? (
                              <Badge status="paid" />
                            ) : tx.paymentStatus === "pending" ? (
                              <Badge status="pending" />
                            ) : (
                              <span className="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize bg-red-50 text-red-700 border border-red-200">
                                failed
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-bold text-muted">{formatRowDate(tx.createdAt)}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              type="button"
                              className="p-2 hover:bg-surface rounded-lg transition-colors text-muted-foreground"
                              aria-label="Open transaction"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
