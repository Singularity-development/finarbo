import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

export const useDocumentTitle = () => {
  const location = useLocation();
  const { t, ready } = useTranslation();

  useEffect(() => {
    if (ready && location.pathname) {
      const screen = t(location.pathname.substring(1), { ns: "paths" });

      if (screen && screen !== "") {
        document.title = screen;
      } else {
        document.title = `Finarbo`;
      }
    }
  }, [ready, location.pathname, t]);
};
