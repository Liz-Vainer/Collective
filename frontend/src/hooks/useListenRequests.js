import { useEffect } from "react";
import { useSocket } from "../context/SocketContext";
import useRequests from "../zustand/useRequests";

const useListenFriends = () => {
  const { socket } = useSocket();
  const { requests, setRequests } = useRequests();

  useEffect(() => {
    socket?.on("newRequest", (newRequest) => {
      setRequests([...requests, newRequest]);
    });

    return () => socket?.off("newFriend");
  }, [socket, setRequests, requests]);
};

export default useListenFriends;
