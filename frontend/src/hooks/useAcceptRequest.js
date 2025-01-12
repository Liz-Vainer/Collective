import { useSocket } from "../context/SocketContext";
import useFriends from "../zustand/useFriends";
import useRequests from "../zustand/useRequests";

const useAcceptRequest = () => {
  const { friends, setFriends } = useFriends();
  const { setRequests } = useRequests();

  const { socket } = useSocket(); // Get the socket instance

  const acceptRequest = async (requesterId) => {
    try {
      const res = await fetch(`/friends/accept-req`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requesterId }),
      });

      const data = await res.json();
      console.log(data);

      // Add the new friend
      setFriends(data.friends); // where data is a new user object
      setRequests(data.requestes);
      // Notify the other user via socket
      if (socket) {
        socket.emit("newFriend", data.friends); // Send the updated friend list or a specific message
      }

      alert("Friend request accepted!");
    } catch (err) {
      console.error("Error accepting request: ", err);
    }
  };

  return { acceptRequest };
};

export default useAcceptRequest;
