import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import { ErrorBoundary } from "react-error-boundary";

import { I18nProvider } from "./i18n/I18nProvider";
import { startMocking } from "./integrations/mockServer";
import { QueryProvider } from "./api/QueryProvider";
import { DisasterRecovery } from "./core/components/DisasterRecovery";

import { App } from "./App";

startMocking().then(() => {
  const rootEl = document.getElementById("root");
  if (rootEl) {
    const root = ReactDOM.createRoot(rootEl);
    root.render(
      <React.StrictMode>
        <I18nProvider>
          <ErrorBoundary FallbackComponent={DisasterRecovery}>
            <BrowserRouter>
              <QueryProvider>
                <App />
              </QueryProvider>
            </BrowserRouter>
          </ErrorBoundary>
        </I18nProvider>
      </React.StrictMode>
    );
  }
});
