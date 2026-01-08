
'use client';

import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Pencil, LogOut, Loader2, Mic, Video, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useFirebase, useUser, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { signOut, updateEmail, updatePassword } from 'firebase/auth';

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
            <Button variant="ghost" size="icon" onClick={() => router.push('/start')}>
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

  // Route protection
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login');
    }
     if (!isUserLoading && user && user.isAnonymous) {
      router.replace('/start'); // Anonymous users don't have a settings page
    }
  }, [user, isUserLoading, router]);
  
  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc(userDocRef);
  
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [hasExistingUsername, setHasExistingUsername] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [defaultAudioMuted, setDefaultAudioMuted] = useState(false);
  const [defaultVideoMuted, setDefaultVideoMuted] = useState(false);
  
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingAccount, setIsSavingAccount] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || '');
      setUsername(userProfile.username || '');
      setHasExistingUsername(!!userProfile.username);
      setAvatarUrl(userProfile.profilePictureUrl || null);
      setDefaultAudioMuted(userProfile.defaultAudioMuted || false);
      setDefaultVideoMuted(userProfile.defaultVideoMuted || false);
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

    const updatedData: { [key: string]: any } = {
        displayName: displayName,
        profilePictureUrl: avatarUrl || '',
        defaultAudioMuted: defaultAudioMuted,
        defaultVideoMuted: defaultVideoMuted,
    };

    // Only add username to the update object if it's being set for the first time
    if (!hasExistingUsername && username.trim()) {
        updatedData.username = username.trim();
    }

    updateDocumentNonBlocking(userDocRef, updatedData);
    
    // Optimistically update UI state for username lock
    if (!hasExistingUsername && username.trim()) {
        setHasExistingUsername(true);
    }
    
    setIsSavingProfile(false);
    toast({
      title: '¡Perfil Guardado!',
      description: 'Tus preferencias de perfil han sido actualizadas.',
    });
  };

  const handleAccountSave = async () => {
     if (!auth?.currentUser) {
      toast({ title: "Error", description: "Debes iniciar sesión para actualizar tu cuenta.", variant: "destructive" });
      return;
    }
    setIsSavingAccount(true);

    try {
        if(email !== auth.currentUser.email) {
            await updateEmail(auth.currentUser, email);
            if(userDocRef) {
                updateDocumentNonBlocking(userDocRef, { email: email });
            }
            toast({ title: '¡Email Actualizado!', description: 'Tu dirección de correo ha sido actualizada.' });
        }

        if(password) {
            await updatePassword(auth.currentUser, password);
            setPassword(''); 
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

  if (isUserLoading || isProfileLoading || !user || user.isAnonymous) {
    return <div className="flex min-h-screen items-center justify-center">Cargando...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-background p-4 pt-8 md:pt-16">
      <SettingsHeader />
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Profile Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Perfil y Preferencias</CardTitle>
            <CardDescription>
              Ajusta cómo te ven los demás y tus configuraciones por defecto para las reuniones.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
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
              <div className="space-y-4 flex-grow w-full">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Nombre para mostrar en reuniones</Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="h-11 text-base"
                    placeholder="Introduce tu nombre público"
                  />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="username">Nombre de usuario (único)</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-11 text-base"
                    readOnly={hasExistingUsername}
                    disabled={hasExistingUsername}
                  />
                  {!hasExistingUsername && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 pt-1">
                        <Info className="h-3.5 w-3.5" />
                        Una vez establecido, no podrás cambiarlo sin contactar a soporte.
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-4 pt-4 border-t">
                <h3 className="text-base font-medium">Preferencias de Reunión</h3>
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <Label htmlFor="audio-switch" className="flex items-center gap-2">
                            <Mic className="h-4 w-4" />
                            Empezar con micrófono silenciado
                        </Label>
                    </div>
                    <Switch
                        id="audio-switch"
                        checked={defaultAudioMuted}
                        onCheckedChange={setDefaultAudioMuted}
                    />
                </div>
                 <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <Label htmlFor="video-switch" className="flex items-center gap-2">
                           <Video className="h-4 w-4" />
                           Empezar con cámara apagada
                        </Label>
                    </div>
                    <Switch
                        id="video-switch"
                        checked={defaultVideoMuted}
                        onCheckedChange={setDefaultVideoMuted}
                    />
                </div>
            </div>

          </CardContent>
          <CardFooter>
            <Button onClick={handleProfileSave} className="w-full" disabled={isSavingProfile}>
                {isSavingProfile && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Guardar Perfil y Preferencias
            </Button>
          </CardFooter>
        </Card>

        {/* Account Card */}
        <Card>
           <CardHeader>
            <CardTitle>Ajustes de la Cuenta</CardTitle>
            <CardDescription>
              Gestiona tu email y contraseña.
            </CardDescription>
          </CardHeader>
           <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-11 text-base"
                    />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="password">Nueva Contraseña</Label>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-11 text-base"
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

