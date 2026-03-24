"use client";

import { useEffect, useState } from "react";
import { Loader2, MapPin, Phone, Save, User as UserIcon } from "lucide-react";
import { Navbar } from "@/features/marketplace/components/Navbar";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { updateUser } from "@/features/auth/api/users";

export default function BuyerProfilePage() {
  const { user } = useAuth();
  const { data: currentUser, refetch } = useCurrentUser();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phoneNumber: "",
    address: "",
    location: "",
  });

  useEffect(() => {
    if (!currentUser) return;
    setForm({
      name: currentUser.name || user?.displayName || "",
      phoneNumber: currentUser.phoneNumber || "",
      address: currentUser.address || "",
      location: currentUser.location || "",
    });
  }, [currentUser, user]);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user?.uid) return;
    setSaving(true);
    setSaved(false);
    try {
      await updateUser(user.uid, form);
      await refetch();
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight text-foreground">My Profile</h1>
          <p className="mt-2 text-sm font-medium text-muted">
            Keep your delivery and contact details updated for faster checkout.
          </p>
        </div>

        <div className="rounded-[28px] border-2 border-border/50 bg-white p-8 shadow-sm">
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-muted">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your full name"
                  className="h-14 w-full rounded-2xl border-2 border-border bg-surface pl-12 pr-4 text-sm font-bold outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/5"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-muted">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  <input
                    value={form.phoneNumber}
                    onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                    placeholder="+234..."
                    className="h-14 w-full rounded-2xl border-2 border-border bg-surface pl-12 pr-4 text-sm font-bold outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/5"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-muted">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  <input
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="City / State"
                    className="h-14 w-full rounded-2xl border-2 border-border bg-surface pl-12 pr-4 text-sm font-bold outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/5"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-muted">
                Default Shipping Address
              </label>
              <textarea
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                rows={3}
                placeholder="Street address, city, state..."
                className="w-full resize-none rounded-2xl border-2 border-border bg-surface px-4 py-4 text-sm font-bold outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/5"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-1 disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? "Saving..." : "Save Profile"}
            </button>

            {saved ? (
              <p className="text-center text-[11px] font-black uppercase tracking-widest text-emerald-600">
                Profile updated successfully
              </p>
            ) : null}
          </form>
        </div>
      </main>
    </div>
  );
}
