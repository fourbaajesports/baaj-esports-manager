import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import App from "./App.jsx";

import { MatchProvider } from "./context/MatchContext";
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <MatchProvider>
        <App />
      </MatchProvider>
    </AuthProvider>
  </StrictMode>
);