"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SITE } from "@/lib/config";
import { NAV } from "./nav";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/95 shadow-[0_4px_12px_var(--shadow)] backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3 md:flex-col md:py-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="font-title text-2xl font-bold text-pink-main md:text-3xl">
            {SITE.nome}
          </Link>
          <ThemeToggle />
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-2xl md:hidden"
          aria-expanded={open}
          aria-controls="menu-principal"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "✕" : "☰"}
        </button>

        <nav
          id="menu-principal"
          aria-label="Navegação principal"
          className={`${open ? "block" : "hidden"} absolute inset-x-0 top-full border-b border-line bg-bg md:static md:block md:border-0 md:bg-transparent`}
        >
          <ul className="flex flex-col gap-1 p-4 md:flex-row md:flex-wrap md:justify-center md:gap-5 md:p-0">
            {NAV.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={isActive(href) ? "page" : undefined}
                  className={`block py-2 font-medium transition hover:text-pink-main md:py-0 ${isActive(href) ? "text-pink-main" : ""}`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
