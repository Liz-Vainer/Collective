import { useEffect } from "react";
import { useSocket } from "../context/SocketContext";
import useFriends from "../zustand/useFriends";

const useListenFriends = () => {
  const { socket } = useSocket();
  const { friends, setFriends } = useFriends();

  useEffect(() => {
    if (socket) {
      // Listen for new friends being added
      socket.on("newFriend", (updatedFriends) => {
        setFriends(updatedFriends);
      });

      // Listen for friend removal
      socket.on("removeFriend", (removeFriend) => {
        setFriends((prevFriends) =>
          prevFriends.filter((friend) => friend.id !== removeFriend._id)
        );
      });

      // Cleanup on unmount
      return () => {
        socket.off("newFriend");
        socket.off("removeFriend");
      };
    }
  }, [socket, setFriends]);
};

export default useListenFriends;
