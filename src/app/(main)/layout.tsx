import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

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
        <main className="flex-1 bg-dark-bg">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
