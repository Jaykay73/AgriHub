"use client";

import { useEffect, useState } from "react";
import {
  CreditCard,
  Mail,
  Trash2,
  Tractor,
  User,
  MapPin,
  Loader2,
  Save,
  Bell,
  Phone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { updateUser } from "@/features/auth/api/users";
import type { User as UserProfile } from "@/shared/types";

type SettingsSection = "profile" | "payment" | "notifications";

type PaymentMethod = NonNullable<UserProfile["paymentDetails"]>["preferredMethod"];

const defaultPayment: {
  preferredMethod: PaymentMethod;
  accountName: string;
  accountNumber: string;
  bankName: string;
} = {
  preferredMethod: "transfer",
  accountName: "",
  accountNumber: "",
  bankName: "",
};

const defaultNotifications = {
  orderUpdates: true,
  paymentAlerts: true,
  marketing: false,
  smsAlerts: false,
};

export default function FarmerSettingsPage() {
  const { user } = useAuth();
  const { data: currentUser, isLoading, refetch } = useCurrentUser();
  const [section, setSection] = useState<SettingsSection>("profile");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    name: "",
    farmName: "",
    location: "",
    phoneNumber: "",
    paymentDetails: { ...defaultPayment },
    notificationSettings: { ...defaultNotifications },
  });

  useEffect(() => {
    if (!currentUser) return;
    setForm({
      name: currentUser.name || user?.displayName || "",
      farmName: currentUser.farmName || "",
      location: currentUser.location || "",
      phoneNumber: currentUser.phoneNumber || "",
      paymentDetails: {
        preferredMethod: currentUser.paymentDetails?.preferredMethod || "transfer",
        accountName: currentUser.paymentDetails?.accountName || "",
        accountNumber: currentUser.paymentDetails?.accountNumber || "",
        bankName: currentUser.paymentDetails?.bankName || "",
      },
      notificationSettings: {
        orderUpdates: currentUser.notificationSettings?.orderUpdates ?? true,
        paymentAlerts: currentUser.notificationSettings?.paymentAlerts ?? true,
        marketing: currentUser.notificationSettings?.marketing ?? false,
        smsAlerts: currentUser.notificationSettings?.smsAlerts ?? false,
      },
    });
  }, [currentUser, user]);

  const emailDisplay = user?.email ?? currentUser?.email ?? "";

  const saveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user?.uid) return;
    setSaving(true);
    setSaved(false);
    try {
      const payload: Partial<UserProfile> = {
        name: form.name.trim(),
        farmName: form.farmName.trim() || undefined,
        location: form.location.trim() || undefined,
        phoneNumber: form.phoneNumber.trim() || undefined,
      };
      await updateUser(user.uid, payload);
      await refetch();
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  const savePayment = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user?.uid) return;
    setSaving(true);
    setSaved(false);
    try {
      await updateUser(user.uid, {
        paymentDetails: { ...form.paymentDetails },
      });
      await refetch();
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  const saveNotifications = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user?.uid) return;
    setSaving(true);
    setSaved(false);
    try {
      await updateUser(user.uid, {
        notificationSettings: { ...form.notificationSettings },
      });
      await refetch();
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  const navButton = (id: SettingsSection, label: string, icon: React.ReactNode) => (
    <button
      key={id}
      type="button"
      onClick={() => {
        setSection(id);
        setSaved(false);
      }}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-bold transition-all",
        section === id
          ? "border border-border/50 bg-white text-primary shadow-sm"
          : "text-muted hover:bg-white hover:text-foreground",
      )}
    >
      {icon}
      {label}
    </button>
  );

  if (isLoading && !currentUser) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <h1 className="text-3xl font-black tracking-tight text-foreground">Settings</h1>
          </div>
          <p className="font-medium text-muted">
            Manage your personal profile, notification preferences, and account security.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <aside className="space-y-2 lg:col-span-1">
          <div className="rounded-xl border border-border/50 bg-surface p-1">
            {navButton("profile", "Profile Information", <User className="h-4 w-4" />)}
            {navButton("payment", "Payment Details", <CreditCard className="h-4 w-4" />)}
            {navButton("notifications", "Notifications", <Mail className="h-4 w-4" />)}
            <button
              type="button"
              className="mt-4 flex w-full items-center gap-3 rounded-lg rounded-t-none border-t border-border/50 px-4 py-2.5 text-sm font-bold text-red-600 transition-all hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              Delete Account
            </button>
          </div>
        </aside>

        <main className="space-y-6 lg:col-span-3">
          {section === "profile" ? (
            <div className="rounded-2xl border-2 border-border/50 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="mb-6 flex items-center gap-2 border-b-2 border-border/50 pb-4 text-xl font-bold text-foreground">
                <User className="h-5 w-5 text-primary" />
                General Profile
              </h2>
              <form onSubmit={saveProfile} className="space-y-6">
                <div className="flex flex-col gap-6 border-b border-border/50 pb-6 sm:flex-row sm:items-center">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-primary/10 shadow-xl">
                    <Tractor className="h-10 w-10 text-primary" />
                  </div>
                  <button
                    type="button"
                    disabled
                    className="rounded-xl border-2 border-border bg-white px-5 py-2.5 text-sm font-bold text-muted"
                    title="Coming soon"
                  >
                    Change Photo
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted">Full Name</label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      className="w-full rounded-xl border-2 border-border bg-white px-4 py-3.5 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                      placeholder="Your name"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted">Email Address</label>
                    <p className="rounded-xl border border-border/50 bg-surface px-4 py-3.5 text-sm font-medium text-foreground opacity-80">
                      {emailDisplay || "—"}
                    </p>
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                      <input
                        value={form.phoneNumber}
                        onChange={(e) => setForm((f) => ({ ...f, phoneNumber: e.target.value }))}
                        className="w-full rounded-xl border-2 border-border bg-white py-3.5 pl-11 pr-4 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                        placeholder="+234..."
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted">Business/Farm Name</label>
                    <input
                      value={form.farmName}
                      onChange={(e) => setForm((f) => ({ ...f, farmName: e.target.value }))}
                      className="w-full rounded-xl border-2 border-border bg-white px-4 py-3.5 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                      placeholder="e.g. Green Valley Organic Farms"
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted">Farm Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                      <input
                        value={form.location}
                        onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                        className="w-full rounded-xl border-2 border-border bg-white py-3.5 pl-11 pr-4 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                        placeholder="e.g. Benue State, Nigeria"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
                {saved ? (
                  <p className="text-sm font-bold text-emerald-600">Profile saved.</p>
                ) : null}
              </form>
            </div>
          ) : null}

          {section === "payment" ? (
            <div className="rounded-2xl border-2 border-border/50 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="mb-6 flex items-center gap-2 border-b-2 border-border/50 pb-4 text-xl font-bold text-foreground">
                <CreditCard className="h-5 w-5 text-primary" />
                Payment Details
              </h2>
              <p className="mb-6 text-sm font-medium text-muted">
                Payout and bank details for settlements. Stored securely on your account.
              </p>
              <form onSubmit={savePayment} className="space-y-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted">Preferred Method</label>
                    <select
                      value={form.paymentDetails.preferredMethod}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          paymentDetails: {
                            ...f.paymentDetails,
                            preferredMethod: e.target.value as "card" | "transfer" | "ussd" | "wallet",
                          },
                        }))
                      }
                      className="w-full rounded-xl border-2 border-border bg-white px-4 py-3.5 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                    >
                      <option value="card">Card</option>
                      <option value="transfer">Bank Transfer</option>
                      <option value="ussd">USSD</option>
                      <option value="wallet">Wallet</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted">Account Name</label>
                    <input
                      value={form.paymentDetails.accountName}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          paymentDetails: { ...f.paymentDetails, accountName: e.target.value },
                        }))
                      }
                      className="w-full rounded-xl border-2 border-border bg-white px-4 py-3.5 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                      placeholder="Account holder name"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted">Account Number</label>
                    <input
                      value={form.paymentDetails.accountNumber}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          paymentDetails: { ...f.paymentDetails, accountNumber: e.target.value },
                        }))
                      }
                      className="w-full rounded-xl border-2 border-border bg-white px-4 py-3.5 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                      placeholder="0123456789"
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted">Bank Name</label>
                    <input
                      value={form.paymentDetails.bankName}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          paymentDetails: { ...f.paymentDetails, bankName: e.target.value },
                        }))
                      }
                      className="w-full rounded-xl border-2 border-border bg-white px-4 py-3.5 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                      placeholder="Your bank"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {saving ? "Saving..." : "Save payment details"}
                </button>
                {saved ? (
                  <p className="text-sm font-bold text-emerald-600">Payment details saved.</p>
                ) : null}
              </form>
            </div>
          ) : null}

          {section === "notifications" ? (
            <div className="rounded-2xl border-2 border-border/50 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="mb-6 flex items-center gap-2 border-b-2 border-border/50 pb-4 text-xl font-bold text-foreground">
                <Bell className="h-5 w-5 text-primary" />
                Notifications
              </h2>
              <p className="mb-6 text-sm font-medium text-muted">
                Choose how you want to hear about orders, payments, and updates.
              </p>
              <form onSubmit={saveNotifications} className="space-y-4">
                {(
                  [
                    { key: "orderUpdates" as const, label: "Order updates" },
                    { key: "paymentAlerts" as const, label: "Payment alerts" },
                    { key: "marketing" as const, label: "Promotions & marketing" },
                    { key: "smsAlerts" as const, label: "SMS notifications" },
                  ] as const
                ).map((item) => (
                  <label
                    key={item.key}
                    className="flex items-center justify-between rounded-xl border border-border/50 bg-surface px-4 py-3"
                  >
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground">{item.label}</span>
                    <input
                      type="checkbox"
                      checked={form.notificationSettings[item.key]}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          notificationSettings: {
                            ...f.notificationSettings,
                            [item.key]: e.target.checked,
                          },
                        }))
                      }
                      className="h-4 w-4 accent-primary"
                    />
                  </label>
                ))}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {saving ? "Saving..." : "Save notification preferences"}
                  </button>
                </div>
                {saved ? (
                  <p className="text-sm font-bold text-emerald-600">Notification preferences saved.</p>
                ) : null}
              </form>
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
}
