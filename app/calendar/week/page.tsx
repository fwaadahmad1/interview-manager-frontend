"use client";
import Day from "@/features/calendar/day/day";
import { addPeriodToDate, formatDate } from "@/lib/dateTimeUtils";
import { useCalendarStore } from "@/stores/useCalendarStore";
import { format } from "date-fns";

export default function CalendarDay() {
  const { selectedDate } = useCalendarStore();

  if (selectedDate instanceof Date || !selectedDate?.from) {
    return null;
  }
  return (
    <div className="grid grid-cols-[1fr_4fr_4fr_4fr_4fr_4fr_4fr_4fr] overflow-hidden">
      <div className="mt-6 flex flex-col">
        {Array.from({ length: 24 }).map((_, index) => (
          <div
            key={index}
            className="relative flex h-[3.35rem] items-center justify-center border-b border-gray-300"
          >
            {format(new Date().setHours(index, 0, 0, 0), "h a")}
            <div className="absolute left-0 bottom-0 w-screen bg-muted h-[2px]"></div>
          </div>
        ))}
      </div>
      {Array(7)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="flex flex-col">
            <div className="text-center">
              {formatDate(
                addPeriodToDate(selectedDate.from, i, "day"),
                "MMM DD",
              )}
            </div>
            <Day
              dayDate={addPeriodToDate(selectedDate.from, i, "day")}
              showTime={false}
            />
          </div>
        ))}
    </div>
  );
}
