import { useState, useEffect } from "react";
import { useSocket } from "../context/SocketContext";

const useGetConversation = () => {
  const { friends } = useSocket();
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await fetch("/friends");
        const data = await res.json();
        if (!data) {
          throw new Error(data.error);
        }
        console.log("friends:", data);
        setConversations(data);
      } catch (err) {
        console.error("Error fetching conversations:", err);
        alert("An error occurred. Please try again.");
      }
    };
    getConversations();
  }, [friends]);
  return { conversations };
};

export default useGetConversation;
