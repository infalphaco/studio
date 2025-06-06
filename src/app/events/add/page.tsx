import { EventForm } from '@/components/event-form';
import { createEventAction } from '@/lib/actions';
import { PlusCircle } from 'lucide-react';

export default function AddEventPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <PlusCircle className="h-6 w-6 text-primary" />
        <h2 className="text-3xl font-headline font-semibold">Add New Event</h2>
      </div>
      <EventForm action={createEventAction} formType="add" />
    </div>
  );
}
