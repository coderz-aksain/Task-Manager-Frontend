// src/context/SocketProvider.js
import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";

const SocketContext = createContext();

export const SocketProvider = ({ children, userId }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_API_URL || "http://localhost:3001", {
      auth: { token: localStorage.getItem("token") },
    });
    setSocket(newSocket);

    newSocket.emit("join", userId);

    return () => newSocket.disconnect();
  }, [userId]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);