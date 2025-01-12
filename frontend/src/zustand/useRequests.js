import { create } from "zustand";

const useRequests = create((set) => ({
  requests: [],
  setRequests: (requests) => set({ requests }),
}));

export default useRequests;
