const useIsParticipant = () => {
  const isParticipant = async (eventId, userId) => {
    try {
      const res = await fetch(`/events/is-part`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId,
          user: userId,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to delete event");
      }

      const data = await res.json();
      return data.member;
    } catch (err) {
      console.log("Error removing event: ", err);
    }
  };

  return { isParticipant };
};

export default useIsParticipant;
