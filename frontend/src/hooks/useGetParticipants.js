import { useState } from "react";
const useGetParticipants = () => {
  const [loading1, setLoading] = useState(false); // Add loading state
  const getParticipants = async (eventId) => {
    setLoading(true); // Set loading to true before starting the operation
    try {
      const res = await fetch("/events/parts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: eventId,
        }),
      });
      const data = await res.json();
      if (!data) {
        throw new Error(data.error);
      }
      console.log("all participants:", data.participants);
      return data.participants;
    } catch (err) {
      console.error("Error fetching events:", err);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return { getParticipants, loading1 };
};

export default useGetParticipants;
