export interface Event {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  notes?: string;
  recurring: boolean;
  createdAt: Date;
}
