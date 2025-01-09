import "./Conversation.css";
import useConversation from "../../zustand/useConversation";
const Conversation = ({ conversation }) => {
  const { selectedConversation, setSelectedConversation } = useConversation();

  const isSelected = selectedConversation?._id === conversation._id;

  return (
    <>
      <div
        className={`conversation ${isSelected ? "bg-conv" : ""}`}
        onClick={() => setSelectedConversation(conversation)}
      >
        <div className="logged-in"></div>
        <div>
          <div>
            <p>{conversation.name}</p>
            <span>Icon</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Conversation;
