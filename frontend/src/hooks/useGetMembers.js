import { useState, useEffect } from "react";
import useMembers from "../zustand/useMembers";

const useGetMembers = (selectedCommunityId) => {
  const { members, setMembers } = useMembers();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only fetch friends if they are not already populated
    const getMembers = async () => {
      setLoading(true);
      try {
        const res = await fetch("/find-users-by-community", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            communityId: selectedCommunityId,
          }),
          credentials: "include",
        });
        const data = await res.json();
        if (!data) {
          throw new Error(data.error);
        }
        console.log("members:", data.users);
        setMembers(data.users); // Set friends only if they aren't already set
      } catch (err) {
        console.error("Error fetching conversations:", err);
        alert("An error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    getMembers();

    // Optional: Adding a cleanup function to avoid memory leaks
    return () => setLoading(false);
  }, [setMembers]);

  return { members, loading };
};

export default useGetMembers;
