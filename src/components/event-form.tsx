"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, StickyNote, Repeat, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO } from 'date-fns';
import { eventSchema, type EventFormData } from "@/lib/validators";
import type { Event } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import React from "react";

interface EventFormProps {
  initialData?: Event | null;
  action: (data: EventFormData) => Promise<any>; // Server action
  formType: 'add' | 'edit';
}

export function EventForm({ initialData, action, formType }: EventFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: initialData ? {
      title: initialData.title,
      date: initialData.date, // expects YYYY-MM-DD
      time: initialData.time, // expects HH:MM
      notes: initialData.notes || "",
      recurring: initialData.recurring,
    } : {
      title: "",
      date: format(new Date(), 'yyyy-MM-dd'),
      time: format(new Date(), 'HH:mm'),
      notes: "",
      recurring: false,
    },
  });

  async function onSubmit(data: EventFormData) {
    setIsSubmitting(true);
    try {
      const result = await action(data);
      if (result?.success === false) {
        toast({
          title: "Error",
          description: result.message || (formType === 'add' ? "Could not create event." : "Could not update event."),
          variant: "destructive",
        });
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            if (Array.isArray(messages)) {
              form.setError(field as keyof EventFormData, { type: 'server', message: messages.join(', ') });
            }
          });
        }
      } else {
        // Success is handled by server action redirect or revalidation
        // For client-side navigation after action (if no redirect from server):
        // router.push('/');
        // router.refresh(); // to get fresh data
      }
    } catch (error) {
      toast({
        title: "Error",
        description: formType === 'add' ? "Could not create event." : "Could not update event.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl mx-auto">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Birthday Party" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(parseISO(field.value), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? parseISO(field.value) : undefined}
                      onSelect={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <StickyNote className="h-4 w-4" /> Notes (Optional)
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any details, like location or what to bring..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="recurring"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="flex items-center gap-2 cursor-pointer">
                  <Repeat className="h-4 w-4" /> Recurring Event
                </FormLabel>
              </div>
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
          <Save className="mr-2 h-4 w-4" />
          {isSubmitting ? (formType === 'add' ? 'Creating...' : 'Saving...') : (formType === 'add' ? 'Create Event' : 'Save Changes')}
        </Button>
      </form>
    </Form>
  );
}
