import i18n from "@/config/i18n/i18n";
import useAuth from "@/features/auth/useAuth";
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "./ui/menubar";
import { LanguagesIcon, LogOut, User } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Avatar from "./avatar";
import { useGetProfileQuery } from "@/services/apis/auth/auth.api";

const SUPPORTED_LANGUAGES = [{ code: "es-ES" }, { code: "en-US" }];

const AccountHeader = () => {
  const { t } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);
  const { isAuthenticated, logout } = useAuth();
  const { data: profile } = useGetProfileQuery(undefined, {
    skip: !isAuthenticated,
  });

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code).then(() => setLanguage(code));
  };

  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>
          <h6 className="text-white mr-2">{profile?.username}</h6>
          <Avatar />
        </MenubarTrigger>
        <MenubarContent className="dark">
          <MenubarItem>
            <User className="mr-2 h-4 w-4" />
            {t("accountMenu.account", { ns: "global" })}
          </MenubarItem>
          <MenubarSub>
            <MenubarSubTrigger>
              <LanguagesIcon className="mr-2 h-4 w-4" />
              {t("accountMenu.languages")}
            </MenubarSubTrigger>
            <MenubarSubContent>
              {SUPPORTED_LANGUAGES.map(({ code }) => (
                <MenubarCheckboxItem
                  key={code}
                  onClick={() => changeLanguage(code)}
                  checked={language === code}
                >
                  {code}
                </MenubarCheckboxItem>
              ))}
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem onClick={logout.request}>
            <LogOut className="mr-2 h-4 w-4" />
            {t("accountMenu.logout")}
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};

export default AccountHeader;
