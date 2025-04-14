import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

export const useDocumentTitle = () => {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    document.title = location.pathname
      ? `Finarbo - ${t(location.pathname, { ns: "paths" })}`
      : "Finarbo";
  }, [location.pathname]);
};
