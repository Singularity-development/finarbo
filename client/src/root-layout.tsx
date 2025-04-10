import { useState, useEffect } from "react";
import { Toaster } from "./components/ui/sonner";
import Portfolio from "./modules/portfolio/portfolio";
import i18n from "./config/i18n.ts";
import Header from "./components/ui/layout/header.tsx";

function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    i18n.on("initialized", () => {
      setIsLoading(false);
    });
  }, []);

  if (isLoading)
    return (
      <div className="flex min-h-screen w-full flex-col bg-[#0a0c10]"></div>
    );

  return (
    <main className="dark flex min-h-screen w-full flex-col bg-[#0a0c10]">
      <div className="flex flex-col">
        <Header />
        <Portfolio />
      </div>
      <Toaster />
    </main>
  );
}

export default RootLayout;
