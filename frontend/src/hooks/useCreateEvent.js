import { useState } from "react";

const useCreateEvent = () => {
  const [event, setEvent] = useState();
  const [loading, setLoading] = useState(false); // State to track loading status

  const createEvent = async (newEvent) => {
    setLoading(true); // Set loading to true when the request starts
    try {
      const res = await fetch(`/events/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventName: newEvent.name,
          location: newEvent.community,
          eventImg: newEvent.image,
          start: newEvent.startDate,
          end: newEvent.endDate,
        }),
      });
      const data = await res.json();
      setEvent(data);
      setLoading(false); // Set loading to false once the request completes
      return data; // Return the created event data
    } catch (err) {
      console.log("error sending message: ", err);
      setLoading(false); // Set loading to false if an error occurs
    }
  };

  return { createEvent, loading }; // Return loading status along with createEvent function
};

export default useCreateEvent;
