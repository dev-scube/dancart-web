import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Calendar, MapPin, Users } from "lucide-react";
import { toast } from "sonner";

// Mock data
const mockEventos = [
  {
    id: 1,
    titulo: "Festival de Dança Primavera",
    descricao: "Festival anual com apresentações de todos os estilos",
    tipo: "festival",
    dataEvento: "2024-12-20T19:00:00",
    local: "Teatro Municipal",
    valorInscricao: 5000, // em centavos
    vagasTotal: 50,
    vagasOcupadas: 23,
    inscricoesAbertas: true,
    imagemUrl: "/images/festival1.jpg",
  },
  {
    id: 2,
    titulo: "Competição de Ballet Clássico",
    descricao: "Competição para bailarinos de nível intermediário",
    tipo: "competicao",
    dataEvento: "2025-01-15T14:00:00",
    local: "Estúdio DançArt",
    valorInscricao: 8000,
    vagasTotal: 30,
    vagasOcupadas: 15,
    inscricoesAbertas: true,
    imagemUrl: "/images/competicao1.jpg",
  },
  {
    id: 3,
    titulo: "Workshop de Jazz Contemporâneo",
    descricao: "Aula especial com professora convidada",
    tipo: "workshop",
    dataEvento: "2024-12-28T10:00:00",
    local: "Sala 2 - DançArt",
    valorInscricao: 0,
    vagasTotal: 20,
    vagasOcupadas: 20,
    inscricoesAbertas: false,
    imagemUrl: "",
  },
];

const tiposEvento = [
  { value: "festival", label: "Festival" },
  { value: "competicao", label: "Competição" },
  { value: "apresentacao", label: "Apresentação" },
  { value: "workshop", label: "Workshop" },
];

export default function EventosAdmin() {
  const [eventos, setEventos] = useState(mockEventos);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvento, setEditingEvento] = useState<any>(null);
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    tipo: "festival",
    dataEvento: "",
    local: "",
    valorInscricao: 0,
    vagasTotal: 0,
    inscricoesAbertas: true,
    imagemUrl: "",
  });

  const handleCreate = () => {
    setEditingEvento(null);
    setFormData({
      titulo: "",
      descricao: "",
      tipo: "festival",
      dataEvento: "",
      local: "",
      valorInscricao: 0,
      vagasTotal: 0,
      inscricoesAbertas: true,
      imagemUrl: "",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (evento: any) => {
    setEditingEvento(evento);
    setFormData({
      titulo: evento.titulo,
      descricao: evento.descricao,
      tipo: evento.tipo,
      dataEvento: new Date(evento.dataEvento).toISOString().slice(0, 16),
      local: evento.local,
      valorInscricao: evento.valorInscricao / 100,
      vagasTotal: evento.vagasTotal,
      inscricoesAbertas: evento.inscricoesAbertas,
      imagemUrl: evento.imagemUrl || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setEventos(eventos.filter(evento => evento.id !== id));
    toast.success("Evento removido com sucesso!");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const eventoData = {
      ...formData,
      valorInscricao: Math.round(formData.valorInscricao * 100), // converter para centavos
      dataEvento: new Date(formData.dataEvento).toISOString(),
    };
    
    if (editingEvento) {
      setEventos(eventos.map(evento => 
        evento.id === editingEvento.id 
          ? { ...evento, ...eventoData }
          : evento
      ));
      toast.success("Evento atualizado com sucesso!");
    } else {
      const newEvento = {
        id: Date.now(),
        ...eventoData,
        vagasOcupadas: 0,
      };
      setEventos([...eventos, newEvento]);
      toast.success("Evento criado com sucesso!");
    }
    
    setIsDialogOpen(false);
  };

  const getTipoLabel = (tipo: string) => {
    return tiposEvento.find(t => t.value === tipo)?.label || tipo;
  };

  return (
    <div className="container py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Eventos</h1>
          <p className="text-muted-foreground">Gerencie eventos para bailarinos e competidores</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Evento
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Eventos Cadastrados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Evento</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Local</TableHead>
                <TableHead>Vagas</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {eventos.map((evento) => (
                <TableRow key={evento.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{evento.titulo}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {evento.descricao}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{getTipoLabel(evento.tipo)}</TableCell>
                  <TableCell>
                    {new Date(evento.dataEvento).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell className="max-w-32">
                    <p className="truncate">{evento.local}</p>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {evento.vagasOcupadas}/{evento.vagasTotal}
                    </span>
                  </TableCell>
                  <TableCell>
                    {evento.valorInscricao === 0 
                      ? "Gratuito" 
                      : `R$ ${(evento.valorInscricao / 100).toFixed(2)}`
                    }
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      evento.inscricoesAbertas
                        ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                        : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                    }`}>
                      {evento.inscricoesAbertas ? "Abertas" : "Encerradas"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(evento)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(evento.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingEvento ? "Editar Evento" : "Novo Evento"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="titulo">Título do Evento *</Label>
                <Input
                  id="titulo"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  required
                />
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="tipo">Tipo de Evento *</Label>
                <select
                  id="tipo"
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                >
                  {tiposEvento.map(tipo => (
                    <option key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label htmlFor="dataEvento">Data e Hora *</Label>
                <Input
                  id="dataEvento"
                  type="datetime-local"
                  value={formData.dataEvento}
                  onChange={(e) => setFormData({ ...formData, dataEvento: e.target.value })}
                  required
                />
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="local">Local *</Label>
                <Input
                  id="local"
                  value={formData.local}
                  onChange={(e) => setFormData({ ...formData, local: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="valorInscricao">Valor da Inscrição (R$)</Label>
                <Input
                  id="valorInscricao"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.valorInscricao}
                  onChange={(e) => setFormData({ ...formData, valorInscricao: Number(e.target.value) })}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Deixe 0 para evento gratuito
                </p>
              </div>
              
              <div>
                <Label htmlFor="vagasTotal">Total de Vagas</Label>
                <Input
                  id="vagasTotal"
                  type="number"
                  min="0"
                  value={formData.vagasTotal}
                  onChange={(e) => setFormData({ ...formData, vagasTotal: Number(e.target.value) })}
                />
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="imagemUrl">URL da Imagem</Label>
                <Input
                  id="imagemUrl"
                  value={formData.imagemUrl}
                  onChange={(e) => setFormData({ ...formData, imagemUrl: e.target.value })}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>

              <div className="col-span-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="inscricoesAbertas"
                  checked={formData.inscricoesAbertas}
                  onChange={(e) => setFormData({ ...formData, inscricoesAbertas: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="inscricoesAbertas">Inscrições abertas</Label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {editingEvento ? "Salvar" : "Criar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}