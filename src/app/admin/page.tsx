
import { loadLandingContent } from '@/actions';
import { AdminTabs } from './_components/AdminTabs';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LogoutButton } from './_components/LogoutButton';


export default async function AdminPage() {
  const content = await loadLandingContent();

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Admin Dashboard</CardTitle>
            <CardDescription>
              Gestiona el contenido del landing page y el sistema de la
              aplicación.
            </CardDescription>
          </div>
          <LogoutButton />
        </CardHeader>
      </Card>

      <AdminTabs content={content} />
    </div>
  );
}
