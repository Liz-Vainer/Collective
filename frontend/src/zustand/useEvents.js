import { create } from "zustand";

const useEvents = create((set) => ({
  events: [],
  setEvents: (events) => set({ events }),
}));

export default useEvents;
