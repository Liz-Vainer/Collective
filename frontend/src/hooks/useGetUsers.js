import { useState, useEffect } from "react";
const useGetUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await fetch("/side-bar");
        const data = await res.json();
        if (!data) {
          throw new Error(data.error);
        }
        console.log("all users:", data);
        setUsers(data);
      } catch (err) {
        console.error("Error fetching conversations:", err);
        alert("An error occurred. Please try again.");
      }
    };
    getUsers();
  }, []);
  return { users };
};

export default useGetUsers;
