"use client";

import type { UserRole } from "@/shared/types";

type RoleSelectProps = {
  value: UserRole;
  onChange: (role: UserRole) => void;
};

export const RoleSelect = ({ value, onChange }: RoleSelectProps) => {
  return (
    <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
      <button
        type="button"
        onClick={() => onChange("farmer")}
        className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
          value === "farmer"
            ? "bg-green-600 text-white"
            : "bg-transparent text-slate-700"
        }`}
      >
        Farmer
      </button>
      <button
        type="button"
        onClick={() => onChange("buyer")}
        className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
          value === "buyer"
            ? "bg-green-600 text-white"
            : "bg-transparent text-slate-700"
        }`}
      >
        Buyer
      </button>
    </div>
  );
};
