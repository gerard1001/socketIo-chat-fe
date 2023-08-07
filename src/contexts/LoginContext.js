import React, { createContext, useContext, useEffect, useState } from "react";

const LoginContext = createContext();

export function useLoginData() {
  return useContext(LoginContext);
}

export function LoginProvider({ children }) {
  const [loginData, setLoginData] = useState(
    JSON.parse(localStorage.getItem("holaChatUser"))
  );

  return (
    <LoginContext.Provider value={{ loginData, setLoginData }}>
      {children}
    </LoginContext.Provider>
  );
}
