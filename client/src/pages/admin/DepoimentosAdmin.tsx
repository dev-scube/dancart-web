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
import { Star, Check, X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function DepoimentosAdmin() {
  const { data: depoimentos, refetch } = trpc.depoimentos.list.useQuery();
  const updateMutation = trpc.depoimentos.update.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("Depoimento atualizado!");
    },
  });

  const handleAprovar = (id: number) => {
    updateMutation.mutate({
      id,
      data: { aprovado: true },
    });
  };

  const handleReprovar = (id: number) => {
    updateMutation.mutate({
      id,
      data: { aprovado: false },
    });
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-7xl">
        <Card>
          <CardHeader>
            <CardTitle>Gerenciamento de Depoimentos</CardTitle>
          </CardHeader>
          <CardContent>
            {!depoimentos || depoimentos.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhum depoimento encontrado.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Modalidade</TableHead>
                    <TableHead>Avaliação</TableHead>
                    <TableHead>Depoimento</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {depoimentos.map((depoimento) => (
                    <TableRow key={depoimento.id}>
                      <TableCell className="font-medium">{depoimento.nome}</TableCell>
                      <TableCell>{depoimento.modalidade || "-"}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < depoimento.avaliacao
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <p className="text-sm line-clamp-2">{depoimento.depoimento}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant={depoimento.aprovado ? "default" : "secondary"}>
                          {depoimento.aprovado ? "Aprovado" : "Pendente"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {!depoimento.aprovado && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAprovar(depoimento.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          {depoimento.aprovado && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReprovar(depoimento.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
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
