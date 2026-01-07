
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { login } from '../actions';
import { useToast } from '@/hooks/use-toast';
import { Video } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

function LoginHeader() {
    return (
        <header className="absolute top-0 left-0 right-0 z-50">
            <div className="container mx-auto flex items-center justify-between p-4 text-foreground">
                <Link href="/" className="flex items-center gap-2">
                    <Video className="h-7 w-7 text-primary" />
                    <span className="text-2xl font-bold">Unio</span>
                </Link>
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <Button asChild variant="secondary">
                        <Link href="/register">Crear Cuenta</Link>
                    </Button>
                </div>
            </div>
        </header>
    );
}


export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login({ username, password });
      if (result.success) {
        toast({ title: 'Login successful!', description: 'Redirecting to dashboard...' });
        router.refresh();
      } else {
        toast({
          variant: 'destructive',
          title: 'Login failed',
          description: result.error,
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: 'Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <LoginHeader />
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="nombre de usuario"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
