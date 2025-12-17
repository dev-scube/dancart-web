import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Search, Eye } from "lucide-react";

// Mock data for news
const mockNoticias = [
  {
    id: 1,
    titulo: "Nova temporada de aulas de Ballet Clássico",
    resumo: "Começam as inscrições para a nova temporada de ballet clássico com professores especializados",
    conteudo: "A DançArt tem o prazer de anunciar o início das inscrições para a nova temporada de aulas de Ballet Clássico. Com professores altamente qualificados e metodologia reconhecida internacionalmente, oferecemos turmas para todos os níveis, desde iniciante até avançado...",
    autor: "Equipe DançArt",
    dataPublicacao: "2024-12-15",
    categoria: "Aulas",
    imagemUrl: "/images/ballet-news.jpg",
    publicada: true,
    visualizacoes: 245,
  },
  {
    id: 2,
    titulo: "Festival de Dança 2024: Últimas vagas disponíveis",
    resumo: "Não perca a oportunidade de participar do maior festival de dança da região",
    conteudo: "O Festival de Dança 2024 está chegando e temos apenas algumas vagas remanescentes para participantes. Este evento promete ser o maior do ano, com apresentações de diversos estilos de dança e participação de artistas renomados...",
    autor: "Marina Silva",
    dataPublicacao: "2024-12-10",
    categoria: "Eventos",
    imagemUrl: "/images/festival-news.jpg",
    publicada: true,
    visualizacoes: 178,
  },
  {
    id: 3,
    titulo: "Workshop de Jazz Contemporâneo com professora internacional",
    resumo: "Aula especial com a renomada professora Sarah Johnson, diretamente dos EUA",
    conteudo: "A DançArt orgulhosamente apresenta um workshop exclusivo de Jazz Contemporâneo com a professora Sarah Johnson, coreógrafa internacional com vasta experiência em Broadway e companhias de dança mundialmente reconhecidas...",
    autor: "Carlos Mendes",
    dataPublicacao: "2024-12-08",
    categoria: "Workshops",
    imagemUrl: "/images/jazz-workshop.jpg",
    publicada: true,
    visualizacoes: 312,
  },
  {
    id: 4,
    titulo: "Resultados da Competição Regional de Hip Hop",
    resumo: "Nossos alunos conquistaram os primeiros lugares em várias categorias",
    conteudo: "Com muito orgulho, anunciamos os excelentes resultados de nossos alunos na Competição Regional de Hip Hop. A DançArt conquistou o primeiro lugar em três categorias diferentes, demonstrando a qualidade de nosso ensino...",
    autor: "Ana Costa",
    dataPublicacao: "2024-12-05",
    categoria: "Competições",
    imagemUrl: "/images/hiphop-competition.jpg",
    publicada: true,
    visualizacoes: 189,
  },
];

const categorias = ["Todas", "Aulas", "Eventos", "Workshops", "Competições"];

export default function Noticias() {
  const [noticias] = useState(mockNoticias);
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");
  const [busca, setBusca] = useState("");

  const noticiasFiltradas = noticias.filter(noticia => {
    const matchCategoria = categoriaFiltro === "Todas" || noticia.categoria === categoriaFiltro;
    const matchBusca = busca === "" || 
      noticia.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      noticia.resumo.toLowerCase().includes(busca.toLowerCase());
    
    return noticia.publicada && matchCategoria && matchBusca;
  });

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Blog DançArt</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Fique por dentro das últimas novidades, eventos e conquistas da nossa escola de dança.
            Acompanhe nosso blog para não perder nenhuma informação importante!
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar notícias..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categorias.map((categoria) => (
              <Button
                key={categoria}
                variant={categoriaFiltro === categoria ? "default" : "outline"}
                size="sm"
                onClick={() => setCategoriaFiltro(categoria)}
              >
                {categoria}
              </Button>
            ))}
          </div>
        </div>

        {/* News Grid */}
        {noticiasFiltradas.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Nenhuma notícia encontrada com os filtros aplicados.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {noticiasFiltradas.map((noticia) => (
              <Card key={noticia.id} className="hover:shadow-lg transition-shadow">
                {noticia.imagemUrl && (
                  <div className="h-48 overflow-hidden rounded-t-lg">
                    <div className="h-full bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground">Imagem da notícia</span>
                    </div>
                  </div>
                )}
                
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{noticia.categoria}</Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Eye className="h-3 w-3" />
                      {noticia.visualizacoes}
                    </div>
                  </div>
                  <CardTitle className="text-lg leading-tight">
                    {noticia.titulo}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {noticia.resumo}
                  </p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3" />
                      <span>{noticia.autor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {new Date(noticia.dataPublicacao).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full mt-4">
                    Ler mais
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="mt-16 bg-primary/5 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Não perca nenhuma novidade!</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Assine nossa newsletter e receba todas as notícias e atualizações da DançArt diretamente no seu email.
          </p>
          <div className="flex max-w-md mx-auto gap-2">
            <Input placeholder="Seu email" type="email" />
            <Button>Assinar</Button>
          </div>
        </div>
      </div>
    </div>
  );
}