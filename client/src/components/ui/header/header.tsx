import { useTranslation } from "react-i18next";
import { LanguageSelector } from "./language-selector";
import Logo from "../logo";

const Header = () => {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-[#1e2030] bg-[#0a0c10] px-6">
      <Logo />
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-semibold text-white">{t("title")}</h1>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <LanguageSelector />
      </div>
    </header>
  );
};

export default Header;
