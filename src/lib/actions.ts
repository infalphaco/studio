"use server";

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { addEventDB, updateEventDB, deleteEventDB, getEventByIdDB } from './events-store';
import { eventSchema, type EventFormData } from './validators';
import type { Event } from '@/types';

export async function createEventAction(formData: EventFormData) {
  const validationResult = eventSchema.safeParse(formData);

  if (!validationResult.success) {
    return {
      success: false,
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  try {
    await addEventDB(validationResult.data);
  } catch (error) {
    return {
      success: false,
      message: "Failed to create event. Please try again.",
    };
  }
  
  revalidatePath('/');
  redirect('/');
}

export async function updateEventAction(eventId: string, formData: EventFormData) {
  const validationResult = eventSchema.safeParse(formData);

  if (!validationResult.success) {
    return {
      success: false,
      errors: validationResult.error.flatten().fieldErrors,
    };
  }
  
  try {
    const updatedEvent = await updateEventDB(eventId, validationResult.data);
    if (!updatedEvent) {
      return {
        success: false,
        message: "Event not found or failed to update.",
      };
    }
  } catch (error) {
     return {
      success: false,
      message: "Failed to update event. Please try again.",
    };
  }

  revalidatePath('/');
  revalidatePath(`/events/${eventId}/edit`);
  redirect('/');
}

export async function deleteEventAction(eventId: string) {
  try {
    const success = await deleteEventDB(eventId);
    if (!success) {
      return {
        success: false,
        message: "Event not found or failed to delete.",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "Failed to delete event. Please try again.",
    };
  }
  
  revalidatePath('/');
   // No redirect needed if called from event card, page will re-render
}

export async function getEventAction(eventId: string): Promise<Event | null> {
  const event = await getEventByIdDB(eventId);
  return event || null;
}
