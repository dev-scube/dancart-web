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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, Trash2, GraduationCap } from "lucide-react";
import { toast } from "sonner";

export default function Matriculas() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    bailarinoId: "",
    cursoId: "",
    dataInicio: "",
    dataFim: "",
    tipoBolsa: "nenhuma" as "nenhuma" | "parcial" | "integral",
    percentualBolsa: "0",
    valorMensalComDesconto: "",
  });

  const utils = trpc.useUtils();
  const { data: matriculas, isLoading } = trpc.matriculas.list.useQuery();
  const { data: bailarinos } = trpc.bailarinos.list.useQuery();
  const { data: cursos } = trpc.cursos.list.useQuery();

  const createMutation = trpc.matriculas.create.useMutation({
    onSuccess: () => {
      utils.matriculas.list.invalidate();
      setIsDialogOpen(false);
      resetForm();
      toast.success("Matrícula cadastrada com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao cadastrar matrícula");
    },
  });

  const updateMutation = trpc.matriculas.update.useMutation({
    onSuccess: () => {
      utils.matriculas.list.invalidate();
      setIsDialogOpen(false);
      resetForm();
      setEditingId(null);
      toast.success("Matrícula atualizada com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao atualizar matrícula");
    },
  });

  const deleteMutation = trpc.matriculas.delete.useMutation({
    onSuccess: () => {
      utils.matriculas.list.invalidate();
      toast.success("Matrícula removida com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao remover matrícula");
    },
  });

  const resetForm = () => {
    setFormData({
      bailarinoId: "",
      cursoId: "",
      dataInicio: "",
      dataFim: "",
      tipoBolsa: "nenhuma",
      percentualBolsa: "0",
      valorMensalComDesconto: "",
    });
  };

  const handleCursoChange = (cursoId: string) => {
    const curso = cursos?.find(c => c.id === parseInt(cursoId));
    if (curso) {
      const percentual = parseInt(formData.percentualBolsa) || 0;
      const valorComDesconto = curso.valorMensal * (1 - percentual / 100);
      setFormData({
        ...formData,
        cursoId,
        valorMensalComDesconto: valorComDesconto.toString(),
      });
    } else {
      setFormData({ ...formData, cursoId });
    }
  };

  const handleBolsaChange = (percentual: string) => {
    const curso = cursos?.find(c => c.id === parseInt(formData.cursoId));
    if (curso) {
      const percent = parseInt(percentual) || 0;
      const valorComDesconto = curso.valorMensal * (1 - percent / 100);
      setFormData({
        ...formData,
        percentualBolsa: percentual,
        valorMensalComDesconto: valorComDesconto.toString(),
      });
    } else {
      setFormData({ ...formData, percentualBolsa: percentual });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      bailarinoId: parseInt(formData.bailarinoId),
      cursoId: parseInt(formData.cursoId),
      dataInicio: formData.dataInicio,
      dataFim: formData.dataFim || undefined,
      tipoBolsa: formData.tipoBolsa,
      percentualBolsa: parseInt(formData.percentualBolsa),
      valorMensalComDesconto: parseInt(formData.valorMensalComDesconto),
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

  const handleEdit = (matricula: any) => {
    setEditingId(matricula.id);
    setFormData({
      bailarinoId: matricula.bailarinoId.toString(),
      cursoId: matricula.cursoId.toString(),
      dataInicio: matricula.dataInicio ? new Date(matricula.dataInicio).toISOString().split('T')[0] : "",
      dataFim: matricula.dataFim ? new Date(matricula.dataFim).toISOString().split('T')[0] : "",
      tipoBolsa: matricula.tipoBolsa || "nenhuma",
      percentualBolsa: matricula.percentualBolsa?.toString() || "0",
      valorMensalComDesconto: matricula.valorMensalComDesconto?.toString() || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja remover esta matrícula?")) {
      deleteMutation.mutate({ id });
    }
  };

  const getBailarinoNome = (id: number) => {
    return bailarinos?.find(b => b.id === id)?.nome || "Desconhecido";
  };

  const getCursoNome = (id: number) => {
    return cursos?.find(c => c.id === id)?.nome || "Desconhecido";
  };

  return (
    <div className="container py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6" />
            Gerenciamento de Matrículas
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetForm(); setEditingId(null); }}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Matrícula
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "Editar Matrícula" : "Nova Matrícula"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bailarinoId">Bailarino *</Label>
                    <Select
                      value={formData.bailarinoId}
                      onValueChange={(value) => setFormData({ ...formData, bailarinoId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um bailarino" />
                      </SelectTrigger>
                      <SelectContent>
                        {bailarinos?.filter(b => b.ativo).map((bailarino) => (
                          <SelectItem key={bailarino.id} value={bailarino.id.toString()}>
                            {bailarino.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="cursoId">Curso *</Label>
                    <Select
                      value={formData.cursoId}
                      onValueChange={handleCursoChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um curso" />
                      </SelectTrigger>
                      <SelectContent>
                        {cursos?.filter(c => c.ativo).map((curso) => (
                          <SelectItem key={curso.id} value={curso.id.toString()}>
                            {curso.nome} - R$ {(curso.valorMensal / 100).toFixed(2)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dataInicio">Data de Início *</Label>
                    <Input
                      id="dataInicio"
                      type="date"
                      value={formData.dataInicio}
                      onChange={(e) => setFormData({ ...formData, dataInicio: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="dataFim">Data de Término</Label>
                    <Input
                      id="dataFim"
                      type="date"
                      value={formData.dataFim}
                      onChange={(e) => setFormData({ ...formData, dataFim: e.target.value })}
                    />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Bolsa de Estudos</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="tipoBolsa">Tipo de Bolsa</Label>
                      <Select
                        value={formData.tipoBolsa}
                        onValueChange={(value: any) => setFormData({ ...formData, tipoBolsa: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nenhuma">Nenhuma</SelectItem>
                          <SelectItem value="parcial">Parcial</SelectItem>
                          <SelectItem value="integral">Integral</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="percentualBolsa">Percentual de Desconto (%)</Label>
                      <Input
                        id="percentualBolsa"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.percentualBolsa}
                        onChange={(e) => handleBolsaChange(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label>Valor Mensal com Desconto</Label>
                    <p className="text-2xl font-bold text-primary">
                      R$ {formData.valorMensalComDesconto ? (parseInt(formData.valorMensalComDesconto) / 100).toFixed(2) : "0.00"}
                    </p>
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
                  <TableHead>Bailarino</TableHead>
                  <TableHead>Curso</TableHead>
                  <TableHead>Data Início</TableHead>
                  <TableHead>Bolsa</TableHead>
                  <TableHead>Valor Mensal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {matriculas?.map((matricula) => (
                  <TableRow key={matricula.id}>
                    <TableCell className="font-medium">{getBailarinoNome(matricula.bailarinoId)}</TableCell>
                    <TableCell>{getCursoNome(matricula.cursoId)}</TableCell>
                    <TableCell>
                      {matricula.dataInicio ? new Date(matricula.dataInicio).toLocaleDateString('pt-BR') : '-'}
                    </TableCell>
                    <TableCell className="capitalize">
                      {matricula.tipoBolsa === "nenhuma" ? "-" : `${matricula.tipoBolsa} (${matricula.percentualBolsa}%)`}
                    </TableCell>
                    <TableCell>R$ {(matricula.valorMensalComDesconto / 100).toFixed(2)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs capitalize ${
                        matricula.status === 'ativa' ? 'bg-green-100 text-green-800' :
                        matricula.status === 'suspensa' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {matricula.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(matricula)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(matricula.id)}
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
