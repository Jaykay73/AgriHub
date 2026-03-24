"use client";

import { useMutation } from "@tanstack/react-query";
import { logger } from "@/lib/logger";

type InitiatePaymentInput = {
  orderIds: string[];
  amount: number;
  email: string;
  callbackUrl: string;
};

type PaymentRequest = {
  action: string;
  fields: Record<string, string>;
  reference: string;
};

export const useInitiatePayment = () => {
  return useMutation({
    mutationFn: async (payload: InitiatePaymentInput) => {
      const response = await fetch("/api/payment/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await response.json()) as PaymentRequest | { error?: string };
      if (!response.ok) {
        throw new Error(
          (body as { error?: string }).error || "Payment initiation failed.",
        );
      }
      return body as PaymentRequest;
    },
    onSuccess: ({ action, fields }) => {
      logger.info("payments/useInitiatePayment", "Submitting payment form to provider");

      const form = document.createElement("form");
      form.method = "POST";
      form.action = action;
      form.style.display = "none";

      Object.entries(fields).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    },
    onError: (error) => {
      logger.error("payments/useInitiatePayment", "Payment initiation error", error);
    },
  });
};
