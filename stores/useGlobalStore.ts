import { Interviewer } from "@/features/calendar/models/interviewer";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type GlobalStore = {
  currentUser: Interviewer | null;
  token: string | null;
  setCurrentUser: (user: Interviewer) => void;
  clearCurrentUser: () => void;
  setToken: (token: string) => void;
  clearToken: () => void;
};

const useGlobalStore = create<GlobalStore>()(
  persist(
    (set) => ({
      currentUser: null,
      token: null,
      setCurrentUser: (user) => set({ currentUser: user }),
      clearCurrentUser: () => set({ currentUser: null }),
      setToken: (token) => set({ token }),
      clearToken: () => set({ token: null }),
    }),
    {
      name: "global-store", // unique name
      storage: createJSONStorage(() => localStorage), // use localStorage
    },
  ),
);

export default useGlobalStore;
