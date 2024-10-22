"use client";
import Select from "@/components/ui/select";
import { TimeUnit } from "@/lib/dateTimeUtils";
import { useCalendarStore } from "@/stores/useCalendarStore";
import React from "react";

const OPTIONS = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
];

export default function CalendarViewSelect() {
  const { view, setView } = useCalendarStore();
  const [open, setOpen] = React.useState(false);
  return (
    <Select
      options={OPTIONS}
      value={view}
      onChange={(value) => setView(value as TimeUnit)}
      open={open}
      setOpen={setOpen}
    />
  );
}
