"use client";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { resolveListingImageUrl } from "@/lib/listingImage";
import { logger } from "@/lib/logger";
import type { Listing } from "@/shared/types";

type ListingFilters = {
  search?: string;
  category?: string;
};

const getDb = () => {
  if (!db) {
    logger.error("marketplace/api", "Marketplace DB requested without Firebase configuration");
    throw new Error("Firebase is not configured.");
  }
  logger.debug("marketplace/api", "Marketplace DB client resolved");
  return db;
};

const toMillis = (value: unknown): number => {
  if (!value) {
    return 0;
  }
  if (typeof value === "string") {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  if (value instanceof Date) {
    return value.getTime();
  }
  if (typeof value === "object" && value !== null) {
    const maybeSeconds = (value as { seconds?: unknown }).seconds;
    if (typeof maybeSeconds === "number") {
      return maybeSeconds * 1000;
    }
  }
  return 0;
};

const mapListing = (id: string, raw: Record<string, unknown>): Listing => ({
  id,
  farmerId: String(raw.farmerId ?? ""),
  farmerName: String(raw.farmerName ?? "Unknown Farmer"),
  farmerLocation: raw.farmerLocation ? String(raw.farmerLocation) : "",
  productName: String(raw.productName ?? ""),
  category: String(raw.category ?? "Other"),
  description: String(raw.description ?? ""),
  imageUrl: resolveListingImageUrl(raw),
  priceInKobo: Number(raw.priceInKobo ?? 0),
  quantity: Number(raw.quantity ?? 0),
  unit: String(raw.unit ?? ""),
  status: (raw.status as Listing["status"]) ?? "active",
  createdAt: String(raw.createdAt ?? ""),
  updatedAt: String(raw.updatedAt ?? ""),
});

export const getActiveListings = async (
  filters?: ListingFilters,
): Promise<Listing[]> => {
  logger.info("marketplace/api", "Fetching active marketplace listings", { filters });
  const dbClient = getDb();
  const baseQuery = query(collection(dbClient, "listings"), where("status", "==", "active"));
  let snapshot;
  try {
    const indexedQuery = query(baseQuery, orderBy("createdAt", "desc"));
    snapshot = await getDocs(indexedQuery);
  } catch (error) {
    logger.warn(
      "marketplace/api",
      "Indexed marketplace query failed; retrying without orderBy",
      error,
    );
    snapshot = await getDocs(baseQuery);
  }
  let items = snapshot.docs.map((item) =>
    mapListing(item.id, item.data() as Record<string, unknown>),
  );
  items = items.sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));

  if (filters?.category && filters.category !== "All") {
    items = items.filter((item) => item.category === filters.category);
  }

  if (filters?.search) {
    const q = filters.search.trim().toLowerCase();
    items = items.filter((item) => item.productName.toLowerCase().includes(q));
  }

  logger.debug("marketplace/api", "Active marketplace listings fetched", {
    count: items.length,
  });
  return items;
};

export const getListingById = async (listingId: string): Promise<Listing | null> => {
  logger.info("marketplace/api", "Fetching listing by ID", { listingId });
  const dbClient = getDb();
  const snapshot = await getDoc(doc(dbClient, "listings", listingId));
  if (!snapshot.exists()) {
    logger.warn("marketplace/api", "Listing not found", { listingId });
    return null;
  }
  logger.debug("marketplace/api", "Listing found", { listingId });
  return mapListing(snapshot.id, snapshot.data() as Record<string, unknown>);
};
