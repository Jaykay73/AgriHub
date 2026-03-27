import { Tractor, Upload, CreditCard, Inbox, TrendingUp, DollarSign, Package, Users } from "lucide-react";
import Link from "next/link";
import { DashboardLoanApplicationSummary } from "@/features/loans/components/DashboardLoanApplicationSummary";

export default function FarmerDashboardPage() {
  const metrics = [
    { title: "Total Revenue", value: "₦0", change: "+0% from last month", icon: DollarSign },
    { title: "Active Listings", value: "0", change: "Add your first crop", icon: Package },
    { title: "Total Orders", value: "0", change: "Awaiting buyers", icon: Inbox },
    { title: "Profile Views", value: "0", change: "Complete your profile", icon: Users },
  ];

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-black text-foreground tracking-tight">Overview</h1>
          </div>
          <p className="text-muted font-medium">
            Welcome back to your farm workspace. Here&apos;s what&apos;s happening today.
          </p>
        </div>
        <Link
          href="/farmer/listings/new"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5 shadow-lg shadow-primary/20"
        >
          <Upload className="h-4 w-4" />
          Create New Listing
        </Link>
      </div>

      <DashboardLoanApplicationSummary />

      {/* Metrics Section */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, i) => {
          const Icon = metric.icon;
          return (
            <div key={i} className="rounded-2xl border-2 border-border/50 bg-white p-6 shadow-sm hover:border-primary/50 transition-colors">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-muted">{metric.title}</p>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-black text-foreground">{metric.value}</p>
                <div className="mt-1 flex items-center gap-1 text-sm font-medium text-emerald-600">
                  <TrendingUp className="h-4 w-4" />
                  {metric.change}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Next Actions */}
        <div className="rounded-2xl border-2 border-border/50 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-foreground border-b-2 border-border/50 pb-4 mb-4">Required Actions</h2>
          <ul className="space-y-4">
            <li className="flex items-start gap-4 p-3 rounded-xl bg-surface border border-border/50">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white border border-border shadow-sm"><Upload className="h-5 w-5 text-primary" /></div>
              <div>
                <p className="font-bold text-foreground">Add your first product</p>
                <p className="text-sm text-muted">You have no active listings on the marketplace.</p>
                <Link href="/farmer/listings/new" className="mt-2 text-sm font-bold text-primary hover:underline inline-block">Start listing &rarr;</Link>
              </div>
            </li>
            <li className="flex items-start gap-4 p-3 rounded-xl hover:bg-surface border border-transparent transition-colors cursor-pointer">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface border border-border shadow-sm"><CreditCard className="h-5 w-5 text-muted" /></div>
              <div>
                <p className="font-bold text-foreground">Set up payouts</p>
                <p className="text-sm text-muted">Connect your bank or wallet to receive funds.</p>
              </div>
            </li>
            <li className="flex items-start gap-4 p-3 rounded-xl hover:bg-surface border border-transparent transition-colors cursor-pointer opacity-50">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface border border-border shadow-sm"><Inbox className="h-5 w-5 text-muted" /></div>
              <div>
                <p className="font-bold text-foreground">Review orders</p>
                <p className="text-sm text-muted">Awaiting your first sale.</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Recent Activity Placeholder */}
        <div className="rounded-2xl border-2 border-border/50 bg-white p-6 shadow-sm flex flex-col items-center justify-center text-center p-12 bg-[url('https://www.transparenttextures.com/patterns/leaf.png')]">
          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Tractor className="h-8 w-8 text-primary opacity-50" />
          </div>
          <p className="text-lg font-bold text-foreground">No recent activity</p>
          <p className="text-muted text-sm mt-2 max-w-sm">When buyers interact with your products or place orders, updates will appear here.</p>
        </div>
      </div>
    </div>
  );
}

