"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import * as React from "react";
import { DateRange, DayPicker } from "react-day-picker";

import { buttonVariants } from "@/components/ui/button";
import {
  getEndOfPeriod,
  getStartOfPeriod,
  isDateInRange,
} from "@/lib/dateTimeUtils";
import { cn } from "@/lib/utils";
import { useCalendarStore } from "@/stores/useCalendarStore";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  selectedDate: Date | DateRange;
  onDateChange?: (date: Date | DateRange) => void;
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  selectedDate,
  ...props
}: CalendarProps) {
  const { setView } = useCalendarStore();
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      // month={selectedDate instanceof Date ? selectedDate : selectedDate.from}
      modifiers={{
        selected: selectedDate,
        ...(selectedDate && "from" in selectedDate
          ? {
              range_start: selectedDate?.from,
              range_end: selectedDate?.to,
              range_middle: (date: Date) =>
                selectedDate
                  ? isDateInRange(date, selectedDate, { excludeEnds: true })
                  : false,
            }
          : {}),
      }}
      onDayClick={(day) => {
        setView("day");
        props.onDateChange?.({
          from: getStartOfPeriod(day, "day"),
          to: getEndOfPeriod(day, "day"),
        });
      }}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center text-white",
        caption_label: "text-sm font-medium text-white",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 rounded-full ",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-primary/20 [&:has([aria-selected].day-outside)]:text-red-500 [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md",
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 p-0 font-normal aria-selected:opacity-100",
        ),
        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        // day_today: "text-blue-500",
        day_outside: "day-outside opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-transparent aria-selected:text-white",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({}) => <ChevronLeftIcon className="h-4 w-4" />,
        IconRight: ({}) => <ChevronRightIcon className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };

