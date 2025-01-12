import { useEffect } from "react";
import useRequests from "../zustand/useRequests";
const useGetRequests = () => {
  const { requests, setRequests } = useRequests();

  useEffect(() => {
    const getRequests = async () => {
      try {
        const res = await fetch("/friends/requests");
        const data = await res.json();
        if (!data) {
          throw new Error(data.error);
        }
        setRequests(data);
      } catch (err) {
        console.error("Error fetching conversations:", err);
        alert("An error occurred. Please try again.");
      }
    };
    getRequests();
  }, [setRequests]);
  return { requests };
};

export default useGetRequests;
