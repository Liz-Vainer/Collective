import { useUser } from "../../context/UserContext";

const useLogin = () => {
  const loggedUser = useUser();

  const login = async () => {
    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: loggedUser.name,
          password: loggedUser.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        loggedUser.setUser(data); // Store user info in the context
        loggedUser.setAge(data.age);
        loggedUser.setGender(data.gender);
        loggedUser.setIsReligious(data.isReligious);
        loggedUser.setReligion(data.religion); // Fixed typo: `religioun` -> `religion`
        loggedUser.setInterest(data.interest);
        loggedUser.setEthnicity(data.ethnicity);
        alert("Login successful");
        localStorage.setItem("user-info", JSON.stringify(data));
        return true;
      } else {
        alert(data.message || "Invalid credentials. Please try again.");
        return false;
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred. Please try again.");
      return false;
    }
  };

  return login; // Return the login function
};

export default useLogin;
