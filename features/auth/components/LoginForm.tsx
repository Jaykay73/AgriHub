"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import {
  signInWithEmail,
  signInWithGoogle,
} from "@/features/auth/api/firebaseAuthHelpers";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { User } from "@/shared/types";

export const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const routeByRole = async (uid: string) => {
    if (!db) {
      router.push("/marketplace");
      return;
    }

    const userDoc = await getDoc(doc(db, "users", uid));
    const userData = userDoc.data() as User | undefined;

    if (userData?.role === "farmer") {
      router.push("/farmer/dashboard");
      return;
    }

    router.push("/marketplace");
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const credential = await signInWithEmail(email, password);
      await routeByRole(credential.user.uid);
    } catch {
      setError("Unable to sign in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const onGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      const credential = await signInWithGoogle();
      await routeByRole(credential.user.uid);
    } catch {
      setError("Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        disabled={loading}
        type="submit"
        className="w-full rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>

      <button
        disabled={loading}
        type="button"
        onClick={onGoogleSignIn}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold disabled:opacity-60"
      >
        Continue with Google
      </button>

      <p className="text-sm text-slate-600">
        New here?{" "}
        <Link href="/signup" className="font-semibold text-green-700">
          Create an account
        </Link>
      </p>
    </form>
  );
};
