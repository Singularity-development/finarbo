import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { setupStore } from "./services/config/store.ts";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import LocaleProvider from "./common/providers/locale-provider.tsx";
import App from "./app.tsx";
import "./config/dayjs.ts";
import "keen-slider/keen-slider.min.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={setupStore()}>
      <LocaleProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </LocaleProvider>
    </Provider>
  </StrictMode>
);
