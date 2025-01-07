const SearchInput = () => {
  return (
    <form className="search-form">
      <input type="text" placeholder="Search..." className="search-input" />
      <button type="submit" className="search-button">
        Search
      </button>
    </form>
  );
};

export default SearchInput;
