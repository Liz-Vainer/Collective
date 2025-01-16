import { useState } from "react";

const useCreateEvent = () => {
  const [event, setEvent] = useState();

  const createEvent = async (newEvent) => {
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
      return event;
    } catch (err) {
      console.log("error sending messsage: ", err);
    }
  };
  return { createEvent };
};

export default useCreateEvent;
