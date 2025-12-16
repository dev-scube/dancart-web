import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, MapPin, Users } from "lucide-react";
import { useState } from "react";

interface Album {
  id: number;
  title: string;
  category: "evento" | "competicao" | "viagem";
  date: string;
  location: string;
  coverImage: string;
  images: string[];
  description: string;
}

const albums: Album[] = [
  {
    id: 1,
    title: "Festival de Dança 2024",
    category: "evento",
    date: "15 de Março, 2024",
    location: "Teatro Municipal - Ouro Branco",
    coverImage: "/gallery-1.jpg",
    images: ["/gallery-1.jpg", "/hero-dance.jpg", "/about-dance.jpg"],
    description: "Apresentação anual com todas as turmas do DançArt, mostrando o trabalho desenvolvido ao longo do ano.",
  },
  {
    id: 2,
    title: "Competição Regional",
    category: "competicao",
    date: "22 de Abril, 2024",
    location: "Belo Horizonte, MG",
    coverImage: "/hero-dance.jpg",
    images: ["/hero-dance.jpg", "/about-dance.jpg", "/studio-space.jpg"],
    description: "Participação na competição regional de dança com conquista de medalhas em várias categorias.",
  },
  {
    id: 3,
    title: "Viagem Cultural - São Paulo",
    category: "viagem",
    date: "10 de Maio, 2024",
    location: "São Paulo, SP",
    coverImage: "/about-dance.jpg",
    images: ["/about-dance.jpg", "/studio-space.jpg", "/gallery-1.jpg"],
    description: "Viagem cultural para assistir espetáculos de dança e conhecer grandes teatros paulistas.",
  },
  {
    id: 4,
    title: "Workshop de Ballet Clássico",
    category: "evento",
    date: "5 de Junho, 2024",
    location: "Estúdio DançArt",
    coverImage: "/studio-space.jpg",
    images: ["/studio-space.jpg", "/hero-dance.jpg", "/about-dance.jpg"],
    description: "Workshop intensivo com professores convidados especializados em ballet clássico.",
  },
];

const categoryLabels = {
  evento: "Evento",
  competicao: "Competição",
  viagem: "Viagem",
};

const categoryColors = {
  evento: "bg-blue-500/10 text-blue-700 border-blue-500/20",
  competicao: "bg-amber-500/10 text-amber-700 border-amber-500/20",
  viagem: "bg-green-500/10 text-green-700 border-green-500/20",
};

export default function Galeria() {
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");

  const filteredAlbums =
    selectedCategory === "todos"
      ? albums
      : albums.filter((album) => album.category === selectedCategory);

  return (
    <div className="py-12 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
            Galeria de Momentos
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Reviva os melhores momentos de nossos eventos, competições e viagens culturais
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            onClick={() => setSelectedCategory("todos")}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              selectedCategory === "todos"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setSelectedCategory("evento")}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              selectedCategory === "evento"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            Eventos
          </button>
          <button
            onClick={() => setSelectedCategory("competicao")}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              selectedCategory === "competicao"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            Competições
          </button>
          <button
            onClick={() => setSelectedCategory("viagem")}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              selectedCategory === "viagem"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            Viagens
          </button>
        </div>

        {/* Albums Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlbums.map((album) => (
            <Dialog key={album.id}>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow group overflow-hidden">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={album.coverImage}
                      alt={album.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                          categoryColors[album.category]
                        }`}
                      >
                        {categoryLabels[album.category]}
                      </span>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl">{album.title}</CardTitle>
                    <CardDescription className="space-y-2 mt-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        <span>{album.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4" />
                        <span>{album.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4" />
                        <span>{album.images.length} fotos</span>
                      </div>
                    </CardDescription>
                  </CardHeader>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl">{album.title}</DialogTitle>
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{album.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{album.location}</span>
                    </div>
                  </div>
                </DialogHeader>
                <div className="mt-4">
                  <p className="text-muted-foreground mb-6">{album.description}</p>
                  <div className="grid grid-cols-2 gap-4">
                    {album.images.map((image, index) => (
                      <div
                        key={index}
                        className="relative h-64 rounded-lg overflow-hidden"
                      >
                        <img
                          src={image}
                          alt={`${album.title} - Foto ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>

        {filteredAlbums.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Nenhum álbum encontrado nesta categoria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
