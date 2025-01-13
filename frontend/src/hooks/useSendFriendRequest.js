const useSendFriendRequest = () => {
  const sendRequest = async (recipientId) => {
    try {
      const res = await fetch(`/friends/send-req`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recipientId }),
      });
      const data = await res.json();
      console.log(data);
      alert("Friend request sent!");
    } catch (err) {
      console.log("error sending messsage: ", err);
    }
  };
  return { sendRequest };
};

export default useSendFriendRequest;
