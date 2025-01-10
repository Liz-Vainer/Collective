import useConversation from "../zustand/useConversation";
import { useEffect, useState } from "react";

const useGetMessages = () => {
  const { messages, setMessages, selectedConversation } = useConversation();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getMessages = async (message) => {
      try {
        const res = await fetch(`/messages/${selectedConversation._id}`);
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.log("error getting messsage: ", err);
      } finally {
        setLoading(false);
      }
    };
    if (selectedConversation?._id) getMessages();
  }, [selectedConversation?._id, setMessages, setLoading]);
  return { messages, loading };
};

export default useGetMessages;
