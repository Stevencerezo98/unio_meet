import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function ThankYouPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-8">
      <div className="text-center max-w-md">
        <CheckCircle className="mx-auto h-24 w-24 text-primary mb-6" />
        <h1 className="text-4xl font-bold mb-4">Meeting Ended</h1>
        <p className="text-muted-foreground text-lg mb-8">
          Thank you for using Unio Premium Video Platform. You have successfully left the meeting.
        </p>
        <Button asChild size="lg">
          <Link href="/">Start a New Meeting</Link>
        </Button>
      </div>
    </div>
  );
}
