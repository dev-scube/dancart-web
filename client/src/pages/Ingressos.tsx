import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, MapPin, Ticket } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  price: number;
  availableTickets: number;
  image: string;
  description: string;
}

const events: Event[] = [
  {
    id: 1,
    title: "Espetáculo de Fim de Ano 2024",
    date: "15 de Dezembro, 2024",
    time: "19:00",
    location: "Teatro Municipal - Ouro Branco",
    price: 30,
    availableTickets: 150,
    image: "/gallery-1.jpg",
    description: "Grande apresentação de encerramento do ano com todas as turmas do DançArt.",
  },
  {
    id: 2,
    title: "Workshop de Dança Contemporânea",
    date: "20 de Janeiro, 2025",
    time: "14:00",
    location: "Estúdio DançArt",
    price: 50,
    availableTickets: 30,
    image: "/hero-dance.jpg",
    description: "Workshop intensivo com professora convidada especializada em dança contemporânea.",
  },
  {
    id: 3,
    title: "Festival de Ballet Clássico",
    date: "10 de Fevereiro, 2025",
    time: "18:00",
    location: "Teatro Municipal - Ouro Branco",
    price: 40,
    availableTickets: 200,
    image: "/about-dance.jpg",
    description: "Festival dedicado ao ballet clássico com apresentações de diferentes níveis.",
  },
];

export default function Ingressos() {
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});

  const handleQuantityChange = (eventId: number, value: string) => {
    const quantity = parseInt(value) || 0;
    setQuantities({ ...quantities, [eventId]: quantity });
  };

  const handlePurchase = (event: Event) => {
    const quantity = quantities[event.id] || 0;
    if (quantity <= 0) {
      toast.error("Por favor, selecione a quantidade de ingressos");
      return;
    }
    if (quantity > event.availableTickets) {
      toast.error("Quantidade indisponível");
      return;
    }
    
    const total = event.price * quantity;
    toast.success(
      `Compra simulada: ${quantity} ingresso(s) para "${event.title}" - Total: R$ ${total.toFixed(2)}`
    );
  };

  return (
    <div className="py-12 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
            Ingressos para Eventos
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Garanta seu lugar nos nossos próximos eventos e espetáculos
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="flex flex-col">
              <div className="relative h-48 overflow-hidden rounded-t-lg">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full font-semibold">
                  R$ {event.price.toFixed(2)}
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-xl">{event.title}</CardTitle>
                <CardDescription className="space-y-2 mt-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Ticket className="h-4 w-4" />
                    <span>{event.availableTickets} ingressos disponíveis</span>
                  </div>
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground">{event.description}</p>
              </CardContent>

              <CardFooter className="flex flex-col gap-3">
                <div className="w-full">
                  <Label htmlFor={`quantity-${event.id}`} className="text-sm mb-2 block">
                    Quantidade
                  </Label>
                  <Input
                    id={`quantity-${event.id}`}
                    type="number"
                    min="1"
                    max={event.availableTickets}
                    placeholder="0"
                    value={quantities[event.id] || ""}
                    onChange={(e) => handleQuantityChange(event.id, e.target.value)}
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={() => handlePurchase(event)}
                >
                  Comprar Ingressos
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  * Este é um protótipo. A compra real será implementada posteriormente.
                </p>
              </CardFooter>
            </Card>
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Nenhum evento disponível no momento. Volte em breve!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
