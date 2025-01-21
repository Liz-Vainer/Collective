import { useState } from "react";

const useJoinEvent = () => {
  const [loading, setLoading] = useState(false); // Add loading state

  const joinEvent = async (eventId, userId) => {
    setLoading(true); // Set loading to true before starting the operation
    try {
      const res = await fetch("/events/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          EventId: eventId,
          userId: userId,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to join event");
      }

      const data = await res.json();
      console.log(data);
      return true;
    } catch (err) {
      console.log("Error joining event: ", err);
    } finally {
      setLoading(false); // Reset loading state after the operation is complete
    }
  };

  return { joinEvent, loading }; // Return the loading state
};

export default useJoinEvent;
