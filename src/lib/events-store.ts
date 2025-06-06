import type { Event } from '@/types';

let events: Event[] = [];

// Seed with some initial data for demonstration
if (process.env.NODE_ENV === 'development' && events.length === 0) {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  events = [
    { id: '1', title: 'Team Meeting', date: today.toISOString().split('T')[0], time: '10:00', notes: 'Discuss project milestones.', recurring: false, createdAt: new Date() },
    { id: '2', title: 'Doctor Appointment', date: tomorrow.toISOString().split('T')[0], time: '14:30', recurring: false, createdAt: new Date() },
    { id: '3', title: 'Grocery Shopping', date: nextWeek.toISOString().split('T')[0], time: '17:00', notes: 'Milk, eggs, bread', recurring: true, createdAt: new Date() },
  ];
}


export async function getEventsDB(): Promise<Event[]> {
  return [...events].sort((a, b) => new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime());
}

export async function getEventByIdDB(id: string): Promise<Event | undefined> {
  return events.find(event => event.id === id);
}

export async function addEventDB(eventData: Omit<Event, 'id' | 'createdAt'>): Promise<Event> {
  const newEvent: Event = { 
    ...eventData, 
    id: Date.now().toString(), // Simple ID generation
    createdAt: new Date(),
  };
  events.push(newEvent);
  return newEvent;
}

export async function updateEventDB(id: string, eventData: Partial<Omit<Event, 'id' | 'createdAt'>>): Promise<Event | undefined> {
  const eventIndex = events.findIndex(event => event.id === id);
  if (eventIndex === -1) {
    return undefined;
  }
  events[eventIndex] = { ...events[eventIndex], ...eventData };
  return events[eventIndex];
}

export async function deleteEventDB(id: string): Promise<boolean> {
  const initialLength = events.length;
  events = events.filter(event => event.id !== id);
  return events.length < initialLength;
}
