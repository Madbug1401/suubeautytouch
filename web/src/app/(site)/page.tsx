import Image from "next/image";
import Link from "next/link";
import { ServiceCard } from "@/components/site/ServiceCard";
import { SERVICOS } from "@/lib/config";
import { getImagensSite } from "@/lib/data";

export const revalidate = 60; // s — alterações no admin aparecem até 1 min depois

export default async function HomePage() {
  const imagens = await getImagensSite();

  return (
    <>
      {/* HERO */}
      <section className="relative flex h-[80vh] items-center md:h-[calc(100vh-7rem)]">
        <Image src="/img/su-hero.jpeg" alt="" fill priority sizes="100vw" className="object-cover object-[center_30%]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 to-black/25 dark:from-black/65 dark:to-black/40" />
        <div className="relative mx-auto w-full max-w-6xl px-6 text-center text-white md:text-left">
          <div className="max-w-xl">
            <h1 className="text-4xl leading-tight md:text-5xl">
              Realçando a sua beleza
              <br />
              com <span className="text-pink-main">elegância</span> e <span className="text-pink-main">glamour</span>
            </h1>
            <p className="mb-10 mt-6 text-lg">
              Maquiagem profissional para momentos únicos. Sinta-se confiante, poderosa e inesquecível.
            </p>
            <Link href="/marcacao" className="btn px-9 py-3.5 text-lg">
              Marcar Atendimento
            </Link>
          </div>
        </div>
      </section>

      {/* SERVIÇOS */}
      <section className="container-page">
        <h2 className="text-center">Serviços Principais</h2>
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICOS.map((s) => (
            <ServiceCard key={s.id} imagem={imagens[s.id]} alt={s.nome} titulo={s.nome} href="/servicos">
              <p>{s.resumo}</p>
            </ServiceCard>
          ))}
        </div>
      </section>

      {/* SOBRE */}
      <section className="container-page fade-in text-center">
        <h2>Sobre a Profissional</h2>
        <p className="mx-auto max-w-2xl">
          Sou apaixonada por realçar a beleza feminina com técnicas modernas, produtos de qualidade e atenção aos
          detalhes. Cada atendimento é único, pensado para valorizar quem você é.
        </p>
      </section>

      {/* DEPOIMENTOS */}
      <section className="container-page fade-in text-center italic">
        <h2 className="not-italic">O que dizem as clientes</h2>
        <p>“Maquiagem impecável, senti-me linda!”</p>
        <p>“Profissional incrível, super recomendo.”</p>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-pink-medium to-pink-main px-6 py-16 text-center text-white dark:from-[#c67189] dark:to-pink-deep">
        <h2>Pronta para se sentir incrível?</h2>
        <Link href="/marcacao" className="btn bg-white text-pink-deep hover:bg-pink-light">
          Agendar Agora
        </Link>
      </section>
    </>
  );
}
