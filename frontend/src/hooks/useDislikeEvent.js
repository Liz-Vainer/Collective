const useDislikeEvent = () => {
  const dislikeEvent = async (eventId) => {
    try {
      const res = await fetch("/events/dislike", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: eventId,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to dislike event");
      }

      const data = await res.json();
      console.log("likes: ", data);
      return data.dislikes;
    } catch (err) {
      console.log("Error disliking event: ", err);
    }
  };

  return { dislikeEvent }; // Return the loading state
};

export default useDislikeEvent;
