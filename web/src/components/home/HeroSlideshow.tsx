"use client";

// Hero da página inicial: abertura com cortina + slideshow em ecrã inteiro.
// O cartão "A seguir" expande-se (clip-path) até ocupar o ecrã — é o momento-assinatura do site.
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Rich } from "@/components/site/Rich";
import { gsapEase, prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export type Slide = {
  id: string;
  /** Nome curto (progresso e cartão "A seguir"). */
  nome: string;
  /** Legenda por cima do título. */
  label: string;
  /** Linhas do título; *texto* fica em itálico. */
  titulo: string[];
  texto: string;
  meta?: string;
  imagem: string;
  /** object-position da fotografia. */
  foco?: string;
  cta: { href: string; label: string };
};

const AUTOPLAY = 7; // s por slide
const INTRO_KEY = "sbt-intro";
const WORDMARK = "Su Beauty Touch";

const pad = (n: number) => String(n).padStart(2, "0");

export function HeroSlideshow({ slides }: { slides: Slide[] }) {
  const root = useRef<HTMLElement>(null);
  const card = useRef<HTMLButtonElement>(null);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);

  const s = useRef({ index: 0, busy: false, playing: true, visible: true, reduced: false });
  const progress = useRef<gsap.core.Tween | null>(null);
  const n = slides.length;

  const { contextSafe } = useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const reduced = prefersReducedMotion();
      s.current.reduced = reduced;
      if (reduced) {
        s.current.playing = false;
        setPlaying(false);
      }

      const lines0 = q('[data-text="0"] [data-line]');
      const fades0 = q('[data-text="0"] [data-fade]');
      const intro = q("[data-intro]")[0];
      gsap.set(q("[data-line]"), { yPercent: 110, y: 0 });
      gsap.set(q("[data-fade]"), { autoAlpha: 0 });

      if (reduced) {
        gsap.set([...lines0], { yPercent: 0 });
        gsap.set([...fades0, ...q("[data-chrome]")], { autoAlpha: 1 });
        gsap.set(intro, { display: "none" });
        startProgress(0);
        return;
      }

      const unlock = () => (document.documentElement.style.overflow = "");
      const tl = gsap.timeline({
        defaults: { ease: gsapEase.out },
        onComplete: () => startProgress(0),
      });

      let t = 0.1;
      const showIntro = intro && getComputedStyle(intro).display !== "none";
      if (showIntro) {
        try {
          sessionStorage.setItem(INTRO_KEY, "1");
        } catch {}
        document.documentElement.style.overflow = "hidden";
        tl.fromTo(q("[data-intro-char]"), { yPercent: 115 }, { yPercent: 0, duration: 1.2, stagger: 0.04 }, 0.15)
          .fromTo(q("[data-intro-rule]"), { scaleX: 0 }, { scaleX: 1, duration: 1.3, ease: gsapEase.inOut }, 0.4)
          .fromTo(q("[data-intro-meta]"), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.1 }, 0.7)
          .to(q("[data-intro-char]"), { yPercent: -115, duration: 0.75, ease: "power3.in", stagger: 0.02 }, 2.05)
          .to(q("[data-intro-meta], [data-intro-rule]"), { autoAlpha: 0, duration: 0.4 }, 2.05)
          .fromTo(
            intro,
            { clipPath: "inset(0% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 100% 0%)", duration: 1.25, ease: gsapEase.inOut, onComplete: unlock },
            2.45,
          )
          .set(intro, { display: "none" });
        t = 2.6;
      }

      tl.fromTo(q('[data-img="0"] [data-inner]'), { scale: 1.4 }, { scale: 1, duration: 2.4 }, t - 0.2)
        .to(lines0, { yPercent: 0, duration: 1.4, stagger: 0.1 }, t + 0.35)
        .fromTo(fades0, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.08 }, t + 0.75)
        .fromTo(q("[data-chrome]"), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.07 }, t + 0.9)
        .fromTo(card.current, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: gsapEase.inOut }, t + 0.8);

      // Parallax suave ao sair do hero
      gsap.to(q("[data-stage]"), {
        yPercent: 14,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });

      // Pausa quando o hero não está visível ou o separador está oculto
      const io = new IntersectionObserver(([e]) => {
        s.current.visible = e.isIntersecting;
        syncProgress();
      });
      io.observe(root.current!);
      const onVis = () => {
        s.current.visible = document.visibilityState === "visible";
        syncProgress();
      };
      document.addEventListener("visibilitychange", onVis);
      return () => {
        io.disconnect();
        document.removeEventListener("visibilitychange", onVis);
        progress.current?.kill();
        unlock();
      };
    },
    { scope: root },
  );

  function syncProgress() {
    const p = progress.current;
    if (!p) return;
    if (s.current.playing && s.current.visible) p.resume();
    else p.pause();
  }

  const startProgress = contextSafe((i: number) => {
    const fills = gsap.utils.toArray<HTMLElement>("[data-fill]", root.current);
    progress.current?.kill();
    gsap.set(fills, { scaleX: (k: number) => (k < i ? 1 : 0) });
    if (s.current.reduced) {
      gsap.set(fills[i], { scaleX: 1 });
      return;
    }
    progress.current = gsap.to(fills[i], {
      scaleX: 1,
      duration: AUTOPLAY,
      ease: "none",
      onComplete: () => go(i + 1, 1),
    });
    syncProgress();
  });

  /** Retângulo do cartão "A seguir" em coordenadas do hero, como inset() em px. */
  function cardInset() {
    const r = card.current?.getBoundingClientRect();
    const R = root.current!.getBoundingClientRect();
    if (!r || !r.width) return `inset(${R.height}px 0px 0px 0px)`;
    return `inset(${r.top - R.top}px ${R.right - r.right}px ${R.bottom - r.bottom}px ${r.left - R.left}px)`;
  }

  const go = contextSafe((target: number, dir: 1 | -1) => {
    const st = s.current;
    const to = (target + n) % n;
    if (st.busy || to === st.index) return;
    st.busy = true;
    progress.current?.kill();

    const from = st.index;
    const q = gsap.utils.selector(root);
    const inImg = q(`[data-img="${to}"]`)[0];
    const outImg = q(`[data-img="${from}"]`)[0];
    const inInner = inImg.querySelector("[data-inner]");
    const outInner = outImg.querySelector("[data-inner]");
    const inText = q(`[data-text="${to}"]`)[0];
    const outText = q(`[data-text="${from}"]`)[0];
    const cardImgs = q("[data-card-img]");
    const oldNext = (from + 1) % n;
    const newNext = (to + 1) % n;

    setActive(to);
    gsap.set(q("[data-img]"), { zIndex: 0 });
    gsap.set(outImg, { zIndex: 1 });
    gsap.set(inImg, { zIndex: 2, autoAlpha: 1 });
    gsap.set(inText, { autoAlpha: 1 });

    const done = () => {
      gsap.set(outImg, { autoAlpha: 0, clipPath: "none" });
      gsap.set(outInner, { scale: 1, xPercent: 0 });
      gsap.set(outText, { autoAlpha: 0 });
      gsap.set(inImg, { clipPath: "none" });
      st.index = to;
      st.busy = false;
      startProgress(to);
    };

    if (st.reduced) {
      gsap.set(q(`[data-text="${to}"] [data-line]`), { yPercent: 0 });
      gsap.set(q(`[data-text="${to}"] [data-fade]`), { autoAlpha: 1, y: 0 });
      gsap.set(q("[data-digits]"), { yPercent: (-100 / n) * to });
      gsap.set(cardImgs, { zIndex: 0 });
      gsap.set(cardImgs[newNext], { zIndex: 1 });
      gsap.fromTo(inImg, { opacity: 0 }, { opacity: 1, duration: 0.4, onComplete: done });
      return;
    }

    const W = root.current!.offsetWidth;
    const fromClip = dir > 0 ? cardInset() : `inset(0px ${W}px 0px 0px)`;

    gsap.set(cardImgs, { zIndex: 0 });
    gsap.set(cardImgs[oldNext], { zIndex: 1 });
    gsap.set(cardImgs[newNext], { zIndex: 2 });

    gsap
      .timeline({ defaults: { ease: gsapEase.out }, onComplete: done })
      // imagem
      .fromTo(inImg, { clipPath: fromClip }, { clipPath: "inset(0px 0px 0px 0px)", duration: 1.45, ease: gsapEase.inOut }, 0)
      .fromTo(inInner, { scale: 1.45 }, { scale: 1, duration: 2 }, 0.05)
      .to(outInner, { scale: 1.12, xPercent: -5 * dir, duration: 1.45, ease: gsapEase.inOut }, 0)
      // texto
      .to(q(`[data-text="${from}"] [data-line]`), { yPercent: -110, duration: 0.6, ease: "power3.in", stagger: 0.04 }, 0)
      .to(q(`[data-text="${from}"] [data-fade]`), { autoAlpha: 0, y: -12, duration: 0.45, ease: "power2.in" }, 0)
      .fromTo(q(`[data-text="${to}"] [data-line]`), { yPercent: 110 }, { yPercent: 0, duration: 1.25, stagger: 0.08 }, 0.75)
      .fromTo(q(`[data-text="${to}"] [data-fade]`), { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.07 }, 1)
      // contador e cartão
      .to(q("[data-digits]"), { yPercent: (-100 / n) * to, duration: 1.2, ease: gsapEase.inOut }, 0.15)
      .fromTo(cardImgs[newNext], { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: gsapEase.inOut }, 0.7)
      .fromTo(cardImgs[newNext].querySelector("[data-inner]"), { scale: 1.3 }, { scale: 1, duration: 1.4 }, 0.7);
  });

  const togglePlay = contextSafe(() => {
    s.current.playing = !s.current.playing;
    setPlaying(s.current.playing);
    if (s.current.playing && !progress.current?.isActive() && progress.current?.progress() === 1) startProgress(s.current.index);
    syncProgress();
  });

  const swipe = useRef<number | null>(null);
  const next = (active + 1) % n;

  return (
    <section
      ref={root}
      aria-roledescription="carrossel"
      aria-label="Destaques"
      className="on-photo relative h-svh min-h-[40rem] overflow-hidden bg-berry text-ivory"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(s.current.index + 1, 1);
        if (e.key === "ArrowLeft") go(s.current.index - 1, -1);
      }}
      onPointerDown={(e) => e.pointerType === "touch" && (swipe.current = e.clientX)}
      onPointerUp={(e) => {
        if (swipe.current === null) return;
        const dx = e.clientX - swipe.current;
        swipe.current = null;
        if (Math.abs(dx) > 50) go(s.current.index + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
      }}
    >
      {/* ---------- Abertura ---------- */}
      <noscript>
        <style>{"[data-intro]{display:none!important}"}</style>
      </noscript>
      <div data-intro aria-hidden="true" className="intro fixed inset-0 z-[150] grid place-items-center bg-barbie text-ivory">
        <div className="shell flex flex-col items-center">
          <p data-intro-meta className="eyebrow mb-8 text-ivory/85">
            Maquilhagem profissional
          </p>
          <p className="flex overflow-hidden pb-[0.12em] font-display text-display font-light italic">
            {[...WORDMARK].map((c, i) => (
              <span key={i} data-intro-char className="inline-block whitespace-pre">
                {c}
              </span>
            ))}
          </p>
          <span data-intro-rule className="mt-6 block h-px w-40 origin-left bg-ivory/70" />
          <p data-intro-meta className="eyebrow mt-8 text-ivory/85">
            Atendimento por marcação
          </p>
        </div>
      </div>

      {/* ---------- Imagens ---------- */}
      <div data-stage className="absolute inset-0">
        {slides.map((sl, i) => (
          <div key={sl.id} data-img={i} className={`absolute inset-0 overflow-hidden ${i === 0 ? "" : "invisible"}`} aria-hidden={i !== active}>
            <div data-inner className="absolute inset-0 will-change-transform">
              <Image
                src={sl.imagem}
                alt=""
                fill
                preload={i === 0}
                loading={i === 0 ? undefined : "eager"}
                sizes="100vw"
                className="object-cover"
                style={{ objectPosition: sl.foco ?? "50% 35%" }}
              />
            </div>
          </div>
        ))}
        <div className="hero-scrim absolute inset-0 z-10" />
      </div>

      {/* ---------- Texto ---------- */}
      <div className="shell relative z-20 grid h-full grid-cols-12 items-end pb-[clamp(7.5rem,17vh,11rem)] pt-header">
        <div className="col-span-12 grid lg:col-span-9">
          {slides.map((sl, i) => (
            <div
              key={sl.id}
              data-text={i}
              aria-hidden={i !== active}
              className={`col-start-1 row-start-1 ${i === 0 ? "" : "invisible"}`}
            >
              <p data-fade className="eyebrow mb-6 flex items-center gap-3 text-ivory/80">
                <span className="tabular-nums">({pad(i + 1)})</span>
                <span className="h-px w-8 bg-ivory/50" />
                {sl.label}
              </p>
              {i === 0 ? <h1 className="mb-0 text-display">{titleLines(sl)}</h1> : <h2 className="mb-0 text-display">{titleLines(sl)}</h2>}
              <div className="mt-8 grid max-w-2xl gap-8 sm:grid-cols-[1fr_auto] sm:items-end">
                <div data-fade>
                  {sl.meta && <p className="eyebrow mb-3 text-rose">{sl.meta}</p>}
                  <p className="max-w-md text-base leading-relaxed text-ivory/85 max-sm:line-clamp-3 sm:text-lg">{sl.texto}</p>
                </div>
                <div data-fade>
                  <Link href={sl.cta.href} tabIndex={i === active ? 0 : -1} className="btn bg-ivory text-berry hover:bg-barbie hover:text-ivory">
                    {sl.cta.label}
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- Contador ---------- */}
      <div data-chrome className="absolute right-gutter top-[calc(var(--spacing-header)+2rem)] z-20 flex items-baseline gap-2 font-display lining-nums">
        <span className="block h-[1em] overflow-hidden text-6xl leading-none italic md:text-7xl">
          <span data-digits className="flex flex-col">
            {slides.map((sl, i) => (
              <span key={sl.id} className="block h-[1em] tabular-nums">
                {pad(i + 1)}
              </span>
            ))}
          </span>
        </span>
        <span className="text-xl text-ivory/60">/ {pad(n)}</span>
      </div>

      {/* ---------- Progresso + controlos ---------- */}
      <div className="shell absolute inset-x-0 bottom-0 z-20 flex items-end gap-6 pb-gutter">
        <div data-chrome className="flex min-w-0 flex-1 items-end gap-3 pr-[calc(clamp(5.5rem,12vw,11rem)+1rem)] md:gap-5">
          <button
            type="button"
            onClick={togglePlay}
            className="eyebrow shrink-0 pb-0.5 text-ivory/80 transition-colors hover:text-ivory"
            aria-label={playing ? "Pausar destaques" : "Retomar destaques"}
          >
            {playing ? "Pausa" : "Play"}
          </button>
          <ol className="flex flex-1 gap-2 md:gap-4">
            {slides.map((sl, i) => (
              <li key={sl.id} className="flex-1">
                <button
                  type="button"
                  onClick={() => go(i, i > s.current.index ? 1 : -1)}
                  aria-label={`Ver ${sl.nome}`}
                  aria-current={i === active ? "true" : undefined}
                  className="group block w-full pt-3 text-left"
                >
                  <span className={`eyebrow mb-3 hidden truncate transition-colors duration-500 md:block ${i === active ? "text-ivory" : "text-ivory/45 group-hover:text-ivory/80"}`}>
                    {sl.nome}
                  </span>
                  <span className="relative block h-px w-full bg-ivory/25">
                    <span data-fill className="absolute inset-0 origin-left scale-x-0 bg-ivory" />
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* ---------- Cartão "A seguir" ---------- */}
      <button
        ref={card}
        type="button"
        onClick={() => go(s.current.index + 1, 1)}
        aria-label={`Seguinte: ${slides[next].nome}`}
        className="group absolute bottom-gutter right-gutter z-30 block aspect-[3/4] w-[clamp(5.5rem,12vw,11rem)] overflow-hidden bg-berry"
      >
        {slides.map((sl, i) => (
          <span key={sl.id} data-card-img className="absolute inset-0 overflow-hidden" style={{ zIndex: i === 1 ? 1 : 0 }}>
            <span data-inner className="absolute inset-0 block transition-transform duration-[900ms] ease-out-expo group-hover:scale-110">
              <Image src={sl.imagem} alt="" fill sizes="12vw" className="object-cover" style={{ objectPosition: sl.foco ?? "50% 35%" }} />
            </span>
          </span>
        ))}
        <span className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-2 bg-gradient-to-t from-berry/80 to-transparent p-2.5 pt-8 text-left md:p-3.5 md:pt-10">
          <span className="min-w-0">
            <span className="eyebrow block whitespace-nowrap text-[0.55rem] text-ivory max-lg:tracking-[0.14em] lg:text-ivory/70">A seguir</span>
            <span className="hidden truncate font-display text-xl leading-tight italic lg:block">{slides[next].nome}</span>
          </span>
          <span aria-hidden="true" className="transition-transform duration-500 ease-out-expo group-hover:translate-x-1">→</span>
        </span>
      </button>
    </section>
  );
}

function titleLines(sl: Slide) {
  return sl.titulo.map((l, k) => (
    <span key={k} className="mask">
      <span data-line className="block will-change-transform">
        <Rich text={l} />
      </span>
    </span>
  ));
}
