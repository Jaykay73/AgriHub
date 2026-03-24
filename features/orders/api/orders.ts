"use client";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { logger } from "@/lib/logger";
import type { Order } from "@/shared/types";

type CreateOrderInput = Omit<Order, "id" | "createdAt" | "updatedAt">;

const getDb = () => {
  if (!db) {
    throw new Error("Firebase is not configured.");
  }
  return db;
};

const toMillis = (value: unknown): number => {
  if (!value) return 0;
  if (typeof value === "string") {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  if (typeof value === "object" && value !== null) {
    const maybeSeconds = (value as { seconds?: unknown }).seconds;
    if (typeof maybeSeconds === "number") return maybeSeconds * 1000;
  }
  return 0;
};

const mapOrder = (id: string, raw: Record<string, unknown>): Order => ({
  id,
  listingId: String(raw.listingId ?? ""),
  buyerId: String(raw.buyerId ?? ""),
  farmerId: String(raw.farmerId ?? ""),
  productName: String(raw.productName ?? ""),
  buyerName: String(raw.buyerName ?? ""),
  buyerEmail: String(raw.buyerEmail ?? ""),
  buyerPhone: String(raw.buyerPhone ?? ""),
  deliveryAddress: String(raw.deliveryAddress ?? ""),
  quantity: Number(raw.quantity ?? 0),
  amountInKobo: Number(raw.amountInKobo ?? 0),
  status: (raw.status as Order["status"]) ?? "pending",
  paymentStatus: (raw.paymentStatus as Order["paymentStatus"]) ?? "unpaid",
  paymentReference: raw.paymentReference ? String(raw.paymentReference) : "",
  createdAt: String(raw.createdAt ?? ""),
  updatedAt: String(raw.updatedAt ?? ""),
});

export const createOrder = async (data: CreateOrderInput) => {
  logger.info("orders/api", "Creating order", {
    listingId: data.listingId,
    buyerId: data.buyerId,
  });
  const dbClient = getDb();
  const docRef = await addDoc(collection(dbClient, "orders"), {
    ...data,
    status: "pending",
    paymentStatus: "unpaid",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  logger.info("orders/api", "Order created", { orderId: docRef.id });
  return docRef.id;
};

const runOrderQuery = async (field: "buyerId" | "farmerId", userId: string) => {
  const dbClient = getDb();
  const baseQuery = query(collection(dbClient, "orders"), where(field, "==", userId));
  let snapshot;
  try {
    snapshot = await getDocs(query(baseQuery, orderBy("createdAt", "desc")));
  } catch (error) {
    logger.warn("orders/api", "Indexed orders query failed; retrying without orderBy", error);
    snapshot = await getDocs(baseQuery);
  }
  const items = snapshot.docs.map((entry) =>
    mapOrder(entry.id, entry.data() as Record<string, unknown>),
  );
  items.sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));
  return items;
};

export const getOrdersByBuyer = async (buyerId: string): Promise<Order[]> => {
  logger.info("orders/api", "Fetching buyer orders", { buyerId });
  return runOrderQuery("buyerId", buyerId);
};

export const getOrdersByFarmer = async (farmerId: string): Promise<Order[]> => {
  logger.info("orders/api", "Fetching farmer orders", { farmerId });
  return runOrderQuery("farmerId", farmerId);
};

export const getOrderById = async (orderId: string): Promise<Order | null> => {
  const dbClient = getDb();
  logger.info("orders/api", "Fetching order by id", { orderId });
  const snapshot = await getDoc(doc(dbClient, "orders", orderId));
  if (!snapshot.exists()) return null;
  return mapOrder(snapshot.id, snapshot.data() as Record<string, unknown>);
};

export const updateOrderStatus = async (
  orderId: string,
  status: Order["status"],
  paymentStatus?: Order["paymentStatus"],
  paymentReference?: string,
) => {
  const dbClient = getDb();
  logger.info("orders/api", "Updating order status", {
    orderId,
    status,
    paymentStatus,
  });
  await updateDoc(doc(dbClient, "orders", orderId), {
    status,
    ...(paymentStatus ? { paymentStatus } : {}),
    ...(paymentReference ? { paymentReference } : {}),
    updatedAt: serverTimestamp(),
  });
};

export const deleteOrder = async (orderId: string) => {
  const dbClient = getDb();
  logger.info("orders/api", "Deleting order", { orderId });
  await deleteDoc(doc(dbClient, "orders", orderId));
};
