import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Login" };

export default function LoginPage() {
  return (
    <main className="container-page max-w-md fade-in text-center">
      <h1>Área Administrativa</h1>
      <LoginForm />
    </main>
  );
}
