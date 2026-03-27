"use client";

import { CheckCircle2, AlertCircle, TrendingUp, ShieldCheck } from "lucide-react";
import { Button } from "@/shared/components/Button";
import { formatNaira } from "@/lib/format";

interface LoanEligibilityCardProps {
  score: number;
  eligible: boolean;
  maxAmount: number;
  isChecking?: boolean;
  onShowOffers?: () => void;
  /** When true, hide “Show Offers” — a loan application is already awaiting lender review. */
  applicationAwaitingReview?: boolean;
}

export function LoanEligibilityCard({
  score,
  eligible,
  maxAmount,
  isChecking,
  onShowOffers,
  applicationAwaitingReview = false,
}: LoanEligibilityCardProps) {
  return (
    <div className="flex flex-col rounded-[24px] border-2 border-border/50 bg-white p-5 shadow-sm overflow-hidden h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-black text-muted uppercase tracking-widest leading-none">Status</h3>
        {eligible ? (
          <div className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-emerald-600">
            <CheckCircle2 className="h-3 w-3" />
            <span>Eligible</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-amber-600">
            <AlertCircle className="h-3 w-3" />
            <span>Reviewing</span>
          </div>
        )}
      </div>

      <div className="space-y-5">
        <div>
           <h4 className="text-lg font-black text-foreground tracking-tight leading-none mb-2 underline decoration-primary/20 decoration-2 underline-offset-4">Max Limit</h4>
           <p className="text-2xl font-black text-primary tracking-tight">
             {formatNaira(maxAmount * 100)}
           </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-surface border border-border/50">
            <TrendingUp className="h-4 w-4 text-primary mb-1.5" />
            <p className="text-[9px] font-black text-muted uppercase tracking-widest mb-0.5">Growth</p>
            <p className="text-xs font-black text-foreground uppercase">High</p>
          </div>
          <div className="p-3 rounded-xl bg-surface border border-border/50">
            <ShieldCheck className="h-4 w-4 text-accent mb-1.5" />
            <p className="text-[9px] font-black text-muted uppercase tracking-widest mb-0.5">Factor</p>
            <p className="text-xs font-black text-foreground uppercase">Prime</p>
          </div>
        </div>

        <div className="space-y-3">
          {eligible && applicationAwaitingReview ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-center">
              <p className="text-xs font-black text-amber-900 uppercase tracking-tight">
                Application pending review
              </p>
              <p className="mt-1 text-[10px] font-bold text-amber-800/90 leading-relaxed">
                We’ll email you when there’s a decision. No further action needed here.
              </p>
            </div>
          ) : (
            <Button
              type="button"
              className="w-full h-10 text-xs font-black uppercase tracking-widest shadow-md shadow-primary/10"
              disabled={!eligible || isChecking}
              onClick={eligible ? onShowOffers : undefined}
            >
              {eligible ? "Show Offers" : "Boost Score"}
            </Button>
          )}
          <p className="text-[8px] text-center text-muted/60 font-bold uppercase tracking-widest">
            *Requires transaction proof
          </p>
        </div>
      </div>
    </div>
  );
}
