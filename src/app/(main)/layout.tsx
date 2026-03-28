import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AdEngelferMobileFooter } from "@/components/ads/ad-engelfer-mobile-footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex min-h-screen flex-1 flex-col lg:ml-[260px]">
        <Header />
        {/* pb-[60px] no mobile para não esconder conteúdo atrás da barra fixa do anúncio */}
        <main className="flex-1 bg-dark-bg pb-[60px] lg:pb-0">{children}</main>
        <Footer />
      </div>

      {/* Barra fixa de anúncio no rodapé — somente mobile */}
      <AdEngelferMobileFooter />
    </div>
  );
}
