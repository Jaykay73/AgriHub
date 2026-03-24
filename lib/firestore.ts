import {
  doc,
  getDoc as fbGetDoc,
  setDoc as fbSetDoc,
  updateDoc as fbUpdateDoc,
  collection,
  query as fbQuery,
  where as fbWhere,
  type DocumentData,
  type Firestore,
  type QueryConstraint,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

const getDbClient = (): Firestore => {
  if (!db) {
    throw new Error(
      "Firebase Firestore is not configured. Add NEXT_PUBLIC_FIREBASE_* values.",
    );
  }
  return db;
};

export const getDocRef = (path: string) => doc(getDbClient(), path);

export const getDoc = async <T>(path: string): Promise<T | null> => {
  const snapshot = await fbGetDoc(getDocRef(path));
  return snapshot.exists() ? (snapshot.data() as T) : null;
};

export const setDoc = async <T extends DocumentData>(
  path: string,
  data: T,
) => fbSetDoc(getDocRef(path), data);

export const updateDoc = async <T extends DocumentData>(
  path: string,
  data: Partial<T>,
) => fbUpdateDoc(getDocRef(path), data as DocumentData);

export const getCollection = (path: string) => collection(getDbClient(), path);

export const query = (path: string, ...constraints: QueryConstraint[]) =>
  fbQuery(getCollection(path), ...constraints);

export const where = fbWhere;
