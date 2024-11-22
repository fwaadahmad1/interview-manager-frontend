export default interface FilteredEventsRequest {
  from: string;
  to: string;
  job?: string;
  business_area?: string;
  interviewer?: string[];
  interviewee?: string;
}
