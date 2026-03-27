"use client";

import { Check, Info, ArrowRight, Zap, Target, PieChart } from "lucide-react";
import { Button } from "@/shared/components/Button";
import { formatNaira } from "@/lib/format";

interface LoanOfferCardProps {
  amount: number;
  interestRate: number;
  tenure: string;
  repaymentSchedule: string;
  onAccept?: () => void;
  acceptDisabled?: boolean;
}

export function LoanOfferCard({
  amount,
  interestRate,
  tenure,
  repaymentSchedule,
  onAccept,
  acceptDisabled = false,
}: LoanOfferCardProps) {
  return (
    <div className="flex flex-col h-full rounded-[32px] border-2 border-primary/20 bg-white p-6 shadow-sm relative overflow-hidden group">
      
      <div className="flex items-center gap-2 mb-6">
        <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-primary text-white shadow-md shadow-primary/30">
          <Zap className="h-4 w-4 fill-current" />
        </div>
        <h3 className="text-lg font-black text-foreground tracking-tight uppercase">
          Prime <span className="text-primary italic">Offer</span>
        </h3>
      </div>

      <div className="space-y-6 flex-1">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] leading-none">Offered Amount</p>
          <p className="text-3xl font-black text-primary tracking-tight">{formatNaira(amount * 100)}</p>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-muted">
              <Target className="h-3 w-3" />
              <p className="text-[9px] font-black uppercase tracking-widest">Rate</p>
            </div>
            <p className="text-base font-black text-foreground">{interestRate}% <span className="text-[8px] font-bold text-muted">p.a.</span></p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-muted">
              <PieChart className="h-3 w-3" />
              <p className="text-[9px] font-black uppercase tracking-widest">Time</p>
            </div>
            <p className="text-base font-black text-foreground">{tenure}</p>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-primary/10">
          <ul className="space-y-2">
            {[
              "No collateral required",
              `Schedule: ${repaymentSchedule}`,
              "Disbursed < 24 hours",
            ].map((feature, i) => (
              <li key={i} className="flex items-start gap-2">
                <Check className="h-3 w-3 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-tight">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8">
        <Button
          type="button"
          onClick={acceptDisabled ? undefined : onAccept}
          disabled={acceptDisabled}
          className="w-full h-12 text-xs font-black uppercase tracking-widest group relative shadow-lg shadow-primary/20"
        >
          Accept Credit Line
          <ArrowRight className="ml-2 h-4 w-4 transform translate-x-0 group-hover:translate-x-1 transition-transform" />
        </Button>
        {acceptDisabled ? (
          <p className="mt-3 text-center text-[10px] font-bold text-amber-800 uppercase tracking-tight">
            Submit a new application after your current one is reviewed.
          </p>
        ) : null}
        <p className="mt-3 text-[8px] text-center text-muted font-bold flex items-center justify-center gap-1 uppercase tracking-[0.2em] leading-none">
          <Info className="h-3 w-3" />
          T&C Applies &bull; Verified
        </p>
      </div>
    </div>
  );
}
