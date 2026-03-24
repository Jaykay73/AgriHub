"use client";

import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { db } from "@/lib/firebase";
import type { User } from "@/shared/types";

export const useCurrentUser = () => {
  const { user } = useAuth();
  const uid = user?.uid;

  return useQuery({
    queryKey: ["user", uid],
    enabled: Boolean(uid && db),
    queryFn: async () => {
      if (!uid || !db) {
        return null;
      }

      const snapshot = await getDoc(doc(db, "users", uid));
      return snapshot.exists() ? (snapshot.data() as User) : null;
    },
  });
};
