"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Select from "@/components/ui/select";
import useDebounce from "@/hooks/useDebounce";
import ApiClient from "@/lib/api/ApiClient";
import { useCalendarApiStore } from "@/stores/useCalendarApiStore";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import BusinessArea from "./models/business-area";
import Interviewee from "./models/interviewee";
import { Interviewer } from "./models/interviewer";
import Job from "./models/job";
import SearchRequest from "./models/request/search.request";

const CalendarSidebarFilterSchema = z.object({
  job: z.string().optional(),
  business_area: z.string().optional(),
  interviewer: z.string().optional(),
  interviewee: z.string().optional(),
});

export default function CalendarSidebarFilter() {
  const { setQuery, fetchEvents } = useCalendarApiStore();
  const form = useForm<z.infer<typeof CalendarSidebarFilterSchema>>({
    resolver: zodResolver(CalendarSidebarFilterSchema),
    defaultValues: {},
  });

  const [jobDropdownOpen, setJobDropdownOpen] = React.useState(false);
  const [jobs, setJobs] = React.useState<Job[]>([]);
  const [jobLoading, setJobLoading] = React.useState(false);

  const fetchJobs = React.useCallback(async function (input: string = "") {
    setJobLoading(true);
    const response = await ApiClient.post<{ title: string }, Job[]>(
      "/jobs/search",
      {
        title: input,
      },
    );
    setJobs([...response.data]);
    setJobLoading(false);
  }, []);

  const [, setDebounceJobSearch] = useDebounce<string>(fetchJobs);

  const [businessAreaDropdownOpen, setBusinessAreaDropdownOpen] =
    React.useState(false);
  const [businessAreas, setBusinessAreas] = React.useState<BusinessArea[]>([]);

  const [interviewerDropdownOpen, setInterviewerDropdownOpen] =
    React.useState(false);

  const [interviewers, setInterviewers] = React.useState<Interviewer[]>([]);
  const [interviewerLoading, setInterviewerLoading] = React.useState(false);
  const fetchInterviewers = React.useCallback(async function (
    input: string = "",
  ) {
    setInterviewerLoading(true);
    const response = await ApiClient.post<SearchRequest, Interviewer[]>(
      "/interviewers/search",
      {
        text: input,
      },
    );
    setInterviewers(response.data);
    setInterviewerLoading(false);
  }, []);
  const [, setDebounceInterviewerSearch] =
    useDebounce<string>(fetchInterviewers);

  // Interviewee
  const [intervieweeDropdownOpen, setIntervieweeDropdownOpen] =
    React.useState(false);
  const [interviewees, setInterviewees] = React.useState<Interviewee[]>([]);
  const [intervieweeLoading, setIntervieweeLoading] = React.useState(false);
  const fetchInterviewees = React.useCallback(async function (
    input: string = "",
  ) {
    setIntervieweeLoading(true);
    const response = await ApiClient.post<SearchRequest, Interviewee[]>(
      "/interviewees/search",
      {
        text: input,
      },
    );
    setInterviewees(response.data);
    setIntervieweeLoading(false);
  }, []);
  const [, setDebounceIntervieweeSearch] =
    useDebounce<string>(fetchInterviewees);

  // Function to fetch
  React.useEffect(() => {
    async function fetchBusinessAreas() {
      const response = await ApiClient.get<BusinessArea[]>("/businessareas/");
      setBusinessAreas(response.data);
    }

    fetchJobs();
    fetchBusinessAreas();
    fetchInterviewers();
    fetchInterviewees();
  }, [fetchInterviewees, fetchInterviewers, fetchJobs]);

  React.useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      console.log("Form value changed:", value);
      setQuery({
        job: value.job || undefined,
        business_area: value.business_area || undefined,
        interviewer: value.interviewer ? [value.interviewer] : undefined,
        interviewee: value.interviewee || undefined,
      });
      fetchEvents();
    });
    return () => subscription.unsubscribe();
  }, [fetchEvents, form, setQuery]);

  return (
    <Form {...form}>
      <form className="flex flex-col items-start gap-4 p-4">
        <FormField
          control={form.control}
          name="job"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-white">Role</FormLabel>
              <FormControl>
                <Select
                  className="w-full"
                  options={jobs.map((job) => ({
                    value: job.id,
                    label: job.title,
                  }))}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  open={jobDropdownOpen}
                  setOpen={setJobDropdownOpen}
                  placeholder="Role"
                  loading={jobLoading}
                  searchable={true}
                  asyncSearchCallback={setDebounceJobSearch}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="business_area"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-white">Business Area</FormLabel>
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
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="interviewer"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-white">Interviewer</FormLabel>
              <FormControl>
                <Select
                  className="w-full"
                  options={interviewers.map((interviewer) => ({
                    value: interviewer.id,
                    label: interviewer.name,
                  }))}
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
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="interviewee"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-white">Interviewee</FormLabel>
              <FormControl>
                <Select
                  className="w-full"
                  options={interviewees.map((interviewee) => ({
                    value: interviewee.id,
                    label: interviewee.name,
                  }))}
                  value={field.value}
                  onChange={field.onChange}
                  open={intervieweeDropdownOpen}
                  setOpen={setIntervieweeDropdownOpen}
                  placeholder="Interviewee"
                  searchable={true}
                  asyncSearchCallback={setDebounceIntervieweeSearch}
                  loading={intervieweeLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
