import { useState } from "react";
import useMembers from "../zustand/useMembers";

const useRemoveMember = () => {
  const { members, setMembers } = useMembers();
  const [isLoading, setIsLoading] = useState(false);

  const removeMember = async (communityId, selectedUserId) => {
    setIsLoading(true);
    try {
      const res = await fetch("/remove-member", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ communityId, selectedUserId }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to remove member");
      }

      const updatedMembers = members.filter(
        (member) => member.id !== selectedUserId
      );
      setMembers(updatedMembers); // Update global state
      alert("Member removed!");
    } catch (err) {
      console.error("Error removing a member:", err);
      alert("Failed to remove member. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return { removeMember, isLoading };
};

export default useRemoveMember;
