import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { loadLandingContent } from '@/app/actions';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function ThankYouPage() {
  const content = await loadLandingContent();
  const { thankYou } = content;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-8">
      <div className="text-center max-w-md">
        <CheckCircle className="mx-auto h-24 w-24 text-primary mb-6" />
        <h1 className="text-4xl font-bold mb-4">{thankYou.title}</h1>
        <p className="text-muted-foreground text-lg mb-8">
          {thankYou.description}
        </p>
        <Button asChild size="lg">
          <Link href="/start">{thankYou.buttonText}</Link>
        </Button>
      </div>
    </div>
  );
}
