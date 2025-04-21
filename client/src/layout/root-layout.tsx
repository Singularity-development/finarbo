import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import Header from "@/components/ui/header/header";

function RootLayout() {
  return (
    <>
      <main className="dark flex min-h-screen w-full flex-col bg-[#0a0c10]">
        <Header />

        <section className="items-center justify-between py-6 mx-auto container">
          <Outlet />
        </section>

        <Toaster />
      </main>
    </>
  );
}

export default RootLayout;
