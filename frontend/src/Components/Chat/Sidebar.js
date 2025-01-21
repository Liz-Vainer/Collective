import { useState } from "react";
import Conversations from "./Conversations";
import SearchInput from "./SearchInput";
import Popup from "../Popup/Popup";
import Friends from "./Friends";
import Requests from "./Requests";

const Sidebar = () => {
  const [friednsButton, setFriednsButton] = useState(false);
  const [request, setRequest] = useState(false);

  const toggleFriends = () => {
    setFriednsButton(!friednsButton);
  };
  const toggleRequest = () => {
    setRequest(!request);
  };

  return (
    <div className="sidebar">
      <SearchInput />
      <Conversations />
      <button onClick={toggleFriends}>Add friends</button>
      <button onClick={toggleRequest}>Requests</button>

      {/* Pass draggable prop for independent behavior */}
      <Popup
        trigger={friednsButton}
        setTrigger={toggleFriends}
        draggable={true} // Make this popup draggable
        position="bottom-right"
      >
        <div className="users">
          <Friends />
        </div>
      </Popup>

      <Popup
        trigger={request}
        setTrigger={toggleRequest}
        draggable={false} // Don't make this popup draggable
        position="bottom-right"
      >
        <div className="users">
          <Requests />
        </div>
      </Popup>
    </div>
  );
};

export default Sidebar;
