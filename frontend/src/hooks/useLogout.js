import { useState } from "react";
import { useUser } from "../context/UserContext";
const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useUser();

  const logout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/logut", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (data.error) throw new Error(data.error);

      localStorage.removeItem("user-info");
      setAuthUser(null);
    } catch (err) {
      console.error("Error during logout:", err);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return { loading, logout };
};

export default useLogout;
