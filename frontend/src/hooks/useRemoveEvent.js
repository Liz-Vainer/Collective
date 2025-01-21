import { useState } from "react";
import useEvents from "../zustand/useEvents";

const useRemoveEvent = () => {
  const { events, setEvents } = useEvents();
  const [loading, setLoading] = useState(false); // Add loading state

  const removeEvent = async (event_name) => {
    setLoading(true); // Set loading to true before starting the operation
    try {
      const res = await fetch(`/events/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: event_name,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to delete event");
      }

      const data = await res.json();
      setEvents(data.events);
    } catch (err) {
      console.log("Error removing event: ", err);
    } finally {
      setLoading(false); // Reset loading state after the operation is complete
    }
  };

  return { removeEvent, loading }; // Return the loading state
};

export default useRemoveEvent;
