import useFriends from "../zustand/useFriends";
const useRemoveFriend = () => {
  const { friends, setFriends } = useFriends();
  const removeFriend = async (selectedUserId) => {
    try {
      const res = await fetch(`/friends/remove-friend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selectedUserId }),
      });
      const data = await res.json();
      console.log(data);
      setFriends(friends.filter((friend) => friend.id !== selectedUserId));
    } catch (err) {
      console.log("error sending messsage: ", err);
    }
  };
  return { removeFriend };
};

export default useRemoveFriend;
