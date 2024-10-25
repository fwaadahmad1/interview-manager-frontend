"use client";
import { Calendar } from "@/components/ui/calendar";
import { useCalendarStore } from "@/stores/useCalendarStore";
import React from "react";

export default function DatePicker() {
  const { selectedDate, onDateChange } = useCalendarStore();
  return (
    <Calendar
      mode="range"
      selectedDate={selectedDate}
      onDateChange={onDateChange}
      className="[&_[role=gridcell].bg-accent]:bg-sidebar-primary [&_[role=gridcell].bg-accent]:text-sidebar-primary-foreground [&_[role=gridcell]]:w-[33px]"
    />
  );
}
