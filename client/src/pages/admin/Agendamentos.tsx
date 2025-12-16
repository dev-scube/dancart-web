import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Agendamentos() {
  const { data: agendamentos, refetch } = trpc.agendamentos.list.useQuery();
  const updateMutation = trpc.agendamentos.update.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("Agendamento atualizado!");
    },
  });

  const handleStatusChange = (id: number, status: string) => {
    updateMutation.mutate({
      id,
      data: {
        status: status as "pendente" | "confirmado" | "realizado" | "cancelado",
        dataConfirmacao: status === "confirmado" ? new Date().toISOString() : undefined,
      },
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      pendente: "secondary",
      confirmado: "default",
      realizado: "default",
      cancelado: "destructive",
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-7xl">
        <Card>
          <CardHeader>
            <CardTitle>Agendamentos de Aulas Experimentais</CardTitle>
          </CardHeader>
          <CardContent>
            {!agendamentos || agendamentos.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhum agendamento encontrado.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Modalidade</TableHead>
                    <TableHead>Data Preferência</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agendamentos.map((agendamento) => (
                    <TableRow key={agendamento.id}>
                      <TableCell className="font-medium">{agendamento.nome}</TableCell>
                      <TableCell>{agendamento.email}</TableCell>
                      <TableCell>{agendamento.telefone || "-"}</TableCell>
                      <TableCell>{agendamento.modalidade}</TableCell>
                      <TableCell>
                        {new Date(agendamento.dataPreferencia).toLocaleDateString("pt-BR")}
                        {agendamento.horarioPreferencia && (
                          <span className="text-xs text-muted-foreground block">
                            {agendamento.horarioPreferencia}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(agendamento.status)}</TableCell>
                      <TableCell>
                        <Select
                          value={agendamento.status}
                          onValueChange={(value) => handleStatusChange(agendamento.id, value)}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pendente">Pendente</SelectItem>
                            <SelectItem value="confirmado">Confirmado</SelectItem>
                            <SelectItem value="realizado">Realizado</SelectItem>
                            <SelectItem value="cancelado">Cancelado</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
