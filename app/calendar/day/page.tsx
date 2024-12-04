"use client";
import Day from "@/features/calendar/day/day";
import { useCalendarStore } from "@/stores/useCalendarStore";

export default function CalendarDay() {
  const { selectedDate } = useCalendarStore();
  return (
    <Day
      dayDate={selectedDate instanceof Date ? selectedDate : selectedDate?.from}
    />
  );
}
