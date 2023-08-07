import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { SocketProvider } from "./contexts/SocketContext";
import { LoginProvider } from "./contexts/LoginContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <LoginProvider>
      <SocketProvider>
        <App />
        <ToastContainer />
      </SocketProvider>
    </LoginProvider>
  </React.StrictMode>
);
