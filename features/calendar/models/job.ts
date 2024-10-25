export default interface Job {
  id: string; // UUID
  title: string;
  description?: string; // Optional field
  created_at: Date;
  updated_at: Date;
}
