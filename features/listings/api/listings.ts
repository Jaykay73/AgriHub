"use client";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  writeBatch,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { DEMO_LISTING_IMAGE_URLS, resolveListingImageUrl } from "@/lib/listingImage";
import { logger } from "@/lib/logger";
import type { Listing } from "@/shared/types";

export type CreateListingInput = {
  farmerId: string;
  farmerName: string;
  farmerLocation?: string;
  productName: string;
  category: string;
  quantity: number;
  unit: string;
  priceInKobo: number;
  description: string;
  imageUrl?: string;
};

export type UpdateListingInput = Partial<
  Pick<
    Listing,
    | "productName"
    | "category"
    | "quantity"
    | "unit"
    | "priceInKobo"
    | "description"
    | "imageUrl"
    | "farmerName"
    | "farmerLocation"
    | "status"
  >
>;

const getDb = () => {
  if (!db) {
    logger.error("listings/api", "Listings DB requested without Firebase configuration");
    throw new Error("Firebase is not configured.");
  }
  logger.debug("listings/api", "Listings DB client resolved");
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

export const createListing = async (data: CreateListingInput) => {
  logger.info("listings/api", "Creating listing", {
    farmerId: data.farmerId,
    productName: data.productName,
  });
  const dbClient = getDb();
  const docRef = await addDoc(collection(dbClient, "listings"), {
    ...data,
    status: "active",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  logger.info("listings/api", "Listing created", {
    listingId: docRef.id,
    farmerId: data.farmerId,
  });
  return docRef.id;
};

export const getFarmerListings = async (farmerId: string): Promise<Listing[]> => {
  logger.info("listings/api", "Fetching farmer listings", { farmerId });
  const dbClient = getDb();
  const baseQuery = query(collection(dbClient, "listings"), where("farmerId", "==", farmerId));

  let snapshot;
  try {
    const indexedQuery = query(baseQuery, orderBy("createdAt", "desc"));
    snapshot = await getDocs(indexedQuery);
  } catch (error) {
    logger.warn(
      "listings/api",
      "Indexed farmer query failed; retrying without orderBy",
      error,
    );
    snapshot = await getDocs(baseQuery);
  }

  const items = snapshot.docs.map((item) =>
    mapListing(item.id, item.data() as Record<string, unknown>),
  );
  items.sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));
  logger.debug("listings/api", "Farmer listings fetched", {
    farmerId,
    count: items.length,
  });
  return items;
};

export const updateListingStatus = async (
  listingId: string,
  status: Listing["status"],
) => {
  logger.info("listings/api", "Updating listing status", { listingId, status });
  const dbClient = getDb();
  await updateDoc(doc(dbClient, "listings", listingId), {
    status,
    updatedAt: serverTimestamp(),
  });
  logger.debug("listings/api", "Listing status updated", { listingId, status });
};

export const updateListing = async (
  listingId: string,
  updates: UpdateListingInput,
) => {
  logger.info("listings/api", "Updating listing content", { listingId, updates });
  const dbClient = getDb();
  await updateDoc(doc(dbClient, "listings", listingId), {
    ...updates,
    updatedAt: serverTimestamp(),
  });
  logger.debug("listings/api", "Listing content updated", { listingId });
};

export const deleteListing = async (listingId: string) => {
  logger.info("listings/api", "Deleting listing", { listingId });
  const dbClient = getDb();
  await deleteDoc(doc(dbClient, "listings", listingId));
  logger.debug("listings/api", "Listing deleted", { listingId });
};

export const seedDemoListings = async (input: {
  farmerId: string;
  farmerName: string;
  farmerLocation?: string;
}) => {
  const dbClient = getDb();
  const categories = ["Grains", "Poultry", "Vegetables", "Fruits", "Other"];
  const names = [
    "Fresh Tomatoes",
    "Premium Rice",
    "Brown Eggs",
    "Sweet Potatoes",
    "Cassava Tubers",
    "Green Pepper",
    "Plantain Bunch",
    "Dried Maize",
    "Watermelon",
    "Onions",
  ];

  logger.info("listings/api", "Seeding demo listings", {
    farmerId: input.farmerId,
    count: names.length,
  });

  const batch = writeBatch(dbClient);
  for (let i = 0; i < names.length; i += 1) {
    const productName = names[i];
    const category = categories[i % categories.length];
    const quantity = 5 + i;
    const priceInKobo = (1500 + i * 125) * 100;
    const now = new Date(Date.now() - i * 60_000).toISOString();

    const ref = doc(collection(dbClient, "listings"));
    batch.set(ref, {
      farmerId: input.farmerId,
      farmerName: input.farmerName,
      farmerLocation: input.farmerLocation ?? "",
      productName,
      category,
      description: `${productName} from verified farm source.`,
      imageUrl: DEMO_LISTING_IMAGE_URLS[i % DEMO_LISTING_IMAGE_URLS.length],
      priceInKobo,
      quantity,
      unit: "kg",
      status: "active",
      createdAt: now,
      updatedAt: now,
    });
  }

  await batch.commit();
  logger.info("listings/api", "Demo listings seed completed", {
    farmerId: input.farmerId,
    count: names.length,
  });
};
