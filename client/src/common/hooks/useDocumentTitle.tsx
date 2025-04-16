import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

export const useDocumentTitle = () => {
  const location = useLocation();
  const { t, ready } = useTranslation("paths");

  useEffect(() => {
    if (ready && location.pathname) {
      const screen = t(location.pathname);
      document.title = `Finarbo - ${screen}`;
    }
  }, [ready, location.pathname, t]);
};
