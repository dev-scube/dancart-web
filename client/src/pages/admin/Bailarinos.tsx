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
import { Plus, Edit, Trash2, User } from "lucide-react";
import { toast } from "sonner";

export default function Bailarinos() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    dataNascimento: "",
    cpf: "",
    rg: "",
    telefone: "",
    email: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    nomeResponsavel: "",
    telefoneResponsavel: "",
    emailResponsavel: "",
    tipoSanguineo: "",
    alergiasRestricoes: "",
    contatoEmergencia: "",
    telefoneEmergencia: "",
    observacoes: "",
  });

  const utils = trpc.useUtils();
  const { data: bailarinos, isLoading } = trpc.bailarinos.list.useQuery();

  const createMutation = trpc.bailarinos.create.useMutation({
    onSuccess: () => {
      utils.bailarinos.list.invalidate();
      setIsDialogOpen(false);
      resetForm();
      toast.success("Bailarino cadastrado com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao cadastrar bailarino");
    },
  });

  const updateMutation = trpc.bailarinos.update.useMutation({
    onSuccess: () => {
      utils.bailarinos.list.invalidate();
      setIsDialogOpen(false);
      resetForm();
      setEditingId(null);
      toast.success("Bailarino atualizado com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao atualizar bailarino");
    },
  });

  const deleteMutation = trpc.bailarinos.delete.useMutation({
    onSuccess: () => {
      utils.bailarinos.list.invalidate();
      toast.success("Bailarino removido com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao remover bailarino");
    },
  });

  const resetForm = () => {
    setFormData({
      nome: "",
      dataNascimento: "",
      cpf: "",
      rg: "",
      telefone: "",
      email: "",
      endereco: "",
      cidade: "",
      estado: "",
      cep: "",
      nomeResponsavel: "",
      telefoneResponsavel: "",
      emailResponsavel: "",
      tipoSanguineo: "",
      alergiasRestricoes: "",
      contatoEmergencia: "",
      telefoneEmergencia: "",
      observacoes: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({
        id: editingId,
        data: formData,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (bailarino: any) => {
    setEditingId(bailarino.id);
    setFormData({
      nome: bailarino.nome || "",
      dataNascimento: bailarino.dataNascimento ? new Date(bailarino.dataNascimento).toISOString().split('T')[0] : "",
      cpf: bailarino.cpf || "",
      rg: bailarino.rg || "",
      telefone: bailarino.telefone || "",
      email: bailarino.email || "",
      endereco: bailarino.endereco || "",
      cidade: bailarino.cidade || "",
      estado: bailarino.estado || "",
      cep: bailarino.cep || "",
      nomeResponsavel: bailarino.nomeResponsavel || "",
      telefoneResponsavel: bailarino.telefoneResponsavel || "",
      emailResponsavel: bailarino.emailResponsavel || "",
      tipoSanguineo: bailarino.tipoSanguineo || "",
      alergiasRestricoes: bailarino.alergiasRestricoes || "",
      contatoEmergencia: bailarino.contatoEmergencia || "",
      telefoneEmergencia: bailarino.telefoneEmergencia || "",
      observacoes: bailarino.observacoes || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja remover este bailarino?")) {
      deleteMutation.mutate({ id });
    }
  };

  return (
    <div className="container py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="h-6 w-6" />
            Gerenciamento de Bailarinos
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetForm(); setEditingId(null); }}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Bailarino
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "Editar Bailarino" : "Novo Bailarino"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome">Nome Completo *</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="dataNascimento">Data de Nascimento *</Label>
                    <Input
                      id="dataNascimento"
                      type="date"
                      value={formData.dataNascimento}
                      onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cpf">CPF</Label>
                    <Input
                      id="cpf"
                      value={formData.cpf}
                      onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="rg">RG</Label>
                    <Input
                      id="rg"
                      value={formData.rg}
                      onChange={(e) => setFormData({ ...formData, rg: e.target.value })}
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
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input
                    id="endereco"
                    value={formData.endereco}
                    onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input
                      id="cidade"
                      value={formData.cidade}
                      onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="estado">Estado</Label>
                    <Input
                      id="estado"
                      value={formData.estado}
                      onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                      maxLength={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cep">CEP</Label>
                    <Input
                      id="cep"
                      value={formData.cep}
                      onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                    />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Responsável (para menores de idade)</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nomeResponsavel">Nome do Responsável</Label>
                      <Input
                        id="nomeResponsavel"
                        value={formData.nomeResponsavel}
                        onChange={(e) => setFormData({ ...formData, nomeResponsavel: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="telefoneResponsavel">Telefone do Responsável</Label>
                      <Input
                        id="telefoneResponsavel"
                        value={formData.telefoneResponsavel}
                        onChange={(e) => setFormData({ ...formData, telefoneResponsavel: e.target.value })}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="emailResponsavel">Email do Responsável</Label>
                      <Input
                        id="emailResponsavel"
                        type="email"
                        value={formData.emailResponsavel}
                        onChange={(e) => setFormData({ ...formData, emailResponsavel: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Informações de Saúde</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="tipoSanguineo">Tipo Sanguíneo</Label>
                      <Input
                        id="tipoSanguineo"
                        value={formData.tipoSanguineo}
                        onChange={(e) => setFormData({ ...formData, tipoSanguineo: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="contatoEmergencia">Contato de Emergência</Label>
                      <Input
                        id="contatoEmergencia"
                        value={formData.contatoEmergencia}
                        onChange={(e) => setFormData({ ...formData, contatoEmergencia: e.target.value })}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="telefoneEmergencia">Telefone de Emergência</Label>
                      <Input
                        id="telefoneEmergencia"
                        value={formData.telefoneEmergencia}
                        onChange={(e) => setFormData({ ...formData, telefoneEmergencia: e.target.value })}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="alergiasRestricoes">Alergias e Restrições</Label>
                      <Textarea
                        id="alergiasRestricoes"
                        value={formData.alergiasRestricoes}
                        onChange={(e) => setFormData({ ...formData, alergiasRestricoes: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    value={formData.observacoes}
                    onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  />
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
                  <TableHead>Data Nascimento</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bailarinos?.map((bailarino) => (
                  <TableRow key={bailarino.id}>
                    <TableCell className="font-medium">{bailarino.nome}</TableCell>
                    <TableCell>
                      {bailarino.dataNascimento ? new Date(bailarino.dataNascimento).toLocaleDateString('pt-BR') : '-'}
                    </TableCell>
                    <TableCell>{bailarino.telefone || '-'}</TableCell>
                    <TableCell>{bailarino.email || '-'}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${bailarino.ativo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {bailarino.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(bailarino)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(bailarino.id)}
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
