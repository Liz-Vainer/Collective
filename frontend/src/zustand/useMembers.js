import { create } from "zustand";

const useMembers = create((set) => ({
  members: [],
  setMembers: (members) => set({ members }),
}));

export default useMembers;
