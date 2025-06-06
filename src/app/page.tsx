import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { EventCard } from '@/components/event-card';
import { getEventsDB } from '@/lib/events-store';
import type { Event } from '@/types';
import { PlusCircle } from 'lucide-react';

export default async function HomePage() {
  const events: Event[] = await getEventsDB();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-headline font-semibold text-foreground">Upcoming Events</h2>
        <Button asChild>
          <Link href="/events/add">
            <PlusCircle className="mr-2 h-5 w-5" /> Add New Event
          </Link>
        </Button>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
            data-ai-hint="empty calendar"
          >
            <path
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-foreground">No events yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Get started by creating a new event.
          </p>
          <div className="mt-6">
            <Button asChild>
              <Link href="/events/add">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Event
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
