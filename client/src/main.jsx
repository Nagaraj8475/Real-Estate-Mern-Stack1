import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
// import { Auth0Provider } from "@auth0/auth0-react";
import { AuthProvider } from "./context/auth";


ReactDOM.createRoot(document.getElementById("root")).render(
  
    <AuthProvider>
      <App />
    </AuthProvider>
  
);
