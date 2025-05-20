import { LanguageSelector } from "@/components/language-selector";
import Logo from "@/components/logo";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <main className="dark grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10 bg-[#0a0c10]">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center">
              <Logo />
            </div>
            <h1 className="text-xl font-semibold text-white">Finarbo</h1>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center mb-32">
          <div className="w-full max-w-sm">
            <Outlet />
          </div>
        </div>
      </div>
      <aside className="relative hidden bg-muted lg:block">
        <img
          src="/public/assets/images/login_background.png"
          alt="Login background"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/10 to-transparent" />
        <div className="absolute top-5 right-5">
          <LanguageSelector />
        </div>
      </aside>
    </main>
  );
};

export default AuthLayout;
