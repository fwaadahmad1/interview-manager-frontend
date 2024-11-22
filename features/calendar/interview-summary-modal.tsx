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
import { useCalendarApiStore } from "@/stores/useCalendarApiStore";
import { useCreateEventStore } from "@/stores/useCreateEventStore";
import useGlobalStore from "@/stores/useGlobalStore";
import {
  CalendarCheck,
  CalendarSearch,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Interview } from "./models/interview";

const InterviewSummaryModalContainer = Popover;

const InterviewSummaryModalTrigger = PopoverTrigger;

export type TInterviewSUmmaryModal = {
  interview: Interview;
};

const InterviewSummaryModal = ({ interview }: TInterviewSUmmaryModal) => {
  const { setOpen } = useCreateEventStore();
  const { fetchEvents } = useCalendarApiStore();
  const { currentUser } = useGlobalStore();

  const [interviewDetail, setInterviewDetail] = useState<Interview | null>(
    null,
  );
  const interviewData = interviewDetail ?? interview;

  useEffect(() => {
    const fetchInterviewDetail = async () => {
      try {
        const res = await ApiClient.get<{ interview: Interview }>(
          `/interviews/${interview.id}`,
        );
        setInterviewDetail(res.data.interview);
      } catch (error) {
        console.error("Failed to fetch interview detail", error);
      }
    };

    fetchInterviewDetail();
  }, [interview]);

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

  const addInterviewer = useCallback(
    async (interviewId: string) => {
      try {
        await ApiClient.put(`/interviews/${interviewId}`, {
          interviewer: [
            ...interviewData.interviewer.map((interviewer) => interviewer?.id),
            ...(currentUser ? [currentUser.id] : []),
          ],
        });
        toast.success("Added self as interviewer successfully");
        fetchEvents();
      } catch (error) {
        console.error("Failed to add interviewer", error);
        toast.error("Failed to add interviewer");
      }
    },
    [currentUser, fetchEvents, interviewData.interviewer],
  );

  return (
    <PopoverContent className="grid w-80 grid-cols-1 gap-6 pt-2" side="left">
      <div className="flex w-full flex-row justify-end gap-1">
        <Button
          variant={"ghost"}
          className="aspect-square rounded-full p-0"
          onClick={() => setOpen(true, interviewData.id)}
        >
          <Pencil className="h-5 w-5" />
        </Button>
        <Button
          variant={"ghost"}
          className="aspect-square rounded-full p-0"
          onClick={() => {
            deleteInterview(interviewData.id);
          }}
        >
          <Trash2 className="h-5 w-5" />
        </Button>
        <PopoverClose asChild>
          <Button variant={"ghost"} className="aspect-square rounded-full p-0">
            <X className="h-5 w-5" />
          </Button>
        </PopoverClose>
      </div>

      <div className="-mt-4">
        <h2 className="text-2xl first:mt-0">
          {interviewData.job?.title ?? "Interview"}
        </h2>
        <p className="text-muted-foreground">
          {formatDate(
            parseDateString(interviewData.date_time),
            "dddd, MMMM DD",
          )}
        </p>
        <p className="text-muted-foreground">
          {`${formatDate(parseDateString(interviewData.date_time), "hh:mm a")}${
            interviewData.duration &&
            ` - ${formatDate(addPeriodToDate(parseDateString(interviewData.date_time), interviewData.duration, "minute"), "hh:mm a")}`
          }`}
        </p>
      </div>

      <div className="flex flex-row flex-wrap gap-2">
        {[
          ...(interviewData?.tags ?? []),
          interviewData?.business_area?.name,
        ]?.map((tag) => {
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

      <div className="flex flex-row flex-wrap items-center gap-2">
        {interviewData.interviewer.length > 0 ? (
          <CalendarCheck />
        ) : (
          <CalendarSearch />
        )}
        {interviewData.interviewer.length > 0 ? (
          <>
            {interviewData?.interviewer?.filter(Boolean).map((interviewer) => {
              return (
                <div
                  key={interviewer.id}
                  className="rounded-md border border-green-500 bg-green-100 px-2"
                >
                  {interviewer.name}
                </div>
              );
            })}

            {interviewData.interviewer.findIndex(
              (interviewer) => interviewer?.id === currentUser?.id,
            ) === -1 && (
              <Button
                variant={"ghost"}
                className=""
                onClick={() => addInterviewer(interviewData.id)}
              >
                <Plus />
                Opt In
              </Button>
            )}
          </>
        ) : (
          <Button
            variant={"link"}
            className="text-blue-600"
            onClick={() => addInterviewer(interviewData.id)}
          >
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
