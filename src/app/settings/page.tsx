
'use client';

import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Pencil, LogOut, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useFirebase, useUser, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { signOut, updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

function SettingsHeader() {
  const router = useRouter();
  const { auth } = useFirebase();

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/login');
    }
  };

  return (
    <header className="w-full max-w-4xl mb-8">
        <div className="flex justify-between items-center">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-6 w-6" />
                <span className="sr-only">Volver</span>
            </Button>
            <h1 className="text-2xl font-bold">Ajustes</h1>
            <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
            </Button>
        </div>
    </header>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { firestore, auth } = useFirebase();
  const { user, isUserLoading } = useUser();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc(userDocRef);
  
  const [displayName, setDisplayName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingAccount, setIsSavingAccount] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || '');
      setAvatarUrl(userProfile.profilePictureUrl || null);
    }
    if (user) {
        setEmail(user.email || '');
    }
  }, [userProfile, user]);

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB Limit
        toast({ title: "Imagen demasiado grande", description: "Por favor, elige una imagen de menos de 2MB.", variant: "destructive" });
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSave = () => {
    if (!userDocRef) {
        toast({ title: "Error", description: "No se puede guardar el perfil.", variant: "destructive" });
        return;
    }
    setIsSavingProfile(true);
    const updatedData = {
        displayName: displayName,
        profilePictureUrl: avatarUrl || '',
    };
    updateDocumentNonBlocking(userDocRef, updatedData);
    setIsSavingProfile(false);
    toast({
      title: '¡Perfil Guardado!',
      description: 'Tu nombre y avatar han sido actualizados.',
    });
  };

  const handleAccountSave = async () => {
     if (!auth?.currentUser) {
      toast({ title: "Error", description: "Debes iniciar sesión para actualizar tu cuenta.", variant: "destructive" });
      return;
    }
    setIsSavingAccount(true);

    try {
        // Update Email if changed
        if(email !== auth.currentUser.email) {
            await updateEmail(auth.currentUser, email);
            if(userDocRef) {
                updateDocumentNonBlocking(userDocRef, { email: email });
            }
            toast({ title: '¡Email Actualizado!', description: 'Tu dirección de correo ha sido actualizada.' });
        }

        // Update password if provided
        if(password) {
            await updatePassword(auth.currentUser, password);
            setPassword(''); // Clear password field after update
            toast({ title: '¡Contraseña Actualizada!', description: 'Tu contraseña ha sido cambiada exitosamente.' });
        }

        if(email === auth.currentUser.email && !password) {
            toast({ title: 'Sin cambios', description: 'No has modificado tu email o contraseña.' });
        }

    } catch(error: any) {
        console.error("Account update error:", error);
        let description = "Ocurrió un error al actualizar tu cuenta.";
        if (error.code === 'auth/requires-recent-login') {
            description = "Esta operación es sensible. Por favor, vuelve a iniciar sesión antes de intentarlo de nuevo.";
        } else if (error.code === 'auth/email-already-in-use') {
            description = "La nueva dirección de email ya está en uso por otra cuenta.";
        }
        toast({ title: "Error al Guardar", description, variant: "destructive" });
    } finally {
        setIsSavingAccount(false);
    }
  }

  if (isUserLoading || isProfileLoading) {
    return <div className="flex min-h-screen items-center justify-center">Cargando perfil...</div>;
  }

  if (!user) {
      router.replace('/login');
      return null;
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-background p-4 pt-8 md:pt-16">
      <SettingsHeader />
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>Perfil Público</CardTitle>
            <CardDescription>
              Este nombre y avatar se mostrarán a otros en las reuniones.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="h-32 w-32 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <AvatarImage src={avatarUrl ?? undefined} />
                  <AvatarFallback className="text-5xl">
                    {displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || '?'}
                  </AvatarFallback>
                </Avatar>
                <div 
                  className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-2.5 border-4 border-background cursor-pointer" 
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Pencil className="h-4 w-4" />
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleAvatarChange} 
                  className="hidden"
                  accept="image/png, image/jpeg, image/webp"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="displayName" className="text-base">Tu Nombre</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="h-12 text-lg"
                placeholder="Introduce tu nombre público"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleProfileSave} className="w-full" disabled={isSavingProfile}>
                {isSavingProfile && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Guardar Perfil
            </Button>
          </CardFooter>
        </Card>

        {/* Account Card */}
        <Card>
           <CardHeader>
            <CardTitle>Ajustes de la Cuenta</CardTitle>
            <CardDescription>
              Gestiona tu email y contraseña de inicio de sesión.
            </CardDescription>
          </CardHeader>
           <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-base">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12 text-lg"
                        placeholder="tu@email.com"
                    />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="password">Nueva Contraseña</Label>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12 text-lg"
                        placeholder="Dejar en blanco para no cambiar"
                    />
                </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleAccountSave} className="w-full" disabled={isSavingAccount}>
                {isSavingAccount && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Guardar Cuenta
            </Button>
          </CardFooter>
        </Card>

      </div>
    </div>
  );
}
