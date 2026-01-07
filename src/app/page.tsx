import JoinMeetingForm from '@/components/JoinMeetingForm';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-8">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-4">
          Unio Premium Video Platform
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8">
          Experience seamless, high-quality video conferencing with advanced features. Enter your name and a room name below to start or join a meeting.
        </p>
      </div>
      <JoinMeetingForm />
    </main>
  );
}
