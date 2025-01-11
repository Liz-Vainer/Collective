import { useContext, createContext, useEffect, useState } from "react";
import { useUser } from "./UserContext";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const { authUser } = useUser();

  useEffect(() => {
    if (authUser) {
      const socket = io("http://localhost:3000", {
        query: {
          userId: authUser.id,
        },
      });
      setSocket(socket);

      socket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      // Listen for updated friends list
      socket.on("updatedFriends", (updatedFriends) => {
        setFriends(updatedFriends); // Update the friends list in real-time
      });

      socket.on("getFriends", (initialFriends) => {
        setFriends(initialFriends); // Initial friends list when the user connects
      });

      return () => socket.close();
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [authUser]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers, friends }}>
      {children}
    </SocketContext.Provider>
  );
};
