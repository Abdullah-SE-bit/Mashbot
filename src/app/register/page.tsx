import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-16">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Create your Mashbot account</h1>
        <p className="text-sm text-zinc-600">SRS 0240 — new user accounts can be created.</p>
      </div>
      <RegisterForm />
    </main>
  );
}
