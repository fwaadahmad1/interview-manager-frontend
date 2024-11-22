import { z } from "zod";

const CreateIntervieweeFormSchema = z
  .object({
    interviewee_id: z.string().optional(),
    interviewee_name: z.string().optional(),
    interviewee_email: z.string().email().optional(),
    comments: z.string().optional(),
  })
  .refine(
    (data) =>
      data.interviewee_id || (data.interviewee_name && data.interviewee_email),
    {
      message:
        "Either interviewee_id must be set or both interviewee_name and interviewee_email must be set",
    },
  );

export default CreateIntervieweeFormSchema;
