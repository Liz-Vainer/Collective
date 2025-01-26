import { useState } from "react";
import useUserEvents from "../zustand/useUserEvents";

const useLeaveEvent = () => {
  const [loading, setLoading] = useState(false); // Add loading state
  const { setUserEvents } = useUserEvents();

  const leaveEvent = async (eventId, userId) => {
    setLoading(true); // Set loading to true before starting the operation
    try {
      console.log(userId);
      const res = await fetch("/events/leave", {
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
        throw new Error("Failed to leave event");
      }

      const data = await res.json();
      console.log(data);
      setUserEvents(data.userEvents);
      return false;
    } catch (err) {
      console.log("Error leaving event: ", err);
    } finally {
      setLoading(false); // Reset loading state after the operation is complete
    }
  };

  return { leaveEvent, loading }; // Return the loading state
};

export default useLeaveEvent;
