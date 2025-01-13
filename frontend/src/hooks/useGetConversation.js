import { useState, useEffect } from "react";
import useFriends from "../zustand/useFriends";

const useGetConversation = () => {
  const { friends, setFriends } = useFriends();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only fetch friends if they are not already populated
    const getConversations = async () => {
      setLoading(true);
      try {
        const res = await fetch("/friends");
        const data = await res.json();
        if (!data) {
          throw new Error(data.error);
        }
        console.log("friends:", data);
        setFriends(data); // Set friends only if they aren't already set
      } catch (err) {
        console.error("Error fetching conversations:", err);
        alert("An error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    // Fetch friends only when they are empty (initial load) or need an update
    if (!friends.length) {
      getConversations();
    } else {
      setLoading(false); // If friends already exist, skip the fetch
    }

    // Optional: Adding a cleanup function to avoid memory leaks
    return () => setLoading(false);
  }, [friends.length, setFriends]);

  return { friends, loading };
};

export default useGetConversation;
