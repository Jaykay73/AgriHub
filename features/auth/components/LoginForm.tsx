"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import {
  signInWithEmail,
  // signInWithGoogle,
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

  // const onGoogleSignIn = async () => {
  //   setError("");
  //   setLoading(true);
  //   try {
  //     const credential = await signInWithGoogle();
  //     await routeByRole(credential.user.uid);
  //   } catch {
  //     setError("Google sign-in failed. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label htmlFor="email" className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-xl border-2 border-border bg-white px-4 py-3.5 text-sm font-medium transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
          placeholder="farmer@example.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-xl border-2 border-border bg-white px-4 py-3.5 text-sm font-medium transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
          placeholder="••••••••"
        />
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        disabled={loading}
        type="submit"
        className="mt-6 w-full rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>

      {/* <button
        disabled={loading}
        type="button"
        onClick={onGoogleSignIn}
        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-border bg-white px-4 py-3.5 text-sm font-bold text-foreground transition-colors hover:bg-border/20 disabled:opacity-60"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335" />
          <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4" />
          <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05" />
          <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26538 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853" />
        </svg>
        Continue with Google
      </button> */}

      <p className="mt-8 text-center text-sm font-medium text-muted">
        New here?{" "}
        <Link href="/signup" className="font-bold text-primary hover:text-primary-light transition-colors">
          Create an account
        </Link>
      </p>
    </form>
  );
};
