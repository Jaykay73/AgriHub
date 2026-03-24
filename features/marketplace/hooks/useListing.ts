"use client";

import { useQuery } from "@tanstack/react-query";
import { getListingById } from "@/features/marketplace/api/listings";
import { logger } from "@/lib/logger";

export const useListing = (id: string) => {
  return useQuery({
    queryKey: ["listing", id],
    queryFn: async () => {
      logger.info("marketplace/useListing", "Running single listing query", { id });
      return getListingById(id);
    },
    enabled: !!id,
  });
};
