import { Interview } from "../interview";

export default interface FilteredEventsResponse {
  interviews: Interview[];
  message: string;
}
