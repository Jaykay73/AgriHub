"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrder } from "@/features/orders/api/orders";
import { logger } from "@/lib/logger";
import type { Order } from "@/shared/types";

type CreateOrderInput = Omit<Order, "id" | "createdAt" | "updatedAt">;

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateOrderInput) => createOrder(data),
    onSuccess: () => {
      logger.info("orders/useCreateOrder", "Order creation successful. Invalidating orders");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error) => {
      logger.error("orders/useCreateOrder", "Order creation failed", error);
    },
  });
};
