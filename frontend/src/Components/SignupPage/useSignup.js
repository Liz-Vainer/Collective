import { useUser } from "../../context/UserContext";

const useSignup = () => {
  const { setAuthUser } = useUser();

  const signup = async (
    name,
    email,
    password,
    userType,
    age,
    isReligious,
    religion,
    ethnicity,
    interest,
    gender
  ) => {
    try {
      const response = await fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          userType,
          age,
          isReligious,
          religion,
          ethnicity,
          interest,
          gender,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("User created!");
        localStorage.setItem("user-info", JSON.stringify(data));
        setAuthUser(data); // Store user information in context
        return true;
      } else {
        alert(data.message || "There was an issue signing up.");
        return false;
      }
    } catch (error) {
      console.error("Error during user creation:", error);
      alert("An error occurred. Please try again.");
      return false;
    }
  };

  return signup; // Return the signup function for use in components
};

export default useSignup;
