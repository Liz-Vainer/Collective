import React, { createContext, useContext, useState } from "react";

// Create the UserContext
const UserContext = createContext();

// Create a provider for the context
export const UserProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(
    JSON.parse(localStorage.getItem("user-info")) || null
  );

  return (
    <UserContext.Provider
      value={{
        authUser,
        setAuthUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to access the context
export const useUser = () => {
  return useContext(UserContext);
};
