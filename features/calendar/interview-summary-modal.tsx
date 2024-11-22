"use client";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ApiClient from "@/lib/api/ApiClient";
import {
  addPeriodToDate,
  formatDate,
  parseDateString,
} from "@/lib/dateTimeUtils";
import { useCreateEventStore } from "@/stores/useCreateEventStore";
import { CalendarCheck, CalendarSearch, Pencil, Trash2, X } from "lucide-react";
import { useCallback } from "react";
import { Interview } from "./models/interview";
import { useCalendarApiStore } from "@/stores/useCalendarApiStore";

const InterviewSummaryModalContainer = Popover;

const InterviewSummaryModalTrigger = PopoverTrigger;

export type TInterviewSUmmaryModal = {
  interview: Interview;
};

const InterviewSummaryModal = ({ interview }: TInterviewSUmmaryModal) => {
  const { setOpen } = useCreateEventStore();
  const { fetchEvents } = useCalendarApiStore();

  const deleteInterview = useCallback(
    async (interviewId: string) => {
      try {
        await ApiClient.delete(`/interviews/${interviewId}`);
        fetchEvents();
      } catch (error) {
        console.error("Failed to delete interview", error);
      }
    },
    [fetchEvents],
  );

  return (
    <PopoverContent className="grid w-80 grid-cols-1 gap-1 pt-2" side="left">
      <div className="flex w-full flex-row justify-end gap-1">
        <Button
          variant={"ghost"}
          className="aspect-square rounded-full p-0"
          onClick={() => setOpen(true, interview.id)}
        >
          <Pencil className="h-5 w-5" />
        </Button>
        <Button
          variant={"ghost"}
          className="aspect-square rounded-full p-0"
          onClick={() => {
            deleteInterview(interview.id);
          }}
        >
          <Trash2 className="h-5 w-5" />
        </Button>
        <PopoverClose>
          <Button variant={"ghost"} className="aspect-square rounded-full p-0">
            <X className="h-5 w-5" />
          </Button>
        </PopoverClose>
      </div>

      <div>
        <h2 className="text-2xl first:mt-0">
          {interview.job?.title ?? "Interview"}
        </h2>
        <p className="text-muted-foreground">
          {formatDate(parseDateString(interview.date_time), "dddd, MMMM DD")}
        </p>
        <p className="text-muted-foreground">
          {`${formatDate(parseDateString(interview.date_time), "hh:mm a")}${
            interview.duration &&
            ` - ${formatDate(addPeriodToDate(parseDateString(interview.date_time), interview.duration, "minute"), "hh:mm a")}`
          }`}
        </p>
      </div>

      <div className="flex flex-row flex-wrap gap-2">
        {interview?.tags?.map((tag) => {
          return (
            <div
              key={tag}
              className="rounded-md border bg-muted px-2 py-1 shadow-sm"
            >
              {tag}
            </div>
          );
        })}
      </div>

      <div className="flex flex-row items-center">
        {interview.interviewer.length > 0 ? (
          <CalendarCheck />
        ) : (
          <CalendarSearch />
        )}
        {false && interview.interviewer.length > 0 ? (
          interview.interviewer.map((interviewer) => {
            return (
              <div key={interviewer.id} className="rounded-md bg-green-200 p-2">
                {interviewer.name}
              </div>
            );
          })
        ) : (
          <Button variant={"link"} className="text-blue-600">
            Take this interview
          </Button>
        )}
      </div>
    </PopoverContent>
  );
};

export {
  InterviewSummaryModal,
  InterviewSummaryModalContainer,
  InterviewSummaryModalTrigger,
};
