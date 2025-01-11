import { useState, useEffect } from "react";
const useGetRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const getRequests = async () => {
      try {
        const res = await fetch("/friends/requests");
        const data = await res.json();
        if (!data) {
          throw new Error(data.error);
        }
        console.log("all users:", data);
        setRequests(data);
      } catch (err) {
        console.error("Error fetching conversations:", err);
        alert("An error occurred. Please try again.");
      }
    };
    getRequests();
  }, []);
  return { requests };
};

export default useGetRequests;
