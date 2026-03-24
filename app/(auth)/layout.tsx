import type { ReactNode } from "react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <Link href="/" className="text-2xl font-bold text-green-700">
            AgriHub
          </Link>
          <p className="mt-1 text-sm text-slate-600">
            Connect farmers and buyers with confidence.
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
