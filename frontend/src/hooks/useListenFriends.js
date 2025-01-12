import { useEffect } from "react";
import { useSocket } from "../context/SocketContext";
import useFriends from "../zustand/useFriends";

const useListenFriends = () => {
  const { socket } = useSocket(); // Access the socket instance from context
  const { setFriends } = useFriends(); // Access the Zustand store's state and updater

  useEffect(() => {
    if (!socket) {
      console.warn("Socket not initialized"); // Log a warning if socket is null or undefined
      return;
    }

    // Handler for new friend events
    const handleNewFriend = (newFriend) => {
      setFriends((prevFriends) => [...prevFriends, newFriend]);
    };

    // Handler for removed friend events
    const handleRemovedFriend = (removedFriendId) => {
      setFriends((prevFriends) =>
        prevFriends.filter((friend) => friend.id !== removedFriendId)
      );
    };

    // Attach listeners for the events
    socket.on("newFriend", handleNewFriend);
    socket.on("removedFriend", handleRemovedFriend);

    // Cleanup function to remove listeners on unmount
    return () => {
      socket.off("newFriend", handleNewFriend);
      socket.off("removedFriend", handleRemovedFriend);
    };
  }, [socket, setFriends]); // Dependencies: socket and setFriends
};

export default useListenFriends;
