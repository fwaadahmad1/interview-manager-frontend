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
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import ApiClient from "@/lib/api/ApiClient";
import CreateIntervieweeFormSchema from "./create-interviewee.schema";
import Interviewee from "../../models/interviewee";
import useDebounce from "@/hooks/useDebounce";
import { Separator } from "@/components/ui/separator";
import CreateIntervieweeRequest from "../../models/request/create-interviewee.request";
import { toast } from "sonner";
import { Interview } from "../../models/interview";

export interface ICreateIntervieweeForm {
  interviewId?: string;
  onSuccess?: (interviewee: Interviewee) => void;
  onError?: (message: string) => void;
  interviewee?: Interviewee | null;
  mode?: "edit" | "create" | "view";
}

export default function CreateIntervieweeForm({
  interviewId,
  onSuccess,
  onError,
  interviewee,
  mode,
}: ICreateIntervieweeForm) {
  const form = useForm<z.infer<typeof CreateIntervieweeFormSchema>>({
    resolver: zodResolver(CreateIntervieweeFormSchema),
    defaultValues: {
      interviewee_id: interviewee?.id,
    },
  });

  async function updateInterview(interviewee: Interviewee) {
    if (interviewId) {
      const promise = new Promise(async (resolve, reject) => {
        try {
          const response = await ApiClient.put<
            { interviewee: string },
            { message: string; interview: Interview }
          >(`/interviews/${interviewId}`, {
            interviewee: interviewee.id,
          });
          resolve(response.data.interview);
          if (onSuccess) onSuccess(interviewee);
        } catch (error) {
          reject(error);
          if (onError) onError("Error updating interview");
        }
      });

      toast.promise(promise, {
        loading: "Adding interviewee to interview...",
        success: "Interview updated successfully",
        error: "Failed to update interview",
      });
    }
  }

  async function onSubmit(values: z.infer<typeof CreateIntervieweeFormSchema>) {
    if (values.interviewee_id) {
      const interviewee = interviewees.find(
        (interviewee) => interviewee.id === values.interviewee_id,
      );
      if (interviewee) {
        updateInterview(interviewee);
      } else {
        toast.error("Interviewee not found");
        onError && onError("Interviewee not found");
      }
    } else {
      const promise = new Promise(async (resolve, reject) => {
        if (values.interviewee_name && values.interviewee_email) {
          try {
            const response = await ApiClient.post<
              CreateIntervieweeRequest,
              { message: string; interviewee: Interviewee }
            >("/interviewees", {
              name: values.interviewee_name,
              email: values.interviewee_email,
              comments: values.comments,
            });
            resolve(response.data.interviewee);
            updateInterview(response.data.interviewee);
          } catch (error) {
            reject(error);
            onError && onError("Error creating interviewee");
          }
        } else {
          reject(new Error("Name and email are required"));
          onError && onError("Name and email are required");
        }
      });

      toast.promise(promise, {
        loading: "Creating Interviewee...",
        success: "Interviewee created successfully",
        error: "Failed to create interviewee",
      });
    }
  }

  const intervieweeId = useWatch({
    control: form.control,
    name: "interviewee_id",
  });

  const intervieweeName = useWatch({
    control: form.control,
    name: "interviewee_name",
  });

  const intervieweeEmail = useWatch({
    control: form.control,
    name: "interviewee_email",
  });

  const comments = useWatch({
    control: form.control,
    name: "comments",
  });

  const [intervieweeDropdownOpen, setIntervieweeDropdownOpen] =
    React.useState(false);
  const [interviewees, setInterviewees] = React.useState<Interviewee[]>([]);
  const [intervieweeLoading, setIntervieweeLoading] = React.useState(false);

  const fetchInterviewees = React.useCallback(
    async function (input: string = "") {
      setIntervieweeLoading(true);
      const response = await ApiClient.post<{ text: string }, Interviewee[]>(
        "/interviewees/search",
        {
          text: input,
        },
      );

      const filteredInterviewees = response.data.filter(
        (interviewee) => interviewee.id === interviewee?.id,
      );

      setInterviewees([
        ...(interviewee ? [interviewee] : []),
        ...filteredInterviewees,
      ]);
      setIntervieweeLoading(false);
    },
    [interviewee],
  );

  const [, setDebounceIntervieweeSearch] =
    useDebounce<string>(fetchInterviewees);

  React.useEffect(() => {
    fetchInterviewees();
  }, [fetchInterviewees]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <h2 className="text-2xl font-semibold">Choose an Interviewee</h2>
        <FormField
          control={form.control}
          name="interviewee_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Interviewee</FormLabel>
              <FormControl>
                <Select
                  className="w-full"
                  options={interviewees.map((interviewee) => ({
                    value: interviewee.id,
                    label: interviewee.name,
                  }))}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  open={intervieweeDropdownOpen}
                  setOpen={setIntervieweeDropdownOpen}
                  placeholder="Interviewee"
                  loading={intervieweeLoading}
                  searchable={true}
                  asyncSearchCallback={setDebounceIntervieweeSearch}
                  disabled={
                    !!intervieweeName || !!intervieweeEmail || !!comments
                  }
                />
              </FormControl>
              <FormDescription>
                Select an interviewee from the list.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <span className="flex flex-row items-center justify-center gap-4">
          <Separator className="w-[45%]" />
          <p className="text-sm text-gray-500">Or</p>
          <Separator className="w-2/5" />
        </span>

        <h2 className="text-2xl font-semibold">Create Interviewee</h2>

        <FormField
          control={form.control}
          name="interviewee_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Interviewee Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter interviewee name"
                  {...field}
                  disabled={!!intervieweeId}
                />
              </FormControl>
              <FormDescription>
                Enter the name of the interviewee.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="interviewee_email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Interviewee Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter interviewee email"
                  {...field}
                  disabled={!!intervieweeId}
                />
              </FormControl>
              <FormDescription>
                Enter the email of the interviewee.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="comments"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comments</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter comments"
                  {...field}
                  disabled={!!intervieweeId}
                />
              </FormControl>
              <FormDescription>Enter any additional comments.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
                <div className="flex justify-end">

        <Button type="submit"  className={`${
    form.formState.isValid ? "bg-secondary opacity-80 text-white hover:bg-secondary hover:opacity-100 " : "bg-gray-500 text-gray-300"
  }`}
  disabled={!form.formState.isValid}>Submit</Button>
  </div>
      </form>
    </Form>
  );
}
