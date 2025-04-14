import { Toaster } from "./components/ui/sonner.tsx";
import Header from "./components/ui/layout/header.tsx";
import { Outlet } from "react-router-dom";

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
