import { useEffect } from "react";
import { useSocket } from "../context/SocketContext";
import useRequests from "../zustand/useRequests";

const useListenFriends = () => {
  const { socket } = useSocket();
  const { requests, setRequests } = useRequests();

  useEffect(() => {
    socket?.on("newRequest", ({ requests }) => {
      console.log("new requests:", requests);
      setRequests(requests);
    });

    socket?.on("removeRequest", ({ updatedRequests }) => {
      setRequests(updatedRequests);
    });

    return () => socket?.off("newFriend");
  }, [socket, setRequests, requests]);
};

export default useListenFriends;
