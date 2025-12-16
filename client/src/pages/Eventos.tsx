import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, DollarSign } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Eventos() {
  const [selectedEvento, setSelectedEvento] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    nomeParticipante: "",
    emailParticipante: "",
    telefoneParticipante: "",
  });

  const { data: eventos, isLoading } = trpc.eventos.ativos.useQuery();
  const createInscricao = trpc.inscricoesEventos.create.useMutation({
    onSuccess: () => {
      setIsDialogOpen(false);
      setSelectedEvento(null);
      setFormData({
        nomeParticipante: "",
        emailParticipante: "",
        telefoneParticipante: "",
      });
      toast.success("Inscrição realizada com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao realizar inscrição. Tente novamente.");
    },
  });

  const handleInscricao = (evento: any) => {
    setSelectedEvento(evento);
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvento) return;

    createInscricao.mutate({
      eventoId: selectedEvento.id,
      ...formData,
    });
  };

  const getTipoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      festival: "Festival",
      competicao: "Competição",
      apresentacao: "Apresentação",
      workshop: "Workshop",
    };
    return labels[tipo] || tipo;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando eventos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container">
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Eventos DançArt</h1>
          <p className="text-lg text-muted-foreground">
            Participe de nossos festivais, competições e apresentações
          </p>
        </div>

        {!eventos || eventos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Nenhum evento disponível no momento. Fique atento às novidades!
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {eventos.map((evento) => (
              <Card key={evento.id} className="hover:shadow-lg transition-shadow">
                {evento.imagemUrl && (
                  <div className="h-48 overflow-hidden rounded-t-lg">
                    <img
                      src={evento.imagemUrl}
                      alt={evento.titulo}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{getTipoLabel(evento.tipo)}</Badge>
                    {evento.inscricoesAbertas ? (
                      <Badge variant="default">Inscrições Abertas</Badge>
                    ) : (
                      <Badge variant="outline">Inscrições Encerradas</Badge>
                    )}
                  </div>
                  <CardTitle>{evento.titulo}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {evento.descricao}
                  </p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>
                        {new Date(evento.dataEvento).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    {evento.local && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>{evento.local}</span>
                      </div>
                    )}

                    {evento.vagasTotal && (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        <span>
                          {evento.vagasOcupadas}/{evento.vagasTotal} vagas
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-primary" />
                      <span className="font-semibold">
                        {evento.valorInscricao === 0
                          ? "Gratuito"
                          : `R$ ${(evento.valorInscricao / 100).toFixed(2)}`}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleInscricao(evento)}
                    disabled={
                      !evento.inscricoesAbertas ||
                      !!(evento.vagasTotal &&
                        evento.vagasOcupadas >= evento.vagasTotal)
                    }
                    className="w-full mt-4"
                  >
                    {evento.inscricoesAbertas ? "Inscrever-se" : "Inscrições Encerradas"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Inscrição: {selectedEvento?.titulo}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="nomeParticipante">Nome Completo *</Label>
                <Input
                  id="nomeParticipante"
                  value={formData.nomeParticipante}
                  onChange={(e) =>
                    setFormData({ ...formData, nomeParticipante: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="emailParticipante">Email *</Label>
                <Input
                  id="emailParticipante"
                  type="email"
                  value={formData.emailParticipante}
                  onChange={(e) =>
                    setFormData({ ...formData, emailParticipante: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="telefoneParticipante">Telefone</Label>
                <Input
                  id="telefoneParticipante"
                  value={formData.telefoneParticipante}
                  onChange={(e) =>
                    setFormData({ ...formData, telefoneParticipante: e.target.value })
                  }
                />
              </div>

              {selectedEvento && selectedEvento.valorInscricao > 0 && (
                <div className="p-4 bg-primary/5 rounded-lg">
                  <p className="text-sm font-semibold">
                    Valor da Inscrição: R$ {(selectedEvento.valorInscricao / 100).toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    O pagamento será confirmado posteriormente pela secretaria.
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={createInscricao.isPending}>
                  {createInscricao.isPending ? "Inscrevendo..." : "Confirmar Inscrição"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
