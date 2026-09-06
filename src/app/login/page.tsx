import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-16">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Mashbot</h1>
        <p className="text-sm text-zinc-600">Log in to manage your campaigns.</p>
      </div>
      <LoginForm />
    </main>
  );
}
