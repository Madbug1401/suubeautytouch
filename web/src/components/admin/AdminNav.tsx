"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getClientAuth } from "@/lib/firebase/client";
import { ADMIN_TABS } from "./tabs";


export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await signOut(getClientAuth());
    router.replace("/admin/login");
  }

  return (
    <nav className="sticky top-0 z-40 flex flex-wrap items-center justify-between gap-4 bg-bg px-6 py-4 shadow-[0_4px_12px_var(--shadow)] dark:bg-surface md:px-12">
      <div className="flex items-center gap-2">
        <Link href="/admin" className="font-title text-2xl font-bold text-pink-main">Su Beauty Touch · Admin</Link>
        <ThemeToggle className="text-xl" />
      </div>
      <ul className="flex flex-1 flex-wrap justify-center gap-2 md:gap-6">
        {ADMIN_TABS.map((t) => (
          <li key={t.href}>
            <Link
              href={t.href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition hover:bg-pink-main hover:text-white ${pathname.startsWith(t.href) ? "bg-pink-main text-white" : ""}`}
            >
              {t.label}
            </Link>
          </li>
        ))}
      </ul>
      <button type="button" onClick={logout} className="btn btn-sm">Sair</button>
    </nav>
  );
}
