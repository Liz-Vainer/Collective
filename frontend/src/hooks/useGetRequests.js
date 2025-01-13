import { useEffect, useState } from "react";
import useRequests from "../zustand/useRequests";
const useGetRequests = () => {
  const { requests, setRequests } = useRequests();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRequests = async () => {
      setLoading(true);
      try {
        const res = await fetch("/friends/requests");
        const data = await res.json();
        if (!data) {
          throw new Error(data.error);
        }
        setRequests(data);
        console.log("fetching reqs", requests);
      } catch (err) {
        console.error("Error fetching conversations:", err);
        alert("An error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    getRequests();
  }, [setRequests]);
  return { requests, loading };
};

export default useGetRequests;
