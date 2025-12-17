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
import { Plus, Edit, Trash2, Newspaper, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

// Mock data
const mockNoticias = [
  {
    id: 1,
    titulo: "Nova temporada de aulas de Ballet Clássico",
    resumo: "Começam as inscrições para a nova temporada de ballet clássico",
    conteudo: "A DançArt tem o prazer de anunciar o início das inscrições para a nova temporada de aulas de Ballet Clássico...",
    autor: "Equipe DançArt",
    dataPublicacao: "2024-12-15",
    categoria: "Aulas",
    imagemUrl: "/images/ballet-news.jpg",
    publicada: true,
    visualizacoes: 245,
    dataCriacao: "2024-12-14T10:30:00",
  },
  {
    id: 2,
    titulo: "Festival de Dança 2024: Últimas vagas",
    resumo: "Não perca a oportunidade de participar do maior festival de dança",
    conteudo: "O Festival de Dança 2024 está chegando e temos apenas algumas vagas remanescentes...",
    autor: "Marina Silva",
    dataPublicacao: "2024-12-10",
    categoria: "Eventos",
    imagemUrl: "/images/festival-news.jpg",
    publicada: true,
    visualizacoes: 178,
    dataCriacao: "2024-12-09T15:20:00",
  },
  {
    id: 3,
    titulo: "Workshop de Jazz Contemporâneo",
    resumo: "Aula especial com professora internacional Sarah Johnson",
    conteudo: "A DançArt orgulhosamente apresenta um workshop exclusivo de Jazz Contemporâneo...",
    autor: "Carlos Mendes",
    dataPublicacao: "2024-12-08",
    categoria: "Workshops",
    imagemUrl: "",
    publicada: false,
    visualizacoes: 0,
    dataCriacao: "2024-12-07T09:15:00",
  },
];

const categorias = [
  { value: "Aulas", label: "Aulas" },
  { value: "Eventos", label: "Eventos" },
  { value: "Workshops", label: "Workshops" },
  { value: "Competições", label: "Competições" },
  { value: "Geral", label: "Geral" },
];

export default function NoticiasAdmin() {
  const [noticias, setNoticias] = useState(mockNoticias);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNoticia, setEditingNoticia] = useState<any>(null);
  const [formData, setFormData] = useState({
    titulo: "",
    resumo: "",
    conteudo: "",
    autor: "",
    categoria: "Geral",
    imagemUrl: "",
    publicada: false,
  });

  const handleCreate = () => {
    setEditingNoticia(null);
    setFormData({
      titulo: "",
      resumo: "",
      conteudo: "",
      autor: "",
      categoria: "Geral",
      imagemUrl: "",
      publicada: false,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (noticia: any) => {
    setEditingNoticia(noticia);
    setFormData({
      titulo: noticia.titulo,
      resumo: noticia.resumo,
      conteudo: noticia.conteudo,
      autor: noticia.autor,
      categoria: noticia.categoria,
      imagemUrl: noticia.imagemUrl || "",
      publicada: noticia.publicada,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setNoticias(noticias.filter(noticia => noticia.id !== id));
    toast.success("Notícia removida com sucesso!");
  };

  const togglePublicacao = (id: number) => {
    setNoticias(noticias.map(noticia => 
      noticia.id === id 
        ? { 
            ...noticia, 
            publicada: !noticia.publicada,
            dataPublicacao: !noticia.publicada ? new Date().toISOString().split('T')[0] : noticia.dataPublicacao
          }
        : noticia
    ));
    const noticia = noticias.find(n => n.id === id);
    toast.success(`Notícia ${!noticia?.publicada ? 'publicada' : 'despublicada'} com sucesso!`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingNoticia) {
      setNoticias(noticias.map(noticia => 
        noticia.id === editingNoticia.id 
          ? { 
              ...noticia, 
              ...formData,
              dataPublicacao: formData.publicada ? new Date().toISOString().split('T')[0] : noticia.dataPublicacao
            }
          : noticia
      ));
      toast.success("Notícia atualizada com sucesso!");
    } else {
      const newNoticia = {
        id: Date.now(),
        ...formData,
        visualizacoes: 0,
        dataCriacao: new Date().toISOString(),
        dataPublicacao: formData.publicada ? new Date().toISOString().split('T')[0] : "",
      };
      setNoticias([newNoticia, ...noticias]);
      toast.success("Notícia criada com sucesso!");
    }
    
    setIsDialogOpen(false);
  };

  const totalPublicadas = noticias.filter(n => n.publicada).length;
  const totalVisualizacoes = noticias.reduce((sum, n) => sum + n.visualizacoes, 0);

  return (
    <div className="container py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Notícias</h1>
          <p className="text-muted-foreground">Gerencie o blog e notícias da DançArt</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Notícia
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Notícias</CardTitle>
            <Newspaper className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{noticias.length}</div>
            <p className="text-xs text-muted-foreground">
              Notícias criadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Publicadas</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPublicadas}</div>
            <p className="text-xs text-muted-foreground">
              Notícias públicas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visualizações</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVisualizacoes.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total de visualizações
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Newspaper className="h-5 w-5" />
            Notícias Cadastradas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Autor</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Data Criação</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Visualizações</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {noticias.map((noticia) => (
                <TableRow key={noticia.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{noticia.titulo}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {noticia.resumo}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{noticia.autor}</TableCell>
                  <TableCell>{noticia.categoria}</TableCell>
                  <TableCell>
                    {new Date(noticia.dataCriacao).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        noticia.publicada 
                          ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
                      }`}>
                        {noticia.publicada ? "Publicada" : "Rascunho"}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => togglePublicacao(noticia.id)}
                        className="h-8 w-8 p-0"
                      >
                        {noticia.publicada ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{noticia.visualizacoes}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(noticia)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(noticia.id)}
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
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingNoticia ? "Editar Notícia" : "Nova Notícia"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="titulo">Título da Notícia *</Label>
                <Input
                  id="titulo"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="autor">Autor *</Label>
                <Input
                  id="autor"
                  value={formData.autor}
                  onChange={(e) => setFormData({ ...formData, autor: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="categoria">Categoria *</Label>
                <select
                  id="categoria"
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                >
                  {categorias.map(categoria => (
                    <option key={categoria.value} value={categoria.value}>
                      {categoria.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="resumo">Resumo *</Label>
                <Textarea
                  id="resumo"
                  value={formData.resumo}
                  onChange={(e) => setFormData({ ...formData, resumo: e.target.value })}
                  rows={2}
                  placeholder="Breve resumo da notícia (aparecerá no cartão)"
                  required
                />
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="conteudo">Conteúdo *</Label>
                <Textarea
                  id="conteudo"
                  value={formData.conteudo}
                  onChange={(e) => setFormData({ ...formData, conteudo: e.target.value })}
                  rows={6}
                  placeholder="Conteúdo completo da notícia"
                  required
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
                  id="publicada"
                  checked={formData.publicada}
                  onChange={(e) => setFormData({ ...formData, publicada: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="publicada">Publicar notícia imediatamente</Label>
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
                {editingNoticia ? "Salvar" : "Criar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}