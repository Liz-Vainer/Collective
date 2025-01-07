import React, { createContext, useContext, useState } from "react";

// Create the UserContext
const UserContext = createContext();

// Create a provider for the context
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // User state to hold user information
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("male");
  const [age, setAge] = useState(null);
  const [ethnicity, setEthnicity] = useState("other");
  const [interest, setInterest] = useState("other");
  const [isReligious, setIsReligious] = useState(false); // Track if user is religious
  const [religion, setReligion] = useState("no"); // Track selected religion
  const [userType, setUserType] = useState("citizen"); //
  const [authUser, setAuthUser] = useState(
    JSON.parse(localStorage.getItem("user-info")) || null
  );

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        name,
        setName,
        password,
        setPassword,
        email,
        setEmail,
        age,
        setAge,
        ethnicity,
        setEthnicity,
        interest,
        setInterest,
        isReligious,
        setIsReligious,
        religion,
        setReligion,
        gender,
        setGender,
        userType,
        setUserType,
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
