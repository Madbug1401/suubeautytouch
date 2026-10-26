import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { SiteProviders } from "@/components/motion/SiteProviders";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <SiteProviders>
      <Header />
      <main className="min-h-[60vh] pt-header has-[[aria-roledescription=carrossel]]:pt-0">{children}</main>
      <Footer />
      <WhatsAppButton />
    </SiteProviders>
  );
}
