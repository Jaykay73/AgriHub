"use client";

import { Button } from "@/shared/components/Button";
import { useInitiatePayment } from "@/features/payments/hooks/useInitiatePayment";

type Props = {
  orderId: string;
  amountInKobo: number;
  email: string;
  callbackUrl: string;
};

export const PaymentButton = ({ orderId, amountInKobo, email, callbackUrl }: Props) => {
  const initiatePayment = useInitiatePayment();

  return (
    <Button
      className="w-full"
      disabled={initiatePayment.isPending}
      onClick={() =>
        initiatePayment.mutate({
          orderId,
          amount: amountInKobo,
          email,
          callbackUrl,
        })
      }
    >
      {initiatePayment.isPending ? "Redirecting..." : "Proceed to Payment"}
    </Button>
  );
};
