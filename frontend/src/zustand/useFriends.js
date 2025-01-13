import { create } from "zustand";

const useFriends = create((set) => ({
  friends: [],
  setFriends: (friends) => set({ friends }),
}));

export default useFriends;
