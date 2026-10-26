"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SITE } from "@/lib/config";
import { dur, ease } from "@/lib/motion";
import { ContactLink } from "./ContactLink";
import { NAV } from "./nav";

const PRINCIPAIS = NAV.filter((n) => n.href !== "/" && n.href !== "/marcacao");

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [overHero, setOverHero] = useState(pathname === "/");
  const [hidden, setHidden] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setOverHero(pathname === "/" && y < window.innerHeight - 90);
      setHidden(y > 160 && y > last + 2);
      if (y < last - 2) setHidden(false);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const light = overHero || open; // texto marfim sobre fotografia / menu escuro

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[translate,background-color,color,border-color] duration-700 ease-out-expo ${
          hidden && !open ? "-translate-y-full" : ""
        } ${light ? "border-b border-transparent text-ivory" : "border-b border-line bg-bg text-fg"}`}
      >
        <div className="shell grid h-header grid-cols-[1fr_auto] items-center gap-6 lg:grid-cols-[1fr_auto_1fr]">
          <Link href="/" className="font-display text-2xl italic tracking-[-0.01em] md:text-[1.75rem]" aria-label={`${SITE.nome} — início`}>
            {SITE.nome}
          </Link>

          <nav aria-label="Navegação principal" className="hidden lg:block">
            <ul className="flex gap-8">
              {PRINCIPAIS.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} aria-current={isActive(href) ? "page" : undefined} className="link-draw eyebrow py-1">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center justify-end gap-2 md:gap-4">
            <ThemeToggle />
            <Link
              href="/marcacao"
              className={`btn btn-sm hidden sm:inline-flex ${light ? "bg-ivory text-berry hover:bg-barbie hover:text-ivory" : ""}`}
            >
              Marcar
            </Link>
            <button
              type="button"
              className="eyebrow flex items-center gap-2 py-2 lg:hidden"
              aria-expanded={open}
              aria-controls="menu-movel"
              onClick={() => setOpen((o) => !o)}
            >
              {open ? "Fechar" : "Menu"}
              <span aria-hidden="true" className="relative block h-2 w-5">
                <span className={`absolute left-0 top-0 h-px w-full bg-current transition-transform duration-500 ${open ? "translate-y-1 rotate-45" : ""}`} />
                <span className={`absolute bottom-0 left-0 h-px w-full bg-current transition-transform duration-500 ${open ? "-translate-y-1 -rotate-45" : ""}`} />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-movel"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-40 on-pink flex flex-col bg-barbie pt-header text-ivory lg:hidden"
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: dur.slow, ease: ease.inOut }}
          >
            <nav aria-label="Navegação" className="shell flex-1 overflow-y-auto py-8">
              <ul>
                {NAV.map(({ href, label }, i) => (
                  <li key={href} className="mask border-b border-ivory/25">
                    <motion.span
                      className="block"
                      initial={{ y: "100%" }}
                      animate={{ y: "0%" }}
                      transition={{ duration: dur.slow, ease: ease.out, delay: 0.25 + i * 0.05 }}
                    >
                      <Link
                        href={href}
                        aria-current={isActive(href) ? "page" : undefined}
                        className="flex items-baseline justify-between py-3 font-display text-[clamp(2.25rem,10vw,3.5rem)] leading-none aria-[current=page]:italic aria-[current=page]:text-berry"
                      >
                        {label}
                        <span className="eyebrow text-ivory/75 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                      </Link>
                    </motion.span>
                  </li>
                ))}
              </ul>
            </nav>
            <motion.div
              className="shell flex flex-wrap gap-x-8 gap-y-3 pb-10 pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: dur.base }}
            >
              <ContactLink tipo="whatsapp" className="eyebrow link-draw">WhatsApp</ContactLink>
              <ContactLink tipo="instagram" className="eyebrow link-draw">Instagram</ContactLink>
              <Link href="/marcacao" className="eyebrow link-draw text-ivory">Marcar atendimento →</Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
