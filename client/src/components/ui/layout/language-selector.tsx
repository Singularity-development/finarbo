import i18n from "@/config/i18n";
import { Button } from "../button";
import { useState } from "react";

export const LanguageSelector = () => {
  const [language, setLanguage] = useState(i18n.language);

  const toggleLanguage = () => {
    if (language === "es-ES") {
      i18n.changeLanguage("en-US").then(() => setLanguage("en-US"));
    } else {
      i18n.changeLanguage("es-ES").then(() => setLanguage("es-ES"));
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="text-white border-[#1e2030] bg-[#131620]"
      onClick={toggleLanguage}
    >
      {language}
    </Button>
  );
};
