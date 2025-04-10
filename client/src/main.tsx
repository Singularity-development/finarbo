import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import { setupStore } from "./services/config/store.ts";
import { Provider } from "react-redux";
import i18n from "./config/i18n.ts";
import RootLayout from "./root-layout.tsx";
import "./config/dayjs.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={setupStore()}>
      <I18nextProvider i18n={i18n}>
        <RootLayout />
      </I18nextProvider>
    </Provider>
  </StrictMode>
);
