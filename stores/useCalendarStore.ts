import {
  addPeriodToDate,
  getEndOfPeriod,
  getStartOfPeriod,
  getWeekDateRange,
  TimeUnit,
} from "@/lib/dateTimeUtils";
import { DateRange } from "react-day-picker";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface CalendarState {
  view: TimeUnit;
  selectedDate: Date | DateRange;
}

interface CalendarActions {
  today: () => void;
  onDateChange: (date: Date | DateRange) => void;
  setView: (view: TimeUnit) => void;
  nextView: () => void;
  previousView: () => void;
}
export const DefaultCalendatState: CalendarState = {
  view: "month",
  selectedDate: {
    from: getStartOfPeriod(new Date(), "month"),
    to: getEndOfPeriod(new Date(), "month"),
  },
};

export const useCalendarStore = create<CalendarState & CalendarActions>()(
  immer((set) => ({
    ...DefaultCalendatState,
    today: () =>
      set((state) => {
        if (state.view === "day") {
          state.selectedDate = {
            from: getStartOfPeriod(new Date(), "day"),
            to: getEndOfPeriod(new Date(), "day"),
          };
          return;
        }
        state.selectedDate = {
          from: getStartOfPeriod(new Date(), state.view),
          to: getEndOfPeriod(new Date(), state.view),
        };
      }),
    onDateChange: (date) =>
      set((state) => {
        if (state.view === "week") {
          state.selectedDate = getWeekDateRange(
            date instanceof Date ? date : date.from,
          );
          return;
        }
        state.selectedDate = date;
      }),
    setView: (view) =>
      set((state) => {
        state.view = view;
        state.selectedDate = {
          from: getStartOfPeriod(new Date(), view),
          to: getEndOfPeriod(new Date(), view),
        };
      }),
    nextView: () =>
      set((state) => {
        if (state.selectedDate instanceof Date) {
          // Handle Date type
          state.selectedDate = addPeriodToDate(
            state.selectedDate,
            1,
            state.view,
          );
        } else {
          // Handle DateRange type
          state.selectedDate = {
            from: addPeriodToDate(state.selectedDate.from, 1, state.view),
            to: addPeriodToDate(state.selectedDate.to, 1, state.view),
          };
        }
      }),
    previousView: () =>
      set((state) => {
        if (state.selectedDate instanceof Date) {
          // Handle Date type
          state.selectedDate = addPeriodToDate(
            state.selectedDate,
            -1,
            state.view,
          );
        } else {
          // Handle DateRange type
          state.selectedDate = {
            from: addPeriodToDate(state.selectedDate.from, -1, state.view),
            to: addPeriodToDate(state.selectedDate.to, -1, state.view),
          };
        }
      }),
  })),
);
