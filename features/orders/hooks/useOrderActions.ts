"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteOrder, updateOrderStatus } from "@/features/orders/api/orders";

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderId: string) => deleteOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useMarkOrderFailed = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderId: string) => updateOrderStatus(orderId, "cancelled", "failed"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
