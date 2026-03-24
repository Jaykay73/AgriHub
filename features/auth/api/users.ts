"use client";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { logger } from "@/lib/logger";
import type { User } from "@/shared/types";

const getDb = () => {
  if (!db) {
    logger.error("auth/api/users", "Firestore DB requested without configuration");
    throw new Error("Firebase is not configured.");
  }
  return db;
};

export const getUserById = async (uid: string): Promise<User | null> => {
  logger.info("auth/api/users", "Fetching user by ID", { uid });
  const dbClient = getDb();
  const snapshot = await getDoc(doc(dbClient, "users", uid));
  
  if (!snapshot.exists()) {
    logger.warn("auth/api/users", "User not found", { uid });
    return null;
  }
  
  return { uid, ...snapshot.data() } as User;
};

export const getFarmers = async (max: number = 20): Promise<User[]> => {
  logger.info("auth/api/users", "Fetching public farmers list", { limit: max });
  const dbClient = getDb();
  const q = query(
    collection(dbClient, "users"),
    where("role", "==", "farmer"),
    limit(max)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as User));
};
