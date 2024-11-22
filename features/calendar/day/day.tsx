"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Interview } from "@/features/calendar/models/interview";
import { useCalendarApiStore } from "@/stores/useCalendarApiStore";
import { useCalendarStore } from "@/stores/useCalendarStore";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import {
  InterviewSummaryModal,
  InterviewSummaryModalContainer,
  InterviewSummaryModalTrigger,
} from "../interview-summary-modal";
import { formatDate, parseDateString } from "@/lib/dateTimeUtils";
import { cn } from "@/lib/utils";
import { PopoverAnchor } from "@radix-ui/react-popover";

const Day = ({
  dayDate = new Date(),
  showTime = true,
}: {
  dayDate?: Date;
  showTime?: boolean;
}) => {
  const [currentTime, setCurrentTime] = useState<number>(0);

  const { selectedDate } = useCalendarStore();

  const { events: interviews, fetchEvents, error } = useCalendarApiStore();

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents, selectedDate]);

  useEffect(() => {
    if (!showTime) return;
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.getHours() * 60 + now.getMinutes());
    };
    updateTime();
    const intervalId = setInterval(updateTime, 60000);

    return () => clearInterval(intervalId);
  }, [showTime]);

  const getGMTOffset = (): string => {
    const offset = -new Date().getTimezoneOffset();
    const hours = Math.floor(Math.abs(offset) / 60);
    const minutes = Math.abs(offset) % 60;
    const sign = offset >= 0 ? "+" : "-";
    return `GMT${sign}${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  };

  if (error) return <div>{error}</div>;

  const groupEventsByStartTime = (events: Interview[]) => {
    const groupedEvents: { [key: string]: Interview[] } = {};

    events.forEach((event) => {
      const startTime = format(new Date(event.date_time), "HH:mm");
      if (
        !(new Date(event.date_time).toDateString() !== dayDate.toDateString())
      ) {
        if (!groupedEvents[startTime]) {
          groupedEvents[startTime] = [];
        }
        groupedEvents[startTime].push(event);
      }
    });

    return groupedEvents;
  };

  const convertTimeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const groupedInterviews = groupEventsByStartTime(interviews);
  const colors = [
    "bg-green-500",
    "bg-blue-300",
    "bg-red-400",
    "bg-yellow-500",
    "bg-purple-500",
  ];
  const lastAssignedColors: { [time: string]: string } = {};

  return (
    <div className={cn("flex flex-col gap-5", showTime ? "p-5" : "border")}>
      {/* <div className="mb-5 flex flex-col items-start">
        <div className="text-2xl font-bold">{format(dayDate, "EEEE")}</div>
        <div className="mt-1 text-xl">
          {format(dayDate, "MMMM d, yyyy")}
        </div>
        <div className="mt-1 text-sm text-gray-600">{getGMTOffset()}</div>
      </div> */}

      <div className="relative flex h-[80rem] overflow-hidden">
        {showTime && (
          <div className="flex w-[5%] flex-col">
            {Array.from({ length: 24 }).map((_, index) => (
              <div
                key={index}
                className="flex h-60 items-center justify-center border-b border-gray-300"
              >
                {format(new Date().setHours(index, 0, 0, 0), "h a")}
              </div>
            ))}
          </div>
        )}

        <div className="relative h-full flex-1 overflow-y-auto">
          {Object.keys(groupedInterviews).map((startTime, groupIndex) => {
            const eventsAtSameTime = groupedInterviews[startTime];
            const totalOverlap = eventsAtSameTime.length;

            const currentTimeInMinutes = convertTimeToMinutes(startTime);

            return eventsAtSameTime.map((interview: Interview, index) => {
              const start = new Date(interview.date_time);
              const end = new Date(
                start.getTime() + (interview.duration || 60) * 60000,
              );

              let assignedColor = "";

              if (start.getTime() < new Date().getTime()) {
                assignedColor = "bg-gray-500";
              } else {
                for (let i = 0; i < colors.length; i++) {
                  const color = colors[(index + i) % colors.length];
                  const prevColor = lastAssignedColors[startTime];
                  const aboveTimeInMinutes = currentTimeInMinutes - 60;
                  const aboveTimeSlot = Object.keys(groupedInterviews).find(
                    (timeSlot) =>
                      convertTimeToMinutes(timeSlot) === aboveTimeInMinutes,
                  );
                  const aboveColor = aboveTimeSlot
                    ? lastAssignedColors[aboveTimeSlot]
                    : null;

                  if (color !== prevColor && color !== aboveColor) {
                    assignedColor = color;
                    break;
                  }
                }
              }

              lastAssignedColors[startTime] = assignedColor;

              return (
                <InterviewSummaryModalContainer key={`${groupIndex}-${index}`}>
                  <InterviewSummaryModalTrigger>
                    <Card
                      className={`absolute flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded p-1 text-center text-xs text-white ${assignedColor}`}
                      style={{
                        top: `${((start.getHours() * 60 + start.getMinutes()) / (24 * 60)) * 100}%`,
                        height: `${((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)) * 100}%`,
                        width: `calc(${100 / totalOverlap}% - 5px)`,
                        left: `calc(${(100 / totalOverlap) * index}%)`,
                      }}
                    >
                      <PopoverAnchor>
                        <CardHeader>
                          <CardTitle className="flex flex-row gap-1 text-sm">
                            <span>
                              {formatDate(
                                parseDateString(interview.date_time),
                                "hh:mm a",
                              )}
                            </span>
                            {interview.job?.title ?? "Interview"}
                          </CardTitle>
                        </CardHeader>
                      </PopoverAnchor>
                    </Card>
                  </InterviewSummaryModalTrigger>
                  <InterviewSummaryModal interview={interview} />
                </InterviewSummaryModalContainer>
              );
            });
          })}
          {showTime && (
            <div
              className="absolute h-0.5 w-full bg-red-500"
              style={{ top: `${(currentTime / (24 * 60)) * 100}%` }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Day;
