"use client";

import type { Event } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, StickyNote, Repeat, Trash2, Pencil } from 'lucide-react';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { deleteEventAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import React from 'react';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteEventAction(event.id);
    if (result?.success === false) {
      toast({
        title: 'Error',
        description: result.message || 'Failed to delete event.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Event deleted successfully.',
      });
      // Revalidation is handled by the server action, no client-side router.refresh() needed here
      // unless specific optimistic UI update is desired.
    }
    setIsDeleting(false);
  };

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="font-headline text-xl text-foreground">{event.title}</CardTitle>
          {event.recurring && <Badge variant="secondary" className="flex items-center gap-1"><Repeat className="h-3 w-3" /> Recurring</Badge>}
        </div>
        <CardDescription className="flex items-center gap-2 pt-1 text-muted-foreground">
          <CalendarDays className="h-4 w-4" />
          <span>{format(parseISO(event.date), 'EEEE, MMMM do, yyyy')}</span>
          <Clock className="h-4 w-4 ml-2" />
          <span>{event.time}</span>
        </CardDescription>
      </CardHeader>
      {event.notes && (
        <CardContent>
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <StickyNote className="h-4 w-4 mt-1 shrink-0" />
            <p className="whitespace-pre-wrap break-words">{event.notes}</p>
          </div>
        </CardContent>
      )}
      <CardFooter className="flex justify-end gap-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" className="text-destructive border-destructive hover:bg-destructive/10">
              <Trash2 className="mr-1 h-4 w-4" /> Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the event "{event.title}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                {isDeleting ? 'Deleting...' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Button variant="default" size="sm" asChild>
          <Link href={`/events/${event.id}/edit`}>
            <Pencil className="mr-1 h-4 w-4" /> Edit
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
