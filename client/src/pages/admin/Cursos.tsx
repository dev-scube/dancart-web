import { useState } from "react";
import { trpc } from "@/lib/trpc";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, Trash2, BookOpen } from "lucide-react";
import { toast } from "sonner";

export default function Cursos() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    modalidade: "",
    nivel: "iniciante" as "iniciante" | "intermediario" | "avancado",
    faixaEtaria: "",
    diasSemana: "",
    horario: "",
    duracaoAula: "",
    valorMensal: "",
    vagasTotal: "",
  });

  const utils = trpc.useUtils();
  const { data: cursos, isLoading } = trpc.cursos.list.useQuery();

  const createMutation = trpc.cursos.create.useMutation({
    onSuccess: () => {
      utils.cursos.list.invalidate();
      setIsDialogOpen(false);
      resetForm();
      toast.success("Curso cadastrado com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao cadastrar curso");
    },
  });

  const updateMutation = trpc.cursos.update.useMutation({
    onSuccess: () => {
      utils.cursos.list.invalidate();
      setIsDialogOpen(false);
      resetForm();
      setEditingId(null);
      toast.success("Curso atualizado com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao atualizar curso");
    },
  });

  const deleteMutation = trpc.cursos.delete.useMutation({
    onSuccess: () => {
      utils.cursos.list.invalidate();
      toast.success("Curso removido com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao remover curso");
    },
  });

  const resetForm = () => {
    setFormData({
      nome: "",
      descricao: "",
      modalidade: "",
      nivel: "iniciante",
      faixaEtaria: "",
      diasSemana: "",
      horario: "",
      duracaoAula: "",
      valorMensal: "",
      vagasTotal: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      duracaoAula: formData.duracaoAula ? parseInt(formData.duracaoAula) : undefined,
      valorMensal: parseInt(formData.valorMensal) * 100, // Converter para centavos
      vagasTotal: parseInt(formData.vagasTotal),
    };

    if (editingId) {
      updateMutation.mutate({
        id: editingId,
        data,
      });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (curso: any) => {
    setEditingId(curso.id);
    setFormData({
      nome: curso.nome || "",
      descricao: curso.descricao || "",
      modalidade: curso.modalidade || "",
      nivel: curso.nivel || "iniciante",
      faixaEtaria: curso.faixaEtaria || "",
      diasSemana: curso.diasSemana || "",
      horario: curso.horario || "",
      duracaoAula: curso.duracaoAula?.toString() || "",
      valorMensal: curso.valorMensal ? (curso.valorMensal / 100).toString() : "",
      vagasTotal: curso.vagasTotal?.toString() || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja remover este curso?")) {
      deleteMutation.mutate({ id });
    }
  };

  return (
    <div className="container py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            Gerenciamento de Cursos
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetForm(); setEditingId(null); }}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Curso
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "Editar Curso" : "Novo Curso"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="nome">Nome do Curso *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="modalidade">Modalidade *</Label>
                    <Input
                      id="modalidade"
                      value={formData.modalidade}
                      onChange={(e) => setFormData({ ...formData, modalidade: e.target.value })}
                      placeholder="Ex: Ballet, Jazz, Contemporâneo"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="nivel">Nível *</Label>
                    <Select
                      value={formData.nivel}
                      onValueChange={(value: any) => setFormData({ ...formData, nivel: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="iniciante">Iniciante</SelectItem>
                        <SelectItem value="intermediario">Intermediário</SelectItem>
                        <SelectItem value="avancado">Avançado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="faixaEtaria">Faixa Etária</Label>
                  <Input
                    id="faixaEtaria"
                    value={formData.faixaEtaria}
                    onChange={(e) => setFormData({ ...formData, faixaEtaria: e.target.value })}
                    placeholder="Ex: 4-10 anos"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="diasSemana">Dias da Semana</Label>
                    <Input
                      id="diasSemana"
                      value={formData.diasSemana}
                      onChange={(e) => setFormData({ ...formData, diasSemana: e.target.value })}
                      placeholder="Ex: Segunda, Quarta, Sexta"
                    />
                  </div>
                  <div>
                    <Label htmlFor="horario">Horário</Label>
                    <Input
                      id="horario"
                      value={formData.horario}
                      onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                      placeholder="Ex: 14:00 - 15:30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="duracaoAula">Duração da Aula (min)</Label>
                    <Input
                      id="duracaoAula"
                      type="number"
                      value={formData.duracaoAula}
                      onChange={(e) => setFormData({ ...formData, duracaoAula: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="valorMensal">Valor Mensal (R$) *</Label>
                    <Input
                      id="valorMensal"
                      type="number"
                      step="0.01"
                      value={formData.valorMensal}
                      onChange={(e) => setFormData({ ...formData, valorMensal: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="vagasTotal">Total de Vagas *</Label>
                    <Input
                      id="vagasTotal"
                      type="number"
                      value={formData.vagasTotal}
                      onChange={(e) => setFormData({ ...formData, vagasTotal: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingId ? "Atualizar" : "Cadastrar"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Carregando...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Modalidade</TableHead>
                  <TableHead>Nível</TableHead>
                  <TableHead>Valor Mensal</TableHead>
                  <TableHead>Vagas</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cursos?.map((curso) => (
                  <TableRow key={curso.id}>
                    <TableCell className="font-medium">{curso.nome}</TableCell>
                    <TableCell>{curso.modalidade}</TableCell>
                    <TableCell className="capitalize">{curso.nivel}</TableCell>
                    <TableCell>R$ {(curso.valorMensal / 100).toFixed(2)}</TableCell>
                    <TableCell>{curso.vagasOcupadas}/{curso.vagasTotal}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${curso.ativo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {curso.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(curso)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(curso.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
