import { useState } from "react";
import useConversation from "../../zustand/useConversation";
import useGetConversation from "../../hooks/useGetConversation";
const SearchInput = () => {
  const [search, setSearch] = useState("");
  const { setSelectedConversation } = useConversation();
  const { friends } = useGetConversation();

  const handelSubmit = (e) => {
    e.preventDefault();
    if (!search) return;
    if (search.length < 3) {
      setSearch("");
      return alert("Search term must be at least 3 characters long");
    }

    console.log("friends:", friends);
    const conversation = friends.find((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );

    if (conversation) {
      setSelectedConversation(conversation);
      setSearch("");
    } else {
      alert("No such user exists!");
    }
  };
  return (
    <form onSubmit={handelSubmit} className="search-form">
      <input
        type="text"
        placeholder="Search..."
        className="search-input"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button type="submit" className="search-button">
        Search
      </button>
    </form>
  );
};

export default SearchInput;
