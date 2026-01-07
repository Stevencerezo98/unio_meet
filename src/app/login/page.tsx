
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Video } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useFirebase, useUser } from '@/firebase';

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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { auth } = useFirebase();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    // Redirect if a non-anonymous user is already logged in
    if (!isUserLoading && user && !user.isAnonymous) {
        router.replace('/start');
    }
  }, [user, isUserLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
        toast({ title: 'Error', description: 'Servicios de Firebase no disponibles.', variant: 'destructive' });
        return;
    }
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: '¡Has iniciado sesión!', description: 'Redirigiendo...' });
      router.push('/start');
    } catch (error: any) {
        let errorMessage = 'Por favor, comprueba tu email y contraseña.';
        if(error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            errorMessage = 'El email o la contraseña son incorrectos.';
        }
      toast({
        variant: 'destructive',
        title: 'Error al iniciar sesión',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading screen while checking auth state or if user is already logged in and redirecting
  if (isUserLoading || (user && !user.isAnonymous)) {
      return <div className="flex min-h-screen items-center justify-center">Cargando...</div>;
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <LoginHeader />
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Iniciar Sesión</CardTitle>
          <CardDescription>Introduce tus credenciales para acceder a tu cuenta.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
