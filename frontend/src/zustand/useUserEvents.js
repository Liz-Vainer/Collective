import { create } from "zustand";

const useUserEvents = create((set) => ({
  userEvents: [],
  setUserEvents: (userEvents) => set({ userEvents }),
}));

export default useUserEvents;
