"use client";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { logger } from "@/lib/logger";

export type SubmitLoanApplicationInput = {
  farmerId: string;
  farmerName: string;
  farmerEmail: string;
  requestedAmountNaira: number;
  offerMaxAmountNaira: number;
  creditScore: number;
  probabilityOfEligibility: number;
  interestRate: number;
  tenure: string;
  repaymentSchedule: string;
  purpose?: string;
};

export async function submitLoanApplication(
  input: SubmitLoanApplicationInput,
): Promise<{ applicationId: string }> {
  if (!db) {
    throw new Error("Firebase is not configured.");
  }

  logger.info("loans/loanApplications", "Submitting loan application", {
    farmerId: input.farmerId,
    requestedAmountNaira: input.requestedAmountNaira,
  });

  const { purpose, ...rest } = input;
  const trimmedPurpose = purpose?.trim();
  const payload = {
    ...rest,
    status: "pending" as const,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    ...(trimmedPurpose ? { purpose: trimmedPurpose } : {}),
  };

  const ref = await addDoc(collection(db, "loanApplications"), payload);

  logger.info("loans/loanApplications", "Loan application stored", {
    applicationId: ref.id,
  });

  return { applicationId: ref.id };
}
