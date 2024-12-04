export interface CreateInterviewRequest {
  interviewer?: string[];
  business_area?: string;
  job?: string;
  date_time: string; // ISO string representation of the date
  duration?: number;
  location?: string;
  notes?: string;
  interviewee?: string;
}
