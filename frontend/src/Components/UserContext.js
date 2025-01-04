import React, { createContext, useContext, useState } from "react";

// Create the UserContext
const UserContext = createContext();

// Create a provider for the context
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // User state to hold user information
  console.log(user);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to access the context
export const useUser = () => {
  return useContext(UserContext);
};
