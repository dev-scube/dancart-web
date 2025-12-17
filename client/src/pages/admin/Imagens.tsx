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
import { Plus, Edit, Trash2, Image as ImageIcon, Eye } from "lucide-react";
import { toast } from "sonner";

// Mock data
const mockImagens = [
  {
    id: 1,
    titulo: "Apresentação Ballet Clássico",
    descricao: "Foto da apresentação de final de ano",
    url: "/images/ballet1.jpg",
    categoria: "Apresentações",
    ativa: true,
    dataUpload: "2024-12-01",
  },
  {
    id: 2,
    titulo: "Aula de Jazz",
    descricao: "Turma de jazz intermediário",
    url: "/images/jazz1.jpg", 
    categoria: "Aulas",
    ativa: true,
    dataUpload: "2024-11-28",
  },
  {
    id: 3,
    titulo: "Estúdio Principal",
    descricao: "Sala principal de dança",
    url: "/images/studio1.jpg",
    categoria: "Instalações", 
    ativa: false,
    dataUpload: "2024-11-20",
  },
];

export default function Imagens() {
  const [imagens, setImagens] = useState(mockImagens);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingImagem, setEditingImagem] = useState<any>(null);
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    url: "",
    categoria: "",
    ativa: true,
  });

  const handleCreate = () => {
    setEditingImagem(null);
    setFormData({
      titulo: "",
      descricao: "",
      url: "",
      categoria: "",
      ativa: true,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (imagem: any) => {
    setEditingImagem(imagem);
    setFormData({
      titulo: imagem.titulo,
      descricao: imagem.descricao,
      url: imagem.url,
      categoria: imagem.categoria,
      ativa: imagem.ativa,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setImagens(imagens.filter(img => img.id !== id));
    toast.success("Imagem removida com sucesso!");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingImagem) {
      setImagens(imagens.map(img => 
        img.id === editingImagem.id ? { ...img, ...formData } : img
      ));
      toast.success("Imagem atualizada com sucesso!");
    } else {
      const newImagem = {
        id: Date.now(),
        ...formData,
        dataUpload: new Date().toISOString().split('T')[0],
      };
      setImagens([...imagens, newImagem]);
      toast.success("Imagem adicionada com sucesso!");
    }
    
    setIsDialogOpen(false);
  };

  return (
    <div className="container py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Imagens</h1>
          <p className="text-muted-foreground">Gerencie as imagens da galeria e do site</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Imagem
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Imagens Cadastradas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Preview</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data Upload</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {imagens.map((imagem) => (
                <TableRow key={imagem.id}>
                  <TableCell>
                    <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center">
                      <ImageIcon className="h-6 w-6 text-muted-foreground" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{imagem.titulo}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {imagem.descricao}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{imagem.categoria}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      imagem.ativa 
                        ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
                    }`}>
                      {imagem.ativa ? "Ativa" : "Inativa"}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(imagem.dataUpload).toLocaleDateString("pt-BR")}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(imagem)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(imagem.id)}
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingImagem ? "Editar Imagem" : "Nova Imagem"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="titulo">Título *</Label>
              <Input
                id="titulo"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="url">URL da Imagem *</Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://exemplo.com/imagem.jpg"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="categoria">Categoria</Label>
              <Input
                id="categoria"
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                placeholder="Ex: Apresentações, Aulas, Instalações"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="ativa"
                checked={formData.ativa}
                onChange={(e) => setFormData({ ...formData, ativa: e.target.checked })}
                className="rounded border-gray-300"
              />
              <Label htmlFor="ativa">Imagem ativa (visível no site)</Label>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {editingImagem ? "Salvar" : "Criar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}