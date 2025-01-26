import { useEffect } from "react";
import useUserEvents from "../zustand/useUserEvents";
const useGetEvents = (userId) => {
  const { setUserEvents } = useUserEvents();

  useEffect(() => {
    const getEvents = async () => {
      try {
        const res = await fetch("/events/user-events", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
          }),
        });
        const data = await res.json();
        if (!data) {
          throw new Error(data.error);
        }
        console.log("joined events: ", data.events);
        setUserEvents(data.events);
      } catch (err) {
        console.error("Error fetching events:", err);
        alert("An error occurred. Please try again.");
      }
    };
    getEvents();
  }, [setUserEvents]);
};

export default useGetEvents;
