"use client";

import { collection, doc, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { logger } from "@/lib/logger";

const getDb = () => {
  if (!db) {
    throw new Error("Firebase is not configured.");
  }
  return db;
};

const PRODUCT_NAMES = [
  "Premium Rice",
  "Brown Eggs",
  "Fresh Tomatoes",
  "Sweet Potatoes",
  "Cassava Tubers",
  "Green Pepper",
  "Plantain Bunch",
  "Dried Maize",
  "Watermelon",
  "Onions",
];

/**
 * Seeds **paid orders** plus matching **paid transactions** so:
 * - Farmer **Orders** shows successful sales (paid / paid).
 * - **Credit scoring** still uses the same transaction metrics (volume, activity, etc.).
 * Safe to run multiple times (adds new docs; does not dedupe).
 */
export const seedDemoTransactions = async (input: {
  farmerId: string;
  farmerName?: string;
}) => {
  const dbClient = getDb();
  const { farmerId, farmerName = "Demo Farm" } = input;

  const paidCount = 40;
  const failedCount = 4;
  const baseKobo = 625_000;
  const now = Date.now();
  const dayMs = 86_400_000;

  const demoBuyerId = "demo-buyer-seed";
  const demoBuyerName = "AgriHub Demo Buyer";
  const demoBuyerEmail = "buyer-demo@agrihub.local";

  logger.info("loans/seedDemoTransactions", "Seeding demo orders + transactions", {
    farmerId,
    paidCount,
    failedCount,
  });

  const batch = writeBatch(dbClient);
  let writeIndex = 0;

  for (let i = 0; i < paidCount; i += 1) {
    const dayOffset = (i * 2 + (i % 7)) % 45;
    const createdAt = new Date(now - dayOffset * dayMs - i * 3_600_000).toISOString();
    const jitter = ((i * 17) % 100) - 50;
    const amountInKobo = Math.max(100_000, baseKobo + jitter * 1_000);
    const withChain = i % 10 !== 0;
    const productName = PRODUCT_NAMES[i % PRODUCT_NAMES.length]!;
    const qty = 1 + (i % 5);
    const paymentReference = `SEED-PAID-${farmerId}-${i}`;

    const orderRef = doc(collection(dbClient, "orders"));
    batch.set(orderRef, {
      listingId: `demo-listing-${i}`,
      buyerId: demoBuyerId,
      farmerId,
      productName,
      buyerName: demoBuyerName,
      buyerEmail: demoBuyerEmail,
      buyerPhone: "+2348000000000",
      deliveryAddress: "Lagos, Nigeria",
      quantity: qty,
      amountInKobo,
      status: "paid",
      paymentStatus: "paid",
      paymentReference,
      createdAt,
      updatedAt: createdAt,
    });
    writeIndex += 1;

    const txRef = doc(collection(dbClient, "transactions"));
    batch.set(txRef, {
      orderId: orderRef.id,
      buyerId: demoBuyerId,
      farmerId,
      amountInKobo,
      currency: "NGN",
      paymentReference,
      paymentStatus: "paid",
      ...(withChain ? { polygonTxHash: `0x${String(i).padStart(64, "0")}` } : {}),
      createdAt,
    });
    writeIndex += 1;
  }

  for (let j = 0; j < failedCount; j += 1) {
    const createdAt = new Date(now - (10 + j) * dayMs).toISOString();
    const ref = doc(collection(dbClient, "transactions"));
    batch.set(ref, {
      orderId: `demo-order-fail-${farmerId}-${j}`,
      buyerId: demoBuyerId,
      farmerId,
      amountInKobo: 400_000,
      currency: "NGN",
      paymentReference: `SEED-FAIL-${farmerId}-${j}`,
      paymentStatus: "failed",
      createdAt,
    });
    writeIndex += 1;
  }

  await batch.commit();
  logger.info("loans/seedDemoTransactions", "Demo orders + transactions seed completed", {
    farmerId,
    farmerName,
    docsWritten: writeIndex,
  });
};
