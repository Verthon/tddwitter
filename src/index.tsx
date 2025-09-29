import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import { App } from "./App";
import { I18nProvider } from "./i18n/I18nProvider";
import { startMocking } from "./integrations/mockServer";
import { QueryProvider } from "./api/QueryProvider";

startMocking().then(() => {
  const rootEl = document.getElementById("root");
  if (rootEl) {
    const root = ReactDOM.createRoot(rootEl);
    root.render(
      <React.StrictMode>
        <I18nProvider>
          <BrowserRouter>
            <QueryProvider>
              <App />
            </QueryProvider>
          </BrowserRouter>
        </I18nProvider>
      </React.StrictMode>
    );
  }
});
