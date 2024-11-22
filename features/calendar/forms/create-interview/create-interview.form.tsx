"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import MultiSelect from "@/components/ui/multi-select";
import Select from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import useDebounce from "@/hooks/useDebounce";
import ApiClient from "@/lib/api/ApiClient";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import BusinessArea from "../../models/business-area";
import { Interview } from "../../models/interview";
import { Interviewer } from "../../models/interviewer";
import Job from "../../models/job";
import { CreateInterviewRequest } from "../../models/request/create-interview.request";
import InterviewersSearchRequest from "../../models/request/interviewers-search.request";
import { CreateInterviewFormSchema } from "./create-interview.schema";
import { parseDateString } from "@/lib/dateTimeUtils";

export interface ICreateInterviewForm {
  onSuccess?: (interview: Interview) => void;
  onError?: (message: string) => void;
  jobId?: string;
  interview?: Interview | null;
  mode?: "create" | "view" | "edit";
}

export default function CreateInterviewForm({
  onSuccess,
  onError,
  jobId,
  interview,
  mode = "create",
}: ICreateInterviewForm) {
  const form = useForm<z.infer<typeof CreateInterviewFormSchema>>({
    resolver: zodResolver(CreateInterviewFormSchema),
    defaultValues: {
      interviewer: interview?.interviewer.map((interviewer) => interviewer.id),
      business_area: interview?.business_area?.id ?? "",
      job: jobId ?? "",
      date_time: interview?.date_time
        ? new Date(interview.date_time)
        : new Date(),
      duration: interview?.duration ?? 0,
      location: interview?.location ?? "",
      notes: interview?.notes ?? "",
    },
  });

  async function onSubmit(values: z.infer<typeof CreateInterviewFormSchema>) {
    let url = "/interviews/";

    if (mode === "edit") {
      if (!form.formState.isDirty) {
        if (onSuccess) onSuccess(interview!);
        return;
      }
      url = `/interviews/${interview?.id}`;
    }

    const promise = new Promise(async (resolve, reject) => {
      try {
        const response = await ApiClient.post<
          CreateInterviewRequest,
          { message: string; interview: Interview }
        >(url, {
          ...values,
          date_time: values.date_time.toISOString(),
        });
        resolve(response.data.interview);
        if (onSuccess) onSuccess(response.data.interview);
      } catch (error) {
        reject(error);
        if (onError) onError("Failed to create interview");
      }
    });

    toast.promise(promise, {
      loading: mode === "edit" ? "Updating interview" : "Creating interview",
      success: mode === "edit" ? "Interview updated" : "Interview created",
      error:
        mode === "edit"
          ? "Failed to update interview"
          : "Failed to create interview",
    });
  }

  const [interviewerDropdownOpen, setInterviewerDropdownOpen] =
    React.useState(false);
  const [businessAreaDropdownOpen, setBusinessAreaDropdownOpen] =
    React.useState(false);
  const [jobDropdownOpen, setJobDropdownOpen] = React.useState(false);

  const [businessAreas, setBusinessAreas] = React.useState<BusinessArea[]>([]);

  const [jobs, setJobs] = React.useState<Job[]>([]);
  const [jobLoading, setJobLoading] = React.useState(false);

  const [interviewers, setInterviewers] = React.useState<Interviewer[]>([]);
  const [interviewerLoading, setInterviewerLoading] = React.useState(false);
  const fetchInterviewers = React.useCallback(
    async function (input: string = "") {
      setInterviewerLoading(true);
      const response = await ApiClient.post<
        InterviewersSearchRequest,
        Interviewer[]
      >("/interviewers/search", {
        text: input,
      });
      const interviewers = response.data.filter(
        (interviewer) =>
          !interview?.interviewer?.find((i) => i.id === interviewer.id),
      );

      setInterviewers([...interviewers, ...(interview?.interviewer || [])]);
      setInterviewerLoading(false);
    },
    [interview?.interviewer],
  );

  const [, setDebounceInterviewerSearch] =
    useDebounce<string>(fetchInterviewers);

  const fetchJobs = React.useCallback(async function (input: string = "") {
    setJobLoading(true);
    setJobs([]);
    const response = await ApiClient.post<{ title: string }, Job[]>(
      "/jobs/search",
      {
        title: input,
      },
    );
    setJobs(response.data);
    setJobLoading(false);
  }, []);

  const [, setDebounceJobSearch] = useDebounce<string>(fetchJobs);

  React.useEffect(() => {
    async function fetchBusinessAreas() {
      const response = await ApiClient.get<BusinessArea[]>("/businessareas/");
      setBusinessAreas(response.data);
    }

    fetchJobs();
    fetchBusinessAreas();
    fetchInterviewers();
  }, [fetchInterviewers, fetchJobs]);

  console.log(form.getValues());

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="interviewer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Interviewer</FormLabel>
              <FormControl>
                <MultiSelect
                  options={interviewers.map((interviewer) => ({
                    value: interviewer.id,
                    label: interviewer.name,
                  }))}
                  defaultSelectedOptions={
                    interview?.interviewer.map((interviewer) => ({
                      value: interviewer.id,
                      label: interviewer.name,
                    })) || []
                  }
                  value={field.value}
                  onChange={field.onChange}
                  open={interviewerDropdownOpen}
                  setOpen={setInterviewerDropdownOpen}
                  placeholder="Interviewer"
                  searchable={true}
                  asyncSearchCallback={setDebounceInterviewerSearch}
                  loading={interviewerLoading}
                />
              </FormControl>
              <FormDescription>
                List of interviewers for the interview.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="business_area"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Area</FormLabel>
              <FormControl>
                <Select
                  className="w-full"
                  options={businessAreas.map((area) => ({
                    value: area.id,
                    label: area.name,
                  }))}
                  value={field.value}
                  onChange={field.onChange}
                  open={businessAreaDropdownOpen}
                  setOpen={setBusinessAreaDropdownOpen}
                  placeholder="Business Area"
                  searchable={true}
                />
              </FormControl>
              <FormDescription>
                The business area related to the interview.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {!jobId && (
          <FormField
            control={form.control}
            name="job"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job</FormLabel>
                <FormControl>
                  <Select
                    className="w-full"
                    options={jobs.map((job) => ({
                      value: job.id,
                      label: job.title,
                    }))}
                    value={field.value}
                    onChange={field.onChange}
                    open={jobDropdownOpen}
                    setOpen={setJobDropdownOpen}
                    placeholder="Job"
                    loading={jobLoading}
                    searchable={true}
                    asyncSearchCallback={setDebounceJobSearch}
                  />
                </FormControl>
                <FormDescription>
                  The job position related to the interview.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <div className="grid grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="date_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date and Time</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    value={field.value.toISOString().slice(0, 16)}
                    onChange={(e) => {
                      field.onChange(new Date(e.target.value));
                    }}
                  />
                </FormControl>
                <FormDescription>
                  The date and time of the interview.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter duration in minutes"
                    {...field}
                    onChange={(e) => {
                      field.onChange(parseInt(e.target.value));
                    }}
                  />
                </FormControl>
                <FormDescription>
                  The duration of the interview in minutes.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Enter location" {...field} />
              </FormControl>
              <FormDescription>
                The location where the interview will take place.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter any additional notes" {...field} />
              </FormControl>
              <FormDescription>
                Additional notes for the interview.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Next</Button>
      </form>
    </Form>
  );
}
