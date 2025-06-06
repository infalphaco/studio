import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { CalendarCheck2 } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <CalendarCheck2 className="h-7 w-7 text-primary-foreground dark:text-primary bg-primary dark:bg-primary-foreground p-1 rounded-md" />
          <h1 className="text-2xl font-headline font-bold text-foreground">Eventide</h1>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
