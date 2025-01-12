import React from "react";
import Conversation from "./Conversation";
import useGetConversations from "../../hooks/useGetConversation";
import useListenFriends from "../../hooks/useListenFriends";

const Conversations = () => {
  const { friends, loading } = useGetConversations();
  useListenFriends();

  // Render loading spinner or message while data is loading
  if (loading) {
    return <div>Loading...</div>; // You can replace this with a spinner or a more styled message
  }

  // Ensure friends is always an array before calling map()
  const friendsArray = Array.isArray(friends) ? friends : [];

  // Render conversations once the data is loaded
  return (
    <div className="convs">
      {friendsArray.map((conversation) => (
        <Conversation key={conversation._id} conversation={conversation} />
      ))}
    </div>
  );
};

export default Conversations;
