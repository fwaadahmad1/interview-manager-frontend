"use client";

import { z } from "zod";

export const CreateInterviewFormSchema = z.object({
  interviewer: z
    .array(z.string())
    .nonempty({ message: "At least one interviewer is required" }),
  business_area: z.string(),
  job: z.string(),
  date_time: z.coerce.date({ required_error: "Date and time are required" }),
  duration: z.number().int(),
  location: z.string(),
  notes: z.string(),
});
