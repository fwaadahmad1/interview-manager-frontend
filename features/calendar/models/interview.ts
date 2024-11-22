import BusinessArea from "./business-area";
import Interviewee from "./interviewee";
import { Interviewer } from "./interviewer";
import Job from "./job";

export interface Interview {
  id: string;
  interviewer: Interviewer[];
  business_area?: BusinessArea;
  job?: Job;
  tags?: string[];
  date_time: string; // ISO string representation of the date
  duration?: number;
  location?: string;
  status?: string;
  notes?: string;
  interviewee?: Interviewee;
  createdAt: string; // ISO string representation of the date
  updatedAt: string; // ISO string representation of the date
}
