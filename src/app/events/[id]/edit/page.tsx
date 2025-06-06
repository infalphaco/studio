import { EventForm } from '@/components/event-form';
import { getEventAction, updateEventAction } from '@/lib/actions';
import { notFound } from 'next/navigation';
import { Pencil } from 'lucide-react';

interface EditEventPageProps {
  params: {
    id: string;
  };
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const eventId = params.id;
  const event = await getEventAction(eventId);

  if (!event) {
    notFound();
  }
  
  // Server action needs to be bound with eventId
  const updateActionForEvent = updateEventAction.bind(null, eventId);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Pencil className="h-6 w-6 text-primary" />
        <h2 className="text-3xl font-headline font-semibold">Edit Event</h2>
      </div>
      <EventForm initialData={event} action={updateActionForEvent} formType="edit" />
    </div>
  );
}
