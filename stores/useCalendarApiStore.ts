import { Interview } from "@/features/calendar/models/interview";
import FilteredEventsRequest from "@/features/calendar/models/request/filtered-event.request";
import FilteredEventsResponse from "@/features/calendar/models/response/filtered-event.response";
import ApiClient from "@/lib/api/ApiClient";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { useCalendarStore } from "./useCalendarStore";

interface CalendarApiState {
  events: Interview[];
  loading: boolean;
  error: string | null;
}

interface CalendarApiActions {
  setEvents: (events: Interview[]) => void;
  toggleLoading: (loading?: boolean) => void;
  setError: (error: string | null) => void;
  fetchEvents: () => void;
}

export const DefaultCalendarApiState: CalendarApiState = {
  events: [],
  loading: true,
  error: null,
};

export const useCalendarApiStore = create<
  CalendarApiState & CalendarApiActions
>()(
  immer((set) => ({
    ...DefaultCalendarApiState,
    setEvents: (events) => set((state) => (state.events = events)),
    toggleLoading: (loading) =>
      set((state) => (state.loading = loading ?? !state.loading)),
    setError: (error) => set((state) => (state.error = error)),
    fetchEvents: async () => {
      const { selectedDate } = useCalendarStore.getState();
      const { from, to } =
        selectedDate instanceof Date
          ? { from: selectedDate, to: selectedDate }
          : selectedDate;

      if (!from || !to) return;

      set((state) => {
        state.loading = true;
      });
      try {
        const response = await ApiClient.post<
          FilteredEventsRequest,
          FilteredEventsResponse
        >("/interviews/filteredInterview", {
          from: from?.toISOString(),
          to: to?.toISOString(),
        });
        set((state) => {
          state.events = response.data.interviews;
        });
      } catch {
        set((state) => {
          state.error = "Failed to fetch events";
        });
      } finally {
        set((state) => {
          state.loading = false;
        });
      }
    },
  })),
);
