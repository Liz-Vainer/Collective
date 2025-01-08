import Conversation from "./Conversation";
import useGetConversations from "../../hooks/useGetConversation";
const Conversations = () => {
  const { conversations } = useGetConversations();
  console.log(conversations);
  return (
    <div className="convs">
      {conversations.map((conversation) => (
        <Conversation key={conversation._id} conversation={conversation} />
      ))}
    </div>
  );
};

export default Conversations;
