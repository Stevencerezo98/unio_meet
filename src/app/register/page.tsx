
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Video } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useFirebase } from '@/firebase';

function RegisterHeader() {
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
                        <Link href="/login">Iniciar Sesión</Link>
                    </Button>
                </div>
            </div>
        </header>
    );
}

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { auth, firestore } = useFirebase();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !firestore) {
        toast({ title: 'Error', description: 'Servicios de Firebase no disponibles.', variant: 'destructive' });
        return;
    }
    setIsLoading(true);
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userProfile = {
        id: user.uid,
        displayName: username,
        email: user.email,
        profilePictureUrl: '', // Default empty avatar
      };

      // Store user profile in Firestore
      const userDocRef = doc(firestore, 'users', user.uid);
      setDocumentNonBlocking(userDocRef, userProfile, { merge: true });

      toast({
        title: '¡Cuenta Creada!',
        description: 'Tu cuenta ha sido creada exitosamente.',
      });
      router.push('/start');

    } catch (error: any) {
      console.error("Registration error:", error);
      let errorMessage = 'Ocurrió un error al registrarse.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este correo electrónico ya está en uso.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
      }
      toast({
        variant: 'destructive',
        title: 'Error de Registro',
        description: errorMessage,
      });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <RegisterHeader />
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Crear una Cuenta</CardTitle>
          <CardDescription>Regístrate para empezar a usar Unio.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
             <div className="space-y-2">
              <Label htmlFor="username">Nombre de Usuario</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="tu-nombre-de-usuario"
                required
              />
            </div>
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
              {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
