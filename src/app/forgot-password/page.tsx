import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-16">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Reset your password</h1>
        <p className="text-sm text-zinc-600">SRS 0450 — reset password.</p>
      </div>
      <ForgotPasswordForm />
    </main>
  );
}
