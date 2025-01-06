import Conversations from "./Conversations";
import SearchInput from "./SearchInput";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <SearchInput />
      <break></break>
      <Conversations />
    </div>
  );
};

export default Sidebar;
