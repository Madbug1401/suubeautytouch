import Link from "next/link";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="container-page text-center">
        <h1>Página não encontrada</h1>
        <p className="mb-8 text-muted">A página que procura não existe ou foi movida.</p>
        <Link href="/" className="btn">Voltar ao início</Link>
      </main>
      <Footer />
    </>
  );
}
