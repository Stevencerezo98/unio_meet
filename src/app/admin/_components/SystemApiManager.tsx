
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getSystemData, type SystemDataOutput } from '@/ai/flows/system-api-flow';
import { Loader2, Server, Users, KeyRound, Copy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';


const StatCard = ({ title, value, icon: Icon }: { title: string, value: string | number, icon: React.ElementType }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
        </CardContent>
    </Card>
)

export function SystemApiManager() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [systemData, setSystemData] = useState<SystemDataOutput | null>(null);
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  
  const handleFetchData = async () => {
    setIsLoading(true);
    setSystemData(null);
    try {
      const data = await getSystemData({});
      setSystemData(data);
      toast({
        title: '¡Datos del sistema cargados!',
        description: 'Se han obtenido las estadísticas más recientes.',
      });
    } catch (e: any) {
      toast({
        variant: 'destructive',
        title: 'Error al obtener datos',
        description: e.message || 'No se pudieron cargar los datos del sistema.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateToken = () => {
    // In a real app, this would call a secure backend endpoint.
    // For now, we'll just generate a fake token on the client.
    const fakeToken = `unio_sk_${[...Array(32)].map(() => Math.random().toString(36)[2]).join('')}`;
    setGeneratedToken(fakeToken);
     toast({
        title: '¡Token Generado!',
        description: 'Copia el token y guárdalo en un lugar seguro.',
      });
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copiado', description: 'El token se ha copiado al portapapeles.' });
  };


  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Estadísticas del Sistema</CardTitle>
          <CardDescription>
            Obtén una vista en tiempo real de las métricas clave de la
            plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            {systemData ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard title="Usuarios Totales" value={systemData.stats.totalUsers} icon={Users} />
                    <StatCard title="Reuniones Totales" value={systemData.stats.totalMeetings} icon={Server} />
                    <Card colSpan={2}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                             <CardTitle className="text-sm font-medium">Motor de Video</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{systemData.systemInfo.videoEngine}</div>
                            <p className="text-xs text-muted-foreground">{systemData.systemInfo.videoDomain}</p>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <p className="text-sm text-muted-foreground">
                    Haz clic en el botón para cargar los datos del sistema.
                </p>
            )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleFetchData} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {systemData ? "Actualizar Datos" : "Cargar Datos del Sistema"}
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle>Gestión de Tokens de API</CardTitle>
            <CardDescription>
                Genera tokens seguros para dar acceso a tu aplicación nativa a la API del sistema.
            </CardDescription>
        </CardHeader>
         <CardContent className="space-y-4">
            {generatedToken && (
                <div className="p-4 rounded-md bg-muted flex items-center justify-between">
                    <pre className="text-sm overflow-x-auto"><code>{generatedToken}</code></pre>
                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(generatedToken)}>
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
            )}
             <p className="text-sm text-muted-foreground">
                Recuerda: guarda los tokens en un lugar seguro. No podrás volver a verlos una vez que actualices la página.
             </p>
        </CardContent>
        <CardFooter>
            <Button onClick={handleGenerateToken}>
                <KeyRound className="mr-2 h-4 w-4" />
                Generar Nuevo Token de Servicio
            </Button>
        </CardFooter>
      </Card>
       {systemData?.users && systemData.users.length > 0 && (
         <Card>
            <CardHeader>
                <CardTitle>Últimos Usuarios Registrados</CardTitle>
                <CardDescription>Una muestra de los usuarios más recientes.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>UID</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Nombre</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {systemData.users.map(user => (
                            <TableRow key={user.uid}>
                                <TableCell className="font-mono text-xs">{user.uid}</TableCell>
                                <TableCell>{user.email || 'N/A'}</TableCell>
                                <TableCell>{user.displayName || 'N/A'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
         </Card>
       )}

    </div>
  );
}
