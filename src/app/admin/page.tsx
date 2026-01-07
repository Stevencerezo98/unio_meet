
import { loadLandingContent, saveLandingContent, logout } from '../actions';
import { AdminForm } from './_components/AdminForm';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const content = await loadLandingContent();

  async function handleLogout() {
    'use server';
    await logout();
    redirect('/login');
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
       <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Admin Dashboard</CardTitle>
            <CardDescription>
              Edit the content of your landing page here.
            </CardDescription>
          </div>
           <form action={handleLogout}>
            <Button type="submit" variant="outline">
              Logout
            </Button>
          </form>
        </CardHeader>
      </Card>
      
      <AdminForm content={content} onSave={saveLandingContent} />
    </div>
  );
}
