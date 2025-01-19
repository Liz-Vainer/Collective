import { useState } from "react";

const useLeaveEvent = () => {
  const [loading, setLoading] = useState(false); // Add loading state

  const leaveEvent = async (eventId, userId) => {
    setLoading(true); // Set loading to true before starting the operation
    try {
      const res = await fetch("/events/leave", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          EventId: eventId,
          user: userId,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to join event");
      }

      const data = await res.json();
      console.log(data);
      return false;
    } catch (err) {
      console.log("Error joining event: ", err);
    } finally {
      setLoading(false); // Reset loading state after the operation is complete
    }
  };

  return { leaveEvent, loading }; // Return the loading state
};

export default useLeaveEvent;
