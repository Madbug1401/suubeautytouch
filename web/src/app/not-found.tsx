import Link from "next/link";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="shell grid min-h-[80svh] content-center gap-8 pb-section pt-[calc(var(--spacing-header)+4rem)]">
        <p className="eyebrow text-muted">Erro 404</p>
        <h1 className="mb-0 text-display">
          Esta página <em className="font-light">saiu</em>
          <br />
          sem maquilhagem.
        </h1>
        <p className="max-w-md text-lg text-muted">A página que procura não existe ou mudou de sítio.</p>
        <div>
          <Link href="/" className="btn">
            Voltar ao início <span aria-hidden="true">→</span>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
