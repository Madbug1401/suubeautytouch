import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminNav } from "@/components/admin/AdminNav";

export default function PainelLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <AdminNav />
      <main className="container-page fade-in">{children}</main>
    </AdminGuard>
  );
}
