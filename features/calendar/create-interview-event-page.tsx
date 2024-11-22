"use client";
import ApiClient from "@/lib/api/ApiClient";
import { useCreateEventStore } from "@/stores/useCreateEventStore";
import { useCallback, useEffect, useState } from "react";
import CreateJobForm from "../job/forms/create/create-job.form";
import CreateInterviewForm from "./forms/create-interview/create-interview.form";
import CreateIntervieweeForm from "./forms/create-interviewee/create-interviewee.form";
import { Interview } from "./models/interview";
import Interviewee from "./models/interviewee";
import Job from "./models/job";

export default function CreateInterviewEventPage() {
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(
    null,
  );

  const {
    step,
    interviewId,
    job,
    setJob,
    interview,
    setInterview,
    interviewee,
    setInterviewee,
    nextStep,
    setOpen,
  } = useCreateEventStore();

  const fetchInterviewById = useCallback(async (interviewId: string) => {
    const res = await ApiClient.get<{ interview: Interview }>(
      `/interviews/${interviewId}`,
    );

    setSelectedInterview(res.data.interview);
  }, []);

  useEffect(() => {
    if (interviewId) fetchInterviewById(interviewId);
  }, [fetchInterviewById, interviewId]);

  function Content() {
    switch (step) {
      case 1:
        return (
          <CreateJobForm
            onSuccess={function (job: Job): void {
              setJob(job);
              nextStep();
            }}
            onError={function (message: string): void {
              console.error("Failed to create job", message);
            }}
            {...(selectedInterview?.job && {
              job: selectedInterview.job,
              mode: "edit",
            })}
          />
        );
      case 2:
        return (
          <CreateInterviewForm
            jobId={job?.id}
            onSuccess={function (interview: Interview): void {
              setInterview(interview);
              nextStep();
            }}
            onError={function (message: string): void {
              console.error("Failed to create job", message);
            }}
            {...(selectedInterview && {
              interview: selectedInterview,
              mode: "edit",
            })}
          />
        );
      case 3:
        return (
          <CreateIntervieweeForm
            interviewId={interview?.id}
            onSuccess={function (interviewee: Interviewee): void {
              setInterviewee(interviewee);
              setOpen(false);
            }}
            onError={function (message: string): void {
              console.error("Failed to create job", message);
            }}
            {...(selectedInterview?.interviewee && {
              interviewee: selectedInterview.interviewee,
              mode: "edit",
            })}
          />
        );
      default:
        return null;
    }
  }

  return (
    <div className="flex h-full flex-col gap-8 overflow-scroll p-8 scrollbar-hide">
      <div className="flex flex-col space-y-2 text-center sm:text-left">
        <h1 className="text-2xl font-semibold">
          {step === 1
            ? "Choose / Create Role"
            : step === 2
              ? "Create Interview"
              : step === 3
                ? "Add / Create Interviewee"
                : ""}
        </h1>
        <p className="text-sm text-muted-foreground">
          {step === 1
            ? "Search or Create a Role to associate with this event."
            : step === 2
              ? "Create an interview to associate with this event."
              : step === 3
                ? "Add or Create an interviewee to associate with this event."
                : ""}
        </p>
      </div>
      <Content />
    </div>
  );
}
