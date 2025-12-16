import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export default function DepoimentosSection() {
  const { data: depoimentos, isLoading } = trpc.depoimentos.aprovados.useQuery();

  if (isLoading) {
    return (
      <section className="py-20 bg-background">
        <div className="container">
          <p className="text-center">Carregando depoimentos...</p>
        </div>
      </section>
    );
  }

  if (!depoimentos || depoimentos.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">O Que Dizem Nossos Alunos</h2>
          <p className="text-lg text-muted-foreground">
            Depoimentos de quem já faz parte da família DançArt
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {depoimentos.slice(0, 6).map((depoimento) => (
            <Card key={depoimento.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  {depoimento.fotoUrl ? (
                    <img
                      src={depoimento.fotoUrl}
                      alt={depoimento.nome}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">
                        {depoimento.nome.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold">{depoimento.nome}</h3>
                    {depoimento.modalidade && (
                      <p className="text-sm text-muted-foreground">{depoimento.modalidade}</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < depoimento.avaliacao
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-sm text-muted-foreground italic">
                  "{depoimento.depoimento}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
