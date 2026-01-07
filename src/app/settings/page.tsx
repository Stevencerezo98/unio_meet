
'use client';

import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useUserSettings } from '@/hooks/use-user-settings';

export default function SettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [settings, saveSettings] = useUserSettings();
  
  const [displayName, setDisplayName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (settings) {
      setDisplayName(settings.name || '');
      setAvatarUrl(settings.avatar || null);
    }
  }, [settings]);

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
    saveSettings({ name: displayName, avatar: avatarUrl || '' });
    toast({
      title: 'Settings Saved!',
      description: 'Your default name and avatar have been updated.',
    });
    router.push('/start');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <header className="absolute top-0 left-0 right-0 p-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
      </header>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>
            Set your default name and avatar for meetings.
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
            <Label htmlFor="displayName" className="text-base">Default Name</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="h-12 text-lg"
              placeholder="Enter your name"
            />
          </div>

          <Button onClick={handleSave} size="lg" className="w-full">
            Save Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
