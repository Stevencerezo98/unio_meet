
'use client';

import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Pencil, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useFirebase, useUser, useDoc, useMemoFirebase } from '@/firebase';
import { doc, getFirestore } from 'firebase/firestore';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { signOut } from 'firebase/auth';

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
    <header className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center">
      <Button variant="ghost" size="icon" onClick={() => router.back()}>
        <ArrowLeft className="h-6 w-6" />
      </Button>
      <Button variant="ghost" onClick={handleLogout}>
        <LogOut className="mr-2 h-4 w-4" />
        Cerrar Sesión
      </Button>
    </header>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { firestore } = useFirebase();
  const { user, isUserLoading } = useUser();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc(userDocRef);
  
  const [displayName, setDisplayName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || '');
      setAvatarUrl(userProfile.profilePictureUrl || null);
    }
  }, [userProfile]);

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!userDocRef) {
        toast({ title: "Error", description: "No se puede guardar el perfil.", variant: "destructive" });
        return;
    }
    
    const updatedData = {
        displayName: displayName,
        profilePictureUrl: avatarUrl || '',
    };

    updateDocumentNonBlocking(userDocRef, updatedData);

    toast({
      title: '¡Ajustes Guardados!',
      description: 'Tu nombre y avatar han sido actualizados.',
    });
    router.push('/start');
  };

  if (isUserLoading || isProfileLoading) {
    return <div className="flex min-h-screen items-center justify-center">Cargando perfil...</div>;
  }

  if (!user) {
      router.replace('/login');
      return null;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <SettingsHeader />

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Tu Perfil</CardTitle>
          <CardDescription>
            Configura tu nombre y avatar para las reuniones.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="h-32 w-32 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <AvatarImage src={avatarUrl ?? undefined} />
                <AvatarFallback className="text-5xl">
                  {displayName?.charAt(0).toUpperCase() || '?'}
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
                accept="image/png, image/jpeg"
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
              placeholder="Introduce tu nombre"
            />
          </div>
        </CardContent>
        <CardFooter>
           <Button onClick={handleSave} size="lg" className="w-full">
            Guardar Ajustes
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
