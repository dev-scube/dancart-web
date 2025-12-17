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
import { Plus, Edit, Trash2, Ticket, Calendar, MapPin } from "lucide-react";
import { toast } from "sonner";

// Mock data
const mockIngressos = [
  {
    id: 1,
    titulo: "Festival Primavera 2024",
    descricao: "Ingresso para o Festival de Dança Primavera",
    eventoId: 1,
    eventoNome: "Festival de Dança Primavera",
    tipoIngresso: "inteira",
    preco: 3000, // em centavos
    quantidadeTotal: 200,
    quantidadeVendida: 87,
    dataEvento: "2024-12-20T19:00:00",
    local: "Teatro Municipal",
    disponivel: true,
  },
  {
    id: 2,
    titulo: "Festival Primavera 2024 - Meia Entrada",
    descricao: "Ingresso meia entrada para estudantes e idosos",
    eventoId: 1,
    eventoNome: "Festival de Dança Primavera",
    tipoIngresso: "meia",
    preco: 1500,
    quantidadeTotal: 50,
    quantidadeVendida: 23,
    dataEvento: "2024-12-20T19:00:00",
    local: "Teatro Municipal",
    disponivel: true,
  },
  {
    id: 3,
    titulo: "Espetáculo Ballet Clássico",
    descricao: "Apresentação especial de fim de ano",
    eventoId: 3,
    eventoNome: "Apresentação Final Ballet",
    tipoIngresso: "inteira",
    preco: 2500,
    quantidadeTotal: 100,
    quantidadeVendida: 100,
    dataEvento: "2024-12-15T20:00:00",
    local: "Auditório DançArt",
    disponivel: false,
  },
];

const tiposIngresso = [
  { value: "inteira", label: "Inteira" },
  { value: "meia", label: "Meia Entrada" },
  { value: "promocional", label: "Promocional" },
  { value: "vip", label: "VIP" },
];

export default function Ingressos() {
  const [ingressos, setIngressos] = useState(mockIngressos);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIngresso, setEditingIngresso] = useState<any>(null);
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    eventoNome: "",
    tipoIngresso: "inteira",
    preco: 0,
    quantidadeTotal: 0,
    dataEvento: "",
    local: "",
    disponivel: true,
  });

  const handleCreate = () => {
    setEditingIngresso(null);
    setFormData({
      titulo: "",
      descricao: "",
      eventoNome: "",
      tipoIngresso: "inteira",
      preco: 0,
      quantidadeTotal: 0,
      dataEvento: "",
      local: "",
      disponivel: true,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (ingresso: any) => {
    setEditingIngresso(ingresso);
    setFormData({
      titulo: ingresso.titulo,
      descricao: ingresso.descricao,
      eventoNome: ingresso.eventoNome,
      tipoIngresso: ingresso.tipoIngresso,
      preco: ingresso.preco / 100,
      quantidadeTotal: ingresso.quantidadeTotal,
      dataEvento: new Date(ingresso.dataEvento).toISOString().slice(0, 16),
      local: ingresso.local,
      disponivel: ingresso.disponivel,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setIngressos(ingressos.filter(ingresso => ingresso.id !== id));
    toast.success("Ingresso removido com sucesso!");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const ingressoData = {
      ...formData,
      preco: Math.round(formData.preco * 100), // converter para centavos
      dataEvento: new Date(formData.dataEvento).toISOString(),
      eventoId: Date.now(), // mock do ID do evento
    };
    
    if (editingIngresso) {
      setIngressos(ingressos.map(ingresso => 
        ingresso.id === editingIngresso.id 
          ? { ...ingresso, ...ingressoData }
          : ingresso
      ));
      toast.success("Ingresso atualizado com sucesso!");
    } else {
      const newIngresso = {
        id: Date.now(),
        ...ingressoData,
        quantidadeVendida: 0,
      };
      setIngressos([...ingressos, newIngresso]);
      toast.success("Ingresso criado com sucesso!");
    }
    
    setIsDialogOpen(false);
  };

  const getTipoLabel = (tipo: string) => {
    return tiposIngresso.find(t => t.value === tipo)?.label || tipo;
  };

  return (
    <div className="container py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Ingressos</h1>
          <p className="text-muted-foreground">Gerencie ingressos para apresentações e eventos</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Ingresso
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Ingressos</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {ingressos.reduce((sum, ing) => sum + ing.quantidadeTotal, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Ingressos criados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {ingressos.reduce((sum, ing) => sum + ing.quantidadeVendida, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Ingressos vendidos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {(ingressos.reduce((sum, ing) => sum + (ing.quantidadeVendida * ing.preco), 0) / 100).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Faturamento com ingressos
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5" />
            Ingressos Cadastrados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ingresso</TableHead>
                <TableHead>Evento</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Vendas</TableHead>
                <TableHead>Data Evento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ingressos.map((ingresso) => (
                <TableRow key={ingresso.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{ingresso.titulo}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {ingresso.descricao}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-32">
                    <p className="truncate">{ingresso.eventoNome}</p>
                  </TableCell>
                  <TableCell>{getTipoLabel(ingresso.tipoIngresso)}</TableCell>
                  <TableCell>
                    R$ {(ingresso.preco / 100).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <span className="text-sm font-medium">
                        {ingresso.quantidadeVendida}/{ingresso.quantidadeTotal}
                      </span>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all" 
                          style={{ 
                            width: `${(ingresso.quantidadeVendida / ingresso.quantidadeTotal) * 100}%` 
                          }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(ingresso.dataEvento).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      ingresso.disponivel
                        ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                        : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                    }`}>
                      {ingresso.disponivel ? "Disponível" : "Indisponível"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(ingresso)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(ingresso.id)}
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
              {editingIngresso ? "Editar Ingresso" : "Novo Ingresso"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="titulo">Título do Ingresso *</Label>
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
                  rows={2}
                />
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="eventoNome">Nome do Evento *</Label>
                <Input
                  id="eventoNome"
                  value={formData.eventoNome}
                  onChange={(e) => setFormData({ ...formData, eventoNome: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="tipoIngresso">Tipo de Ingresso *</Label>
                <select
                  id="tipoIngresso"
                  value={formData.tipoIngresso}
                  onChange={(e) => setFormData({ ...formData, tipoIngresso: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                >
                  {tiposIngresso.map(tipo => (
                    <option key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label htmlFor="preco">Preço (R$) *</Label>
                <Input
                  id="preco"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.preco}
                  onChange={(e) => setFormData({ ...formData, preco: Number(e.target.value) })}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="quantidadeTotal">Quantidade Total *</Label>
                <Input
                  id="quantidadeTotal"
                  type="number"
                  min="1"
                  value={formData.quantidadeTotal}
                  onChange={(e) => setFormData({ ...formData, quantidadeTotal: Number(e.target.value) })}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="dataEvento">Data do Evento *</Label>
                <Input
                  id="dataEvento"
                  type="datetime-local"
                  value={formData.dataEvento}
                  onChange={(e) => setFormData({ ...formData, dataEvento: e.target.value })}
                  required
                />
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="local">Local do Evento *</Label>
                <Input
                  id="local"
                  value={formData.local}
                  onChange={(e) => setFormData({ ...formData, local: e.target.value })}
                  required
                />
              </div>

              <div className="col-span-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="disponivel"
                  checked={formData.disponivel}
                  onChange={(e) => setFormData({ ...formData, disponivel: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="disponivel">Ingresso disponível para venda</Label>
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
                {editingIngresso ? "Salvar" : "Criar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}