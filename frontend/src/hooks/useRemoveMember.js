import { useState } from "react";
import useMembers from "../zustand/useMembers";

const useRemoveMember = () => {
  const { setMembers } = useMembers();
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const removeMember = async (communityId, selectedUserId) => {
    setIsLoading(true); // Set loading to true at the start
    try {
      const res = await fetch("/remove-member", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ communityId, selectedUserId }),
      });

      const data = await res.json();
      console.log("members after removal:", data.members);
      setMembers(data.members);

      alert("Member removed!");
    } catch (err) {
      console.log("Error removing a member: ", err);
    } finally {
      setIsLoading(false); // Ensure loading is reset regardless of success or failure
    }
  };

  return { removeMember, isLoading }; // Expose `isLoading` for UI feedback
};

export default useRemoveMember;
