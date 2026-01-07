
import { loadLandingContent, saveLandingContent } from '../actions';
import { AdminForm } from './_components/AdminForm';
import { LogoutButton } from './_components/LogoutButton';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default async function AdminPage() {
  const content = await loadLandingContent();

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
          <LogoutButton />
        </CardHeader>
      </Card>
      
      <AdminForm content={content} onSave={saveLandingContent} />
    </div>
  );
}
