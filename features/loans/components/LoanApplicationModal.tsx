"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { Button } from "@/shared/components/Button";
import { formatNaira } from "@/lib/format";
import { submitLoanApplication } from "@/features/loans/api/loanApplications";

type LoanApplicationModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  farmerId: string;
  farmerName: string;
  farmerEmail: string;
  maxAmountNaira: number;
  creditScore: number;
  probability: number;
  interestRate: number;
  tenure: string;
  repaymentSchedule: string;
  onSubmitted?: (applicationId: string) => void;
};

export function LoanApplicationModal({
  open,
  onOpenChange,
  farmerId,
  farmerName,
  farmerEmail,
  maxAmountNaira,
  creditScore,
  probability,
  interestRate,
  tenure,
  repaymentSchedule,
  onSubmitted,
}: LoanApplicationModalProps) {
  const [requestedNaira, setRequestedNaira] = useState(String(maxAmountNaira));
  const [purpose, setPurpose] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setRequestedNaira(String(maxAmountNaira));
      setError("");
    }
  }, [open, maxAmountNaira]);

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setError("");
    }
    onOpenChange(next);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    const amount = Number.parseInt(String(requestedNaira).replace(/\D/g, ""), 10);
    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Enter a valid amount.");
      return;
    }
    if (amount > maxAmountNaira) {
      setError(`Amount cannot exceed your approved limit (${formatNaira(maxAmountNaira * 100)}).`);
      return;
    }

    setSubmitting(true);
    try {
      const { applicationId } = await submitLoanApplication({
        farmerId,
        farmerName,
        farmerEmail,
        requestedAmountNaira: amount,
        offerMaxAmountNaira: maxAmountNaira,
        creditScore,
        probabilityOfEligibility: probability,
        interestRate,
        tenure,
        repaymentSchedule,
        purpose: purpose.trim() || undefined,
      });
      onSubmitted?.(applicationId);
      handleOpenChange(false);
      setPurpose("");
      setRequestedNaira(String(maxAmountNaira));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[101] w-[95vw] max-w-md max-h-[90vh] overflow-y-auto -translate-x-1/2 -translate-y-1/2 rounded-[24px] bg-white p-6 shadow-elevated border-2 border-border sm:p-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <Dialog.Title className="text-xl font-black text-foreground tracking-tight">
              Apply for credit line
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                className="rounded-lg p-2 text-muted hover:bg-surface hover:text-foreground"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Description className="text-sm text-muted mb-6">
            Your marketplace transaction history is already on file. Confirm the amount and purpose; our team
            will review within 24 hours.
          </Dialog.Description>

          <form onSubmit={(e) => void onSubmit(e)} className="space-y-5">
            <div className="rounded-xl border border-border bg-surface/40 p-4 text-xs space-y-1">
              <p className="font-bold text-muted uppercase tracking-widest">Pre-approved limit</p>
              <p className="text-lg font-black text-primary">{formatNaira(maxAmountNaira * 100)}</p>
              <p className="text-muted">
                Score {creditScore} · {Math.round(probability * 100)}% model confidence · {interestRate}% p.a. ·{" "}
                {tenure}
              </p>
            </div>

            <div>
              <label htmlFor="loan-amount" className="block text-xs font-black uppercase tracking-widest text-muted mb-2">
                Amount requested (₦)
              </label>
              <input
                id="loan-amount"
                type="text"
                inputMode="numeric"
                value={requestedNaira}
                onChange={(ev) => setRequestedNaira(ev.target.value)}
                className="w-full rounded-xl border-2 border-border bg-white px-4 py-3 text-sm font-bold text-foreground outline-none focus:border-primary"
                placeholder="e.g. 1500000"
              />
            </div>

            <div>
              <label htmlFor="loan-purpose" className="block text-xs font-black uppercase tracking-widest text-muted mb-2">
                Purpose (optional)
              </label>
              <textarea
                id="loan-purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                rows={3}
                className="w-full resize-none rounded-xl border-2 border-border bg-white px-4 py-3 text-sm font-medium text-foreground outline-none focus:border-primary"
                placeholder="e.g. Seeds, equipment, labour for harvest season"
              />
            </div>

            {error ? (
              <p className="text-sm font-bold text-red-600" role="alert">
                {error}
              </p>
            ) : null}

            <Button type="submit" className="w-full h-12 text-xs font-black uppercase tracking-widest" disabled={submitting}>
              {submitting ? "Submitting…" : "Submit application"}
            </Button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
