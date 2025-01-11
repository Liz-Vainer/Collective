const useRejectRequest = () => {
  const rejectRequest = async (requesterId) => {
    try {
      const res = await fetch(`/friends/reject-req`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requesterId }),
      });
      const data = await res.json();
      console.log(data);
    } catch (err) {
      console.log("error sending messsage: ", err);
    }
  };
  return { rejectRequest };
};

export default useRejectRequest;
