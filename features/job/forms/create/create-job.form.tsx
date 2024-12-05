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
import Select from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import Job from "@/features/calendar/models/job";
import CreateJobRequest from "@/features/calendar/models/request/create-job-request";
import useDebounce from "@/hooks/useDebounce";
import ApiClient from "@/lib/api/ApiClient";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { CreateJobFormSchema } from "./create-job.schema";

export interface ICreateJobForm {
  onSuccess?: (job: Job) => void;
  onError?: (message: string) => void;
  job?: Job | null;
  mode?: "create" | "view" | "edit";
}

export default function CreateJobForm({
  onSuccess,
  onError,
  job,
  mode = "create",
}: ICreateJobForm) {
  const form = useForm<z.infer<typeof CreateJobFormSchema>>({
    resolver: zodResolver(CreateJobFormSchema),
    defaultValues: {
      ...(job?.id && { id: job.id }),
    },
  });

  const jobId = useWatch({
    control: form.control,
    name: "id",
  });

  const jobTitle = useWatch({
    control: form.control,
    name: "title",
  });

  const jobDescription = useWatch({
    control: form.control,
    name: "description",
  });

  const [jobDropdownOpen, setJobDropdownOpen] = React.useState(false);
  const [jobs, setJobs] = React.useState<Job[]>([]);
  const [jobLoading, setJobLoading] = React.useState(false);

  const fetchJobs = React.useCallback(
    async function (input: string = "") {
      setJobLoading(true);
      const response = await ApiClient.post<{ title: string }, Job[]>(
        "/jobs/search",
        {
          title: input,
        },
      );
      const jobRes = response.data.filter(
        (_job) => _job.id !== (job?.id ?? ""),
      );
      setJobs([...(job ? [job] : []), ...jobRes]);
      setJobLoading(false);
    },
    [job],
  );

  const [, setDebounceJobSearch] = useDebounce<string>(fetchJobs);

  React.useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  async function onSubmit(values: z.infer<typeof CreateJobFormSchema>) {
    if (Object.keys(form.formState.dirtyFields).length === 0) {
      onSuccess && onSuccess(job);
      return;
    }

    if (values.id) {
      const job = jobs.find((job) => job.id === values.id);
      if (job) {
        onSuccess && onSuccess(job);
      } else {
        toast.error("Job not found");
        onError && onError("Job not found");
      }
    } else {
      const promise = new Promise(async (resolve, reject) => {
        if (values.title && values.description) {
          try {
            const response = await ApiClient.post<
              CreateJobRequest,
              { message: string; job: Job }
            >("/jobs", {
              title: values.title,
              description: values.description,
            });
            resolve(response.data.job);
            onSuccess && onSuccess(response.data.job);
          } catch (error) {
            reject(error);
            onError && onError("Error creating job");
          }
        } else {
          reject(new Error("Title and description are required"));
          onError && onError("Title and description are required");
        }
      });

      toast.promise(promise, {
        loading: "Creating Job...",
        success: "Job created successfully",
        error: "Failed to create job",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h2 className="text-lg font-semibold text-secondary">
            Choose a Role
          </h2>
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem>
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
                    disabled={!!jobTitle || !!jobDescription}
                  />
                </FormControl>
                <FormDescription>Select a job from the list.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <span className="flex flex-row items-center justify-center gap-4">
          <Separator className="w-[45%]" />
          <p className="text-sm text-gray-500">Or</p>
          <Separator className="w-[45%]" />
        </span>

        <div>
          <h2 className="text-lg font-semibold text-secondary">Create Role</h2>

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Senior Frontend Developer"
                    {...field}
                    disabled={!!jobId}
                  />
                </FormControl>
                <FormDescription>
                  A clear and concise title that describes the Role.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  className={"min-h-72"}
                  placeholder="Enter role description"
                  {...field}
                  disabled={!!jobId}
                />
              </FormControl>
              <FormDescription>
                A detailed description of the role responsibilities.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            className={`${
              form.formState.isValid
                ? "bg-secondary text-white opacity-80 hover:bg-secondary hover:opacity-100"
                : "bg-gray-500 text-gray-300"
            }`}
            disabled={!form.formState.isValid}
          >
            Next
          </Button>
        </div>
      </form>
    </Form>
  );
}
