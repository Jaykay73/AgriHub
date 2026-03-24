"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { signUpWithEmail } from "@/features/auth/api/firebaseAuthHelpers";
import { RoleSelect } from "@/features/auth/components/RoleSelect";
import type { UserRole } from "@/shared/types";

export const SignupForm = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");
  const [role, setRole] = useState<UserRole>("buyer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signUpWithEmail(email, password, { name, role, location });
      if (role === "farmer") {
        router.push("/farmer/dashboard");
      } else {
        router.push("/marketplace");
      }
    } catch {
      setError("Unable to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium">
          Full Name
        </label>
        <input
          id="name"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

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
          minLength={6}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label htmlFor="location" className="mb-1 block text-sm font-medium">
          Location
        </label>
        <input
          id="location"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          placeholder="State, Country"
        />
      </div>

      <div>
        <p className="mb-1 text-sm font-medium">Role</p>
        <RoleSelect value={role} onChange={setRole} />
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        disabled={loading}
        type="submit"
        className="w-full rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {loading ? "Creating account..." : "Create Account"}
      </button>

      <p className="text-sm text-slate-600">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-green-700">
          Sign in
        </Link>
      </p>
    </form>
  );
};
