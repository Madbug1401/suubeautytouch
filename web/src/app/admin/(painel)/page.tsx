import Link from "next/link";
import { ADMIN_TABS } from "@/components/admin/tabs";

export default function AdminHome() {
  return (
    <div className="pt-8 text-center">
      <h1 className="text-4xl md:text-5xl">Bem-vindo ao Painel Admin</h1>
      <p className="mb-12 text-lg text-muted">Escolha uma opção para começar a gerir o seu negócio</p>
      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
        {ADMIN_TABS.map((t) => (
          <Link key={t.href} href={t.href} className="card group block p-10 transition duration-300 hover:-translate-y-2">
            <span aria-hidden="true" className="mb-4 block text-6xl transition group-hover:scale-110">{t.icon}</span>
            <h3 className="mb-2 text-2xl text-pink-main">{t.label}</h3>
            <p className="text-sm text-muted">{t.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
