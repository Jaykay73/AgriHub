import { SignupForm } from "@/features/auth/components/SignupForm";

export default function SignupPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900">Create account</h1>
      <p className="text-sm text-slate-600">
        Join AgriHub as a farmer or buyer in minutes.
      </p>
      <SignupForm />
    </div>
  );
}
