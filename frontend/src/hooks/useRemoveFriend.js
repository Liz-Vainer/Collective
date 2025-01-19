import useFriends from "../zustand/useFriends";
import { useSocket } from "../context/SocketContext";
const useRemoveFriend = () => {
  const { friends, setFriends } = useFriends();

  const { socket } = useSocket(); // Get the socket instance
  const removeFriend = async (selectedUserId) => {
    try {
      const res = await fetch(`/friends/remove-friend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selectedUserId }),
      });
      const data = await res.json();
      console.log(data);
      setFriends(data.friends);
      if (socket) {
        socket.emit("removeFriend", data.friends); // Send the updated friend list or a specific message
      }
      alert("Friend removed!");
    } catch (err) {
      console.log("error sending messsage: ", err);
    }
  };
  return { removeFriend };
};

export default useRemoveFriend;
