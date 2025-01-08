import useConversation from "../zustand/useConversation";
import { useEffect } from "react";
const useGetMessages = () => {
  const { messages, setMessages, selectedConversation } = useConversation();
  useEffect(() => {
    const getMessages = async (message) => {
      try {
        const res = await fetch(`/messages/${selectedConversation._id}`);
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.log("error getting messsage: ", err);
      }
    };
    if (selectedConversation?._id) getMessages();
  }, [selectedConversation?._id, setMessages]);
  return { messages };
};

export default useGetMessages;
