import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { SongsProvider } from "./SongsProvider";
import App from "@components/App";

import "@scss/index.scss";

const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <SongsProvider>
        <App />
      </SongsProvider>
    </StrictMode>
  );
}
