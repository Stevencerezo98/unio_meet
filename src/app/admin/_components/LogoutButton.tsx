
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { logout } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

export function LogoutButton() {
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    await logout();
    toast({ title: 'Logged out successfully.' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <form action={handleLogout}>
      <Button type="submit" variant="outline">
        Logout
      </Button>
    </form>
  );
}
