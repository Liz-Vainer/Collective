import { useUser } from "../../context/UserContext";

const useSignup = () => {
  const loggedUser = useUser(); // Access the user context

  const signup = async () => {
    try {
      const response = await fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: loggedUser.name,
          email: loggedUser.email,
          password: loggedUser.password,
          userType: loggedUser.userType,
          age: loggedUser.age,
          isReligious: loggedUser.isReligious,
          religion: loggedUser.religion,
          ethnicity: loggedUser.ethnicity,
          interest: loggedUser.interest,
          gender: loggedUser.gender,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("User created!");
        localStorage.setItem("user-info", JSON.stringify(data));
        loggedUser.setUser(data); // Store user information in context
        return true;
      } else {
        alert(data.message || "There was an issue signing up.");
        return false;
      }
    } catch (error) {
      console.error("Error during user creation:", error);
      alert("An error occurred. Please try again.");
      return true;
    }
  };

  return signup; // Return the signup function for use in components
};

export default useSignup;
