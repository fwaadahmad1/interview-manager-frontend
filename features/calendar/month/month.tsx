"use client";
import {
  getDaysMatrix,
  getMonthIndexForDate,
  parseDateString,
} from "@/lib/dateTimeUtils";
import { cn } from "@/lib/utils";
import { useCalendarApiStore } from "@/stores/useCalendarApiStore";
import { useCalendarStore } from "@/stores/useCalendarStore";
import { Fragment, useEffect, useMemo } from "react";
import Day from "./day";
import useGlobalStore from "@/stores/useGlobalStore";
import { Card, CardContent } from "@/components/ui/card";

export interface IMonth {
  className?: React.ComponentProps<"div">["className"];
}

export default function Month({ className }: IMonth) {
  const { events, fetchEvents } = useCalendarApiStore();
  const { selectedDate } = useCalendarStore();

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const daysMatrix = useMemo(() => {
    return getDaysMatrix(
      getMonthIndexForDate(
        selectedDate instanceof Date ? selectedDate : selectedDate.from,
      ),
    );
  }, [selectedDate]);

  function getEventsForDay(day: Date) {
    return events?.filter((evt) => {
      const evtDate = parseDateString(evt.date_time);
      return (
        evtDate.getDate() === day.getDate() &&
        evtDate.getMonth() === day.getMonth() &&
        evtDate.getFullYear() === day.getFullYear()
      );
    });
  }

  return (
    <Card
      className={"m-2 mt-4 flex h-full items-center justify-center overflow-hidden"}
    >
      <CardContent
        className={cn(
          "grid size-[101%] grid-cols-7 grid-rows-5 p-0",
          className,
        )}
      >
        {daysMatrix.map((week, w_idx) => (
          <Fragment key={w_idx}>
            {week.map((day, idx) => (
              <Day
                key={`${day.toISOString}_${w_idx}_${idx}`}
                value={day}
                showDay={w_idx === 0}
                events={getEventsForDay(day)}
              />
            ))}
          </Fragment>
        ))}
      </CardContent>
    </Card>
  );
}
