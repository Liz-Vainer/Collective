import { useUser } from "../../context/UserContext";

const useLogin = () => {
  const { authUser, setAuthUser } = useUser();

  const login = async (name, password) => {
    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data);
        setAuthUser(data);
        console.log(authUser);
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
