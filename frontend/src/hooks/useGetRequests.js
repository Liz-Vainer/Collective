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
        console.log("fetching reqs");
        setRequests(data);
      } catch (err) {
        console.error("Error fetching conversations:", err);
        alert("An error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    if (!requests.length) {
      getRequests();
    } else {
      setLoading(false); // If friends already exist, skip the fetch
    }
  }, [requests.length, setRequests]);
  return { requests, loading };
};

export default useGetRequests;
