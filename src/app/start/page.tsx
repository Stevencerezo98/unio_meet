
import JoinMeetingForm from '@/components/JoinMeetingForm';
import { Video } from 'lucide-react';
import Link from 'next/link';

export default function StartPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <header className="absolute top-0 left-0 right-0 p-4">
        <Link href="/" className="flex items-center gap-2 text-foreground">
            <Video className="h-7 w-7 text-primary" />
            <span className="text-2xl font-bold">Unio</span>
        </Link>
      </header>
      <JoinMeetingForm />
    </div>
  );
}
