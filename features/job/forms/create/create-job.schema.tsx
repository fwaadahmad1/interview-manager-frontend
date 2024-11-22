"use client";

import { z } from "zod";

export const CreateJobFormSchema = z
  .object({
    id: z.string().optional(),
    title: z
      .string()
      .min(3, { message: "Title must be at least 3 characters long" })
      .optional(),
    description: z
      .string()
      .min(10, { message: "Description must be at least 10 characters long" })
      .optional(),
  })
  .refine((data) => data.id || (data.title && data.description), {
    message: "Either id must be set or both title and description must be set",
  });
