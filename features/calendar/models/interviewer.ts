import BusinessArea from "./business-area";

export interface Interviewer {
  id: string;
  name: string;
  email: string;
  designation?: string;
  business_area_id?: BusinessArea;
  created_at: Date;
  updated_at: Date;
}
