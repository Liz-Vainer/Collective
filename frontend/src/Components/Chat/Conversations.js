import Conversation from "./Conversation";
import useGetConversations from "../../hooks/useGetConversation";
import useListenFriends from "../../hooks/useListenFriends";
const Conversations = () => {
  const { friends } = useGetConversations();
  useListenFriends();
  console.log(friends);
  return (
    <div className="convs">
      {friends.map((conversation) => (
        <Conversation key={conversation._id} conversation={conversation} />
      ))}
    </div>
  );
};

export default Conversations;
