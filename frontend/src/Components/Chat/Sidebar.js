import Conversations from "./Conversations";
import SearchInput from "./SearchInput";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <SearchInput />
      <Conversations />
    </div>
  );
};

export default Sidebar;
