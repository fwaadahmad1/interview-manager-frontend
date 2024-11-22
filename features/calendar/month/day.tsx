"use client";
import { formatDate, parseDateString } from "@/lib/dateTimeUtils";
import { cn } from "@/lib/utils";
import { Interview } from "../models/interview";
import { useCalendarStore } from "@/stores/useCalendarStore";
import {
  InterviewSummaryModal,
  InterviewSummaryModalContainer,
  InterviewSummaryModalTrigger,
} from "../interview-summary-modal";

export interface IDay {
  value: Date;
  className?: string;
  showDay?: boolean;
  events?: Interview[];
}

const EVENTS_PER_DAY = 3;

export default function Day({ value, className, showDay, events }: IDay) {
  const { isSummaryModalOpen, toggleSummaryModal } = useCalendarStore();

  function isInCurrentMonth() {
    return value.getMonth() === new Date().getMonth();
  }
  return (
    <div className={cn("flex flex-col border border-gray-200", className)}>
      <header className="flex flex-col items-center">
        <p className={`my-1 p-1 text-center text-sm`}>
          {showDay && (
            <>
              {formatDate(value, "ddd").toUpperCase()}
              <br />
            </>
          )}
          <span
            className={cn(
              "",
              isInCurrentMonth() ? "font-semibold" : "text-muted-foreground",
            )}
          >
            {value.getDate() === 1 && formatDate(value, "MMM")}{" "}
            {formatDate(value, "DD")}
          </span>
        </p>
      </header>
      <div className="flex cursor-pointer flex-col gap-0.5">
        {events?.slice(0, EVENTS_PER_DAY).map((evt) => (
          <InterviewSummaryModalContainer key={`${evt.id}`}>
            <InterviewSummaryModalTrigger>
              <div
                className={
                  "flex flex-row items-center truncate rounded px-2 py-1 text-xs"
                }
              >
                <div className={`mr-1 h-2 w-2 rounded-full bg-slate-600`} />
                {formatDate(parseDateString(evt.date_time), "hh:mma")}{" "}
                {evt.job?.title ?? "Interview"}
              </div>
            </InterviewSummaryModalTrigger>
            <InterviewSummaryModal interview={evt} />
          </InterviewSummaryModalContainer>
        ))}
        {events && events.length > EVENTS_PER_DAY && (
          <div className="flex flex-row items-center truncate rounded px-2 py-1 text-xs">
            <div className={`h-2 w-2 rounded-full bg-slate-600`} />
            {events.length - EVENTS_PER_DAY} more
          </div>
        )}
      </div>
    </div>
  );
}
