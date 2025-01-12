import { useEffect } from "react";
import { useSocket } from "../context/SocketContext";
import useFriends from "../zustand/useFriends";

const useListenFriends = () => {
  const { socket } = useSocket();
  const { setFriends } = useFriends();

  useEffect(() => {
    // Handler for new friend events
    const handleNewFriend = (newFriend) => {
      setFriends((prevFriends) => [...prevFriends, newFriend]);
    };

    // Add event listener for "newFriend"
    socket?.on("newFriend", handleNewFriend);

    // Cleanup function to remove the listener
    return () => socket?.off("newFriend", handleNewFriend);
  }, [socket, setFriends]);
};

export default useListenFriends;
