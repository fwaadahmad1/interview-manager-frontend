export default interface Interviewee {
  id: string; // UUID
  name: string;
  email?: string; // Optional field
  resume?: string; // Optional field
  comments?: string; // Optional field
  created_at: Date;
  updated_at: Date;
}
