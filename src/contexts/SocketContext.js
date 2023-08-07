import React, { createContext, useContext, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();
const socket = io("http://localhost:4004");

export function useSockets() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }) {
  const [userName, setUserName] = useState("");
  const [room, setRoom] = useState("");
  return (
    <SocketContext.Provider
      value={{ socket, userName, setUserName, room, setRoom }}
    >
      {children}
    </SocketContext.Provider>
  );
}
