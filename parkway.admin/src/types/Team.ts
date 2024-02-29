export interface Team {
  _id: string;
  name: string;
  description?: string;
  leaderId?: string;
  members: string[];
}
