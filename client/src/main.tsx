import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { setupStore } from "./services/config/store.ts";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import LocaleProvider from "./common/providers/locale-provider.tsx";
import { AuthProvider } from "./features/auth/AuthContext.tsx";
import App from "./app.tsx";
import "./config/dayjs.ts";
import "keen-slider/keen-slider.min.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={setupStore()}>
      <LocaleProvider>
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </LocaleProvider>
    </Provider>
  </StrictMode>
);
