import React, { useState, useEffect } from "react";
import PageLoading from "../../components/screens/page-loading";
import i18n from "../../config/i18n";
import { I18nextProvider } from "react-i18next";

const LocaleProvider = ({ children }: { children: React.ReactElement }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    i18n.on("initialized", () => {
      setIsLoading(false);
    });
  }, []);

  if (isLoading) return <PageLoading />;

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

export default LocaleProvider;
