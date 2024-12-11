import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "@components/App";
import "@scss/index.scss";

const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}