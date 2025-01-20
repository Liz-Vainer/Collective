const useLikeEvent = () => {
  const likeEvent = async (eventId) => {
    try {
      const res = await fetch("/events/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: eventId,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to like event");
      }

      const data = await res.json();
      console.log("likes: ", data);
      return data.likes;
    } catch (err) {
      console.log("Error liking event: ", err);
    }
  };

  return { likeEvent }; // Return the loading state
};

export default useLikeEvent;
