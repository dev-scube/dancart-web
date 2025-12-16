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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Clock } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function AgendamentoSection() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    modalidade: "",
    dataPreferencia: "",
    horarioPreferencia: "",
    idade: "",
    mensagem: "",
  });

  const createMutation = trpc.agendamentos.create.useMutation({
    onSuccess: () => {
      setIsDialogOpen(false);
      setFormData({
        nome: "",
        email: "",
        telefone: "",
        modalidade: "",
        dataPreferencia: "",
        horarioPreferencia: "",
        idade: "",
        mensagem: "",
      });
      toast.success("Agendamento realizado com sucesso! Entraremos em contato em breve.");
    },
    onError: () => {
      toast.error("Erro ao realizar agendamento. Tente novamente.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      ...formData,
      idade: formData.idade ? parseInt(formData.idade) : undefined,
    });
  };

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 to-primary/10">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Agende sua Aula Experimental</h2>
          <p className="text-lg text-muted-foreground">
            Venha conhecer nossa escola e experimentar uma aula gratuita! Escolha a modalidade que mais te interessa.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Agende Agora
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Preencha o formulário e escolha o melhor dia e horário para sua aula experimental.
              </p>
              <Button onClick={() => setIsDialogOpen(true)} className="w-full" size="lg">
                Agendar Aula Gratuita
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Horários Disponíveis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>Segunda a Sexta:</strong> 14h às 20h</p>
                <p><strong>Sábado:</strong> 9h às 12h</p>
                <p className="text-muted-foreground mt-4">
                  Confirmaremos o horário por email ou telefone após o agendamento.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Agendar Aula Experimental</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="modalidade">Modalidade de Interesse *</Label>
                  <Select
                    value={formData.modalidade}
                    onValueChange={(value) => setFormData({ ...formData, modalidade: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma modalidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ballet Clássico">Ballet Clássico</SelectItem>
                      <SelectItem value="Jazz">Jazz</SelectItem>
                      <SelectItem value="Contemporâneo">Contemporâneo</SelectItem>
                      <SelectItem value="Hip Hop">Hip Hop</SelectItem>
                      <SelectItem value="Dança de Salão">Dança de Salão</SelectItem>
                      <SelectItem value="Sapateado">Sapateado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="idade">Idade</Label>
                  <Input
                    id="idade"
                    type="number"
                    value={formData.idade}
                    onChange={(e) => setFormData({ ...formData, idade: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="dataPreferencia">Data Preferencial *</Label>
                  <Input
                    id="dataPreferencia"
                    type="date"
                    value={formData.dataPreferencia}
                    onChange={(e) => setFormData({ ...formData, dataPreferencia: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="horarioPreferencia">Horário Preferencial</Label>
                  <Select
                    value={formData.horarioPreferencia}
                    onValueChange={(value) => setFormData({ ...formData, horarioPreferencia: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um horário" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Manhã (9h-12h)">Manhã (9h-12h)</SelectItem>
                      <SelectItem value="Tarde (14h-17h)">Tarde (14h-17h)</SelectItem>
                      <SelectItem value="Noite (17h-20h)">Noite (17h-20h)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-2">
                  <Label htmlFor="mensagem">Mensagem (opcional)</Label>
                  <Textarea
                    id="mensagem"
                    value={formData.mensagem}
                    onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                    placeholder="Conte-nos um pouco sobre sua experiência com dança ou suas expectativas..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Agendando..." : "Confirmar Agendamento"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
