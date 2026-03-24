import Link from "next/link";

export default function FarmerDashboardPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900">Farmer Dashboard</h1>
      <p className="mt-2 text-slate-600">
        Your farmer workspace is ready. Listing, order, and analytics modules land
        in the next phases.
      </p>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Next actions</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
          <li>Create your first produce listing.</li>
          <li>Connect your payout profile.</li>
          <li>Review incoming buyer requests.</li>
        </ul>
      </div>

      <Link
        href="/marketplace"
        className="mt-6 inline-block rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white"
      >
        Go to marketplace
      </Link>
    </main>
  );
}
