import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900">Welcome back</h1>
      <p className="text-sm text-slate-600">
        Sign in to continue to your AgriHub dashboard.
      </p>
      <LoginForm />
    </div>
  );
}
