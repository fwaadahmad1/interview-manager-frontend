"use client";
import { Label } from "@/components/ui/label";
import Select from "@/components/ui/select";
import React from "react";

export default function CalendarSidebarFilter() {
  const [businessArea, setBusinessArea] = React.useState<{
    value: string;
    open: boolean;
  }>({ value: "", open: false });
  const [interviewer, setInterviewer] = React.useState<{
    value: string;
    open: boolean;
  }>({ value: "", open: false });
  const [job, setJob] = React.useState<{ value: string; open: boolean }>({
    value: "",
    open: false,
  });
  const [interviewee, setInterviewee] = React.useState<{
    value: string;
    open: boolean;
  }>({ value: "", open: false });

  return (
    <div className="flex flex-col items-start gap-8 p-4">
      <div className="flex w-full flex-col gap-2">
        <Label className="text-md">Job</Label>
        <Select
          options={[
            { label: "Software Developer", value: "software" },
            { label: "Marketing Manager", value: "marketing" },
            { label: "Sales Executive", value: "sales" },
            { label: "Customer Support", value: "support" },
          ]}
          value={job.value}
          onChange={(value: string) => {
            setJob({ value: value, open: false });
          }}
          open={job.open}
          setOpen={(open: boolean) =>
            setJob((prev) => ({ value: prev.value, open }))
          }
        />
      </div>

      <div className="flex w-full flex-col gap-2">
        <Label className="text-md">Business Area</Label>
        <Select
          options={[
            { label: "Software Development", value: "software" },
            { label: "Marketing", value: "marketing" },
            { label: "Sales", value: "sales" },
            { label: "Customer Support", value: "support" },
          ]}
          value={businessArea.value}
          onChange={(value: string) => {
            setBusinessArea({ value: value, open: false });
          }}
          open={businessArea.open}
          setOpen={(open: boolean) =>
            setBusinessArea((prev) => ({ value: prev.value, open }))
          }
        />
      </div>

      <div className="flex w-full flex-col gap-2">
        <Label className="text-md">Interviewer</Label>
        <Select
          options={[
            { label: "John Doe", value: "john" },
            { label: "Jane Doe", value: "jane" },
            { label: "John Smith", value: "smith" },
            { label: "Jane Smith", value: "jane-smith" },
          ]}
          value={interviewer.value}
          onChange={(value: string) => {
            setInterviewer({ value: value, open: false });
          }}
          open={interviewer.open}
          setOpen={(open: boolean) =>
            setInterviewer((prev) => ({ value: prev.value, open }))
          }
        />
      </div>

      <div className="flex w-full flex-col gap-2">
        <Label className="text-md">Interviewee</Label>
        <Select
          options={[
            { label: "John Doe", value: "john" },
            { label: "Jane Doe", value: "jane" },
            { label: "John Smith", value: "smith" },
            { label: "Jane Smith", value: "jane-smith" },
          ]}
          value={interviewee.value}
          onChange={(value: string) => {
            setInterviewee({ value: value, open: false });
          }}
          open={interviewee.open}
          setOpen={(open: boolean) =>
            setInterviewee((prev) => ({ value: prev.value, open }))
          }
        />
      </div>
    </div>
  );
}
