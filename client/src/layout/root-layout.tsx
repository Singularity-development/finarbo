import { Outlet } from "react-router-dom";
import Header from "@/components/header";
import Footer from "@/components/ui/footer";

function RootLayout() {
  return (
    <>
      <main className="dark flex min-h-screen w-full flex-col bg-[#0a0c10]">
        <Header />

        <section className="items-center justify-between py-6 mx-auto container">
          <Outlet />
        </section>

        <Footer />
      </main>
    </>
  );
}

export default RootLayout;
