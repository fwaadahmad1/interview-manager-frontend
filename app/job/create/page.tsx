import CreateInterviewForm from "@/features/calendar/forms/create-interview/create-interview.form";
import CreateIntervieweeForm from "@/features/calendar/forms/create-interviewee/create-interviewee.form";
import CreateJobForm from "@/features/job/forms/create/create-job.form";
import React from "react";

export default function CreateJob() {
  return (
    <div>
      {/* <CreateJobForm /> */}
      {/* <CreateInterviewForm /> */}
      <CreateIntervieweeForm />
    </div>
  );
}
