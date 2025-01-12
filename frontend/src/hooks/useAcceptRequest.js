import useFriends from "../zustand/useFriends";

const useAcceptRequest = () => {
  const { friends, setFriends } = useFriends();
  const acceptRequest = async (requesterId) => {
    try {
      const res = await fetch(`/friends/accept-req`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requesterId }),
      });
      const data = await res.json();
      console.log(data);
      setFriends([...friends, data]);
    } catch (err) {
      console.log("error sending messsage: ", err);
    }
  };
  return { acceptRequest };
};

export default useAcceptRequest;
