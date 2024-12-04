import { Interviewer } from "@/features/calendar/models/interviewer";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type GlobalStore = {
  currentUser: Interviewer | null;
  setCurrentUser: (user: Interviewer) => void;
  token: string | null;
  setToken: (token: string) => void;
  logout: () => void;
};

const useGlobalStore = create<GlobalStore>()(
  persist(
    (set) => ({
      currentUser: null,
      setCurrentUser: (user) => set({ currentUser: user }),
      token: null,
      setToken: (token) => set({ token }),
      logout: () => set({ currentUser: null, token: null }),
    }),
    {
      name: "global-store", // unique name
      storage: createJSONStorage(() => localStorage), // use localStorage
    },
  ),
);

export default useGlobalStore;
