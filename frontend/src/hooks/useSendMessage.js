import useConversation from "../zustand/useConversation";
const useSendMessage = () => {
  const { messages, setMessages, selectedConversation } = useConversation();

  const sendMessage = async (message) => {
    try {
      console.log(message);
      const res = await fetch(`/messages/send/${selectedConversation._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      setMessages([...messages, data]);
    } catch (err) {
      console.log("error sending messsage: ", err);
    }
  };
  return { sendMessage };
};

export default useSendMessage;
