import { StrictMode } from "react";
import { Provider } from "./src/components/ui/provider.jsx";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { CatalogProvider } from "./context/CatalogContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename="/E-commerce">
      <Provider>
        <CatalogProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </CatalogProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>,
);
