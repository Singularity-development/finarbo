import { useTranslation } from "react-i18next";
import Logo from "./logo";
import AccountHeader from "./account-menu";
import { Link } from "react-router-dom";

const Header = () => {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b px-6">
      <Link to="/portfolio" className="flex gap-2">
        <Logo />

        <h1 className="text-xl font-semibold text-white">{t("title")}</h1>
      </Link>
      <div className="ml-auto flex items-center gap-4">
        <AccountHeader />
      </div>
    </header>
  );
};

export default Header;
