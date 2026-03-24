"use client";

import { useParams } from "next/navigation";
import { useUser } from "@/features/auth/hooks/useUser";
import { useFarmerListings } from "@/features/listings/hooks/useFarmerListings";
import { FarmerProfile } from "@/features/auth/components/FarmerProfile";
import { Spinner } from "@/shared/components/Spinner";
import { ArrowLeft, UserX } from "lucide-react";
import Link from "next/link";

export default function FarmerProfilePage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  
  const { data: farmer, isLoading: userLoading, isError: userError } = useUser(id || "");
  const { data: listings = [], isLoading: listingsLoading } = useFarmerListings(id || "");

  if (userLoading || listingsLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface">
        <Spinner className="h-10 w-10 text-primary" />
        <p className="animate-pulse font-black text-primary uppercase tracking-widest text-xs tracking-widest">Resolving Farmer Credentials...</p>
      </div>
    );
  }

  if (userError || !farmer || farmer.role !== "farmer") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-surface text-center">
        <div className="h-24 w-24 rounded-full bg-red-50 flex items-center justify-center text-red-600 mb-8 border border-red-100">
           <UserX className="h-12 w-12 opacity-20" />
        </div>
        <h1 className="text-3xl font-black text-foreground tracking-tight mb-2 uppercase">Farmer Not Found</h1>
        <p className="text-muted font-medium max-w-sm mb-10">We couldn't find a verified farmer associated with this ID. They might have changed their roles or left the network.</p>
        <Link 
          href="/farmers"
          className="rounded-2xl bg-primary px-10 py-5 text-sm font-black text-white shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Browse Active Farmers
        </Link>
      </div>
    );
  }

  return <FarmerProfile farmer={farmer} listings={listings} />;
}
