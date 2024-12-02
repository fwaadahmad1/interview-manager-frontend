"use client";
import { buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useCalendarStore } from "@/stores/useCalendarStore";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React from "react";

export default function DatePicker() {
  const { selectedDate, onDateChange } = useCalendarStore();
  return (
    <Calendar
      mode="range"
      selectedDate={selectedDate}
      onDateChange={onDateChange}
      className="[&_[role=gridcell]]:text-sidebar-primary-foreground 
        [&_[role=gridcell]]:w-[33px] 
       "
       classNames={{caption_label: "text-sm font-medium text-sidebar-primary-foreground ", head_cell:
          "text-sidebar-primary-foreground rounded-md w-8 font-normal text-[0.8rem]",nav_button: cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100",
          ),}}
          components={{
            IconLeft: ({}) => <ChevronLeftIcon className="h-4 w-4" color="white"/>,
            IconRight: ({}) => <ChevronRightIcon className="h-4 w-4" color="white"/>,
          }}
    />
  );
}
