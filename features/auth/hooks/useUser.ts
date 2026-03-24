"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserById, getFarmers } from "@/features/auth/api/users";
import { logger } from "@/lib/logger";

export const useUser = (uid: string) => {
  return useQuery({
    queryKey: ["user", uid],
    queryFn: async () => {
      logger.info("auth/useUser", "Running user profile query", { uid });
      return getUserById(uid);
    },
    enabled: !!uid,
  });
};

export const useFarmers = () => {
  return useQuery({
    queryKey: ["farmers"],
    queryFn: async () => {
      logger.info("auth/useFarmers", "Running farmers list query");
      return getFarmers();
    },
  });
};
