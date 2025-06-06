import { z } from 'zod';

export const eventSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }).max(100, { message: "Title must be 100 characters or less." }),
  date: z.string().min(1, { message: "Date is required." }), // Assuming YYYY-MM-DD format from date picker
  time: z.string().min(1, { message: "Time is required." }), // Assuming HH:MM format
  notes: z.string().max(500, { message: "Notes must be 500 characters or less." }).optional(),
  recurring: z.boolean().default(false),
});

export type EventFormData = z.infer<typeof eventSchema>;
