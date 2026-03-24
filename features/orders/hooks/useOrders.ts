"use client";

import { useQuery } from "@tanstack/react-query";
import { getOrdersByBuyer, getOrdersByFarmer } from "@/features/orders/api/orders";
import type { UserRole } from "@/shared/types";

export const useOrders = (userId?: string, role?: UserRole) => {
  return useQuery({
    queryKey: ["orders", userId, role],
    enabled: Boolean(userId && role),
    queryFn: async () => {
      if (!userId || !role) return [];
      if (role === "farmer") return getOrdersByFarmer(userId);
      return getOrdersByBuyer(userId);
    },
  });
};
