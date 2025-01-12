import { useEffect } from "react";
import { useSocket } from "../context/SocketContext";
import useFriends from "../zustand/useFriends";

const useListenFriends = () => {
  const { socket } = useSocket();
  const { friends, setFriends } = useFriends();

  useEffect(() => {
    socket?.on("newFriend", (newFriend) => {
      setFriends([...friends, newFriend]);
    });

    return () => socket?.off("newFriend");
  }, [socket, setFriends, friends]);
};

export default useListenFriends;
